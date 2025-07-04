import { AIProvider, AIMessage, AIFunction, AIResponse, AIProviderType, AIProviderConfig } from './types';
import { DeepSeekProvider } from './providers/deepseek';
import { OpenAIProvider } from './providers/openai';
import { AnthropicProvider } from './providers/anthropic';

export class AIService {
  private providers: Map<AIProviderType, AIProvider> = new Map();
  private primaryProvider: AIProviderType = 'deepseek';
  private fallbackProviders: AIProviderType[] = ['openai', 'anthropic'];

  constructor() {
    this.initializeProviders();
  }

  private initializeProviders() {
    // Initialize DeepSeek
    const deepseekKey = process.env.DEEPSEEK_API_KEY;
    if (deepseekKey) {
      this.providers.set('deepseek', new DeepSeekProvider({
        apiKey: deepseekKey,
        model: process.env.DEEPSEEK_MODEL || 'deepseek-chat',
      }));
    }

    // Initialize OpenAI
    const openaiKey = process.env.OPENAI_API_KEY;
    if (openaiKey) {
      this.providers.set('openai', new OpenAIProvider({
        apiKey: openaiKey,
        model: process.env.OPENAI_MODEL || 'gpt-4-turbo-preview',
      }));
    }

    // Initialize Anthropic
    const anthropicKey = process.env.ANTHROPIC_API_KEY;
    if (anthropicKey) {
      this.providers.set('anthropic', new AnthropicProvider({
        apiKey: anthropicKey,
        model: process.env.ANTHROPIC_MODEL || 'claude-3-opus-20240229',
      }));
    }
  }

  async chat(
    messages: AIMessage[],
    functions?: AIFunction[],
    options?: {
      provider?: AIProviderType;
      stream?: boolean;
    }
  ): Promise<AIResponse> {
    const preferredProvider = options?.provider || this.primaryProvider;
    const providerList = [preferredProvider, ...this.fallbackProviders.filter(p => p !== preferredProvider)];

    let lastError: Error | null = null;

    for (const providerType of providerList) {
      const provider = this.providers.get(providerType);
      if (!provider) continue;

      try {
        console.log(`Attempting to use ${provider.name} provider...`);
        const response = await provider.chat(messages, functions);
        
        // Log usage if available
        if (response.usage) {
          console.log(`${provider.name} usage:`, {
            promptTokens: response.usage.promptTokens,
            completionTokens: response.usage.completionTokens,
            totalTokens: response.usage.totalTokens,
            estimatedCost: provider.estimateCost ? 
              `$${provider.estimateCost(response.usage.totalTokens).toFixed(4)}` : 
              'N/A',
          });
        }

        return response;
      } catch (error) {
        console.error(`${provider.name} provider failed:`, error);
        lastError = error as Error;
        continue; // Try next provider
      }
    }

    throw new Error(
      `All AI providers failed. Last error: ${lastError?.message || 'Unknown error'}`
    );
  }

  async *streamChat(
    messages: AIMessage[],
    functions?: AIFunction[],
    options?: {
      provider?: AIProviderType;
    }
  ): AsyncGenerator<string> {
    const preferredProvider = options?.provider || this.primaryProvider;
    const provider = this.providers.get(preferredProvider);

    if (!provider || !provider.streamChat) {
      throw new Error(`Provider ${preferredProvider} does not support streaming`);
    }

    try {
      yield* provider.streamChat(messages, functions);
    } catch (error) {
      console.error(`${provider.name} streaming failed:`, error);
      
      // Try fallback providers
      for (const fallbackType of this.fallbackProviders) {
        const fallback = this.providers.get(fallbackType);
        if (fallback && fallback.streamChat && fallbackType !== preferredProvider) {
          try {
            console.log(`Falling back to ${fallback.name} for streaming...`);
            yield* fallback.streamChat(messages, functions);
            return;
          } catch (fallbackError) {
            console.error(`${fallback.name} fallback streaming failed:`, fallbackError);
            continue;
          }
        }
      }
      
      throw error;
    }
  }

  getAvailableProviders(): AIProviderType[] {
    return Array.from(this.providers.keys());
  }

  getProviderInfo(type: AIProviderType): { name: string; available: boolean } | null {
    const provider = this.providers.get(type);
    return provider ? {
      name: provider.name,
      available: true,
    } : null;
  }

  setPrimaryProvider(type: AIProviderType) {
    if (!this.providers.has(type)) {
      throw new Error(`Provider ${type} is not available`);
    }
    this.primaryProvider = type;
  }
}

// Singleton instance
let aiService: AIService | null = null;

export function getAIService(): AIService {
  if (!aiService) {
    aiService = new AIService();
  }
  return aiService;
}