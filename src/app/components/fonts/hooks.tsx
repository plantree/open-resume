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
      // Disable hyphenation for English Font Family so the word wraps each line
      // https://github.com/diegomura/react-pdf/issues/311#issuecomment-548301604
      Font.registerHyphenationCallback((word) => [word]);
    } else {
      // React PDF doesn't understand how to wrap non-english word on line break
      // A workaround is to add an empty character after each word
      // Reference https://github.com/diegomura/react-pdf/issues/1568
      Font.registerHyphenationCallback((word) =>
        word
          .split("")
          .map((char) => [char, ""])
          .flat()
      );
    }
  }, [fontFamily]);
};
