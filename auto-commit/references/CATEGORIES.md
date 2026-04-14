# 分类规则参考

## 分类策略

### 优先级顺序
1. **文件扩展名**（最高优先级）
2. **关键词匹配**
3. **增删比例分析**

## 详细分类规则

### 1. 文档类 (docs)
**触发条件：**
- 文件扩展名：`.md`, `.txt`
- 关键词：`docs`, `document`, `documentation`, `文档`, `说明`

**示例：**
- `README.md` → docs
- `API文档.md` → docs
- `CHANGELOG.md` → docs

### 2. 样式类 (style)
**触发条件：**
- 文件扩展名：`.css`, `.scss`, `.less`, `.sass`
- 关键词：`style`, `format`, `formatting`, `样式`, `格式`

**示例：**
- `styles.css` → style
- `theme.scss` → style
- `layout.less` → style

### 3. 测试类 (test)
**触发条件：**
- 文件扩展名：`.test.js`, `.spec.js`, 包含 `test`
- 关键词：`test`, `testing`, `测试`, `单元测试`

**示例：**
- `button.test.js` → test
- `api.spec.js` → test
- `utils.test.ts` → test

### 4. 功能类 (feature)
**触发条件：**
- 关键词：`feat`, `feature`, `add`, `implement`, `新增`, `添加`
- 增删比例：添加行数 > 删除行数 * 2

**示例：**
- 添加新组件 → feature
- 新增 API 接口 → feature
- 实现新功能 → feature

### 5. 修复类 (bugfix)
**触发条件：**
- 关键词：`fix`, `bug`, `resolve`, `correct`, `修复`, `解决`
- 代码逻辑：错误处理、异常修复

**示例：**
- 修复空指针异常 → bugfix
- 解决内存泄漏 → bugfix
- 修正计算错误 → bugfix

### 6. 重构类 (refactor)
**触发条件：**
- 关键词：`refactor`, `optimize`, `improve`, `重构`, `优化`
- 增删比例：删除行数 > 添加行数 * 2

**示例：**
- 优化代码结构 → refactor
- 重构组件逻辑 → refactor
- 改进性能 → refactor

### 7. 杂项类 (chore)
**触发条件：**
- 关键词：`chore`, `build`, `ci`, `deploy`, `构建`, `部署`
- 其他未分类的变更

**示例：**
- 更新依赖版本 → chore
- 配置 CI/CD → chore
- 构建脚本修改 → chore

## 分类流程

```javascript
function classifyChange(change) {
  // 1. 检查文件扩展名
  if (isDocumentFile(change.file)) return 'docs';
  if (isStyleFile(change.file)) return 'style';
  if (isTestFile(change.file)) return 'test';
  
  // 2. 检查关键词
  const content = getContent(change);
  for (const [category, config] of categories) {
    if (hasKeyword(content, config.patterns)) {
      return category;
    }
  }
  
  // 3. 基于增删比例
  if (change.additions.length > change.deletions.length * 2) {
    return 'feature';
  } else if (change.deletions.length > change.additions.length * 2) {
    return 'refactor';
  } else {
    return 'chore';
  }
}
```

## 自定义分类

在 `.auto-commit-config.js` 中添加自定义分类：

```javascript
module.exports = {
  categories: {
    mycategory: {
      patterns: ['mykeyword', '我的关键词'],
      commitPrefix: 'mycat',
      color: 'orange'
    }
  }
};
```

## 分类示例

### 示例1：功能开发
```javascript
// 文件：src/components/NewFeature.tsx
// 变更：添加新组件
// 分类：feature
// Commit: feat(component): add new feature component
```

### 示例2：Bug 修复
```javascript
// 文件：src/utils/api.js
// 变更：修复请求超时问题
// 分类：bugfix
// Commit: fix(api): resolve timeout issue
```

### 示例3：文档更新
```javascript
// 文件：docs/API.md
// 变更：更新接口文档
// 分类：docs
// Commit: docs(api): update interface documentation
```

## 注意事项

1. **优先级明确**：文件扩展名 > 关键词 > 增删比例
2. **灵活配置**：支持自定义分类规则
3. **准确识别**：基于多维度分析提高准确性
4. **可扩展性**：易于添加新的分类规则