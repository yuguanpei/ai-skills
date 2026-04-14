# 同一文件多行处理

## 问题场景

### 同一文件多处修改
```javascript
// src/components/Button.tsx

// 修改1：行 10-15 - 添加新功能
const NewButton = () => {
  return <button>新按钮</button>;
};

// 修改2：行 30-35 - 重构样式
const styles = {
  padding: "10px"  // 之前是 5px
};
```

### 当前挑战
1. **分类冲突**：不同修改可能属于不同分类
2. **提交策略**：应该分开提交还是合并提交？
3. **用户选择**：如何让用户控制提交粒度？

## 当前实现

### 简单方案
```javascript
// 整个文件一起提交
stageChange(change) {
  const filePath = change.file;
  
  if (change.lines.length > 1) {
    // 同一文件的多个修改块
    console.log(`   筛选 ${filePath} 的特定行...`);
    
    // 当前：stage 整个文件
    execSync(`git add ${filePath}`, { stdio: 'inherit' });
  } else {
    execSync(`git add ${filePath}`, { stdio: 'inherit' });
  }
}
```

### 优点
- 实现简单
- 不需要复杂的选择逻辑
- 用户操作少

### 缺点
- 无法分开提交不同分类的修改
- 可能产生不规范的 commit message
- 失去了自动分类的优势

## 优化方案

### 方案1：智能合并（推荐）
```javascript
// 智能识别相关修改，合并提交
function smartMerge(changes) {
  const fileGroups = {};
  
  // 按文件分组
  changes.forEach(change => {
    if (!fileGroups[change.file]) {
      fileGroups[change.file] = [];
    }
    fileGroups[change.file].push(change);
  });
  
  // 智能合并相关修改
  const mergedChanges = [];
  for (const [file, fileChanges] of Object.entries(fileGroups)) {
    if (fileChanges.length === 1) {
      mergedChanges.push(fileChanges[0]);
    } else {
      // 检查是否相关
      const isRelated = checkRelated(fileChanges);
      if (isRelated) {
        // 合并为一个修改
        mergedChanges.push(mergeChanges(fileChanges));
      } else {
        // 保持分开
        mergedChanges.push(...fileChanges);
      }
    }
  }
  
  return mergedChanges;
}
```

### 方案2：交互式选择
```javascript
// 使用 git add -p 交互式选择
function interactiveStage(change) {
  console.log(`\n📁 文件: ${change.file}`);
  console.log(`修改块:`);
  change.lines.forEach((line, index) => {
    console.log(`  ${index + 1}. 行 ${line.start}-${line.end}`);
  });
  
  // 询问用户选择
  const answer = await askQuestion('选择要提交的修改块 (1,2,3 或 all): ');
  
  if (answer === 'all') {
    execSync(`git add ${change.file}`, { stdio: 'inherit' });
  } else {
    // 使用 git add -p 选择特定行
    // 需要实现行选择逻辑
  }
}
```

### 方案3：自动分类分开提交
```javascript
// 自动识别不同分类，分别提交
function separateByCategory(changes) {
  const categorized = {};
  
  changes.forEach(change => {
    const category = classifyChange(change);
    if (!categorized[category]) {
      categorized[category] = [];
    }
    categorized[category].push(change);
  });
  
  // 分别提交每个分类
  for (const [category, categoryChanges] of Object.entries(categorized)) {
    // stage 该分类的所有变更
    categoryChanges.forEach(change => {
      execSync(`git add ${change.file}`, { stdio: 'inherit' });
    });
    
    // commit
    const message = generateCommitMessage(category, categoryChanges);
    execSync(`git commit -m "${message}"`, { stdio: 'inherit' });
  }
}
```

## 实现建议

### 短期方案（当前版本）
```javascript
// 保持简单方案，但提供提示
function stageChange(change) {
  if (change.lines.length > 1) {
    console.log(`💡 提示: ${change.file} 有多个修改块`);
    console.log(`   当前将整个文件一起提交`);
    console.log(`   如需分开提交，请使用 git add -p 手动选择`);
  }
  
  execSync(`git add ${change.file}`, { stdio: 'inherit' });
}
```

### 中期方案
```javascript
// 添加交互式选项
function stageChange(change) {
  if (change.lines.length > 1) {
    const answer = await askQuestion(
      `${change.file} 有多个修改块，是否分开提交？(y/n): `
    );
    
    if (answer.toLowerCase() === 'y') {
      // 使用 git add -p
      interactiveStage(change);
    } else {
      execSync(`git add ${change.file}`, { stdio: 'inherit' });
    }
  } else {
    execSync(`git add ${change.file}`, { stdio: 'inherit' });
  }
}
```

### 长期方案
```javascript
// 完整的多行处理系统
function processMultiLineChanges(changes) {
  // 1. 智能分析修改块
  const analyzed = analyzeChangeBlocks(changes);
  
  // 2. 分类相关性
  const grouped = groupRelatedChanges(analyzed);
  
  // 3. 用户确认策略
  const strategy = await confirmStrategy(grouped);
  
  // 4. 执行提交
  executeStrategy(strategy);
}
```

## 使用示例

### 示例1：相关修改合并
```javascript
// 同一组件的样式调整
src/components/Button.tsx:
- 行 10-15: 添加新属性
- 行 20-25: 更新样式
- 行 30-35: 优化逻辑

// 智能合并为一个提交
feat(button): add new variant and optimize styles
```

### 示例2：不相关修改分开
```javascript
// 同一文件的不同功能
src/utils/helper.js:
- 行 10-15: 添加日期处理函数 (feature)
- 行 30-35: 重构数组处理逻辑 (refactor)

// 分开提交
feat(helper): add date processing function
refactor(helper): improve array processing logic
```

### 示例3：用户选择
```javascript
// 交互式选择要提交的修改
src/components/App.tsx:
1. 行 10-15: 添加新功能
2. 行 30-35: 修复 Bug
3. 行 50-55: 重构代码

用户选择：1,3
// 提交：feat(app): add new feature + refactor(app): improve code structure
```

## 最佳实践

### 1. 小步提交
- 每个功能单独提交
- 避免大范围修改
- 便于代码审查

### 2. 相关合并
- 同一功能的修改合并提交
- 相关逻辑的调整合并提交
- 保持提交的逻辑性

### 3. 分开提交
- 不同功能的修改分开提交
- 不同分类的修改分开提交
- 便于版本管理

## 注意事项

1. **性能考虑**：复杂的行选择可能影响性能
2. **用户体验**：避免过多的交互提示
3. **兼容性**：确保与不同 Git 版本兼容
4. **错误处理**：处理用户取消操作的情况