#!/usr/bin/env python3
"""
Skill Packager - 打包技能为 .skill 文件

Usage:
    package_skill.py <path/to/skill-folder> [output-directory]

Examples:
    package_skill.py ./auto-commit
    package_skill.py ./auto-commit ./dist
"""

import argparse
import json
import os
import re
import sys
import zipfile
from pathlib import Path

def validate_skill(skill_path):
    """验证技能是否符合规范"""
    errors = []
    
    # 检查 SKILL.md
    skill_md_path = skill_path / "SKILL.md"
    if not skill_md_path.exists():
        errors.append("SKILL.md 文件不存在")
    else:
        # 检查 YAML frontmatter
        with open(skill_md_path, 'r', encoding='utf-8') as f:
            content = f.read()
            
        # 检查 frontmatter
        if not content.startswith('---'):
            errors.append("SKILL.md 缺少 YAML frontmatter")
        else:
            # 提取 frontmatter
            frontmatter_match = re.match(r'^---\n(.*?)\n---', content, re.DOTALL)
            if frontmatter_match:
                frontmatter = frontmatter_match.group(1)
                
                # 检查必要字段
                if 'name:' not in frontmatter:
                    errors.append("SKILL.md frontmatter 缺少 name 字段")
                if 'description:' not in frontmatter:
                    errors.append("SKILL.md frontmatter 缺少 description 字段")
            else:
                errors.append("SKILL.md frontmatter 格式错误")
    
    # 检查技能名称
    skill_name = skill_path.name
    if not re.match(r'^[a-z0-9-]+$', skill_name):
        errors.append(f"技能名称 '{skill_name}' 不符合规范（只允许小写字母、数字和连字符）")
    
    # 检查目录结构
    required_dirs = ['scripts', 'references', 'assets']
    for dir_name in required_dirs:
        dir_path = skill_path / dir_name
        if not dir_path.exists():
            errors.append(f"缺少目录: {dir_name}")
    
    return errors

def create_skill_package(skill_path, output_dir):
    """创建 .skill 包"""
    skill_name = skill_path.name
    output_path = output_dir / f"{skill_name}.skill"
    
    # 创建 zip 文件
    with zipfile.ZipFile(output_path, 'w', zipfile.ZIP_DEFLATED) as zipf:
        # 添加所有文件
        for root, dirs, files in os.walk(skill_path):
            for file in files:
                file_path = Path(root) / file
                relative_path = file_path.relative_to(skill_path)
                
                # 跳过隐藏文件和临时文件
                if file.startswith('.') or file.endswith('~'):
                    continue
                
                zipf.write(file_path, relative_path)
    
    return output_path

def main():
    parser = argparse.ArgumentParser(description='打包技能为 .skill 文件')
    parser.add_argument('skill_path', help='技能文件夹路径')
    parser.add_argument('output_dir', nargs='?', default='./dist', help='输出目录')
    
    args = parser.parse_args()
    
    skill_path = Path(args.skill_path)
    output_dir = Path(args.output_dir)
    
    # 检查技能路径
    if not skill_path.exists():
        print(f"❌ 技能路径不存在: {skill_path}")
        sys.exit(1)
    
    if not skill_path.is_dir():
        print(f"❌ 路径不是目录: {skill_path}")
        sys.exit(1)
    
    # 验证技能
    print("🔍 验证技能...")
    errors = validate_skill(skill_path)
    
    if errors:
        print("❌ 验证失败:")
        for error in errors:
            print(f"   - {error}")
        sys.exit(1)
    
    print("✅ 技能验证通过")
    
    # 创建输出目录
    output_dir.mkdir(parents=True, exist_ok=True)
    
    # 打包技能
    print("📦 打包技能...")
    try:
        package_path = create_skill_package(skill_path, output_dir)
        print(f"✅ 打包成功: {package_path}")
        print(f"   文件大小: {package_path.stat().st_size} 字节")
    except Exception as e:
        print(f"❌ 打包失败: {e}")
        sys.exit(1)

if __name__ == '__main__':
    main()