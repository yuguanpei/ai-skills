#!/bin/bash

# Auto Commit Skill - 安装脚本

set -e

echo "🤖 Auto Commit Skill 安装脚本"
echo "=============================="

# 检查是否在正确的目录
if [ ! -f "SKILL.md" ]; then
    echo "❌ 请在 auto-commit 技能目录中运行此脚本"
    exit 1
fi

# 检查 Claude Code 技能目录
CLAUDE_SKILLS_DIR="$HOME/.claude/skills"
if [ ! -d "$CLAUDE_SKILLS_DIR" ]; then
    echo "📁 创建 Claude Code 技能目录..."
    mkdir -p "$CLAUDE_SKILLS_DIR"
fi

# 复制技能文件
echo "📦 复制技能文件到 Claude Code..."
cp -r . "$CLAUDE_SKILLS_DIR/auto-commit/"

# 检查 Git 是否可用
if ! command -v git &> /dev/null; then
    echo "❌ 未检测到 Git，请先安装 Git"
    exit 1
fi

# 检查 Node.js 是否可用
if ! command -v node &> /dev/null; then
    echo "❌ 未检测到 Node.js，请先安装 Node.js"
    exit 1
fi

# 安装依赖（如果有）
if [ -f "package.json" ]; then
    echo "📦 安装依赖..."
    npm install
fi

# 创建配置文件示例
echo "📝 创建配置文件示例..."
if [ ! -f "$HOME/.claude/config/auto-commit.json" ]; then
    mkdir -p "$HOME/.claude/config"
    cat > "$HOME/.claude/config/auto-commit.json" << 'EOF'
{
  "commitMessage": {
    "template": "{type}({scope}): {description}",
    "maxLength": 72
  },
  "autoStage": false,
  "confirmBeforeCommit": true
}
EOF
fi

# 显示安装完成信息
echo ""
echo "✅ 安装完成！"
echo ""
echo "📚 使用方法："
echo "   1. 在 Claude Code 中输入："
echo "      /auto-commit help"
echo ""
echo "   2. 分析变更："
echo "      /auto-commit analyze"
echo ""
echo "   3. 详细报告："
echo "      /auto-commit detail"
echo ""
echo "📁 技能位置："
echo "   $CLAUDE_SKILLS_DIR/auto-commit/"
echo ""
echo "⚙️ 配置文件："
echo "   $HOME/.claude/config/auto-commit.json"
echo ""
echo "💡 提示："
echo "   - 首次使用前请阅读 SKILL.md"
echo "   - 可在项目根目录创建 .auto-commit-config.js"
echo "   - 使用 /auto-commit help 查看详细帮助"
echo ""