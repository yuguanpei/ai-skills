# Commit Message 生成规则

## 消息格式

### 基本模板
```
{type}({scope}): {description}
```

### 示例
```
feat(button): add new button variant
fix(api): resolve timeout issue
refactor(component): improve code structure
```

## 消息组成部分

### 1. Type (类型)
来自分类的 commit 前缀：

| 分类 | 前缀 | 说明 |
|------|------|------|
| feature | feat | 新功能 |
| bugfix | fix | Bug 修复 |
| refactor | refactor | 代码重构 |
| docs | docs | 文档更新 |
| style | style | 样式调整 |
| test | test | 测试相关 |
| chore | chore | 构建部署 |

### 2. Scope (范围)
来自配置的 scope 字段：

```javascript
// 配置示例
module.exports = {
  scope: 'button'  // 或 'project-name'
};
```

### 3. Description (描述)
基于变更内容生成：

#### 单个变更
```javascript
// 基于文件名 + 变更内容
describeFile(change.file) + ": " + describeChanges(change)
```

#### 多个变更
```javascript
// 基于文件名列表
"update " + fileNames.join(", ")
```

## 描述生成规则

### 文件名描述
```javascript
function describeFile(filePath) {
  const name = path.basename(filePath, path.extname(filePath));
  
  // 组件文件：驼峰转空格
  if (filePath.includes('components/')) {
    return name.replace(/([A-Z])/g, ' $1').trim().toLowerCase();
  }
  
  // API 文件：驼峰转空格
  if (filePath.includes('api/') || filePath.includes('service/')) {
    return name.replace(/([A-Z])/g, ' $1').trim().toLowerCase();
  }
  
  // 其他：直接使用文件名
  return name;
}
```

### 变更内容描述
```javascript
function describeChanges(change, category) {
  switch (category) {
    case 'feature':
      return 'add ' + change.additions[0].substring(0, 50) + '...';
    
    case 'bugfix':
      return 'fix ' + change.deletions[0].substring(0, 50) + '...';
    
    case 'refactor':
      return 'improve code structure';
    
    case 'docs':
      return 'update documentation';
    
    case 'style':
      return 'update styles';
    
    case 'test':
      return 'add/update tests';
    
    default:
      return 'update';
  }
}
```

## 消息示例

### 功能开发
```javascript
// 文件：src/components/Button.tsx
// 变更：添加新按钮变体
// 生成：feat(button): add new button variant
```

### Bug 修复
```javascript
// 文件：src/utils/api.js
// 变更：修复请求超时
// 生成：fix(api): resolve timeout issue
```

### 代码重构
```javascript
// 文件：src/components/App.tsx
// 变更：重构组件结构
// 生成：refactor(app): improve code structure
```

### 文档更新
```javascript
// 文件：docs/API.md
// 变更：更新接口文档
// 生成：docs(api): update interface documentation
```

## 长度限制

### 最大长度
```javascript
const maxLength = 72; // 默认值
```

### 截断策略
```javascript
if (message.length > maxLength) {
  message = message.substring(0, maxLength - 3) + '...';
}
```

## 自定义模板

### 配置模板
```javascript
module.exports = {
  commitMessage: {
    template: '{type}({scope}): {description}',
    maxLength: 72,
    includeBody: true,
    bodyTemplate: '{details}\n\nBREAKING CHANGE: {breaking}'
  }
};
```

### 模板变量
- `{type}` - commit 类型前缀
- `{scope}` - 变更范围
- `{description}` - 变更描述
- `{details}` - 详细说明
- `{breaking}` - 破坏性变更

## 最佳实践

### 1. 描述简洁
- 使用动词开头
- 保持简短明确
- 避免冗余信息

### 2. 范围准确
- 基于文件路径
- 反映实际变更
- 保持一致性

### 3. 类型正确
- 准确分类变更
- 符合团队规范
- 便于版本管理

## 示例集合

### 前端开发
```
feat(button): add loading state
fix(form): validate required fields
refactor(layout): improve responsive design
docs(component): add usage examples
style(theme): update color palette
test(button): add unit tests
chore(build): update webpack config
```

### 后端开发
```
feat(api): add user authentication
fix(database): resolve connection timeout
refactor(service): improve error handling
docs(api): update endpoint documentation
test(controller): add integration tests
chore(deploy): update deployment script
```

### 全栈开发
```
feat(auth): implement login page
fix(payment): resolve transaction error
refactor(state): improve Redux structure
docs(readme): add setup instructions
style(css): update mobile responsiveness
test(e2e): add user flow tests
chore(ci): update GitHub Actions
```

## 注意事项

1. **一致性**：团队统一使用相同格式
2. **可读性**：描述要清晰易懂
3. **规范性**：符合 Conventional Commits
4. **实用性**：便于版本管理和回滚