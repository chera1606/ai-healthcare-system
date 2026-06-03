import { Router, type Request, type Response } from "express";
import { reportUpload } from "../../../config/upload.js";
import { getReportFileKind } from "../services/fileType.js";
import { extractReportText } from "../services/extractText.js";
import { createReportRecord } from "../repositories/report.repository.js";
import { generateEmbedding } from "../services/embeddings.js";
import { chunkText } from "../services/chunking.js";
import { createChunk } from "../repositories/chunk.repository.js";
const router = Router();

type UploadRequest = Request & {
  file?: Express.Multer.File;
};

router.post("/upload", (req: UploadRequest, res: Response) => {
  void processUpload(req, res);
});

export default router;

async function processUpload(req: UploadRequest, res: Response): Promise<void> {
  reportUpload.single("report")(req, res, async (err: unknown) => {
    if (err instanceof Error) {
      res.status(400).json({
        ok: false,
        error: err.message
      });
      return;
    }

    if (!req.file) {
      res.status(400).json({
        ok: false,
        error: "Report file is required"
      });
      return;
    }

    try {
      const extractedText = await extractReportText(req.file);
      const sourceKind = getReportFileKind(req.file);
      
      console.log(`Extracted ${extractedText.length} characters from ${req.file.originalname}`);
      
      // Generate embedding for full report
      const embedding = await generateEmbedding(extractedText);
      console.log(`Generated full report embedding with ${embedding.length} dimensions`);
      
      const savedReport = await createReportRecord({
        originalName: req.file.originalname,
        storedName: req.file.filename,
        mimetype: req.file.mimetype,
        size: req.file.size,
        filePath: req.file.path,
        extractedText,
        sourceKind,
        embedding,
      });
      console.log(`Saved report with ID: ${savedReport.id}`);

      // Chunk the text for RAG with smaller chunks for better granularity
      const chunks = chunkText(extractedText, 1500, 150);
      console.log(`Created ${chunks.length} chunks for processing`);
      
      // Process chunks one at a time to prevent memory overflow
      for (let i = 0; i < chunks.length; i++) {
        const chunkEmbedding = await generateEmbedding(chunks[i]);
        await createChunk({
          reportId: savedReport.id,
          chunkText: chunks[i],
          chunkIndex: i,
          embedding: chunkEmbedding,
        });
        
        // Force garbage collection after each chunk
        if (global.gc) global.gc();
      }
      console.log(`Successfully saved all ${chunks.length} chunks to database`);

      res.json({
        ok: true,
        message: "Report uploaded successfully",
        file: {
          originalName: req.file.originalname,
          storedName: req.file.filename,
          mimetype: req.file.mimetype,
          size: req.file.size,
          path: req.file.path
        },
        extractedText,
        report: savedReport
      });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to extract text";

      res.status(500).json({
        ok: false,
        error: message
      });
    }
  });
}
