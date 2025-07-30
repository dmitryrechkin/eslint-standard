// Let's analyze the nesting in the provided code
const code = `
private async processTicketsBatch(startDate: Date, limit: number = 50): Promise<boolean>
{
    try                                                              // Level 0: try block
    {
        const ticketsResult = await this.ticketsFetcher.fetchBatch({
            startDate,
            limit
        });

        if (!ticketsResult.success)                                  // Level 1: if statement
        {
            // handle error
            return false;
        }

        const tickets = ticketsResult.data || [];
        
        for (const ticket of tickets)                               // Level 2: for loop
        {
            if (this.shouldProcessTicket(ticket))                   // Level 3: if statement
            {
                const processedData = [];
                
                for (const conversation of ticket.conversations || []) // Level 4: nested for loop
                {
                    if (conversation.body_text)                      // Level 5: if statement
                    {
                        // Process conversation
                        processedData.push({
                            text: conversation.body_text,
                            created_at: conversation.created_at
                        });
                    }
                }
            }
        }
    }
    catch (error)
    {
        // error handling
    }
}`;

console.log('Analyzing nesting levels in the provided code:\n');

const lines = code.split('\n');
let currentDepth = -1; // Start at -1 because function body itself counts as 0
let maxDepth = 0;
const depthAtLine = [];

for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();
    
    // Count opening braces (entering a block)
    if (trimmed.includes('{') && !trimmed.includes('}')) {
        currentDepth++;
        maxDepth = Math.max(maxDepth, currentDepth);
    }
    
    // Store depth for this line
    depthAtLine[i] = currentDepth;
    
    // Count closing braces (exiting a block)
    if (trimmed === '}') {
        currentDepth--;
    }
    
    // Log important lines with their depth
    if (trimmed.includes('// Level') || trimmed.includes('if (conversation.body_text)')) {
        console.log(`Line ${i + 1}: Depth ${depthAtLine[i]} - "${trimmed}"`);
    }
}

console.log(`\nMaximum depth found: ${maxDepth}`);
console.log('\nESLint max-depth rule counts from the function body (depth 0).');
console.log('With max-depth set to 3, it allows:');
console.log('- Depth 0: Function body');
console.log('- Depth 1: First level (try block)');
console.log('- Depth 2: Second level (for loop)');  
console.log('- Depth 3: Third level (if statement)');
console.log('- Depth 4: Would trigger error (nested for loop)');
console.log('- Depth 5: Would trigger error (deepest if)');

console.log('\nThe issue is that ESLint counts nesting from the function body.');
console.log('Your code has 5 levels of nesting inside the function, which exceeds the limit of 3.');