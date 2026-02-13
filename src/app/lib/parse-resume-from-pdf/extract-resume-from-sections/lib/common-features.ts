import type { TextItem, FeatureSet } from "lib/parse-resume-from-pdf/types";

const isTextItemBold = (fontName: string) =>
  fontName.toLowerCase().includes("bold");
export const isBold = (item: TextItem) => isTextItemBold(item.fontName);
export const hasLetter = (item: TextItem) => /[a-zA-Z]/.test(item.text);
export const hasChinese = (item: TextItem) => /[\u4e00-\u9fa5]/.test(item.text);
export const hasLetterOrChinese = (item: TextItem) => hasLetter(item) || hasChinese(item);
export const hasNumber = (item: TextItem) => /[0-9]/.test(item.text);
export const hasComma = (item: TextItem) => item.text.includes(",") || item.text.includes("，");
export const getHasText = (text: string) => (item: TextItem) =>
  item.text.includes(text);
export const hasOnlyLettersSpacesAmpersands = (item: TextItem) =>
  /^[A-Za-z\s&]+$/.test(item.text);
export const hasOnlyChineseOrLetters = (item: TextItem) =>
  /^[\u4e00-\u9fa5A-Za-z\s·•]+$/.test(item.text);
export const hasLetterAndIsAllUpperCase = (item: TextItem) =>
  hasLetter(item) && item.text.toUpperCase() === item.text;

// Date Features
const hasYear = (item: TextItem) => /(?:19|20)\d{2}/.test(item.text);
// prettier-ignore
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const hasMonth = (item: TextItem) =>
  MONTHS.some(
    (month) =>
      item.text.includes(month) || item.text.includes(month.slice(0, 4))
  );
const SEASONS = ["Summer", "Fall", "Spring", "Winter"];
const hasSeason = (item: TextItem) =>
  SEASONS.some((season) => item.text.includes(season));
const hasPresent = (item: TextItem) => item.text.includes("Present");
// Chinese date patterns
const CHINESE_MONTHS = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'];
const hasChineseMonth = (item: TextItem) =>
  CHINESE_MONTHS.some((month) => item.text.includes(month));
const hasChineseDateKeyword = (item: TextItem) =>
  /[年月日]/.test(item.text) || item.text.includes("至今") || item.text.includes("至") || item.text.includes("现在");
const hasChinesePresent = (item: TextItem) =>
  item.text.includes("至今") || item.text.includes("现在");
export const DATE_FEATURE_SETS: FeatureSet[] = [
  [hasYear, 1],
  [hasMonth, 1],
  [hasChineseMonth, 1],
  [hasChineseDateKeyword, 1],
  [hasSeason, 1],
  [hasPresent, 1],
  [hasChinesePresent, 1],
  [hasComma, -1],
];
