import fs from "node:fs/promises";
import { PDFParse } from "pdf-parse";

export async function extractPdfText(filePath: string): Promise<string> {
  const fileBuffer = await fs.readFile(filePath);
  const parser = new PDFParse({ data: fileBuffer });
  const data = await parser.getText();
  await parser.destroy();

  return data.text.trim();
}
