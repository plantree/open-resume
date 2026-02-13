import type { ResumeSectionToLines } from "lib/parse-resume-from-pdf/types";

// Map English section keywords to their Chinese equivalents
const KEYWORD_TO_CHINESE: Record<string, string[]> = {
  work: ["工作经历", "工作经验", "实习经历", "实习经验"],
  experience: ["经历", "经验"],
  employment: ["工作"],
  history: ["经历"],
  job: ["工作"],
  education: ["教育背景", "教育经历", "学历"],
  project: ["项目经历", "项目经验", "项目介绍"],
  skill: ["专业技能", "技能", "技术能力", "专业能力"],
  summary: ["自我评价", "个人总结", "个人简介"],
  objective: ["求职意向", "求职目标"],
  award: ["获奖情况", "荣誉奖项"],
  honor: ["荣誉"],
  course: ["课程", "课外活动"],
};

/**
 * Return section lines that contain any of the keywords (English or Chinese).
 */
export const getSectionLinesByKeywords = (
  sections: ResumeSectionToLines,
  keywords: string[]
) => {
  // Collect all Chinese keywords corresponding to the English keywords
  const chineseKeywords: string[] = [];
  for (const keyword of keywords) {
    const chinese = KEYWORD_TO_CHINESE[keyword];
    if (chinese) {
      chineseKeywords.push(...chinese);
    }
  }

  for (const sectionName in sections) {
    const sectionNameLower = sectionName.toLowerCase();
    // Check English keyword match
    const hasEnglishKeyWord = keywords.some((keyword) =>
      sectionNameLower.includes(keyword)
    );
    // Check Chinese keyword match
    const hasChineseKeyWord = chineseKeywords.some((keyword) =>
      sectionName.includes(keyword)
    );
    if (hasEnglishKeyWord || hasChineseKeyWord) {
      return sections[sectionName];
    }
  }
  return [];
};
