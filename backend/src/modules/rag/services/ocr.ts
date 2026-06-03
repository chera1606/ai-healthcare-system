import { createWorker } from "tesseract.js";

export async function extractImageText(filePath: string): Promise<string> {
  const worker = await createWorker("eng");

  try {
    const result = await worker.recognize(filePath);
    const text = result.data.text || "";
    return text.trim();
  } finally {
    await worker.terminate();
  }
}
