---
name: auto-commit
description: 基于 Git changes 自动分类 stage 并生成 commit message，支持同一文件不同行的分开 commit。使用当需要自动化 Git 提交流程、规范 commit message、智能分类变更时。
---

# Auto Commit Skill

## Overview

自动分析 Git 变更，智能分类并生成规范的 commit message，支持同一文件不同行的分开提交。

## Quick Start

### 基本使用
```bash
# 分析变更
/auto-commit analyze

# 自动提交
/auto-commit stage-and-commit

# 交互式模式
/auto-commit interactive
```

### 配置项目
在项目根目录创建 `.auto-commit-config.js`：
```javascript
module.exports = {
  scope: 'your-project-name',
  categories: {
    feature: { enabled: true },
    bugfix: { enabled: true }
  }
};
```

## Workflow Decision Tree

```
用户需要提交代码
    ↓
是否需要自动分类？ → 否 → 手动提交
    ↓ 是
执行 /auto-commit analyze
    ↓
查看分析结果
    ↓
是否确认分类？ → 否 → 使用 interactive 模式调整
    ↓ 是
执行 /auto-commit stage-and-commit
    ↓
按提示手动执行 git 命令
    ↓
完成提交
```

## Core Features

### 1. 智能变更分类

基于多维度策略自动分类：

- **文件扩展名**：.md → docs，.css → style
- **关键词匹配**：识别变更内容中的关键词
- **增删比例**：功能开发 vs 重构

See [CATEGORIES.md](references/CATEGORIES.md) for detailed classification rules.

### 2. 同一文件多行处理

支持同一文件的不同修改块分开提交：

```javascript
// 当前实现：整个文件一起提交
// 未来优化：使用 git add -p 分开选择
```

See [MULTILINE.md](references/MULTILINE.md) for implementation details.

### 3. Commit Message 生成

符合 Conventional Commits 规范：

```
feat(scope): description
fix(scope): description
refactor(scope): description
```

See [MESSAGES.md](references/MESSAGES.md) for message generation rules.

## Commands

### analyze
分析当前变更并显示建议

```bash
/auto-commit analyze
```

**输出内容：**
- 变更列表（文件、行号、增删数量）
- 分类结果
- Commit Message 建议

### stage-and-commit
显示提交建议（需手动确认）

```bash
/auto-commit stage-and-commit
```

**流程：**
1. 分析变更
2. 显示将要提交的内容
3. 提示手动执行 git 命令

### interactive
交互式确认模式

```bash
/auto-commit interactive
```

**功能：**
- 逐个确认分类
- 修改 commit message
- 最终确认提交

### detail
显示详细分析报告

```bash
/auto-commit detail
```

**包含：**
- 变更详情（增删内容）
- 分类详情
- Commit Message 详情

## Configuration

### 项目配置
创建 `.auto-commit-config.js`：

```javascript
module.exports = {
  scope: 'project-name',
  commitMessage: {
    template: '{type}({scope}): {description}',
    maxLength: 72
  },
  categories: {
    feature: { enabled: true },
    bugfix: { enabled: true }
  }
};
```

See [CONFIG.md](references/CONFIG.md) for all configuration options.

### 分类规则
See [CATEGORIES.md](references/CATEGORIES.md) for detailed classification rules.

## Error Handling

### 常见问题
1. **无变更检测** → 提示用户暂无修改
2. **分类失败** → 提供手动分类选项
3. **Commit 失败** → 提供重试机制

See [TROUBLESHOOTING.md](references/TROUBLESHOOTING.md) for detailed solutions.

## Best Practices

### 提交前检查
- 查看自动分类结果
- 确认 commit message
- 检查 staged 文件

### 小步提交
- 功能开发分阶段提交
- Bug 修复及时提交
- 重构分步骤进行

### 规范命名
- 使用 Conventional Commits
- 保持 scope 一致性
- 描述简洁明确

See [BEST_PRACTICES.md](references/BEST_PRACTICES.md) for detailed guidelines.

## Examples

### 场景1：功能开发
```bash
# 开发新功能后
/auto-commit analyze
# 查看变更分析
/auto-commit stage-and-commit
# 按提示提交
```

### 场景2：同一文件多处修改
```bash
# 同一文件不同功能的修改
/auto-commit analyze --split
# 智能识别不同修改块
# 分别生成 commit message
```

### 场景3：Bug 修复
```bash
# 修复多个 bug
/auto-commit interactive
# 交互式确认每个修改
```

See [EXAMPLES.md](references/EXAMPLES.md) for more usage examples.

## Scripts

### init_skill.py
初始化新技能结构

### package_skill.py
打包技能为 .skill 文件

See [SCRIPTS.md](scripts/README.md) for script documentation.

## References

- [CATEGORIES.md](references/CATEGORIES.md) - 分类规则
- [MESSAGES.md](references/MESSAGES.md) - 消息生成规则
- [CONFIG.md](references/CONFIG.md) - 配置选项
- [MULTILINE.md](references/MULTILINE.md) - 多行处理
- [TROUBLESHOOTING.md](references/TROUBLESHOOTING.md) - 故障排除
- [BEST_PRACTICES.md](references/BEST_PRACTICES.md) - 最佳实践
- [EXAMPLES.md](references/EXAMPLES.md) - 使用示例

## Assets

### Templates
- `.auto-commit-config.js` - 项目配置模板
- `commit-template.txt` - Commit message 模板

See [ASSETS.md](assets/README.md) for asset documentation.