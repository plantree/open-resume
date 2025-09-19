# OpenResume YAML 导入导出功能

## 概述

OpenResume 现已支持 YAML 格式的简历数据导入和导出功能，为用户提供了更灵活的数据交换方式。

## 功能特性

### 1. YAML 导出
- **完整数据导出**: 导出包含简历内容和设置信息的完整YAML文件
- **版本信息**: 包含导出时间戳和格式版本信息
- **人类可读**: YAML格式易于阅读和编辑

### 2. YAML 导入
- **智能解析**: 自动识别YAML文件格式并验证数据结构
- **设置恢复**: 如果YAML包含设置信息，会自动恢复用户的个性化配置
- **错误处理**: 提供详细的错误信息，帮助用户修正格式问题

## 使用方法

### 导出简历为YAML

1. 在简历构建器页面，点击右下角的"下载简历"按钮
2. 从下拉菜单中选择"下载YAML"
3. 系统会自动下载包含完整简历数据的YAML文件

### 导入YAML简历

1. 在简历导入页面，将YAML文件拖拽到上传区域或点击"浏览文件"按钮
2. 选择您的YAML文件(.yaml 或 .yml 格式)
3. 点击"导入并继续"，系统会自动解析并导入数据
4. 导入成功后会跳转到简历构建器页面

## YAML 文件结构

### 基本结构
```yaml
resume:
  profile:        # 个人信息
  workExperiences: # 工作经历
  educations:     # 教育背景
  projects:       # 项目经验
  skills:         # 技能专长
  custom:         # 其他信息

settings:         # 显示设置(可选)
  themeColor:     # 主题颜色
  fontFamily:     # 字体
  fontSize:       # 字体大小
  # ...更多设置

exportInfo:       # 导出信息(自动生成)
  exportedAt:     # 导出时间
  version:        # 格式版本
  format:         # 文件格式
```

### 详细字段说明

#### 个人信息 (profile)
```yaml
profile:
  name: "姓名"
  email: "邮箱地址"
  phone: "电话号码"
  url: "个人网站或LinkedIn"
  summary: "个人简介"
  location: "所在地"
```

#### 工作经历 (workExperiences)
```yaml
workExperiences:
  - company: "公司名称"
    jobTitle: "职位名称"
    date: "工作时间"
    descriptions:
      - "工作描述1"
      - "工作描述2"
```

#### 教育背景 (educations)
```yaml
educations:
  - school: "学校名称"
    degree: "学位专业"
    date: "就读时间"
    gpa: "GPA成绩"
    descriptions:
      - "相关描述"
```

#### 项目经验 (projects)
```yaml
projects:
  - project: "项目名称"
    date: "项目时间"
    descriptions:
      - "项目描述1"
      - "项目描述2"
```

#### 技能专长 (skills)
```yaml
skills:
  featuredSkills:
    - skill: "技能名称"
      rating: 5  # 1-5星评级
  descriptions:
    - "技能描述1"
    - "技能描述2"
```

#### 其他信息 (custom)
```yaml
custom:
  descriptions:
    - "其他信息1"
    - "其他信息2"
```

## 支持的文件格式

- `.yaml` - 标准YAML格式
- `.yml` - 简化YAML格式
- `.pdf` - PDF简历文件(现有功能)

## 错误处理

当导入YAML文件时，如果遇到以下问题，系统会显示相应的错误信息：

- **格式错误**: YAML语法不正确
- **结构错误**: 缺少必需字段或字段类型不匹配
- **编码错误**: 文件编码问题

## 最佳实践

1. **备份数据**: 导出YAML文件作为简历数据的备份
2. **版本控制**: 可以将YAML文件加入Git等版本控制系统
3. **批量编辑**: 使用文本编辑器批量修改简历内容
4. **数据迁移**: 在不同设备间迁移简历数据

## 示例文件

项目根目录下的 `test-resume.yaml` 文件包含了一个完整的示例，可以用来测试导入功能。

## 技术实现

- 使用 `js-yaml` 库进行YAML解析和生成
- 完整的数据验证确保导入数据的正确性
- 支持增量数据导入(只包含简历内容，不包含设置)
- 向后兼容，确保不同版本间的数据交换

---

这个功能大大增强了OpenResume的数据互操作性，使用户能够更灵活地管理和编辑简历数据。
