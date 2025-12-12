import { CodeReviewBot } from './src/cli.js';
import fs from 'fs';

async function test() {
    console.log("Starting integration test...");
    const bot = new CodeReviewBot();
    await bot.initialize();

    // Create a mock file
    const testFile = 'integration_test.js';
    fs.writeFileSync(testFile, 'var password = "123";\n eval("console.log(1)");');

    await bot.runAnalysis({ files: [testFile], format: 'json', output: 'result.json' });
    console.log("Analysis finished.");
}

test().catch(console.error);
