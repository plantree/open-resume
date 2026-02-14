import { Text, Link } from "@react-pdf/renderer";
import type { Style } from "@react-pdf/types";
import { DEFAULT_FONT_COLOR } from "lib/redux/settingsSlice";

/**
 * Inline markdown token types:
 * - text: plain text
 * - bold: **text** or __text__
 * - italic: *text* or _text_
 * - boldItalic: ***text*** or ___text___
 * - link: [text](url)
 */
type InlineToken =
  | { type: "text"; content: string }
  | { type: "bold"; content: string }
  | { type: "italic"; content: string }
  | { type: "boldItalic"; content: string }
  | { type: "link"; text: string; url: string };

/**
 * Parse inline markdown into tokens.
 * Supports: ***bold italic***, **bold**, *italic*, [link](url)
 */
function parseInlineMarkdown(text: string): InlineToken[] {
  const tokens: InlineToken[] = [];
  // Order matters: bold-italic (***) before bold (**) before italic (*)
  const regex =
    /(\*\*\*(.+?)\*\*\*|\*\*(.+?)\*\*|\*(.+?)\*|\[([^\]]+)\]\(([^)]+)\))/g;

  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(text)) !== null) {
    // Add any text before this match
    if (match.index > lastIndex) {
      tokens.push({ type: "text", content: text.slice(lastIndex, match.index) });
    }

    if (match[2]) {
      // ***bold italic***
      tokens.push({ type: "boldItalic", content: match[2] });
    } else if (match[3]) {
      // **bold**
      tokens.push({ type: "bold", content: match[3] });
    } else if (match[4]) {
      // *italic*
      tokens.push({ type: "italic", content: match[4] });
    } else if (match[5] && match[6]) {
      // [text](url)
      tokens.push({ type: "link", text: match[5], url: match[6] });
    }

    lastIndex = match.index + match[0].length;
  }

  // Add remaining text
  if (lastIndex < text.length) {
    tokens.push({ type: "text", content: text.slice(lastIndex) });
  }

  return tokens;
}

/**
 * Renders inline markdown as react-pdf Text/Link elements.
 * Use this inside a <Text> parent component.
 */
export const ResumePDFMarkdownText = ({
  children,
  style = {},
  bold = false,
  isPDF = true,
}: {
  children: string;
  style?: Style;
  bold?: boolean;
  isPDF?: boolean;
}) => {
  const tokens = parseInlineMarkdown(children);

  // If no markdown found, return plain text
  if (tokens.length === 1 && tokens[0].type === "text") {
    return (
      <Text
        style={{
          color: DEFAULT_FONT_COLOR,
          fontWeight: bold ? "bold" : "normal",
          ...style,
        }}
      >
        {children}
      </Text>
    );
  }

  return (
    <Text
      style={{
        color: DEFAULT_FONT_COLOR,
        fontWeight: bold ? "bold" : "normal",
        ...style,
      }}
    >
      {tokens.map((token, idx) => {
        switch (token.type) {
          case "text":
            return <Text key={idx}>{token.content}</Text>;
          case "bold":
            return (
              <Text key={idx} style={{ fontWeight: "bold" }}>
                {token.content}
              </Text>
            );
          case "italic":
            return (
              <Text key={idx} style={{ fontStyle: "italic" }}>
                {token.content}
              </Text>
            );
          case "boldItalic":
            return (
              <Text
                key={idx}
                style={{ fontWeight: "bold", fontStyle: "italic" }}
              >
                {token.content}
              </Text>
            );
          case "link":
            if (isPDF) {
              return (
                <Link
                  key={idx}
                  src={
                    token.url.startsWith("http")
                      ? token.url
                      : `https://${token.url}`
                  }
                  style={{ color: "#0563C1", textDecoration: "underline" }}
                >
                  {token.text}
                </Link>
              );
            }
            return (
              <Text key={idx} style={{ color: "#0563C1" }}>
                {token.text}
              </Text>
            );
          default:
            return null;
        }
      })}
    </Text>
  );
};
