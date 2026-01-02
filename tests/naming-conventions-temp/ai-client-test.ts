// Test with exact code from AiClaudeMessagesClient.ts (lines 160, 168, 295, 474)

const response = await this.client.messages.create({
    model: this.config.AI_MODEL,

    max_tokens: this.config.maxTokens ?? DEFAULT_MAX_TOKENS,  // Line 160 - snake_case

    ...(this.config.temperature !== undefined && {
        temperature: this.config.temperature
    }),
    messages,
    tools: [tool],

    tool_choice: { type: 'tool', name: 'structured_response' }, // Line 168 - snake_case

    ...(systemPrompt && { system: systemPrompt })
});

// Line 295 - input_schema
const schema = {
    type: 'object',
    input_schema: {  // snake_case
        type: 'string'
    }
};

// Line 474 - media_type
const content = {
    media_type: 'text/plain'  // snake_case
};
