import { NextRequest, NextResponse } from 'next/server';
import { getAIService } from '@/lib/ai/service';
import { AIMessage, AIFunction, AIProviderType } from '@/lib/ai/types';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const supabase = createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Parse request body
    const { messages, functions, provider } = await request.json();
    
    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: 'Messages array is required' },
        { status: 400 }
      );
    }

    // Get AI service
    const aiService = getAIService();

    // Create a TransformStream for streaming response
    const encoder = new TextEncoder();
    const stream = new TransformStream();
    const writer = stream.writable.getWriter();

    // Start streaming in background
    (async () => {
      try {
        let totalTokens = 0;
        
        for await (const token of aiService.streamChat(
          messages as AIMessage[],
          functions as AIFunction[] | undefined,
          {
            provider: provider as AIProviderType | undefined,
          }
        )) {
          await writer.write(encoder.encode(token));
          totalTokens += token.length; // Rough estimate
        }

        // Log usage to database (rough estimate)
        try {
          await supabase.from('ai_usage_logs').insert({
            user_id: user.id,
            provider: provider || 'deepseek',
            prompt_tokens: messages.reduce((acc, m) => acc + m.content.length / 4, 0), // Rough estimate
            completion_tokens: totalTokens / 4, // Rough estimate
            total_tokens: (messages.reduce((acc, m) => acc + m.content.length, 0) + totalTokens) / 4,
            request_type: 'stream',
          });
        } catch (logError) {
          // Table might not exist yet, continue anyway
          console.log('Could not log AI usage:', logError);
        }
      } catch (error) {
        console.error('Streaming error:', error);
        await writer.write(
          encoder.encode(`\n\nError: ${error instanceof Error ? error.message : 'Stream failed'}`)
        );
      } finally {
        await writer.close();
      }
    })();

    // Return streaming response
    return new Response(stream.readable, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache',
      },
    });
  } catch (error) {
    console.error('AI stream error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'AI stream failed' },
      { status: 500 }
    );
  }
}