# Auto Commit Skill

基于 Skill Creator 重构的 Auto Commit Skill，支持智能分类和 Commit Message 生成。

## 📦 包内容

```
auto-commit/
├── SKILL.md                    # 技能文档（必需）
├── scripts/                    # 脚本目录
│   ├── auto-commit.js         # 主程序
│   ├── package_skill.py       # 打包脚本
│   ├── install.sh             # 安装脚本
│   └── README.md              # 脚本文档
├── references/                 # 参考文档
│   ├── CATEGORIES.md          # 分类规则
│   ├── MESSAGES.md            # 消息生成规则
│   ├── CONFIG.md              # 配置选项
│   ├── MULTILINE.md           # 多行处理
│   ├── TROUBLESHOOTING.md     # 故障排除
│   ├── BEST_PRACTICES.md      # 最佳实践
│   └── EXAMPLES.md            # 使用示例
└── assets/                     # 资产文件
    ├── .auto-commit-config.js # 配置模板
    ├── commit-template.txt    # Commit 模板
    └── README.md              # 资产说明
```

## 🚀 快速开始

### 1. 安装技能
```bash
cd ~/.openclaw/workspace/skills/auto-commit
./scripts/install.sh
```

### 2. 配置项目
```bash
# 复制配置模板到项目根目录
cp assets/.auto-commit-config.js ./

# 修改项目名称
sed -i 's/your-project-name/my-project/g' .auto-commit-config.js
```

### 3. 开始使用
```bash
# 在 Claude Code 中
/auto-commit help
/auto-commit analyze
/auto-commit detail
```

## 📚 文档导航

### 核心文档
- **SKILL.md** - 技能主文档，包含使用方法和命令说明
- **CATEGORIES.md** - 详细的分类规则
- **MESSAGES.md** - Commit message 生成规则

### 配置文档
- **CONFIG.md** - 所有配置选项说明
- **MULTILINE.md** - 同一文件多行处理策略

### 实用文档
- **TROUBLESHOOTING.md** - 故障排除指南
- **BEST_PRACTICES.md** - 最佳实践
- **EXAMPLES.md** - 使用示例集合

## 🎯 核心功能

### 1. 智能分类
- 基于文件扩展名
- 基于关键词匹配
- 基于增删比例

### 2. Commit Message 生成
- 符合 Conventional Commits
- 模板驱动
- 自动描述生成

### 3. 配置驱动
- 项目级配置
- 全局配置
- 默认配置

## 🔧 开发指南

### 添加新功能
1. 修改 `scripts/auto-commit.js`
2. 更新参考文档
3. 测试功能

### 自定义分类
1. 编辑 `.auto-commit-config.js`
2. 添加新的分类规则
3. 测试分类效果

### 打包发布
```bash
python3 scripts/package_skill.py . ./dist
```

## 📊 版本信息

- **版本**: v1.0.0
- **基于**: Skill Creator 规范
- **兼容**: Claude Code, OpenClaw

## 🤝 贡献指南

1. Fork 项目
2. 创建特性分支
3. 提交更改
4. 创建 Pull Request

## 📄 许可证

MIT License