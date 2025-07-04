import { useState, useCallback, useRef } from 'react';
import { AIMessage, AIFunction, AIProviderType, DEVICE_FUNCTIONS } from './types';
import { ChatMessage } from '@/types/analytics';

export interface UseAIChatOptions {
  provider?: AIProviderType;
  systemPrompt?: string;
  enableDeviceFunctions?: boolean;
  onFunctionCall?: (name: string, args: any) => Promise<any>;
}

export function useAIChat(options: UseAIChatOptions = {}) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim()) return;

    // Add user message
    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content: content.trim(),
      timestamp: new Date().toISOString(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    setError(null);

    // Create abort controller
    abortControllerRef.current = new AbortController();

    try {
      // Prepare messages for API
      const apiMessages: AIMessage[] = [];
      
      // Add system prompt if provided
      if (options.systemPrompt) {
        apiMessages.push({
          role: 'system',
          content: options.systemPrompt,
        });
      }

      // Add conversation history
      messages.forEach(msg => {
        apiMessages.push({
          role: msg.role,
          content: msg.content,
        });
      });

      // Add new user message
      apiMessages.push({
        role: 'user',
        content: userMessage.content,
      });

      // Prepare functions if enabled
      const functions = options.enableDeviceFunctions ? DEVICE_FUNCTIONS : undefined;

      // Call API
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: apiMessages,
          functions,
          provider: options.provider,
        }),
        signal: abortControllerRef.current.signal,
      });

      if (!response.ok) {
        throw new Error(`AI chat failed: ${response.statusText}`);
      }

      const data = await response.json();

      // Handle function call if present
      if (data.functionCall && options.onFunctionCall) {
        const functionResult = await options.onFunctionCall(
          data.functionCall.name,
          data.functionCall.arguments
        );

        // Add function result as assistant message
        const functionMessage: ChatMessage = {
          id: crypto.randomUUID(),
          role: 'assistant',
          content: `Executed ${data.functionCall.name}: ${JSON.stringify(functionResult)}`,
          timestamp: new Date().toISOString(),
          metadata: {
            action: data.functionCall.name,
            result: functionResult,
          },
        };
        
        setMessages(prev => [...prev, functionMessage]);
      }

      // Add assistant response
      const assistantMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: data.content,
        timestamp: new Date().toISOString(),
      };
      
      setMessages(prev => [...prev, assistantMessage]);
    } catch (err) {
      if (err instanceof Error && err.name !== 'AbortError') {
        setError(err.message);
      }
    } finally {
      setIsLoading(false);
      abortControllerRef.current = null;
    }
  }, [messages, options]);

  const clearMessages = useCallback(() => {
    setMessages([]);
    setError(null);
  }, []);

  const stopGeneration = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  }, []);

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    clearMessages,
    stopGeneration,
  };
}

export interface UseAIStreamOptions extends UseAIChatOptions {
  onToken?: (token: string) => void;
}

export function useAIStreamChat(options: UseAIStreamOptions = {}) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentResponse, setCurrentResponse] = useState('');
  const abortControllerRef = useRef<AbortController | null>(null);

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim()) return;

    // Add user message
    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content: content.trim(),
      timestamp: new Date().toISOString(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    setIsStreaming(true);
    setError(null);
    setCurrentResponse('');

    // Create abort controller
    abortControllerRef.current = new AbortController();

    try {
      // Prepare messages for API
      const apiMessages: AIMessage[] = [];
      
      if (options.systemPrompt) {
        apiMessages.push({
          role: 'system',
          content: options.systemPrompt,
        });
      }

      messages.forEach(msg => {
        apiMessages.push({
          role: msg.role,
          content: msg.content,
        });
      });

      apiMessages.push({
        role: 'user',
        content: userMessage.content,
      });

      // Call streaming API
      const response = await fetch('/api/ai/stream', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: apiMessages,
          functions: options.enableDeviceFunctions ? DEVICE_FUNCTIONS : undefined,
          provider: options.provider,
        }),
        signal: abortControllerRef.current.signal,
      });

      if (!response.ok) {
        throw new Error(`AI streaming failed: ${response.statusText}`);
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error('No response body');

      const decoder = new TextDecoder();
      let accumulated = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        accumulated += chunk;
        setCurrentResponse(accumulated);
        
        if (options.onToken) {
          options.onToken(chunk);
        }
      }

      // Add complete assistant response
      const assistantMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: accumulated,
        timestamp: new Date().toISOString(),
      };
      
      setMessages(prev => [...prev, assistantMessage]);
      setCurrentResponse('');
    } catch (err) {
      if (err instanceof Error && err.name !== 'AbortError') {
        setError(err.message);
      }
    } finally {
      setIsStreaming(false);
      abortControllerRef.current = null;
    }
  }, [messages, options]);

  const clearMessages = useCallback(() => {
    setMessages([]);
    setError(null);
    setCurrentResponse('');
  }, []);

  const stopStreaming = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  }, []);

  return {
    messages,
    isStreaming,
    error,
    currentResponse,
    sendMessage,
    clearMessages,
    stopStreaming,
  };
}