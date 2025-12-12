import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export class Config {
  constructor() {
    this.defaultConfig = {
      // Analysis Settings
      analysis: {
        enabledAnalyzers: ['security', 'quality', 'bugs', 'performance'],
        maxFileSize: 1000000, // 1MB
        ignoredFiles: [
          'node_modules/**',
          'dist/**',
          'build/**',
          '.git/**',
          '*.min.js',
          '*.min.css',
          'vendor/**'
        ],
        languages: ['javascript', 'typescript', 'python', 'java', 'php', 'go', 'rust']
      },
      
      // Security Settings
      security: {
        enableSecretScanning: true,
        enableDependencyScanning: true,
        severityThresholds: {
          critical: 'error',
          high: 'warning',
          medium: 'warning',
          low: 'info'
        },
        customRules: []
      },
      
      // Quality Settings
      quality: {
        complexityThreshold: 10,
        duplicationThreshold: 3,
        maintainabilityIndex: 65,
        testCoverageThreshold: 80,
        documentationThreshold: 80
      },
      
      // Performance Settings
      performance: {
        enablePerformanceAnalysis: true,
        memoryLeakDetection: true,
        algorithmicComplexityAnalysis: true,
        nPlusOneDetection: true
      },
      
      // Output Settings
      output: {
        format: 'console', // console, json, html, markdown
        includeCodeSnippets: true,
        includeSuggestions: true,
        maxSuggestionsPerFile: 20
      },
      
      // Integration Settings
      integrations: {
        github: {
          enabled: false,
          token: null,
          repository: null,
          branch: 'main'
        },
        precommit: {
          enabled: true,
          blocking: false,
          timeout: 30000
        }
      },
      
      // Advanced Features
      ai: {
        enabled: true,
        provider: 'local', // local, openai, anthropic
        model: 'gpt-3.5-turbo',
        apiKey: null,
        maxTokens: 2000,
        temperature: 0.3
      },
      
      ml: {
        enabled: true,
        modelPath: null,
        confidenceThreshold: 0.7,
        adaptiveLearning: true
      },
      
      plugins: {
        enabled: [],
        customRules: [],
        externalAnalyzers: []
      }
    };
    
    this.config = null;
    this.configPath = path.join(process.cwd(), '.codereviewrc.json');
  }

  async load() {
    try {
      const configData = await fs.readFile(this.configPath, 'utf8');
      this.config = JSON.parse(configData);
      // Merge with defaults
      this.config = this.mergeDeep(this.defaultConfig, this.config);
    } catch (error) {
      if (error.code === 'ENOENT') {
        // Config file doesn't exist, use defaults
        this.config = { ...this.defaultConfig };
        await this.save();
      } else {
        throw new Error(`Failed to load config: ${error.message}`);
      }
    }
    
    return this.config;
  }

  async save() {
    await fs.writeFile(this.configPath, JSON.stringify(this.config, null, 2));
  }

  get(key, defaultValue = null) {
    if (!this.config) {
      throw new Error('Config not loaded. Call load() first.');
    }
    
    const keys = key.split('.');
    let value = this.config;
    
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        return defaultValue;
      }
    }
    
    return value;
  }

  set(key, value) {
    if (!this.config) {
      throw new Error('Config not loaded. Call load() first.');
    }
    
    const keys = key.split('.');
    let target = this.config;
    
    for (let i = 0; i < keys.length - 1; i++) {
      if (!(keys[i] in target) || typeof target[keys[i]] !== 'object') {
        target[keys[i]] = {};
      }
      target = target[keys[i]];
    }
    
    target[keys[keys.length - 1]] = value;
  }

  mergeDeep(target, source) {
    const isObject = (obj) => obj && typeof obj === 'object';
    
    if (!isObject(target) || !isObject(source)) {
      return source;
    }
    
    for (const key in source) {
      if (source.hasOwnProperty(key)) {
        if (isObject(source[key])) {
          if (!target[key]) Object.assign(target, { [key]: {} });
          this.mergeDeep(target[key], source[key]);
        } else {
          Object.assign(target, { [key]: source[key] });
        }
      }
    }
    
    return target;
  }

  async validate() {
    const requiredPaths = [
      'analysis.enabledAnalyzers',
      'security.severityThresholds',
      'output.format'
    ];
    
    for (const path of requiredPaths) {
      if (this.get(path) === null) {
        throw new Error(`Required config path missing: ${path}`);
      }
    }
    
    return true;
  }

  getAnalyzers() {
    return this.get('analysis.enabledAnalyzers', []);
  }

  getIgnoredFiles() {
    return this.get('analysis.ignoredFiles', []);
  }

  getSupportedLanguages() {
    return this.get('analysis.languages', []);
  }

  shouldBlockOnError() {
    return this.get('integrations.precommit.blocking', false);
  }

  getSeverityThreshold(severity) {
    const thresholds = this.get('security.severityThresholds', {});
    return thresholds[severity] || 'info';
  }
}

export default new Config();
