// lib/ai-provider.ts
import OpenAI from 'openai';
import { ChatCompletionMessageParam } from 'openai/resources/chat/completions';

export interface AIProvider {
  chat(messages: ChatCompletionMessageParam[]): Promise<string>;
  analyzeImage(imageUrl: string, prompt?: string): Promise<string>;
  analyzeCode(code: string, language?: string): Promise<any>;
}

export class OpenAIProvider implements AIProvider {
  private client: OpenAI;

  constructor(apiKey: string) {
    this.client = new OpenAI({ apiKey });
  }

  async chat(messages: ChatCompletionMessageParam[]): Promise<string> {
    const response = await this.client.chat.completions.create({
      model: 'gpt-4-vision-preview',
      messages,
      max_tokens: 4000,
      temperature: 0.7,
    });

    return response.choices[0]?.message?.content || '';
  }

  async analyzeImage(imageUrl: string, prompt?: string): Promise<string> {
    const response = await this.client.chat.completions.create({
      model: 'gpt-4-vision-preview',
      messages: [
        {
          role: 'user',
          content: [
            { type: 'text', text: prompt || 'Analyze this image and describe what you see, including any code, errors, UI elements, or relevant information.' },
            { type: 'image_url', image_url: { url: imageUrl } },
          ],
        },
      ],
      max_tokens: 2000,
    });

    return response.choices[0]?.message?.content || '';
  }

  async analyzeCode(code: string, language?: string): Promise<any> {
    const response = await this.client.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'You are a code analysis expert. Analyze the code and provide detailed insights, potential issues, and improvements.',
        },
        {
          role: 'user',
          content: `Language: ${language || 'auto-detect'}\n\nCode:\n${code}`,
        },
      ],
      max_tokens: 3000,
      temperature: 0.3,
    });

    return response.choices[0]?.message?.content || '';
  }
}

export class SelfHostedProvider implements AIProvider {
  private endpoint: string;

  constructor(endpoint: string) {
    this.endpoint = endpoint;
  }

  async chat(messages: ChatCompletionMessageParam[]): Promise<string> {
    const response = await fetch(`${this.endpoint}/v1/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ messages }),
    });

    const data = await response.json();
    return data.choices[0]?.message?.content || '';
  }

  async analyzeImage(imageUrl: string, prompt?: string): Promise<string> {
    // Implement for self-hosted vision model
    throw new Error('Vision not supported in self-hosted mode');
  }

  async analyzeCode(code: string, language?: string): Promise<any> {
    // Implement for self-hosted model
    throw new Error('Code analysis not supported in self-hosted mode');
  }
}

export class AIProviderFactory {
  static createProvider(): AIProvider {
    const provider = process.env.AI_PROVIDER || 'openai';
    
    switch (provider) {
      case 'self-hosted':
        return new SelfHostedProvider(process.env.SELF_HOSTED_ENDPOINT || '');
      case 'openai':
      default:
        return new OpenAIProvider(process.env.OPENAI_API_KEY || '');
    }
  }
}
