import OpenAI from 'openai';
import { AIProvider, AIMessage, AIFunction, AIResponse, AIProviderConfig } from '../types';

export class DeepSeekProvider implements AIProvider {
  name = 'DeepSeek';
  private client: OpenAI;
  private model: string;
  private temperature: number;
  private maxTokens: number;

  constructor(config: AIProviderConfig) {
    this.client = new OpenAI({
      apiKey: config.apiKey,
      baseURL: config.baseURL || 'https://api.deepseek.com/v1',
    });
    this.model = config.model || 'deepseek-chat';
    this.temperature = config.temperature ?? 0.7;
    this.maxTokens = config.maxTokens || 2000;
  }

  async chat(messages: AIMessage[], functions?: AIFunction[]): Promise<AIResponse> {
    try {
      const completion = await this.client.chat.completions.create({
        model: this.model,
        messages: messages as any,
        temperature: this.temperature,
        max_tokens: this.maxTokens,
        ...(functions && functions.length > 0 && {
          functions: functions as any,
          function_call: 'auto',
        }),
      });

      const choice = completion.choices[0];
      const response: AIResponse = {
        content: choice.message.content || '',
        usage: completion.usage ? {
          promptTokens: completion.usage.prompt_tokens,
          completionTokens: completion.usage.completion_tokens,
          totalTokens: completion.usage.total_tokens,
        } : undefined,
      };

      if (choice.message.function_call) {
        response.functionCall = {
          name: choice.message.function_call.name,
          arguments: JSON.parse(choice.message.function_call.arguments),
        };
      }

      return response;
    } catch (error) {
      console.error('DeepSeek API error:', error);
      throw new Error(`AI chat failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async *streamChat(messages: AIMessage[], functions?: AIFunction[]): AsyncGenerator<string> {
    try {
      const stream = await this.client.chat.completions.create({
        model: this.model,
        messages: messages as any,
        temperature: this.temperature,
        max_tokens: this.maxTokens,
        stream: true,
        ...(functions && functions.length > 0 && {
          functions: functions as any,
          function_call: 'auto',
        }),
      });

      for await (const chunk of stream) {
        const content = chunk.choices[0]?.delta?.content;
        if (content) {
          yield content;
        }
      }
    } catch (error) {
      console.error('DeepSeek streaming error:', error);
      throw new Error(`AI streaming failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  estimateCost(tokens: number): number {
    // DeepSeek pricing (as of 2024)
    // Input: $0.14 per 1M tokens
    // Output: $0.28 per 1M tokens
    // Assuming 50/50 split for estimation
    const inputCost = (tokens * 0.5 / 1_000_000) * 0.14;
    const outputCost = (tokens * 0.5 / 1_000_000) * 0.28;
    return inputCost + outputCost;
  }
}