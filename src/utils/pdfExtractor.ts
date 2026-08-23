/**
 * CAREEROS - PDF & Document Text Extractor Module
 * Extracts high-fidelity text streams from PDF ArrayBuffers using pdfjs-dist
 * and supports multi-format resume files (.pdf, .docx, .txt, .md).
 * Employs Unicode NFC normalization and Mojibake repair to preserve technical symbols.
 */

import * as pdfjsLib from 'pdfjs-dist';
import { normalizeImportedText, parseWordXmlToText } from './textNormalization.ts';
export { parseWordXmlToText };

// Set up worker source for browser environments
if (typeof window !== 'undefined' && pdfjsLib.GlobalWorkerOptions) {
  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version || '4.10.38'}/pdf.worker.min.mjs`;
}

/**
 * Extract plain text from an ArrayBuffer containing PDF binary data
 */
export async function extractTextFromPdfBuffer(arrayBuffer: ArrayBuffer): Promise<string> {
  try {
    const loadingTask = pdfjsLib.getDocument({
      data: new Uint8Array(arrayBuffer),
      useSystemFonts: true,
    });

    const pdfDocument = await loadingTask.promise;
    const numPages = pdfDocument.numPages;
    const pageTexts: string[] = [];

    for (let pageIndex = 1; pageIndex <= numPages; pageIndex++) {
      const page = await pdfDocument.getPage(pageIndex);
      const textContent = await page.getTextContent();

      let lastY: number | null = null;
      let pageLines: string[] = [];
      let currentLine = '';

      for (const item of textContent.items as any[]) {
        if (!item || typeof item.str !== 'string') continue;
        const text = item.str;
        const currentY = item.transform ? item.transform[5] : null;

        // Check if item starts a new line based on y-coordinate delta or hasEOL flag
        if (lastY !== null && currentY !== null && Math.abs(currentY - lastY) > 5) {
          if (currentLine.trim()) {
            pageLines.push(currentLine.trim());
          }
          currentLine = text;
        } else {
          currentLine += (currentLine ? ' ' : '') + text;
        }

        if (item.hasEOL) {
          if (currentLine.trim()) {
            pageLines.push(currentLine.trim());
          }
          currentLine = '';
        }

        lastY = currentY;
      }

      if (currentLine.trim()) {
        pageLines.push(currentLine.trim());
      }

      pageTexts.push(pageLines.join('\n'));
    }

    const rawPdfText = pageTexts.filter(Boolean).join('\n\n');
    return normalizeImportedText(rawPdfText);
  } catch (error: any) {
    console.error('PDF text extraction error:', error);
    return extractPrintableTextFallback(arrayBuffer);
  }
}

/**
 * Extract text from DOCX binary ArrayBuffer
 */
export async function extractTextFromDocxBuffer(arrayBuffer: ArrayBuffer): Promise<string> {
  try {
    const uint8 = new Uint8Array(arrayBuffer);

    // Search for word/document.xml in ZIP headers
    let offset = 0;
    while (offset < uint8.length - 30) {
      if (
        uint8[offset] === 0x50 &&
        uint8[offset + 1] === 0x4b &&
        uint8[offset + 2] === 0x03 &&
        uint8[offset + 3] === 0x04
      ) {
        const view = new DataView(arrayBuffer, offset);
        const compMethod = view.getUint16(8, true);
        const compSize = view.getUint32(18, true);
        const fnLen = view.getUint16(26, true);
        const extraLen = view.getUint16(28, true);

        const fileNameBytes = uint8.subarray(offset + 30, offset + 30 + fnLen);
        const fileName = new TextDecoder().decode(fileNameBytes);

        const dataStart = offset + 30 + fnLen + extraLen;
        const compressedData = uint8.subarray(dataStart, dataStart + compSize);

        if (fileName === 'word/document.xml' || fileName.endsWith('document.xml')) {
          let xmlText = '';
          if (compMethod === 0) {
            xmlText = new TextDecoder('utf-8').decode(compressedData);
          } else if (compMethod === 8 && typeof DecompressionStream !== 'undefined') {
            try {
              const ds = new DecompressionStream('deflate-raw');
              const writer = ds.writable.getWriter();
              writer.write(compressedData);
              writer.close();
              const decompressedBuffer = await new Response(ds.readable).arrayBuffer();
              xmlText = new TextDecoder('utf-8').decode(decompressedBuffer);
            } catch (decompErr) {
              console.warn('DecompressionStream error for DOCX:', decompErr);
            }
          }

          if (xmlText) {
            return parseWordXmlToText(xmlText);
          }
        }

        offset = dataStart + compSize;
      } else {
        offset++;
      }
    }
  } catch (err) {
    console.error('Error extracting text from DOCX:', err);
  }

  return extractPrintableTextFallback(arrayBuffer);
}

/**
 * Fallback extractor for plain text streams in binary buffers
 */
function extractPrintableTextFallback(arrayBuffer: ArrayBuffer): string {
  try {
    const text = new TextDecoder('utf-8').decode(arrayBuffer);
    // If text contains XML <w:t> tags
    if (text.includes('<w:t')) {
      return parseWordXmlToText(text);
    }
    return normalizeImportedText(text);
  } catch {
    const uint8 = new Uint8Array(arrayBuffer);
    let rawStr = '';
    for (let i = 0; i < Math.min(uint8.length, 100000); i++) {
      const byte = uint8[i];
      if ((byte >= 32 && byte <= 126) || byte === 10 || byte === 13 || byte === 9) {
        rawStr += String.fromCharCode(byte);
      }
    }
    return normalizeImportedText(rawStr);
  }
}

/**
 * Extract clean plain text from any uploaded resume file (.pdf, .docx, .txt, .md)
 */
export async function extractTextFromFile(file: File): Promise<string> {
  const fileName = file.name.toLowerCase();
  const isPdf = file.type === 'application/pdf' || fileName.endsWith('.pdf');
  const isDocx =
    file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
    fileName.endsWith('.docx');

  if (isPdf) {
    const arrayBuffer = await file.arrayBuffer();
    const extractedText = await extractTextFromPdfBuffer(arrayBuffer);
    if (extractedText && extractedText.trim().length > 0) {
      return extractedText;
    }
  }

  if (isDocx) {
    const arrayBuffer = await file.arrayBuffer();
    const extractedText = await extractTextFromDocxBuffer(arrayBuffer);
    if (extractedText && extractedText.trim().length > 0) {
      return extractedText;
    }
  }

  // Plain text / Markdown fallback
  const rawContent = await file.text();
  return normalizeImportedText(rawContent);
}
