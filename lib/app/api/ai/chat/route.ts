// app/api/ai/chat/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { AIProviderFactory } from '@/lib/ai-provider';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const chatSchema = z.object({
  conversationId: z.string().optional(),
  message: z.string(),
  attachments: z.array(z.object({
    fileName: z.string(),
    fileType: z.string(),
    fileSize: z.number(),
    fileUrl: z.string(),
    content: z.string().optional(),
  })).optional(),
  projectId: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const validated = chatSchema.parse(body);

    // Get project context if provided
    let projectContext = '';
    if (validated.projectId) {
      const project = await prisma.project.findUnique({
        where: { id: validated.projectId },
        include: { files: true },
      });

      if (project) {
        projectContext = project.files
          .map(f => `File: ${f.name}\n${f.content}`)
          .join('\n\n');
      }
    }

    // Build messages with context
    const messages = [];
    
    if (projectContext) {
      messages.push({
        role: 'system',
        content: `Project context:\n${projectContext}`,
      });
    }

    if (validated.attachments) {
      for (const attachment of validated.attachments) {
        if (attachment.content) {
          messages.push({
            role: 'user',
            content: `File: ${attachment.fileName}\n${attachment.content}`,
          });
        }
      }
    }

    messages.push({
      role: 'user',
      content: validated.message,
    });

    // Get or create conversation
    let conversationId = validated.conversationId;
    if (!conversationId) {
      const conversation = await prisma.conversation.create({
        data: {
          title: validated.message.slice(0, 50),
          userId: session.user.id,
        },
      });
      conversationId = conversation.id;
    }

    // Save user message
    await prisma.message.create({
      data: {
        conversationId,
        role: 'user',
        content: validated.message,
        attachments: validated.attachments ? {
          create: validated.attachments,
        } : undefined,
      },
    });

    // Get AI response
    const aiProvider = AIProviderFactory.createProvider();
    const aiResponse = await aiProvider.chat(messages);

    // Save AI response
    await prisma.message.create({
      data: {
        conversationId,
        role: 'assistant',
        content: aiResponse,
      },
    });

    return NextResponse.json({
      conversationId,
      response: aiResponse,
    });
  } catch (error) {
    console.error('Chat error:', error);
    return NextResponse.json(
      { error: "APEX AI couldn't complete this request." },
      { status: 500 }
    );
  }
}
