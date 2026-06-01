import fs from "node:fs/promises";
import { getReportFileKind } from "./fileType.js";
import { extractPdfText } from "./pdf.js";
import { extractImageText } from "./ocr.js";

export async function extractReportText(
  file: Express.Multer.File,
): Promise<string> {
  const kind = getReportFileKind(file);

  if (kind === "text") {
    const text = await fs.readFile(file.path, "utf8");
    return text.trim();
  }

  if (kind === "pdf") {
    return extractPdfText(file.path);
  }

  if (kind === "image") {
    return extractImageText(file.path);
  }

  throw new Error("Unsupported file type for text extraction.");
}
