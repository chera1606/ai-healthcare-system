import { Router, type Request, type Response } from "express";
import { reportUpload } from "../config/upload.js";
import { extractReportText } from "../services/extractText.js";

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

      res.json({
        ok: true,
        message: "Report uploaded successfully",
        file: {
          originalName: req.file.originalname,
          storedName: req.file.filename,
          mimetype: req.file.mimetype,
          size: req.file.size
        },
        extractedText
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
