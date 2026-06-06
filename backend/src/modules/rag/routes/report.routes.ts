import { Router, type Request, type Response } from "express";
import { reportUpload } from "../../../config/upload.js";
import { getReportFileKind } from "../services/fileType.js";
import { extractReportText } from "../services/extractText.js";
import { createReportRecord } from "../repositories/report.repository.js";
import { generateEmbedding } from "../services/embeddings.js";
import { chunkText } from "../services/chunking.js";
import { createChunk } from "../repositories/chunk.repository.js";
import { extractAndSaveObservations } from "../../observations/observations.service.js";

const router = Router();

type UploadRequest = Request & {
  file?: Express.Multer.File;
};

router.post("/upload", reportUpload.single("report"), (req: UploadRequest, res: Response, next: any) => {
  console.log('Upload route handler called, req.file:', req.file);
  console.log('req.body:', req.body);
  console.log('req.headers content-type:', req.headers['content-type']);
  
  if (!req.file) {
    console.log('No file found in request');
    return res.status(400).json({
      ok: false,
      error: "Report file is required"
    });
  }
  
  next();
}, async (req: UploadRequest, res: Response) => {

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

    // Extract and save structured medical observations
    // Note: Using patient_id = 1 for now (will be replaced with actual user authentication later)
    try {
      const observationResult = await extractAndSaveObservations({
        reportText: extractedText,
        reportId: savedReport.id,
        patientId: 1, // TODO: Replace with actual patient ID from authentication
        hospitalName: undefined, // Could extract from report text
        reportDate: undefined // Could extract from report text
      });
      console.log(`Extracted and saved ${observationResult.observations.length} medical observations`);
    } catch (obsError) {
      console.error(`Failed to extract observations:`, obsError);
      // Don't fail the upload if observation extraction fails
      // Just log the error and continue
    }

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

// GET /api/reports - List all reports
router.get("/", async (_req: Request, res: Response) => {
  try {
    const { getPool } = await import("../../../shared/database/pool.js");
    const { ensureDatabase } = await import("../../../shared/database/init.js");
    
    await ensureDatabase();
    
    const result = await getPool().query(
      `SELECT id, original_name, stored_name, mimetype, size, created_at 
       FROM reports 
       ORDER BY created_at DESC`
    );
    
    // Map database fields to frontend expected format
    const reports = result.rows.map((row: any) => ({
      id: row.id,
      name: row.original_name,
      date: row.created_at,
      type: 'Medical Report',
      status: 'Analyzed',
      icon: 'description'
    }));
    
    res.json({
      ok: true,
      reports
    });
  } catch (error) {
    console.error("Failed to fetch reports:", error);
    res.status(500).json({
      ok: false,
      error: error instanceof Error ? error.message : "Failed to fetch reports"
    });
  }
});

// DELETE /api/reports/:id - Delete a report
router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { getPool } = await import("../../../shared/database/pool.js");
    const { ensureDatabase } = await import("../../../shared/database/init.js");
    
    await ensureDatabase();
    
    // Delete chunks first
    await getPool().query("DELETE FROM document_chunks WHERE report_id = $1", [id]);
    
    // Delete observations
    await getPool().query("DELETE FROM medical_observations WHERE report_id = $1", [id]);
    
    // Delete report
    await getPool().query("DELETE FROM reports WHERE id = $1", [id]);
    
    res.json({
      ok: true,
      message: "Report deleted successfully"
    });
  } catch (error) {
    console.error("Failed to delete report:", error);
    res.status(500).json({
      ok: false,
      error: error instanceof Error ? error.message : "Failed to delete report"
    });
  }
});

export default router;

async function processUpload(req: UploadRequest, res: Response): Promise<void> {
  console.log('processUpload called');
  reportUpload.single("report")(req, res, async (err: unknown) => {
    console.log('Multer callback called, err:', err);
    if (err instanceof Error) {
      console.log('Multer error:', err.message);
      res.status(400).json({
        ok: false,
        error: err.message
      });
      return;
    }

    console.log('req.file:', req.file);
    if (!req.file) {
      console.log('No file in request');
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
      console.log('Extracted text preview:', extractedText.substring(0, 500));
      
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

      // Extract and save structured medical observations
      // Note: Using patient_id = 1 for now (will be replaced with actual user authentication later)
      try {
        const observationResult = await extractAndSaveObservations({
          reportText: extractedText,
          reportId: savedReport.id,
          patientId: 1, // TODO: Replace with actual patient ID from authentication
          hospitalName: undefined, // Could extract from report text
          reportDate: undefined // Could extract from report text
        });
        console.log(`Extracted and saved ${observationResult.observations.length} medical observations`);
      } catch (obsError) {
        console.error(`Failed to extract observations:`, obsError);
        // Don't fail the upload if observation extraction fails
        // Just log the error and continue
      }

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
