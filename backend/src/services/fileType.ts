import path from "node:path";

export type ReportFileKind = "pdf" | "text" | "image" | "unknown";

export function getReportFileKind(file: Express.Multer.File): ReportFileKind {
  const extension = path.extname(file.originalname).toLowerCase();
  const mimeType = file.mimetype.toLowerCase();

  if (mimeType === "application/pdf" || extension === ".pdf") {
    return "pdf";
  }

  if (mimeType === "text/plain" || extension === ".txt") {
    return "text";
  }

  if (
    mimeType.startsWith("image/") ||
    [".jpg", ".jpeg", ".png", ".webp", ".heic", ".heif"].includes(extension)
  ) {
    return "image";
  }

  return "unknown";
}
