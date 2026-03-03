export type AiAction = 
  | 'improve' 
  | 'fix_spelling' 
  | 'make_longer' 
  | 'make_shorter' 
  | 'simplify' 
  | 'emojify' 
  | 'continue' 
  | 'summarize'
  | { type: 'tone'; tone: string }
  | { type: 'translate'; language: string }
  | { type: 'custom'; prompt: string };

export async function askAI(text: string, action: AiAction, context?: string): Promise<string> {
    const AI_API_KEY = import.meta.env.VITE_AI_API_KEY;
    const API_URL = 'https://api.groq.com/openai/v1/chat/completions';

    if (!AI_API_KEY) {
        throw new Error('AI API key is missing. Please check your .env file.');
    }

    const systemPrompt = 'You are a helpful writing assistant. Respond ONLY with the converted or generated text, without any conversational filler, markdown code blocks (unless the user asked for code), or explanations.';
    let userPrompt = '';

    if (typeof action === 'string') {
        switch (action) {
            case 'improve':
                userPrompt = `Improve the writing of the following text:\n\n${text}`;
                break;
            case 'fix_spelling':
                userPrompt = `Fix any spelling and grammar mistakes in the following text. Do not change the meaning:\n\n${text}`;
                break;
            case 'make_longer':
                userPrompt = `Make the following text significantly longer and more detailed while keeping the original intent:\n\n${text}`;
                break;
            case 'make_shorter':
                userPrompt = `Make the following text much shorter and concise:\n\n${text}`;
                break;
            case 'simplify':
                userPrompt = `Simplify the language in the following text so it is easier to read and understand:\n\n${text}`;
                break;
            case 'emojify':
                userPrompt = `Add relevant emojis to the following text to make it more engaging. Do not change the original text, just add emojis:\n\n${text}`;
                break;
            case 'continue':
                userPrompt = `Continue writing the following text naturally. Provide the continuation only:\n\n${text}`;
                break;
            case 'summarize':
                userPrompt = `Summarize the following text:\n\n${text}`;
                break;
        }
    } else {
        if (action.type === 'tone') {
            userPrompt = `Rewrite the following text in a ${action.tone.toLowerCase()} tone:\n\n${text}`;
        } else if (action.type === 'translate') {
            userPrompt = `Translate the following text into ${action.language}:\n\n${text}`;
        } else if (action.type === 'custom') {
            userPrompt = `Here is some text: "${text}"\n\nPlease do the following: ${action.prompt}`;
            if (!text) {
                userPrompt = action.prompt;
                if (context) {
                    userPrompt = `Context:\n${context}\n\nPlease do the following: ${action.prompt}`;
                }
            }
        }
    }

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${AI_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: 'llama-3.1-8b-instant', // Updated from decommissioned llama3-8b-8192
                messages: [
                    { role: 'system', content: systemPrompt },
                    { role: 'user', content: userPrompt }
                ],
                temperature: 0.7,
                max_tokens: 1024,
            })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error?.message || 'Failed to fetch AI response');
        }

        const data = await response.json();
        return data.choices[0].message.content || '';
    } catch (error: unknown) {
        console.error('AI Service Error:', error);
        throw new Error(error instanceof Error ? error.message : 'An unexpected error occurred while contacting the AI service.');
    }
}
