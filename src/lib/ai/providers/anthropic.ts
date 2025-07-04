import Anthropic from '@anthropic-ai/sdk';
import { AIProvider, AIMessage, AIFunction, AIResponse, AIProviderConfig } from '../types';

export class AnthropicProvider implements AIProvider {
  name = 'Anthropic';
  private client: Anthropic;
  private model: string;
  private temperature: number;
  private maxTokens: number;

  constructor(config: AIProviderConfig) {
    this.client = new Anthropic({
      apiKey: config.apiKey,
    });
    this.model = config.model || 'claude-3-opus-20240229';
    this.temperature = config.temperature ?? 0.7;
    this.maxTokens = config.maxTokens || 2000;
  }

  async chat(messages: AIMessage[], functions?: AIFunction[]): Promise<AIResponse> {
    try {
      // Convert messages to Anthropic format
      const systemMessage = messages.find(m => m.role === 'system');
      const conversationMessages = messages.filter(m => m.role !== 'system');
      
      // Prepare tools if functions are provided
      const tools = functions?.map(f => ({
        name: f.name,
        description: f.description,
        input_schema: f.parameters,
      }));

      const completion = await this.client.messages.create({
        model: this.model,
        max_tokens: this.maxTokens,
        temperature: this.temperature,
        system: systemMessage?.content,
        messages: conversationMessages.map(m => ({
          role: m.role === 'assistant' ? 'assistant' : 'user',
          content: m.content,
        })),
        ...(tools && tools.length > 0 && { tools }),
      });

      const response: AIResponse = {
        content: completion.content
          .filter(c => c.type === 'text')
          .map(c => (c as any).text)
          .join(''),
        usage: {
          promptTokens: completion.usage.input_tokens,
          completionTokens: completion.usage.output_tokens,
          totalTokens: completion.usage.input_tokens + completion.usage.output_tokens,
        },
      };

      // Check for tool use
      const toolUse = completion.content.find(c => c.type === 'tool_use');
      if (toolUse && toolUse.type === 'tool_use') {
        response.functionCall = {
          name: toolUse.name,
          arguments: toolUse.input as Record<string, any>,
        };
      }

      return response;
    } catch (error) {
      console.error('Anthropic API error:', error);
      throw new Error(`AI chat failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async *streamChat(messages: AIMessage[], functions?: AIFunction[]): AsyncGenerator<string> {
    try {
      // Convert messages to Anthropic format
      const systemMessage = messages.find(m => m.role === 'system');
      const conversationMessages = messages.filter(m => m.role !== 'system');
      
      // Prepare tools if functions are provided
      const tools = functions?.map(f => ({
        name: f.name,
        description: f.description,
        input_schema: f.parameters,
      }));

      const stream = await this.client.messages.create({
        model: this.model,
        max_tokens: this.maxTokens,
        temperature: this.temperature,
        system: systemMessage?.content,
        messages: conversationMessages.map(m => ({
          role: m.role === 'assistant' ? 'assistant' : 'user',
          content: m.content,
        })),
        stream: true,
        ...(tools && tools.length > 0 && { tools }),
      });

      for await (const chunk of stream) {
        if (chunk.type === 'content_block_delta' && chunk.delta.type === 'text_delta') {
          yield chunk.delta.text;
        }
      }
    } catch (error) {
      console.error('Anthropic streaming error:', error);
      throw new Error(`AI streaming failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  estimateCost(tokens: number): number {
    // Anthropic Claude 3 Opus pricing (as of 2024)
    // Input: $15 per 1M tokens
    // Output: $75 per 1M tokens
    // Assuming 50/50 split for estimation
    const inputCost = (tokens * 0.5 / 1_000_000) * 15;
    const outputCost = (tokens * 0.5 / 1_000_000) * 75;
    return inputCost + outputCost;
  }
}