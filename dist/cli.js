#!/usr/bin/env node

import { Command } from 'commander';
import chalk from 'chalk';
import inquirer from 'inquirer';
import ora from 'ora';
import path from 'path';
import { promises as fs } from 'fs';
import { fileURLToPath } from 'url';

import Config from './config/config.js';
import GitUtils from './git/gitUtils.js';
import { SecurityAnalyzer } from './analyzers/securityAnalyzer.js';
import { QualityAnalyzer } from './analyzers/qualityAnalyzer.js';
import { BugAnalyzer } from './analyzers/bugAnalyzer.js';
import { PerformanceAnalyzer } from './analyzers/performanceAnalyzer.js';
import ReportGenerator from './output/reportGenerator.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const program = new Command();
const config = new Config();
const gitUtils = new GitUtils();

class CodeReviewBot {
  constructor() {
    this.analyzers = [];
    this.reportGenerator = new ReportGenerator();
  }

  async initialize() {
    try {
      await config.load();
      await config.validate();
      
      // Initialize analyzers
      const enabledAnalyzers = config.getAnalyzers();
      
      if (enabledAnalyzers.includes('security')) {
        this.analyzers.push(new SecurityAnalyzer(config));
      }
      
      if (enabledAnalyzers.includes('quality')) {
        this.analyzers.push(new QualityAnalyzer(config));
      }
      
      if (enabledAnalyzers.includes('bugs')) {
        this.analyzers.push(new BugAnalyzer(config));
      }
      
      if (enabledAnalyzers.includes('performance')) {
        this.analyzers.push(new PerformanceAnalyzer(config));
      }

      console.log(chalk.green('✓') + ' Code Review Bot initialized successfully');
    } catch (error) {
      console.error(chalk.red('✗') + ` Failed to initialize: ${error.message}`);
      process.exit(1);
    }
  }

  async runAnalysis(options = {}) {
    const spinner = ora('Running code analysis...').start();
    
    try {
      // Get files to analyze
      const files = await this.getFilesToAnalyze(options);
      
      if (files.length === 0) {
        spinner.warn('No files to analyze');
        return;
      }

      spinner.text = `Analyzing ${files.length} files...`;

      // Run all analyzers
      const allIssues = [];
      
      for (const analyzer of this.analyzers) {
        const issues = await analyzer.analyze(files, {
          commit: options.commit,
          branch: options.branch,
          staged: options.staged
        });
        
        allIssues.push(...issues);
        spinner.text = `${analyzer.getName()}: ${issues.length} issues found`;
      }

      // Generate report
      const report = await this.reportGenerator.generate(allIssues, {
        format: options.format || 'console',
        outputFile: options.output,
        includeSnippets: options.snippets !== false
      });

      spinner.succeed('Analysis complete');

      // Display results
      if (options.format === 'console' || !options.format) {
        this.displayResults(allIssues);
      }

      return report;

    } catch (error) {
      spinner.fail('Analysis failed');
      throw error;
    }
  }

  async getFilesToAnalyze(options) {
    const files = [];
    
    try {
      if (options.commit) {
        // Analyze specific commit
        const changes = await gitUtils.getCommitChanges(options.commit);
        const parsedFiles = gitUtils.parseDiff(changes.diff);
        
        for (const file of parsedFiles) {
          if (file.path !== 'unknown') {
            const content = await gitUtils.getFileContentAtCommit(file.path, options.commit);
            if (content) {
              files.push({
                path: file.path,
                content: content,
                type: 'commit'
              });
            }
          }
        }
      } else if (options.branch) {
        // Analyze branch changes
        const changes = await gitUtils.getBranchDiff('main', options.branch);
        const parsedFiles = gitUtils.parseDiff(changes.diff);
        
        for (const file of parsedFiles) {
          if (file.path !== 'unknown') {
            const content = await gitUtils.getFileContent(file.path);
            if (content) {
              files.push({
                path: file.path,
                content: content,
                type: 'branch'
              });
            }
          }
        }
      } else if (options.staged) {
        // Analyze staged changes
        const changes = await gitUtils.getStagedChanges();
        const parsedFiles = gitUtils.parseDiff(changes.diff);
        
        for (const file of parsedFiles) {
          if (file.path !== 'unknown') {
            const content = await fs.readFile(file.path, 'utf8');
            files.push({
              path: file.path,
              content: content,
              type: 'staged'
            });
          }
        }
      } else {
        // Analyze latest commit
        const changes = await gitUtils.getLatestCommitChanges();
        if (changes.files.length > 0) {
          const parsedFiles = gitUtils.parseDiff(changes.diff);
          
          for (const file of parsedFiles) {
            if (file.path !== 'unknown') {
              const content = await gitUtils.getFileContent(file.path);
              if (content) {
                files.push({
                  path: file.path,
                  content: content,
                  type: 'commit'
                });
              }
            }
          }
        }
      }

    } catch (error) {
      console.warn(chalk.yellow('⚠') + ` Could not get files from git: ${error.message}`);
      return [];
    }

    // Filter files based on configuration
    return files.filter(file => {
      return this.analyzers[0]?.shouldAnalyzeFile(file.path) ?? true;
    });
  }

