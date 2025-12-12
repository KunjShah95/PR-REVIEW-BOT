
import { BaseAnalyzer } from './src/analyzers/baseAnalyzer.js';

console.log("Testing Regex Fix...");

class TestAnalyzer extends BaseAnalyzer {
    constructor() { super('test', {}); }
    async analyze() { }
    async analyzeFile() { }
}

const analyzer = new TestAnalyzer();
try {
    // This string contains characters that previously caused crashes: ?, &&, ||, :
    const code = "const a = (b && c) ? d : e; if (x || y) {}";
    const complexity = analyzer.calculateComplexity(code);
    console.log(`Complexity calculated successfully: ${complexity}`);
} catch (error) {
    console.error("Test Failed:", error);
    process.exit(1);
}
