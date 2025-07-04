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

    // Call AI service
    const response = await aiService.chat(
      messages as AIMessage[],
      functions as AIFunction[] | undefined,
      {
        provider: provider as AIProviderType | undefined,
      }
    );

    // Log usage to database (if table exists)
    if (response.usage) {
      try {
        await supabase.from('ai_usage_logs').insert({
          user_id: user.id,
          provider: provider || 'deepseek',
          prompt_tokens: response.usage.promptTokens,
          completion_tokens: response.usage.completionTokens,
          total_tokens: response.usage.totalTokens,
          request_type: 'chat',
        });
      } catch (logError) {
        // Table might not exist yet, continue anyway
        console.log('Could not log AI usage:', logError);
      }
    }

    return NextResponse.json(response);
  } catch (error) {
    console.error('AI chat error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'AI chat failed' },
      { status: 500 }
    );
  }
}