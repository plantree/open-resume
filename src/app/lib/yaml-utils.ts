import yaml from 'js-yaml';
import type { Resume } from 'lib/redux/types';
import type { Settings } from 'lib/redux/settingsSlice';

export interface ResumeDataWithSettings {
  resume: Resume;
  settings: Settings;
  exportInfo: {
    exportedAt: string;
    version: string;
    format: 'yaml';
  };
}

/**
 * 将简历数据导出为YAML格式
 */
export const exportResumeToYaml = (resume: Resume, settings: Settings): string => {
  const exportData: ResumeDataWithSettings = {
    resume,
    settings,
    exportInfo: {
      exportedAt: new Date().toISOString(),
      version: '1.0.0',
      format: 'yaml'
    }
  };

  return yaml.dump(exportData, {
    indent: 2,
    lineWidth: 80,
    noRefs: true,
    quotingType: '"',
    forceQuotes: false
  });
};

/**
 * 从YAML文件内容解析简历数据
 */
export const parseResumeFromYaml = (yamlContent: string): { resume: Resume; settings?: Settings } => {
  try {
    const data = yaml.load(yamlContent) as any;
    
    // 检查数据格式
    if (!data || typeof data !== 'object') {
      throw new Error('无效的YAML格式');
    }

    // 如果是完整的导出格式（包含settings）
    if (data.resume && data.settings && data.exportInfo) {
      const parsedData = data as ResumeDataWithSettings;
      
      // 验证简历数据结构
      validateResumeStructure(parsedData.resume);
      
      return {
        resume: parsedData.resume,
        settings: parsedData.settings
      };
    }
    
    // 如果是纯简历数据
    if (data.profile || data.workExperiences || data.educations) {
      validateResumeStructure(data as Resume);
      return { resume: data as Resume };
    }

    throw new Error('YAML文件不包含有效的简历数据');
  } catch (error) {
    if (error instanceof yaml.YAMLException) {
      throw new Error(`YAML解析错误: ${error.message}`);
    }
    throw error;
  }
};

/**
 * 验证简历数据结构
 */
const validateResumeStructure = (resume: any): void => {
  const requiredFields = ['profile'];
  const optionalFields = ['workExperiences', 'educations', 'projects', 'skills', 'custom'];
  
  if (!resume || typeof resume !== 'object') {
    throw new Error('简历数据必须是一个对象');
  }

  // 检查必需字段
  for (const field of requiredFields) {
    if (!(field in resume)) {
      throw new Error(`缺少必需字段: ${field}`);
    }
  }

  // 验证profile结构
  if (!resume.profile || typeof resume.profile !== 'object') {
    throw new Error('profile字段必须是一个对象');
  }

  // 确保可选字段存在且为正确类型
  if (!resume.workExperiences) resume.workExperiences = [];
  if (!resume.educations) resume.educations = [];
  if (!resume.projects) resume.projects = [];
  if (!resume.skills) resume.skills = { featuredSkills: [], descriptions: [] };
  if (!resume.custom) resume.custom = { descriptions: [] };

  // 验证数组字段
  const arrayFields = ['workExperiences', 'educations', 'projects'];
  for (const field of arrayFields) {
    if (!Array.isArray(resume[field])) {
      throw new Error(`${field}字段必须是一个数组`);
    }
  }
};

/**
 * 生成YAML文件名
 * 格式：姓名-电话-求职目标.yaml
 */
export const generateYamlFileName = (resume: Resume): string => {
  const { name, phone, summary } = resume.profile;
  
  // 清理和格式化各个部分
  const cleanName = name?.trim().replace(/[^\w\u4e00-\u9fa5]/g, '') || '简历';
  const cleanPhone = phone?.trim().replace(/[^\d]/g, '') || '';
  
  // 从summary中提取求职目标关键词，或使用默认值
  let jobTarget = '求职';
  if (summary) {
    const keywords = ['工程师', '开发', '设计师', '经理', '专员', '主管', '总监', '架构师', '分析师', '顾问'];
    const foundKeyword = keywords.find(keyword => summary.includes(keyword));
    if (foundKeyword) {
      jobTarget = foundKeyword;
    } else if (summary.length > 0) {
      // 如果没有找到关键词，取summary的前几个字符
      jobTarget = summary.slice(0, 6).replace(/[^\w\u4e00-\u9fa5]/g, '') || '求职';
    }
  }
  
  // 组合文件名
  const parts = [cleanName];
  if (cleanPhone) parts.push(cleanPhone);
  parts.push(jobTarget);
  
  return `${parts.join('-')}.yaml`;
};
export const downloadYamlFile = (yamlContent: string, fileName: string): void => {
  const blob = new Blob([yamlContent], { type: 'application/x-yaml;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName.endsWith('.yaml') ? fileName : `${fileName}.yaml`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  URL.revokeObjectURL(url);
};
