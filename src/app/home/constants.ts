import {
  initialEducation,
  initialProfile,
  initialProject,
  initialWorkExperience,
} from "lib/redux/resumeSlice";
import type { Resume } from "lib/redux/types";
import { deepClone } from "lib/deep-clone";

export const END_HOME_RESUME: Resume = {
  profile: {
    name: "张三",
    summary:
      "热衷于构建用户喜爱的卓越产品的软件工程师",
    email: "hello@openresume.com",
    phone: "138-0000-0000",
    location: "北京, 中国",
    url: "linkedin.com/in/zhangsan",
  },
  workExperiences: [
    {
      company: "ABC科技公司",
      jobTitle: "软件工程师",
      date: "2023年5月 - 至今",
      descriptions: [
        "领导一个由5名工程师组成的跨职能团队开发搜索栏功能，使数千名日活跃用户能够在整个平台上搜索内容",
        "创建引人注目的主页产品演示动画，将注册率提高了20%",
        "编写模块化且易于维护的清洁代码，同时确保100%的测试覆盖率",
      ],
    },
    {
      company: "DEF机构",
      jobTitle: "软件工程师实习生",
      date: "2022年夏季",
      descriptions: [
        "重新架构现有的内容编辑器以支持移动端响应式设计，使移动用户参与度增加了10%",
        "创建进度条帮助用户跟踪进度，将用户留存率提高了15%",
        "发现并修复现有代码库中的5个错误，提升了用户体验",
      ],
    },
    {
      company: "XYZ大学",
      jobTitle: "研究助理",
      date: "2021年夏季",
      descriptions: [
        "设计了一种新的文本分类NLP算法，准确率提高了10%",
        "整理并向20多名教职员工和学生展示研究成果",
      ],
    },
  ],
  educations: [
    {
      school: "XYZ大学",
      degree: "计算机科学学士",
      date: "2019年9月 - 2023年5月",
      gpa: "3.8",
      descriptions: [
        "2022年教育黑客马拉松第一名，2023年健康科技竞赛第二名",
        "网页编程课程助教（2022年 - 2023年）",
        "课程成绩：面向对象编程（A+）、网页编程（A+）、云计算（A）、机器学习入门（A-）、算法分析（A-）",
      ],
    },
  ],
  projects: [
    {
      project: "OpenResume",
      date: "2023年春季",
      descriptions: [
        "创建并发布了一个免费简历生成器网页应用，帮助数千名用户轻松创建专业简历并找到理想工作",
      ],
    },
  ],
  skills: {
    featuredSkills: [
      { skill: "HTML", rating: 4 },
      { skill: "CSS", rating: 4 },
      { skill: "Python", rating: 3 },
      { skill: "TypeScript", rating: 3 },
      { skill: "React", rating: 3 },
      { skill: "C++", rating: 2 },
    ],
    descriptions: [
      "技术栈: React Hooks, GraphQL, Node.js, SQL, Postgres, NoSql, Redis, REST API, Git",
      "软技能: 团队合作, 创造性问题解决, 沟通能力, 学习心态, 敏捷开发",
    ],
  },
  custom: {
    descriptions: [],
  },
};

export const START_HOME_RESUME: Resume = {
  profile: deepClone(initialProfile),
  workExperiences: END_HOME_RESUME.workExperiences.map(() =>
    deepClone(initialWorkExperience)
  ),
  educations: [deepClone(initialEducation)],
  projects: [deepClone(initialProject)],
  skills: {
    featuredSkills: END_HOME_RESUME.skills.featuredSkills.map((item) => ({
      skill: "",
      rating: item.rating,
    })),
    descriptions: [],
  },
  custom: {
    descriptions: [],
  },
};
