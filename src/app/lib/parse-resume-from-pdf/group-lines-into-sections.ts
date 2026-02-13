import type { ResumeKey } from "lib/redux/types";
import type {
  Line,
  Lines,
  ResumeSectionToLines,
} from "lib/parse-resume-from-pdf/types";
import {
  hasLetterAndIsAllUpperCase,
  hasOnlyLettersSpacesAmpersands,
  hasOnlyChineseOrLetters,
  isBold,
} from "lib/parse-resume-from-pdf/extract-resume-from-sections/lib/common-features";

export const PROFILE_SECTION: ResumeKey = "profile";

/**
 * Step 3. Group lines into sections
 *
 * Every section (except the profile section) starts with a section title that
 * takes up the entire line. This is a common pattern not just in resumes but
 * also in books and blogs. The resume parser uses this pattern to group lines
 * into the closest section title above these lines.
 */
export const groupLinesIntoSections = (lines: Lines) => {
  let sections: ResumeSectionToLines = {};
  let sectionName: string = PROFILE_SECTION;
  let sectionLines = [];
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const text = line[0]?.text.trim();
    if (isSectionTitle(line, i)) {
      sections[sectionName] = [...sectionLines];
      sectionName = text;
      sectionLines = [];
    } else {
      sectionLines.push(line);
    }
  }
  if (sectionLines.length > 0) {
    sections[sectionName] = [...sectionLines];
  }
  return sections;
};

const SECTION_TITLE_PRIMARY_KEYWORDS = [
  "experience",
  "education",
  "project",
  "skill",
];
const SECTION_TITLE_SECONDARY_KEYWORDS = [
  "job",
  "course",
  "extracurricular",
  "objective",
  "summary", // LinkedIn generated resume has a summary section
  "award",
  "honor",
  "project",
];
// Chinese section title keywords
const SECTION_TITLE_CHINESE_KEYWORDS = [
  "工作经历", "工作经验", "实习经历", "实习经验",
  "教育背景", "教育经历", "学历",
  "项目经历", "项目经验", "项目介绍",
  "专业技能", "技能", "技术能力", "专业能力",
  "个人信息", "基本信息", "求职意向", "自我评价",
  "获奖情况", "荣誉奖项", "证书", "资格证书",
  "校园经历", "社团经历", "课外活动",
  "研究经历", "科研经历", "发表论文",
];
const SECTION_TITLE_KEYWORDS = [
  ...SECTION_TITLE_PRIMARY_KEYWORDS,
  ...SECTION_TITLE_SECONDARY_KEYWORDS,
];

const isSectionTitle = (line: Line, lineNumber: number) => {
  const isFirstTwoLines = lineNumber < 2;
  const hasMoreThanOneItemInLine = line.length > 1;
  const hasNoItemInLine = line.length === 0;
  if (isFirstTwoLines || hasMoreThanOneItemInLine || hasNoItemInLine) {
    return false;
  }

  const textItem = line[0];
  const text = textItem.text.trim();

  // Check for Chinese section titles (bold Chinese text matching known keywords)
  const isChinese = /[\u4e00-\u9fa5]/.test(text);
  if (isChinese) {
    // Chinese section title: bold or matching known Chinese section keywords
    if (SECTION_TITLE_CHINESE_KEYWORDS.some((keyword) => text.includes(keyword))) {
      return true;
    }
    // Short bold Chinese text (2-6 chars) is likely a section title
    if (isBold(textItem) && hasOnlyChineseOrLetters(textItem) && text.length >= 2 && text.length <= 8) {
      return true;
    }
  }

  // The main heuristic to determine a section title is to check if the text is double emphasized
  // to be both bold and all uppercase, which is generally true for a well formatted resume
  if (isBold(textItem) && hasLetterAndIsAllUpperCase(textItem)) {
    return true;
  }

  // The following is a fallback heuristic to detect section title if it includes a keyword match
  // (This heuristics is not well tested and may not work well)
  const textHasAtMost2Words =
    text.split(" ").filter((s) => s !== "&").length <= 2;
  const startsWithCapitalLetter = /[A-Z]/.test(text.slice(0, 1));

  if (
    textHasAtMost2Words &&
    hasOnlyLettersSpacesAmpersands(textItem) &&
    startsWithCapitalLetter &&
    SECTION_TITLE_KEYWORDS.some((keyword) =>
      text.toLowerCase().includes(keyword)
    )
  ) {
    return true;
  }

  return false;
};
