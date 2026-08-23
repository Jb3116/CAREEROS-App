/**
 * CAREEROS - Unicode Text Normalization & Anti-Corruption Engine
 * Centralized utility for robust Unicode NFC normalization, Mojibake repair,
 * control character filtering, and preservation of technical acronyms/symbols.
 */

// Common Mojibake mappings caused by UTF-8 bytes read as Windows-1252 / ISO-8859-1
const MOJIBAKE_MAP: Array<[RegExp, string]> = [
  // Dashes & Hyphens
  [/â€“/g, '–'], // En dash (U+2013)
  [/â€”/g, '—'], // Em dash (U+2014)
  [/â€•/g, '―'], // Horizontal bar (U+2015)

  // Quotes & Apostrophes
  [/â€˜/g, '‘'], // Left single quote (U+2018)
  [/â€™/g, '’'], // Right single quote (U+2019)
  [/â€œ/g, '“'], // Left double quote (U+201C)
  [/â€\x9c/g, '“'],
  [/â€\x9d/g, '”'],
  [/â€/g, '”'], // Right double quote (U+201D)
  [/â€ /g, '”'], // Right double quote with trailing space
  [/â€š/g, '‚'], // Single low-9 quote (U+201A)
  [/â€ž/g, '„'], // Double low-9 quote (U+201E)
  [/â€²/g, '′'], // Prime (U+2032)
  [/â€³/g, '″'], // Double prime (U+2033)

  // Bullets & Symbols
  [/â€¢/g, '•'], // Bullet (U+2022)
  [/â€¦/g, '…'], // Horizontal ellipsis (U+2026)
  [/â„¢/g, '™'], // Trademark (U+2122)
  [/Â©/g, '©'],  // Copyright (U+00A9)
  [/Â®/g, '®'],  // Registered (U+00AE)
  [/Â°/g, '°'],  // Degree sign (U+00B0)
  [/Â±/g, '±'],  // Plus-minus (U+00B1)
  [/Â·/g, '·'],  // Middle dot (U+00B7)
  [/Â»/g, '»'],  // Right guillemet (U+00BB)
  [/Â«/g, '«'],  // Left guillemet (U+00AB)

  // General trailing quote fallback after all specific symbols are resolved
  [/â€(?=\s|$|\n|[.,!?;:)\]])/g, '”'],

  // Accented Latin Characters (Lowercase)
  [/Ã©/g, 'é'], [/Ã¨/g, 'è'], [/Ãª/g, 'ê'], [/Ã«/g, 'ë'],
  [/Ã /g, 'à'], [/Ã¡/g, 'á'], [/Ã¢/g, 'â'], [/Ã£/g, 'ã'], [/Ã¤/g, 'ä'], [/Ã¥/g, 'å'],
  [/Ã¬/g, 'ì'], [/Ã­/g, 'í'], [/Ã®/g, 'î'], [/Ã¯/g, 'ï'],
  [/Ã²/g, 'ò'], [/Ã³/g, 'ó'], [/Ã´/g, 'ô'], [/Ãµ/g, 'õ'], [/Ã¶/g, 'ö'], [/Ã¸/g, 'ø'],
  [/Ã¹/g, 'ù'], [/Ãº/g, 'ú'], [/Ã»/g, 'û'], [/Ã¼/g, 'ü'],
  [/Ã±/g, 'ñ'], [/Ã§/g, 'ç'], [/Ã¿/g, 'ÿ'], [/Ã½/g, 'ý'], [/Ã¦/g, 'æ'], [/Ã¾/g, 'þ'],

  // Accented Latin Characters (Uppercase)
  [/Ã‰/g, 'É'], [/Ãˆ/g, 'È'], [/ÃŠ/g, 'Ê'], [/Ã‹/g, 'Ë'],
  [/Ã€/g, 'À'], [/Ã/g, 'Á'], [/Ã‚/g, 'Â'], [/Ãƒ/g, 'Ã'], [/Ã„/g, 'Ä'], [/Ã…/g, 'Å'],
  [/ÃŒ/g, 'Ì'], [/Ã/g, 'Í'], [/ÃŽ/g, 'Î'], [/Ã/g, 'Ï'],
  [/Ã’/g, 'Ò'], [/Ã“/g, 'Ó'], [/Ã”/g, 'Ô'], [/Ã•/g, 'Õ'], [/Ã–/g, 'Ö'], [/Ã˜/g, 'Ø'],
  [/Ã™/g, 'Ù'], [/Ãš/g, 'Ú'], [/Ã›/g, 'Û'], [/Ãœ/g, 'Ü'],
  [/Ã‘/g, 'Ñ'], [/Ã‡/g, 'Ç'],

  // Miscellaneous Non-Breaking Space and Stray Artifacts
  [/Â\s/g, ' '],
  [/\u00A0/g, ' '], // Non-breaking space to regular space
  [/\u200B/g, ''],  // Zero-width space
  [/\uFEFF/g, ''],  // Byte Order Mark (BOM)
];

