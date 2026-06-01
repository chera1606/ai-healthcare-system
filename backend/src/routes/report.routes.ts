import { Router, type Request, type Response } from "express";
import { reportUpload } from "../config/upload.js";

const router = Router();

type UploadRequest = Request & {
  file?: Express.Multer.File;
};

router.post("/upload", (req: UploadRequest, res: Response) => {
  reportUpload.single("report")(req, res, (err: unknown) => {
    if (err instanceof Error) {
      return res.status(400).json({
        ok: false,
        error: err.message
      });
    }

    if (!req.file) {
      return res.status(400).json({
        ok: false,
        error: "Report file is required"
      });
    }

    return res.json({
      ok: true,
      message: "Report uploaded successfully",
      file: {
        originalName: req.file.originalname,
        storedName: req.file.filename,
        mimetype: req.file.mimetype,
        size: req.file.size
      }
    });
  });
});

export default router;
