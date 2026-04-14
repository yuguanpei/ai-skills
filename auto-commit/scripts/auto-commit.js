#!/usr/bin/env node

/**
 * Auto Commit Skill - 主程序
 * 基于 Git changes 自动分类 stage 并生成 commit message
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

class AutoCommit {
  constructor() {
    this.config = this.loadConfig();
    this.changes = [];
    this.categories = {};
  }

  // 加载配置
  loadConfig() {
    const defaultConfig = {
      commitMessage: {
        template: '{type}({scope}): {description}',
        maxLength: 72,
        includeBody: true
      },
      categories: {
        feature: {
          patterns: ['feat', 'feature', 'add', 'implement', '新增', '添加'],
          commitPrefix: 'feat',
          color: 'green'
        },
        bugfix: {
          patterns: ['fix', 'bug', 'resolve', 'correct', '修复', '解决'],
          commitPrefix: 'fix',
          color: 'red'
        },
        refactor: {
          patterns: ['refactor', 'optimize', 'improve', '重构', '优化'],
          commitPrefix: 'refactor',
          color: 'yellow'
        },
        docs: {
          patterns: ['docs', 'document', 'documentation', '文档', '说明'],
          commitPrefix: 'docs',
          color: 'blue'
        },
        style: {
          patterns: ['style', 'format', 'formatting', '样式', '格式'],
          commitPrefix: 'style',
          color: 'purple'
        },
        test: {
          patterns: ['test', 'testing', '测试', '单元测试'],
          commitPrefix: 'test',
          color: 'cyan'
        },
        chore: {
          patterns: ['chore', 'build', 'ci', 'deploy', '构建', '部署'],
          commitPrefix: 'chore',
          color: 'gray'
        }
      },
      autoStage: true,
      confirmBeforeCommit: true,
      scope: 'project'
    };

    // 尝试加载项目配置
    const projectConfigPath = path.join(process.cwd(), '.auto-commit-config.js');
    if (fs.existsSync(projectConfigPath)) {
      try {
        const projectConfig = require(projectConfigPath);
        return { ...defaultConfig, ...projectConfig };
      } catch (e) {
        console.warn('无法加载项目配置，使用默认配置');
      }
    }

    return defaultConfig;
  }

  // 分析 Git 变更
  analyzeChanges() {
    try {
      // 获取 git diff
      const diffOutput = execSync('git diff --cached --unified=0', { 
        encoding: 'utf8',
        stdio: ['pipe', 'pipe', 'pipe']
      });

      if (!diffOutput.trim()) {
        console.log('暂无 staged 变更，分析工作区变更...');
        
        // 分析工作区变更
        const worktreeDiff = execSync('git diff --unified=0', {
          encoding: 'utf8',
          stdio: ['pipe', 'pipe', 'pipe']
        });

        if (!worktreeDiff.trim()) {
          console.log('暂无任何变更');
          return [];
        }

        return this.parseDiff(worktreeDiff);
      }

      return this.parseDiff(diffOutput);
    } catch (error) {
      console.error('分析变更失败:', error.message);
      return [];
    }
  }

  // 解析 diff 输出
  parseDiff(diffOutput) {
    const changes = [];
    const lines = diffOutput.split('\n');
    
    let currentFile = null;
    let currentChange = null;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      // 文件变更行
      if (line.startsWith('diff --git')) {
        // 保存之前的变更
        if (currentChange) {
          changes.push(currentChange);
        }

        // 解析新文件
        const match = line.match(/diff --git a\/(.+) b\/(.+)/);
        if (match) {
          currentFile = match[2];
          currentChange = {
            file: currentFile,
            lines: [],
            additions: [],
            deletions: [],
            type: 'unknown',
            description: ''
          };
        }
      }

      // 行号变更
      else if (line.startsWith('@@')) {
        const match = line.match(/@@ -(\d+),?(\d*) \+(\d+),?(\d*) @@/);
        if (match) {
          const startLine = parseInt(match[3]);
          const endLine = match[4] ? startLine + parseInt(match[4]) - 1 : startLine;
          
          if (currentChange) {
            currentChange.lines.push({ start: startLine, end: endLine });
          }
        }
      }

      // 添加的行
      else if (line.startsWith('+') && !line.startsWith('+++')) {
        if (currentChange) {
          const content = line.substring(1).trim();
          if (content) {
            currentChange.additions.push(content);
          }
        }
      }

      // 删除的行
      else if (line.startsWith('-') && !line.startsWith('---')) {
        if (currentChange) {
          const content = line.substring(1).trim();
          if (content) {
            currentChange.deletions.push(content);
          }
        }
      }
    }

    // 保存最后一个变更
    if (currentChange) {
      changes.push(currentChange);
    }

    return changes;
  }

  // 智能分类变更
  categorizeChanges(changes) {
    const categories = {};

    changes.forEach(change => {
      const category = this.classifyChange(change);
      
      if (!categories[category]) {
        categories[category] = [];
      }
      
      categories[category].push(change);
    });

    return categories;
  }

  // 分类单个变更
  classifyChange(change) {
    const content = [
      change.file,
      ...change.additions,
      ...change.deletions
    ].join(' ').toLowerCase();

    // 检查文件扩展名
    const ext = path.extname(change.file);
    if (ext === '.md' || ext === '.txt') {
      return 'docs';
    }
    if (ext === '.css' || ext === '.scss' || ext === '.less') {
      return 'style';
    }
    if (ext === '.test.js' || ext === '.spec.js' || ext.includes('test')) {
      return 'test';
    }

    // 检查内容关键词
    for (const [category, config] of Object.entries(this.config.categories)) {
      for (const pattern of config.patterns) {
        if (content.includes(pattern)) {
          return category;
        }
      }
    }

    // 默认分类
    if (change.additions.length > change.deletions.length * 2) {
      return 'feature';
    } else if (change.deletions.length > change.additions.length * 2) {
      return 'refactor';
    } else {
      return 'chore';
    }
  }

  // 生成 commit message
  generateCommitMessages(categories) {
    const messages = {};

    for (const [category, changes] of Object.entries(categories)) {
      const prefix = this.config.categories[category]?.commitPrefix || 'chore';
      
      // 生成描述
      const description = this.generateDescription(changes, category);
      
      // 应用模板
      const message = this.config.commitMessage.template
        .replace('{type}', prefix)
        .replace('{scope}', this.config.scope)
        .replace('{description}', description);

      messages[category] = {
        message,
        changes,
        prefix
      };
    }

    return messages;
  }

  // 生成变更描述
  generateDescription(changes, category) {
    if (changes.length === 1) {
      const change = changes[0];
      const fileName = path.basename(change.file, path.extname(change.file));
      
      // 基于文件名生成描述
      const fileDesc = this.describeFile(change.file);
      
      // 基于变更内容生成描述
      const contentDesc = this.describeChanges(change, category);
      
      return `${fileDesc}: ${contentDesc}`;
    } else {
      // 多个变更的描述
      const fileNames = changes.map(c => path.basename(c.file)).join(', ');
      return `update ${fileNames}`;
    }
  }

  // 文件描述
  describeFile(filePath) {
    const ext = path.extname(filePath);
    const name = path.basename(filePath, ext);
    const dir = path.dirname(filePath);

    // 组件文件
    if (filePath.includes('components/')) {
      return name.replace(/([A-Z])/g, ' $1').trim().toLowerCase();
    }

    // API 文件
    if (filePath.includes('api/') || filePath.includes('service/')) {
      return name.replace(/([A-Z])/g, ' $1').trim().toLowerCase();
    }

    // 工具文件
    if (filePath.includes('utils/') || filePath.includes('helpers/')) {
      return name.replace(/([A-Z])/g, ' $1').trim().toLowerCase();
    }

    return name;
  }

  // 变更内容描述
  describeChanges(change, category) {
    const additions = change.additions;
    const deletions = change.deletions;

    switch (category) {
      case 'feature':
        if (additions.length > 0) {
          const keyAddition = additions[0].substring(0, 50);
          return `add ${keyAddition}...`;
        }
        return 'add new feature';

      case 'bugfix':
        if (deletions.length > 0) {
          const keyDeletion = deletions[0].substring(0, 50);
          return `fix ${keyDeletion}...`;
        }
        return 'fix bug';

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

  // 分析并显示结果
  async analyze() {
    console.log('🔍 分析变更...\n');

    this.changes = this.analyzeChanges();
    
    if (this.changes.length === 0) {
      console.log('✅ 暂无变更需要提交');
      return;
    }

    console.log(`📊 发现 ${this.changes.length} 个变更:\n`);

    // 显示变更列表
    this.changes.forEach((change, index) => {
      const lines = change.lines.map(l => 
        l.start === l.end ? `${l.start}` : `${l.start}-${l.end}`
      ).join(', ');
      
      console.log(`${index + 1}. ${change.file}`);
      console.log(`   行号: ${lines}`);
      console.log(`   +${change.additions.length} -${change.deletions.length}`);
      console.log('');
    });

    // 分类
    this.categories = this.categorizeChanges(this.changes);
    
    console.log('📁 分类结果:');
    for (const [category, changes] of Object.entries(this.categories)) {
      console.log(`   ${category}: ${changes.length} 个变更`);
    }
    console.log('');

    // 生成 commit message
    const messages = this.generateCommitMessages(this.categories);
    
    console.log('📝 Commit Message 建议:');
    for (const [category, data] of Object.entries(messages)) {
      console.log(`   ${category}: ${data.message}`);
    }
    console.log('');

    return { changes: this.changes, categories: this.categories, messages };
  }

  // 显示详细信息
  async showDetail() {
    const analysis = await this.analyze();
    
    if (!analysis) return;

    console.log('📋 详细分析报告:\n');

    // 变更详情
    console.log('=== 变更详情 ===');
    this.changes.forEach((change, index) => {
      console.log(`\n${index + 1}. ${change.file}`);
      console.log(`   行号: ${change.lines.map(l => 
        l.start === l.end ? `${l.start}` : `${l.start}-${l.end}`
      ).join(', ')}`);
      
      console.log(`   添加: ${change.additions.length} 行`);
      change.additions.forEach(line => {
        console.log(`     + ${line.substring(0, 80)}${line.length > 80 ? '...' : ''}`);
      });
      
      console.log(`   删除: ${change.deletions.length} 行`);
      change.deletions.forEach(line => {
        console.log(`     - ${line.substring(0, 80)}${line.length > 80 ? '...' : ''}`);
      });
    });

    // 分类详情
    console.log('\n=== 分类详情 ===');
    for (const [category, changes] of Object.entries(this.categories)) {
      console.log(`\n${category}:`);
      changes.forEach(change => {
        console.log(`   - ${change.file}`);
      });
    }

    // Commit Message 详情
    console.log('\n=== Commit Message ===');
    const messages = this.generateCommitMessages(this.categories);
    for (const [category, data] of Object.entries(messages)) {
      console.log(`\n${category}:`);
      console.log(`   ${data.message}`);
      console.log(`   包含变更:`);
      data.changes.forEach(change => {
        console.log(`     - ${change.file}`);
      });
    }
  }
}

// 命令行接口
async function main() {
  const autoCommit = new AutoCommit();
  const command = process.argv[2] || 'analyze';

  switch (command) {
    case 'analyze':
      await autoCommit.analyze();
      break;
    
    case 'detail':
      await autoCommit.showDetail();
      break;
    
    case 'help':
      console.log(`
Auto Commit Skill - 自动分类 stage 并生成 commit message

用法:
  auto-commit analyze    分析变更并显示建议
  auto-commit detail     显示详细分析
  auto-commit help       显示帮助

特性:
  - 智能变更分类
  - Conventional Commits 规范
  - 配置驱动
      `);
      break;
    
    default:
      console.log('未知命令，使用 "auto-commit help" 查看帮助');
  }
}

// 运行
if (require.main === module) {
  main().catch(console.error);
}

module.exports = AutoCommit;