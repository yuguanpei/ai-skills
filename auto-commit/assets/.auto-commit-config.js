// Auto Commit 配置文件模板
// 复制到项目根目录并修改配置

module.exports = {
  // 项目标识
  scope: 'your-project-name',
  
  // Commit Message 配置
  commitMessage: {
    template: '{type}({scope}): {description}',
    maxLength: 72,
    includeBody: true,
    bodyTemplate: '{details}\n\nBREAKING CHANGE: {breaking}'
  },
  
  // 分类配置
  categories: {
    feature: {
      patterns: ['feat', 'feature', 'add', 'implement', '新增', '添加'],
      commitPrefix: 'feat',
      color: 'green',
      enabled: true
    },
    bugfix: {
      patterns: ['fix', 'bug', 'resolve', 'correct', '修复', '解决'],
      commitPrefix: 'fix',
      color: 'red',
      enabled: true
    },
    refactor: {
      patterns: ['refactor', 'optimize', 'improve', '重构', '优化'],
      commitPrefix: 'refactor',
      color: 'yellow',
      enabled: true
    },
    docs: {
      patterns: ['docs', 'document', 'documentation', '文档', '说明'],
      commitPrefix: 'docs',
      color: 'blue',
      enabled: true
    },
    style: {
      patterns: ['style', 'format', 'formatting', '样式', '格式'],
      commitPrefix: 'style',
      color: 'purple',
      enabled: true
    },
    test: {
      patterns: ['test', 'testing', '测试', '单元测试'],
      commitPrefix: 'test',
      color: 'cyan',
      enabled: true
    },
    chore: {
      patterns: ['chore', 'build', 'ci', 'deploy', '构建', '部署'],
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
    'build/',
    '.git/',
    '*.log',
    '*.tmp'
  ],
  
  // 同一文件多行处理策略
  multiLineStrategy: 'smart', // 'smart', 'separate', 'combined'
  
  // AI 辅助分类（可选）
  aiAssisted: false,
  aiModel: 'gpt-3.5-turbo'
};