# 脚本文档

## init_skill.py

### 功能
初始化新技能结构

### 使用方法
```bash
python3 init_skill.py <skill-name> --path <path> [--resources scripts,references,assets] [--examples]
```

### 参数
- `<skill-name>` - 技能名称
- `--path` - 输出路径
- `--resources` - 资源目录类型
- `--examples` - 是否包含示例文件

### 示例
```bash
python3 init_skill.py my-skill --path . --resources scripts,references,assets
```

## package_skill.py

### 功能
打包技能为 .skill 文件

### 使用方法
```bash
python3 package_skill.py <path/to/skill-folder> [output-directory]
```

### 参数
- `<path/to/skill-folder>` - 技能文件夹路径
- `[output-directory]` - 输出目录（可选）

### 示例
```bash
python3 package_skill.py ./auto-commit ./dist
```

## 使用流程

### 1. 初始化技能
```bash
cd /path/to/skills
python3 init_skill.py auto-commit --path . --resources scripts,references,assets
```

### 2. 编辑技能
- 修改 SKILL.md
- 添加参考文件
- 创建脚本和资源

### 3. 打包技能
```bash
python3 package_skill.py ./auto-commit
```

### 4. 测试技能
```bash
# 在 Claude Code 中测试
/auto-commit help
```

## 注意事项

1. **技能命名**：使用小写字母、数字和连字符
2. **目录结构**：保持标准的技能目录结构
3. **文件命名**：使用小写字母和连字符
4. **权限设置**：脚本文件需要可执行权限