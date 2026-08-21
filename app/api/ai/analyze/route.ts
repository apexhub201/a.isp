// app/api/ai/analyze/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { AIProviderFactory } from '@/lib/ai-provider';
import { z } from 'zod';

const analyzeSchema = z.object({
  code: z.string(),
  language: z.string().optional(),
  analysisType: z.enum(['explain', 'debug', 'optimize', 'refactor', 'security']).optional(),
});

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const validated = analyzeSchema.parse(body);

    const aiProvider = AIProviderFactory.createProvider();
    
    let prompt = '';
    switch (validated.analysisType) {
      case 'explain':
        prompt = `Explain the following ${validated.language || 'code'} in detail:\n\n${validated.code}`;
        break;
      case 'debug':
        prompt = `Debug the following ${validated.language || 'code'} and identify issues:\n\n${validated.code}`;
        break;
      case 'optimize':
        prompt = `Optimize the following ${validated.language || 'code'} for performance:\n\n${validated.code}`;
        break;
      case 'refactor':
        prompt = `Refactor the following ${validated.language || 'code'} for better readability and maintainability:\n\n${validated.code}`;
        break;
      case 'security':
        prompt = `Analyze the following ${validated.language || 'code'} for security vulnerabilities:\n\n${validated.code}`;
        break;
      default:
        prompt = `Analyze the following ${validated.language || 'code'}:\n\n${validated.code}`;
    }

    const analysis = await aiProvider.chat([
      {
        role: 'system',
        content: 'You are an expert code analyst. Provide detailed, actionable insights.',
      },
      {
        role: 'user',
        content: prompt,
      },
    ]);

    return NextResponse.json({ analysis });
  } catch (error) {
    console.error('Analysis error:', error);
    return NextResponse.json(
      { error: "APEX AI couldn't analyze this code." },
      { status: 500 }
    );
  }
}
