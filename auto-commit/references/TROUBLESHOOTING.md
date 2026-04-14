# 故障排除

## 常见问题

### 1. 技能无法加载

**症状：**
```
❌ 加载 Auto Commit 技能失败
```

**可能原因：**
- 文件路径错误
- Node.js 版本不兼容
- 依赖缺失

**解决方案：**
```bash
# 检查 Node.js 版本
node --version  # 需要 >= 14.0.0

# 检查文件权限
ls -la auto-commit.js
chmod +x auto-commit.js

# 重新安装技能
cd ~/.claude/skills/auto-commit
npm install
```

### 2. 分析结果为空

**症状：**
```
✅ 暂无变更需要提交
```

**可能原因：**
- 当前目录不是 Git 仓库
- 没有未提交的变更
- Git 命令执行失败

**解决方案：**
```bash
# 检查 Git 状态
git status

# 检查是否有变更
git diff

# 确保在正确的目录
pwd
ls -la .git
```

### 3. 分类不准确

**症状：**
- 变更被错误分类
- Commit message 不符合预期

**可能原因：**
- 关键词匹配不准确
- 文件扩展名识别错误
- 增删比例判断失误

**解决方案：**
1. 检查配置文件中的分类规则
2. 调整关键词模式
3. 查看详细分析报告

```bash
# 查看详细分析
/auto-commit detail
```

### 4. Commit message 不规范

**症状：**
- 消息格式错误
- 长度超出限制
- 不符合团队规范

**可能原因：**
- 模板配置错误
- Scope 设置不当
- 描述生成逻辑问题

**解决方案：**
1. 检查 `commitMessage.template` 配置
2. 验证 `scope` 设置
3. 查看消息生成逻辑

### 5. 命令不识别

**症状：**
```
未知命令: xxx
```

**可能原因：**
- 命令拼写错误
- 技能未正确安装
- Claude Code 配置问题

**解决方案：**
```bash
# 查看可用命令
/auto-commit help

# 检查技能安装
ls -la ~/.claude/skills/auto-commit
```

## 错误信息处理

### Git 相关错误

#### 错误：不是 Git 仓库
```
fatal: not a git repository
```

**解决：**
```bash
# 初始化 Git 仓库
git init

# 或进入现有仓库
cd /path/to/git/repo
```

#### 错误：权限被拒绝
```
permission denied
```

**解决：**
```bash
# 检查文件权限
ls -la

# 修改权限
chmod +x auto-commit.js
```

### Node.js 相关错误

#### 错误：模块未找到
```
Error: Cannot find module 'xxx'
```

**解决：**
```bash
# 安装依赖
npm install

# 或检查模块路径
node -e "console.log(require.resolve('xxx'))"
```

#### 错误：语法错误
```
SyntaxError: Unexpected token
```

**解决：**
1. 检查 Node.js 版本
2. 验证代码语法
3. 查看错误行号

## 调试方法

### 1. 查看详细日志
```bash
# 使用详细模式
/auto-commit detail

# 检查 Git diff
git diff --unified=0
```

### 2. 测试配置
```bash
# 检查配置加载
node -e "const config = require('./auto-commit.js'); console.log(config);"
```

### 3. 验证 Git 命令
```bash
# 测试 Git 命令
git diff --cached --unified=0
git status
```

## 环境问题

### Windows 环境

#### 问题：路径分隔符
**解决：** 技能已自动处理路径分隔符

#### 问题：Git 命令兼容性
**解决：** 使用标准 Git 命令，确保 Git 在 PATH 中

### macOS/Linux 环境

#### 问题：权限问题
**解决：**
```bash
chmod +x auto-commit.js
```

#### 问题：Node.js 版本
**解决：**
```bash
# 使用 nvm 管理版本
nvm install 14
nvm use 14
```

## 配置问题

### 配置文件不生效

**检查步骤：**
1. 配置文件位置是否正确
2. 语法是否正确
3. 是否需要重启 Claude Code

### 分类规则不工作

**检查步骤：**
1. 关键词是否正确
2. 文件扩展名是否匹配
3. 变更内容是否包含关键词

## 性能问题

### 分析速度慢

**可能原因：**
- 变更文件过多
- Git diff 输出过大
- 网络延迟（如果使用 AI 辅助）

**优化建议：**
1. 分批提交大范围变更
2. 使用 `.gitignore` 排除不必要的文件
3. 考虑使用缓存机制

### 内存占用高

**可能原因：**
- 变更内容过多
- 同时处理大量文件

**优化建议：**
1. 分批处理变更
2. 及时清理临时变量
3. 监控内存使用

## 版本兼容性

### Node.js 版本
- **支持：** >= 14.0.0
- **推荐：** 16.x 或 18.x

### Git 版本
- **支持：** >= 2.0.0
- **推荐：** 最新稳定版

### Claude Code 版本
- **支持：** 最新版本
- **兼容：** 向后兼容

## 获取帮助

### 查看帮助文档
```bash
/auto-commit help
```

### 检查日志
```bash
# 查看详细错误
/auto-commit detail

# 检查 Git 状态
git status
```

### 社区支持
- 查阅 README.md
- 检查参考文档
- 提交 Issue

## 问题反馈

### 提交 Issue
1. 描述问题现象
2. 提供错误信息
3. 说明复现步骤
4. 建议解决方案

### 提供信息
- 操作系统版本
- Node.js 版本
- Git 版本
- 技能版本
- 配置文件内容