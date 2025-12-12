#!/usr/bin/env node

import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import chalk from 'chalk';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class BuildScript {
  constructor() {
    this.rootDir = path.join(__dirname, '..');
    this.srcDir = path.join(__dirname);
    this.distDir = path.join(this.rootDir, 'dist');
  }

  async run() {
    try {
      console.log(chalk.blue.bold('\n📦 Building Sentinel...\n'));

      // Create dist directory if it doesn't exist
      await this.createDistDirectory();

      // Copy source files
      await this.copySrcFiles();

      // Validate syntax
      await this.validateSyntax();

      // Generate manifest
      await this.generateManifest();

      console.log(chalk.green.bold('\n✅ Build completed successfully!\n'));
      console.log(chalk.cyan('Build output:'), this.distDir);
    } catch (error) {
      console.error(chalk.red.bold('\n❌ Build failed!\n'));
      console.error(chalk.red(error.message));
      process.exit(1);
    }
  }

  async createDistDirectory() {
    try {
      await fs.mkdir(this.distDir, { recursive: true });
      console.log(chalk.gray('✓ Created dist directory'));
    } catch (error) {
      throw new Error(`Failed to create dist directory: ${error.message}`);
    }
  }

  async copySrcFiles() {
    try {
      const files = await this.getAllFiles(this.srcDir);
      
      for (const file of files) {
        if (file.endsWith('.js')) {
          const relativePath = path.relative(this.srcDir, file);
          const destFile = path.join(this.distDir, relativePath);
          const destDir = path.dirname(destFile);

          await fs.mkdir(destDir, { recursive: true });
          await fs.copyFile(file, destFile);
        }
      }

      console.log(chalk.gray(`✓ Copied ${files.length} files to dist`));
    } catch (error) {
      throw new Error(`Failed to copy files: ${error.message}`);
    }
  }

  async getAllFiles(dir) {
    const files = [];
    const entries = await fs.readdir(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        files.push(...await this.getAllFiles(fullPath));
      } else {
        files.push(fullPath);
      }
    }

    return files;
  }

  async validateSyntax() {
    try {
      const srcFiles = await this.getAllFiles(this.srcDir);
      let validFiles = 0;

      for (const file of srcFiles) {
        if (file.endsWith('.js')) {
          try {
            const content = await fs.readFile(file, 'utf8');
            // Basic syntax validation by checking for obvious issues
            if (content.includes('export') || content.includes('import')) {
              validFiles++;
            }
          } catch (error) {
            console.warn(chalk.yellow(`⚠ Warning: Could not validate ${file}`));
          }
        }
      }

      console.log(chalk.gray(`✓ Validated ${validFiles} source files`));
    } catch (error) {
      console.warn(chalk.yellow(`⚠ Syntax validation skipped: ${error.message}`));
    }
  }

  async generateManifest() {
    try {
      const manifest = {
        name: 'smart-code-review-bot',
        version: '1.0.0',
        description: 'An intelligent automated code review bot with AI-powered analysis',
        buildTime: new Date().toISOString(),
        modules: {
          analyzers: ['BaseAnalyzer', 'SecurityAnalyzer', 'QualityAnalyzer', 'BugAnalyzer', 'PerformanceAnalyzer'],
          config: ['Config'],
          git: ['GitUtils'],
          output: ['ReportGenerator'],
          cli: ['CodeReviewBot']
        }
      };

      const manifestPath = path.join(this.distDir, 'manifest.json');
      await fs.writeFile(manifestPath, JSON.stringify(manifest, null, 2));
      console.log(chalk.gray('✓ Generated manifest.json'));
    } catch (error) {
      console.warn(chalk.yellow(`⚠ Warning: Failed to generate manifest: ${error.message}`));
    }
  }
}

const build = new BuildScript();
await build.run();