/**
 * Checks whether a given string exhibits Mojibake / encoding corruption artifacts
 */
export function detectMojibake(text: string): boolean {
  if (!text) return false;
  return MOJIBAKE_MAP.some(([regex]) => regex.test(text));
}

/**
 * Normalizes imported text:
 * 1. Performs standard Unicode NFC canonical composition.
 * 2. Repairs common Mojibake sequence corruptions without altering legitimate characters.
 * 3. Filters raw binary control characters while preserving formatting whitespace (\n, \t, \r).
 * 4. Strictly preserves technical symbols (e.g. C++, C#, .NET, Node.js, TypeScript, CI/CD, O(N), etc.).
 * 5. Normalizes linebreaks and collapses redundant whitespace.
 */
export function normalizeImportedText(text: string): string {
  if (!text || typeof text !== 'string') return '';

  // 1. Strip raw binary PDF stream markers and obj dictionaries if present
  let normalized = text
    .replace(/^%PDF-[0-9.]+[\s\S]*?stream\b/i, '')
    .replace(/\bendstream[\s\S]*?endobj\b/gi, '')
    .replace(/\b[0-9]+\s+[0-9]+\s+obj\b/gi, '')
    .replace(/\bxref\b[\s\S]*?\btrailer\b/gi, '')
    .replace(/\bstartxref\b[\s\S]*?%%EOF/gi, '');

  // 2. Unicode NFC Normalization
  normalized = normalized.normalize('NFC');

  // 3. Mojibake Sequences Repair
  for (const [regex, replacement] of MOJIBAKE_MAP) {
    normalized = normalized.replace(regex, replacement);
  }

  // 4. Clean hex escape artifacts (e.g. \x00-\x1F, \xB...)
  normalized = normalized.replace(/\\x[0-1][0-9a-fA-F]/g, '');

  // 5. Filter Raw Binary & Non-Printable ASCII Control Characters (0x00-0x08, 0x0B-0x0C, 0x0E-0x1F, 0x7F)
  // Preserves \t (0x09), \n (0x0A), and \r (0x0D), as well as all printable Unicode characters (> 0x7F)
  normalized = normalized.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '');

  // 6. Normalize Line Endings (CRLF -> LF)
  normalized = normalized.replace(/\r\n/g, '\n').replace(/\r/g, '\n');

  // 7. Clean up redundant empty lines (max 2 consecutive newlines)
  normalized = normalized.replace(/\n{3,}/g, '\n\n');

  // 8. Clean trailing whitespace per line
  normalized = normalized
    .split('\n')
    .map((line) => line.trimEnd())
    .join('\n')
    .trim();

  return normalized;
}

/**
 * Sanitizes technical skills string without destroying +, #, ., /, -, etc.
 * e.g., "C++, C#, .NET, Node.js, CI/CD" -> clean formatted string
 */
export function sanitizeTechnicalSkillList(rawSkills: string): string {
  if (!rawSkills) return '';
  const normalized = normalizeImportedText(rawSkills);

  // Split on commas, semicolons, or bullet points
  const items = normalized
    .split(/[,;•|\n]+/)
    .map((item) => item.trim())
    .filter(Boolean);

  // Deduplicate case-insensitively while preserving original casing
  const seen = new Set<string>();
  const uniqueItems: string[] = [];

  for (const item of items) {
    const lower = item.toLowerCase();
    if (!seen.has(lower)) {
      seen.add(lower);
      uniqueItems.push(item);
    }
  }

  return uniqueItems.join(', ');
}

/**
 * Parse Word XML markup from document.xml to structured text
 */
export function parseWordXmlToText(xml: string): string {
  if (!xml) return '';
  const paragraphs = xml.split(/<\/w:p>/gi);
  const textLines: string[] = [];

  for (const p of paragraphs) {
    const textMatches = p.match(/<w:t(?:\s[^>]*)?>([\s\S]*?)<\/w:t>/gi);
    if (textMatches && textMatches.length > 0) {
      const line = textMatches
        .map((t) => t.replace(/<w:t(?:\s[^>]*)?>/gi, '').replace(/<\/w:t>/gi, ''))
        .join('');
      if (line.trim()) {
        textLines.push(line.trim());
      }
    }
  }

  return normalizeImportedText(textLines.join('\n'));
}
