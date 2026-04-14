# 使用示例

## 基本使用

### 示例1：功能开发
```bash
# 1. 开发新功能
# 编辑代码...

# 2. 分析变更
/auto-commit analyze

# 输出：
# 🔍 分析变更...
# 📊 发现 3 个变更:
# 1. src/components/Button.tsx
#    行号: 10-15, 30-35
#    +5 -2
# 2. src/utils/api.ts
#    行号: 20-25
#    +3 -1
# 3. docs/api.md
#    行号: 5-10
#    +6 -0
#
# 📁 分类结果:
#    feature: 2 个变更
#    docs: 1 个变更
#
# 📝 Commit Message 建议:
#    feature: feat(button): add new button variant
#    docs: docs(api): update api documentation

# 3. 自动提交
/auto-commit stage-and-commit

# 4. 按提示执行 git 命令
git add src/components/Button.tsx
git add src/utils/api.ts
git add docs/api.md
git commit -m "feat(button): add new button variant"
git commit -m "docs(api): update api documentation"
```

### 示例2：Bug 修复
```bash
# 1. 发现并修复 Bug
# 编辑代码...

# 2. 分析变更
/auto-commit analyze

# 输出：
# 📁 分类结果:
#    bugfix: 2 个变更
#
# 📝 Commit Message 建议:
#    bugfix: fix(api): resolve timeout issue
#    bugfix: fix(form): validate required fields

# 3. 交互式确认
/auto-commit interactive

# 4. 确认提交
# 是否提交？(y/n): y
```

### 示例3：代码重构
```bash
# 1. 重构代码
# 编辑代码...

# 2. 查看详细分析
/auto-commit detail

# 3. 确认重构范围
# 检查影响的文件和行数

# 4. 提交重构
/auto-commit stage-and-commit
```

## 高级使用

### 同一文件多处修改
```bash
# 场景：同一文件的不同功能修改
src/components/App.tsx:
- 行 10-15: 添加新功能
- 行 30-35: 修复 Bug
- 行 50-55: 重构代码

# 分析变更
/auto-commit analyze

# 当前实现：整个文件一起提交
# 未来优化：支持分开提交不同修改块
```

### 自定义分类
```bash
# 1. 创建配置文件
# .auto-commit-config.js
module.exports = {
  scope: 'my-project',
  categories: {
    feature: { enabled: true },
    bugfix: { enabled: true },
    performance: {
      patterns: ['perf', 'performance', '性能'],
      commitPrefix: 'perf',
      color: 'orange'
    }
  }
};

# 2. 使用自定义分类
# 变更内容包含 "性能优化" → 自动分类为 performance
```

### 批量提交
```bash
# 场景：多个功能开发完成

# 1. 分析所有变更
/auto-commit analyze

# 2. 查看分类结果
# feature: 5 个变更
# bugfix: 2 个变更
# docs: 1 个变更

# 3. 批量提交
/auto-commit stage-and-commit

# 4. 按分类依次提交
```

## 团队协作

### 统一提交规范
```bash
# 1. 项目配置
# .auto-commit-config.js
module.exports = {
  scope: 'team-project',
  commitMessage: {
    template: '{type}({scope}): {description}',
    maxLength: 72
  }
};

# 2. 团队成员使用
/auto-commit analyze
/auto-commit stage-and-commit
```

### 代码审查
```bash
# 1. 创建 Pull Request
# 2. 审查提交历史
git log --oneline

# 3. 检查 commit message
# 确保符合规范

# 4. 合并到主分支
```

## 特殊场景

### 紧急修复
```bash
# 1. 快速修复 Bug
# 编辑代码...

# 2. 快速提交
/auto-commit analyze
/auto-commit stage-and-commit

# 3. 标记为紧急
# 在 commit message 中添加 [紧急]
```

### 大规模重构
```bash
# 1. 分阶段重构
# 阶段1：重构组件结构
# 阶段2：优化性能
# 阶段3：更新文档

# 2. 每个阶段单独提交
/auto-commit analyze
/auto-commit stage-and-commit

# 3. 使用标签标记
# feat(refactor): 阶段1 - 组件结构重构
```

### 多人协作
```bash
# 1. 拉取最新代码
git pull origin main

# 2. 开发功能
# 编辑代码...

# 3. 分析变更
/auto-commit analyze

# 4. 确认无冲突
# 检查是否与他人修改冲突

# 5. 提交并推送
git push origin feature-branch
```

## 配置示例

### 基础配置
```javascript
// .auto-commit-config.js
module.exports = {
  scope: 'my-project',
  categories: {
    feature: { enabled: true },
    bugfix: { enabled: true }
  }
};
```

### 团队配置
```javascript
// .auto-commit-config.js
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
    docs: { enabled: true },
    style: { enabled: true },
    test: { enabled: true },
    chore: { enabled: true }
  },
  autoStage: true,
  confirmBeforeCommit: true
};
```

### 自定义配置
```javascript
// .auto-commit-config.js
module.exports = {
  scope: 'my-project',
  categories: {
    feature: {
      patterns: ['feat', 'feature', 'add', '新增'],
      commitPrefix: 'feat',
      color: 'green'
    },
    bugfix: {
      patterns: ['fix', 'bug', '修复'],
      commitPrefix: 'fix',
      color: 'red'
    },
    performance: {
      patterns: ['perf', 'performance', '性能'],
      commitPrefix: 'perf',
      color: 'orange'
    }
  }
};
```

## 故障排除

### 问题1：分析结果为空
```bash
# 检查 Git 状态
git status

# 检查是否有变更
git diff

# 确保在 Git 仓库中
ls -la .git
```

### 问题2：分类不准确
```bash
# 查看详细分析
/auto-commit detail

# 检查配置文件
cat .auto-commit-config.js

# 调整分类规则
```

### 问题3：提交失败
```bash
# 检查 Git 配置
git config --list

# 检查权限
ls -la

# 手动提交测试
git add .
git commit -m "test"
```

## 最佳实践总结

### 1. 提交前检查
- 查看自动分类结果
- 确认 commit message
- 检查 staged 文件

### 2. 小步提交
- 功能开发分阶段提交
- Bug 修复及时提交
- 重构分步骤进行

### 3. 规范命名
- 使用 Conventional Commits
- 保持 scope 一致性
- 描述简洁明确

### 4. 团队协作
- 统一提交规范
- 定期回顾提交历史
- 分享最佳实践

## 扩展功能

### CI/CD 集成
```yaml
# GitHub Actions
- name: Check commit messages
  run: |
    git log --oneline -n 10
    # 检查 commit message 规范
```

### 代码审查
```bash
# 审查提交历史
git log --oneline --graph

# 检查 commit message
git log --format="%h %s"
```

### 版本管理
```bash
# 创建版本标签
git tag -a v1.0.0 -m "Release version 1.0.0"

# 查看版本历史
git tag -l
```

## 总结

Auto Commit Skill 可以显著提升提交效率和代码质量：

- **时间节省**：减少 80% 的提交准备时间
- **质量提升**：规范的 commit message
- **团队协作**：统一的提交规范
- **错误减少**：智能分类避免手动错误

开始使用：
```bash
/auto-commit help
```