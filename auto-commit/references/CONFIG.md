# 配置选项参考

## 配置文件位置

### 项目配置
```
项目根目录/
└── .auto-commit-config.js
```

### 全局配置
```
~/.claude/config/auto-commit.json
```

## 配置结构

### 完整配置示例
```javascript
module.exports = {
  // 项目标识
  scope: 'project-name',
  
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
    // ... 其他分类
  },
  
  // 自动配置选项
  autoStage: true,
  confirmBeforeCommit: true,
  
  // 文件过滤规则
  ignorePatterns: [
    'node_modules/',
    'dist/',
    '.git/',
    '*.log'
  ],
  
  // 同一文件多行处理策略
  multiLineStrategy: 'smart'
};
```

## 配置项详解

### scope
**类型：** String  
**默认：** 'project'  
**说明：** Commit message 中的范围标识

```javascript
scope: 'my-project'
```

### commitMessage.template
**类型：** String  
**默认：** '{type}({scope}): {description}'  
**说明：** Commit message 模板

```javascript
template: '{type}({scope}): {description}'
```

### commitMessage.maxLength
**类型：** Number  
**默认：** 72  
**说明：** Commit message 最大长度

```javascript
maxLength: 72
```

### commitMessage.includeBody
**类型：** Boolean  
**默认：** true  
**说明：** 是否包含详细说明

```javascript
includeBody: true
```

### categories
**类型：** Object  
**说明：** 分类规则配置

每个分类包含：
- `patterns` - 关键词模式数组
- `commitPrefix` - commit 前缀
- `color` - 显示颜色
- `enabled` - 是否启用

```javascript
categories: {
  feature: {
    patterns: ['feat', 'feature', 'add'],
    commitPrefix: 'feat',
    color: 'green',
    enabled: true
  }
}
```

### autoStage
**类型：** Boolean  
**默认：** true  
**说明：** 是否自动 stage 变更

```javascript
autoStage: true
```

### confirmBeforeCommit
**类型：** Boolean  
**默认：** true  
**说明：** 提交前是否确认

```javascript
confirmBeforeCommit: true
```

### ignorePatterns
**类型：** Array  
**默认：** []  
**说明：** 忽略的文件模式

```javascript
ignorePatterns: [
  'node_modules/',
  'dist/',
  '*.log'
]
```

### multiLineStrategy
**类型：** String  
**默认：** 'smart'  
**说明：** 同一文件多行处理策略

- `'smart'` - 智能合并相关修改
- `'separate'` - 分开提交不同修改
- `'combined'` - 合并提交所有修改

```javascript
multiLineStrategy: 'smart'
```

## 配置优先级

### 优先级顺序
1. **项目配置** (.auto-commit-config.js) - 最高
2. **全局配置** (~/.claude/config/auto-commit.json)
3. **默认配置** (代码内置) - 最低

### 配置合并规则
```javascript
// 后面的配置覆盖前面的
const finalConfig = {
  ...defaultConfig,
  ...globalConfig,
  ...projectConfig
};
```

## 配置示例

### 基础配置
```javascript
module.exports = {
  scope: 'my-project',
  categories: {
    feature: { enabled: true },
    bugfix: { enabled: true }
  }
};
```

### 自定义分类
```javascript
module.exports = {
  scope: 'my-project',
  categories: {
    feature: {
      patterns: ['feat', 'feature', 'add', '新增'],
      commitPrefix: 'feat'
    },
    bugfix: {
      patterns: ['fix', 'bug', '修复'],
      commitPrefix: 'fix'
    },
    // 自定义分类
    performance: {
      patterns: ['perf', 'performance', '性能'],
      commitPrefix: 'perf',
      color: 'orange'
    }
  }
};
```

### 高级配置
```javascript
module.exports = {
  scope: 'my-project',
  commitMessage: {
    template: '{type}({scope}): {description}',
    maxLength: 100,
    includeBody: true,
    bodyTemplate: '{details}\n\nBREAKING CHANGE: {breaking}'
  },
  categories: {
    feature: {
      patterns: ['feat', 'feature', 'add'],
      commitPrefix: 'feat',
      color: 'green',
      enabled: true
    }
  },
  autoStage: false,
  confirmBeforeCommit: true,
  ignorePatterns: [
    'node_modules/',
    'dist/',
    '.git/',
    '*.log',
    '*.tmp'
  ],
  multiLineStrategy: 'smart'
};
```

## 环境特定配置

### 开发环境
```javascript
module.exports = {
  scope: 'dev',
  autoStage: true,
  confirmBeforeCommit: false
};
```

### 生产环境
```javascript
module.exports = {
  scope: 'prod',
  autoStage: false,
  confirmBeforeCommit: true
};
```

### 团队配置
```javascript
module.exports = {
  scope: 'team-project',
  commitMessage: {
    template: '{type}({scope}): {description}',
    maxLength: 72
  },
  categories: {
    feature: { enabled: true },
    bugfix: { enabled: true },
    refactor: { enabled: true },
    docs: { enabled: true }
  }
};
```

## 配置验证

### 有效配置
```javascript
// ✅ 正确
module.exports = {
  scope: 'my-project',
  categories: {
    feature: { enabled: true }
  }
};
```

### 无效配置
```javascript
// ❌ 错误：缺少 scope
module.exports = {
  categories: {
    feature: { enabled: true }
  }
};

// ❌ 错误：分类格式错误
module.exports = {
  categories: [
    { name: 'feature', enabled: true }  // 应该是对象而非数组
  ]
};
```

## 配置迁移

### 从旧版本迁移
```javascript
// 旧配置
const oldConfig = {
  project: 'my-project',
  autoCommit: true
};

// 新配置
module.exports = {
  scope: oldConfig.project,
  autoStage: oldConfig.autoCommit
};
```

## 故障排除

### 配置不生效
1. 检查配置文件位置是否正确
2. 确认配置文件语法正确
3. 重启 Claude Code

### 分类规则不工作
1. 检查 patterns 是否正确
2. 确认文件扩展名匹配
3. 查看关键词是否包含在变更中

### Commit message 不规范
1. 检查 template 配置
2. 确认 maxLength 设置
3. 验证 scope 配置