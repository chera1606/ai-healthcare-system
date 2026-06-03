export function chunkText(text: string, chunkSize: number = 500, overlap: number = 50): string[] {
  const chunks: string[] = [];
  let start = 0;

  while (start < text.length) {
    const end = Math.min(start + chunkSize, text.length);
    chunks.push(text.slice(start, end));
    
    // Ensure start always advances to prevent infinite loop
    // If we're at the end, break; otherwise advance by (chunkSize - overlap)
    if (end >= text.length) {
      break;
    }
    start = end - overlap;
    
    // Safety check: ensure start always moves forward
    if (start <= end - chunkSize) {
      start = end;
    }
  }

  return chunks;
}
