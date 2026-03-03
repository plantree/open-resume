import { useEffect } from "react";
import { Font } from "@react-pdf/renderer";
import { ENGLISH_FONT_FAMILIES } from "components/fonts/constants";
import { getAllFontFamiliesToLoad } from "components/fonts/lib";

// Register all fonts immediately (not in useEffect) so they are available
// before the first usePDF render call. This prevents the initial render
// from using a fallback font for CJK characters.
const allFontFamilies = getAllFontFamiliesToLoad();
allFontFamilies.forEach((fontFamily) => {
  Font.register({
    family: fontFamily,
    fonts: [
      {
        src: `/fonts/${fontFamily}-Regular.ttf`,
      },
      {
        src: `/fonts/${fontFamily}-Bold.ttf`,
        fontWeight: "bold",
      },
    ],
  });
});

// Hyphenation callback for CJK fonts - keeps English words together while allowing CJK to wrap
const cjkHyphenationCallback = (word: string): string[] => {
  // Check if word is pure ASCII (English/numbers/symbols)
  const isAsciiWord = /^[\x00-\x7F]+$/.test(word);
  if (isAsciiWord) {
    // Keep English words together
    return [word];
  }
  
  // For mixed or CJK text, split but keep ASCII sequences together
  const result: string[] = [];
  let asciiBuffer = "";
  
  for (const char of word) {
    const isAscii = char.charCodeAt(0) <= 0x7f;
    if (isAscii) {
      asciiBuffer += char;
    } else {
      // Flush ASCII buffer if any
      if (asciiBuffer) {
        result.push(asciiBuffer);
        asciiBuffer = "";
      }
      // Add CJK character with empty string for wrapping
      result.push(char, "");
    }
  }
  // Flush remaining ASCII buffer
  if (asciiBuffer) {
    result.push(asciiBuffer);
  }
  
  return result;
};

// Hyphenation callback for English fonts - no hyphenation
const englishHyphenationCallback = (word: string): string[] => [word];

// Register default hyphenation callback at module load time
// Default to CJK callback since it handles both CJK and English text correctly
Font.registerHyphenationCallback(cjkHyphenationCallback);

/**
 * Hook kept for backward compatibility - fonts are now registered at module load time.
 */
export const useRegisterReactPDFFont = () => {
  // Font registration is now done at module scope above.
  // This hook is kept so existing call sites don't break.
};

export const useRegisterReactPDFHyphenationCallback = (fontFamily: string) => {
  useEffect(() => {
    if (ENGLISH_FONT_FAMILIES.includes(fontFamily as any)) {
      Font.registerHyphenationCallback(englishHyphenationCallback);
    } else {
      Font.registerHyphenationCallback(cjkHyphenationCallback);
    }
  }, [fontFamily]);
};
