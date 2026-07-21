import mammoth from 'mammoth';

/**
 * Extract plain text from a DOCX file buffer using mammoth.
 * Throws if the file cannot be parsed (e.g. corrupted or not a valid DOCX).
 */
export async function extractDocxText(buffer: Buffer): Promise<string> {
  const result = await mammoth.extractRawText({ buffer });
  const text = result.value.trim();
  if (!text) {
    throw new Error('문서에서 텍스트를 추출하지 못했습니다.');
  }
  return text;
}
