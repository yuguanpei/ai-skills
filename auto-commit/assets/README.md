# 资产文件

## 配置模板

### .auto-commit-config.js
项目级配置文件模板

**使用方法：**
1. 复制到项目根目录
2. 修改 `scope` 为项目名称
3. 根据需要调整分类规则

### commit-template.txt
Commit message 模板

**使用方法：**
1. 作为参考模板
2. 自定义消息格式
3. 团队规范统一

## 模板内容

### .auto-commit-config.js 模板
```javascript
module.exports = {
  // 项目标识
  scope: 'your-project-name',
  
  // Commit Message 配置
  commitMessage: {
    template: '{type}({scope}): {description}',
    maxLength: 72,
    includeBody: true
  },
  
  // 分类配置
  categories: {
    feature: {
      patterns: ['feat', 'feature', 'add', '新增', '添加'],
      commitPrefix: 'feat',
      color: 'green',
      enabled: true
    },
    bugfix: {
      patterns: ['fix', 'bug', 'resolve', '修复', '解决'],
      commitPrefix: 'fix',
      color: 'red',
      enabled: true
    },
    refactor: {
      patterns: ['refactor', 'optimize', '重构', '优化'],
      commitPrefix: 'refactor',
      color: 'yellow',
      enabled: true
    },
    docs: {
      patterns: ['docs', 'document', '文档'],
      commitPrefix: 'docs',
      color: 'blue',
      enabled: true
    },
    style: {
      patterns: ['style', 'format', '样式'],
      commitPrefix: 'style',
      color: 'purple',
      enabled: true
    },
    test: {
      patterns: ['test', 'testing', '测试'],
      commitPrefix: 'test',
      color: 'cyan',
      enabled: true
    },
    chore: {
      patterns: ['chore', 'build', 'ci', '部署'],
      commitPrefix: 'chore',
      color: 'gray',
      enabled: true
    }
  },
  
  // 自动配置选项
  autoStage: true,
  confirmBeforeCommit: true,
  
  // 文件过滤规则
  ignorePatterns: [
    'node_modules/',
    'dist/',
    '.git/',
    '*.log',
    '*.tmp'
  ],
  
  // 同一文件多行处理策略
  multiLineStrategy: 'smart'
};
```

### commit-template.txt 模板
```
# Commit Message 模板

## 格式
{type}({scope}): {description}

## 示例
feat(button): add new button variant
fix(api): resolve timeout issue
refactor(component): improve code structure

## 类型说明
- feat: 新功能
- fix: Bug 修复
- refactor: 代码重构
- docs: 文档更新
- style: 样式调整
- test: 测试相关
- chore: 构建部署

## 注意事项
1. 使用英文小写
2. 描述简洁明确
3. 避免冗余信息
4. 符合团队规范
```

## 使用示例

### 项目配置
```bash
# 复制配置模板到项目根目录
cp assets/.auto-commit-config.js ./

# 修改项目名称
sed -i 's/your-project-name/my-project/g' .auto-commit-config.js
```

### 团队规范
```bash
# 将模板添加到项目模板目录
cp assets/.auto-commit-config.js project-template/

# 在项目初始化时自动复制
```

## 自定义模板

### 添加新模板
1. 在 `assets/` 目录创建新文件
2. 在 SKILL.md 中引用
3. 提供使用说明

### 模板命名规范
- 使用小写字母和连字符
- 描述性名称
- 避免特殊字符

## 维护指南

### 更新模板
1. 检查模板是否过时
2. 更新配置选项
3. 测试模板有效性

### 版本管理
- 模板版本与技能版本同步
- 记录模板变更历史
- 提供迁移指南