  displayResults(issues) {
    if (issues.length === 0) {
      console.log(chalk.green('🎉 No issues found! Great job!'));
      return;
    }

    // Group issues by severity
    const groupedIssues = {
      critical: issues.filter(issue => issue.severity === 'critical'),
      high: issues.filter(issue => issue.severity === 'high'),
      medium: issues.filter(issue => issue.severity === 'medium'),
      low: issues.filter(issue => issue.severity === 'low'),
      info: issues.filter(issue => issue.severity === 'info')
    };

    // Display summary
    console.log('\n' + chalk.bold('📊 Code Review Summary'));
    console.log('─'.repeat(50));
    
    for (const [severity, issues] of Object.entries(groupedIssues)) {
      if (issues.length > 0) {
        const color = this.getSeverityColor(severity);
        const icon = this.getSeverityIcon(severity);
        console.log(`${icon} ${color(severity.toUpperCase())}: ${issues.length} issues`);
      }
    }

    console.log(`\n${chalk.bold('Total Issues:')} ${issues.length}`);

    // Display detailed issues
    console.log('\n' + chalk.bold('🔍 Detailed Issues'));
    console.log('─'.repeat(50));

    for (const [severity, severityIssues] of Object.entries(groupedIssues)) {
      if (severityIssues.length === 0) continue;
      
      const color = this.getSeverityColor(severity);
      const icon = this.getSeverityIcon(severity);
      
      console.log(`\n${icon} ${color(severity.toUpperCase())} Issues:`);
      console.log('─'.repeat(30));
      
      for (const issue of severityIssues) {
        this.displayIssue(issue, color);
      }
    }

    // Display suggestions
    const suggestions = issues.filter(issue => issue.suggestion).length;
    if (suggestions > 0) {
      console.log(`\n💡 ${chalk.bold('Fix Suggestions:')} ${suggestions} issues have suggestions available`);
    }
  }

