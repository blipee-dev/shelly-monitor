import OpenAI from 'openai';
import { AIProvider, AIMessage, AIFunction, AIResponse, AIProviderConfig } from '../types';

export class OpenAIProvider implements AIProvider {
  name = 'OpenAI';
  private client: OpenAI;
  private model: string;
  private temperature: number;
  private maxTokens: number;

  constructor(config: AIProviderConfig) {
    this.client = new OpenAI({
      apiKey: config.apiKey,
    });
    this.model = config.model || 'gpt-4-turbo-preview';
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
          tools: functions.map(f => ({
            type: 'function' as const,
            function: f,
          })),
          tool_choice: 'auto',
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

      if (choice.message.tool_calls && choice.message.tool_calls.length > 0) {
        const toolCall = choice.message.tool_calls[0];
        if (toolCall.type === 'function') {
          response.functionCall = {
            name: toolCall.function.name,
            arguments: JSON.parse(toolCall.function.arguments),
          };
        }
      }

      return response;
    } catch (error) {
      console.error('OpenAI API error:', error);
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
          tools: functions.map(f => ({
            type: 'function' as const,
            function: f,
          })),
          tool_choice: 'auto',
        }),
      });

      for await (const chunk of stream) {
        const content = chunk.choices[0]?.delta?.content;
        if (content) {
          yield content;
        }
      }
    } catch (error) {
      console.error('OpenAI streaming error:', error);
      throw new Error(`AI streaming failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  estimateCost(tokens: number): number {
    // OpenAI GPT-4 Turbo pricing (as of 2024)
    // Input: $10 per 1M tokens
    // Output: $30 per 1M tokens
    const inputCost = (tokens * 0.5 / 1_000_000) * 10;
    const outputCost = (tokens * 0.5 / 1_000_000) * 30;
    return inputCost + outputCost;
  }
}