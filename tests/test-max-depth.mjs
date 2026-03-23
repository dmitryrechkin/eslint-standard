import { ESLint } from 'eslint';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create a test file with the exact code structure from HappySupport
const testCode = `
export class TicketsResumableGeneratorService {
    private async processTicketsBatch(): Promise<void> {
        try {
            for (const ticket of tickets) {
                if (shouldProcess) {
                    for (const conversation of ticket.conversations) {
                        if (conversation.body_text) {
                            // This is 4 levels deep
                            console.log('Processing');
                        }
                    }
                }
            }
        } catch (error) {
            console.error(error);
        }
    }
}
`;

// Write test file
fs.writeFileSync(path.join(__dirname, 'test-max-depth.ts'), testCode);

async function testMaxDepth() {
    // Import the config function
    const configFn = (await import('../eslint.config.mjs')).default;
    const config = configFn({ tsconfigPath: './tests/tsconfig.json' });
    
    const eslint = new ESLint({
        overrideConfig: config,
        cwd: path.join(__dirname, '..')
    });

    const results = await eslint.lintFiles([path.join(__dirname, 'test-max-depth.ts')]);
    
    console.log('Testing max-depth rule with 4-level nested code...\n');
    
    let foundMaxDepthViolation = false;
    
    for (const result of results) {
        if (result.errorCount > 0 || result.warningCount > 0) {
            for (const message of result.messages) {
                console.log(`Rule: ${message.ruleId}`);
                console.log(`Message: ${message.message}`);
                console.log(`Line: ${message.line}, Column: ${message.column}`);
                console.log(`Severity: ${message.severity === 2 ? 'error' : 'warning'}\n`);
                
                if (message.ruleId === 'max-depth') {
                    foundMaxDepthViolation = true;
                }
            }
        }
    }
    
    if (!foundMaxDepthViolation) {
        console.log('❌ max-depth rule did NOT catch the 4-level nesting!');
        console.log('\nLet\'s check the exact nesting structure...');
        
        // Let's manually count the nesting levels
        const lines = testCode.split('\n');
        let maxNesting = 0;
        let currentNesting = 0;
        
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            const openBraces = (line.match(/{/g) || []).length;
            const closeBraces = (line.match(/}/g) || []).length;
            currentNesting += openBraces - closeBraces;
            maxNesting = Math.max(maxNesting, currentNesting);
            
            if (line.includes('// This is 4 levels deep')) {
                console.log(`Line ${i + 1}: "${line.trim()}"`);
                console.log(`Current nesting level: ${currentNesting}`);
            }
        }
        
        console.log(`\nMaximum nesting level found: ${maxNesting}`);
    } else {
        console.log('✅ max-depth rule correctly caught the violation!');
    }
    
    // Clean up
    fs.unlinkSync(path.join(__dirname, 'test-max-depth.ts'));
}

testMaxDepth().catch(console.error);