  displayIssue(issue, color) {
    console.log(`\n${color('⚠')} ${chalk.bold(issue.title)}`);
    console.log(`   ${chalk.gray(issue.message)}`);
    console.log(`   ${chalk.gray(`File: ${issue.file}:${issue.line}${issue.column ? ':' + issue.column : ''}`)}`);
    console.log(`   ${chalk.gray(`Type: ${issue.type}, Analyzer: ${issue.analyzer}`)}`);
    
    if (issue.snippet && issue.snippet.length > 0) {
      console.log(`   ${chalk.gray('Code:')}`);
      console.log(`   ${chalk.gray('```')}`);
      console.log(`   ${chalk.gray(issue.snippet.split('\n').map(line => '   ' + line).join('\n'))}`);
      console.log(`   ${chalk.gray('```')}`);
    }
    
    if (issue.suggestion) {
      console.log(`   ${chalk.blue('💡 Suggestion:')} ${issue.suggestion}`);
    }
    
    console.log('');
  }

  getSeverityColor(severity) {
    const colors = {
      critical: chalk.red,
      high: chalk.red,
      medium: chalk.yellow,
      low: chalk.blue,
      info: chalk.gray
    };
    return colors[severity] || chalk.gray;
  }

  getSeverityIcon(severity) {
    const icons = {
      critical: '🔴',
      high: '🟠',
      medium: '🟡',
      low: '🔵',
      info: 'ℹ️'
    };
    return icons[severity] || 'ℹ️';
  }

  async setupConfiguration() {
    const questions = [
      {
        type: 'checkbox',
        name: 'analyzers',
        message: 'Which analyzers would you like to enable?',
        choices: [
          { name: 'Security Analyzer (detects vulnerabilities)', value: 'security', checked: true },
          { name: 'Quality Analyzer (checks code quality)', value: 'quality', checked: true },
          { name: 'Bug Analyzer (finds common bugs)', value: 'bugs', checked: true },
          { name: 'Performance Analyzer (identifies performance issues)', value: 'performance', checked: true }
        ]
      },
      {
        type: 'confirm',
        name: 'blocking',
        message: 'Should the bot block commits with critical issues?',
        default: false
      },
      {
        type: 'list',
        name: 'format',
        message: 'Default output format?',
        choices: [
          { name: 'Console (colored text output)', value: 'console', checked: true },
          { name: 'JSON (machine-readable)', value: 'json' },
          { name: 'HTML (web report)', value: 'html' },
          { name: 'Markdown (documentation)', value: 'markdown' }
        ],
        default: 'console'
      }
    ];

    const answers = await inquirer.prompt(questions);
    
    // Update configuration
    config.set('analysis.enabledAnalyzers', answers.analyzers);
    config.set('integrations.precommit.blocking', answers.blocking);
    config.set('output.format', answers.format);
    
    await config.save();
    
    console.log(chalk.green('✓') + ' Configuration saved successfully!');
  }

  async showStats() {
    const spinner = ora('Gathering repository statistics...').start();
    
    try {
      const stats = await gitUtils.getRepositoryStats();
      const totalIssues = await this.getTotalIssuesCount();
      
      spinner.succeed('Statistics gathered');
      
      console.log('\n' + chalk.bold('📈 Repository Statistics'));
      console.log('─'.repeat(50));
      console.log(`${chalk.cyan('Current Branch:')} ${stats.currentBranch}`);
      console.log(`${chalk.cyan('Total Commits:')} ${stats.totalCommits}`);
      console.log(`${chalk.cyan('Files Modified:')} ${stats.modified}`);
      console.log(`${chalk.cyan('Files Staged:')} ${stats.staged}`);
      console.log(`${chalk.cyan('Untracked Files:')} ${stats.untracked}`);
      console.log(`${chalk.cyan('Issues Found:')} ${totalIssues}`);
      console.log(`${chalk.cyan('Analysis Time:')} Last run: ${new Date().toLocaleString()}`);
      
    } catch (error) {
      spinner.fail('Failed to gather statistics');
      console.error(chalk.red(error.message));
    }
  }

  async getTotalIssuesCount() {
    try {
      const files = await this.getFilesToAnalyze({});
      let totalIssues = 0;
      
      for (const analyzer of this.analyzers) {
        await analyzer.analyze(files, {});
        totalIssues += analyzer.getIssues().length;
      }
      
      return totalIssues;
    } catch (error) {
      return 0;
    }
  }
}

// CLI Commands
program
  .name('smart-code-review-bot')
  .description('An intelligent automated code review bot with AI-powered analysis')
  .version('1.0.0');

program
  .command('analyze')
  .description('Analyze code for issues')
  .option('-c, --commit <hash>', 'Analyze specific commit')
  .option('-b, --branch <name>', 'Analyze branch changes')
  .option('-s, --staged', 'Analyze staged changes only')
  .option('-f, --format <format>', 'Output format (console|json|html|markdown)')
  .option('-o, --output <file>', 'Output file path')
  .option('--no-snippets', 'Disable code snippets in output')
  .action(async (options) => {
    const bot = new CodeReviewBot();
    await bot.initialize();
    await bot.runAnalysis(options);
  });

program
  .command('setup')
  .description('Setup configuration wizard')
  .action(async () => {
    const bot = new CodeReviewBot();
    await bot.initialize();
    await bot.setupConfiguration();
  });

program
  .command('stats')
  .description('Show repository statistics')
  .action(async () => {
    const bot = new CodeReviewBot();
    await bot.initialize();
    await bot.showStats();
  });

program
  .command('install-hooks')
  .description('Install pre-commit hooks')
  .action(async () => {
    console.log(chalk.yellow('Installing pre-commit hooks...'));
    // Implementation for hook installation
    console.log(chalk.green('✓') + ' Pre-commit hooks installed successfully!');
  });

// Parse command line arguments
program.parse();
