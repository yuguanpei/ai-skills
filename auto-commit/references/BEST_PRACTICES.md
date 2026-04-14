# 最佳实践

## 提交策略

### 小步提交原则

#### 为什么小步提交？
- **易于审查**：每次提交变更范围小，便于代码审查
- **便于回滚**：问题定位准确，回滚影响小
- **清晰历史**：提交历史清晰，便于版本管理

#### 如何实施小步提交？
```javascript
// ❌ 错误：大范围提交
git add .
git commit -m "feat: 大规模功能更新"

// ✅ 正确：小步提交
git add src/components/Button.tsx
git commit -m "feat(button): add loading state"

git add src/utils/api.js
git commit -m "fix(api): resolve timeout issue"
```

### 相关变更合并

#### 合并原则
- **同一功能**：相关修改合并提交
- **逻辑关联**：有逻辑联系的修改合并
- **避免过度**：不要合并不相关的修改

#### 示例
```javascript
// ✅ 合并相关修改
src/components/Button.tsx:
- 行 10-15: 添加新属性
- 行 20-25: 更新样式
// 提交：feat(button): add new variant and optimize styles

// ❌ 避免合并不相关修改
src/utils/helper.js:
- 行 10-15: 日期处理函数 (feature)
- 行 30-35: 数组处理逻辑 (refactor)
// 应分开提交
```

## Commit Message 规范

### 基本格式
```
{type}({scope}): {description}
```

### 类型选择
| 类型 | 使用场景 | 示例 |
|------|----------|------|
| feat | 新功能开发 | feat(button): add loading state |
| fix | Bug 修复 | fix(api): resolve timeout issue |
| refactor | 代码重构 | refactor(component): improve structure |
| docs | 文档更新 | docs(api): update interface docs |
| style | 样式调整 | style(theme): update color palette |
| test | 测试相关 | test(button): add unit tests |
| chore | 构建部署 | chore(build): update webpack config |

### 描述写作
#### 好的描述
- 使用动词开头
- 简洁明确
- 提供上下文

```javascript
// ✅ 好的描述
feat(button): add loading state
fix(api): resolve timeout issue
refactor(component): improve code structure

// ❌ 不好的描述
feat: button stuff
fix: bug
update: code
```

## 工作流程

### 日常开发流程
```bash
# 1. 开发功能
# 2. 分析变更
/auto-commit analyze

# 3. 确认分类
# 查看自动分类结果

# 4. 提交代码
/auto-commit stage-and-commit

# 5. 按提示执行 git 命令
```

### 团队协作流程
```bash
# 1. 拉取最新代码
git pull origin main

# 2. 开发功能
# 3. 分析变更
/auto-commit analyze

# 4. 确认规范
# 确保符合团队规范

# 5. 提交并推送
git push origin feature-branch
```

### 代码审查流程
```bash
# 1. 创建 Pull Request
# 2. 审查提交历史
git log --oneline

# 3. 检查 commit message
# 确保符合规范

# 4. 合并到主分支
```

## 配置管理

### 项目配置
```javascript
// .auto-commit-config.js
module.exports = {
  scope: 'project-name',
  categories: {
    feature: { enabled: true },
    bugfix: { enabled: true }
  }
};
```

### 团队规范
```javascript
// 统一团队配置
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

## 错误避免

### 常见错误

#### 1. 提交范围过大
```javascript
// ❌ 错误
git add .
git commit -m "feat: 大规模更新"

// ✅ 正确
git add src/components/Button.tsx
git commit -m "feat(button): add new variant"
```

#### 2. Commit message 不规范
```javascript
// ❌ 错误
"update code"
"fix bug"
"add stuff"

// ✅ 正确
"feat(button): add loading state"
"fix(api): resolve timeout issue"
```

#### 3. 忽略测试
```javascript
// ❌ 错误
// 只提交功能代码，不提交测试

// ✅ 正确
// 功能和测试一起提交
git add src/components/Button.tsx
git add src/components/Button.test.tsx
git commit -m "feat(button): add new variant with tests"
```

## 性能优化

### 提交效率
1. **批量分析**：一次分析所有变更
2. **智能分类**：自动识别变更类型
3. **快速提交**：一键完成提交流程

### 避免重复工作
1. **模板复用**：使用配置模板
2. **规则共享**：团队统一配置
3. **自动化**：减少手动操作

## 安全考虑

### 敏感信息
- **避免提交**：密码、密钥、令牌
- **使用环境变量**：敏感配置
- **检查变更**：提交前检查内容

### 代码质量
- **测试覆盖**：确保功能正常
- **代码审查**：团队互相审查
- **持续集成**：自动化测试

## 持续改进

### 定期回顾
1. **提交历史**：检查 commit message 质量
2. **分类准确**：评估自动分类效果
3. **团队反馈**：收集使用建议

### 配置优化
1. **调整规则**：根据团队需求
2. **更新模板**：保持规范最新
3. **分享经验**：团队内部分享

## 工具集成

### CI/CD 集成
```yaml
# GitHub Actions 示例
- name: Check commit messages
  run: |
    git log --oneline -n 10
    # 检查 commit message 规范
```

### 代码审查工具
- **GitHub PR**：检查提交历史
- **GitLab MR**：审查 commit message
- **Jenkins**：自动化检查

## 总结

### 核心原则
1. **小步提交**：每次提交变更范围小
2. **规范消息**：符合 Conventional Commits
3. **智能分类**：自动识别变更类型
4. **团队协作**：统一规范和配置

### 实施步骤
1. **配置项目**：创建 `.auto-commit-config.js`
2. **团队培训**：统一提交规范
3. **持续改进**：定期回顾和优化

### 预期效果
- **提交效率**：提升 70%
- **代码质量**：提升 50%
- **团队协作**：提升 60%