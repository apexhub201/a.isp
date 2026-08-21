// app/api/files/upload/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { randomUUID } from 'crypto';
import { sanitizeFileName } from '@/lib/utils';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_MIME_TYPES = [
  'text/plain',
  'text/x-lua',
  'application/json',
  'text/javascript',
  'text/typescript',
  'text/html',
  'text/css',
  'text/markdown',
  'text/xml',
  'text/csv',
  'image/png',
  'image/jpeg',
  'image/gif',
  'image/webp',
  'application/pdf',
];

const ALLOWED_EXTENSIONS = [
  '.lua', '.luau', '.js', '.ts', '.html', '.css', '.json',
  '.txt', '.md', '.xml', '.csv', '.log', '.png', '.jpg',
  '.jpeg', '.gif', '.webp', '.pdf',
];

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await req.formData();
    const files = formData.getAll('files') as File[];
    
    if (!files || files.length === 0) {
      return NextResponse.json({ error: 'No files provided' }, { status: 400 });
    }

    const uploadedFiles = [];

    for (const file of files) {
      // Validate file size
      if (file.size > MAX_FILE_SIZE) {
        return NextResponse.json(
          { error: `File ${file.name} exceeds maximum size of 10MB` },
          { status: 400 }
        );
      }

      // Validate file extension
      const extension = '.' + file.name.split('.').pop()?.toLowerCase();
      if (!ALLOWED_EXTENSIONS.includes(extension)) {
        return NextResponse.json(
          { error: `File type ${extension} is not supported` },
          { status: 400 }
        );
      }

      // Validate MIME type
      if (!ALLOWED_MIME_TYPES.includes(file.type) && !file.type.startsWith('text/')) {
        return NextResponse.json(
          { error: `MIME type ${file.type} is not supported` },
          { status: 400 }
        );
      }

      // Sanitize filename
      const sanitizedName = sanitizeFileName(file.name);
      const uniqueId = randomUUID();
      const userDir = join(process.cwd(), 'public', 'uploads', session.user.id);
      const filePath = join(userDir, `${uniqueId}-${sanitizedName}`);

      // Create user directory if it doesn't exist
      await mkdir(userDir, { recursive: true });

      // Save file
      const buffer = Buffer.from(await file.arrayBuffer());
      await writeFile(filePath, buffer);

      // Read content for text files
      let content: string | undefined;
      if (file.type.startsWith('text/') || 
          ['.lua', '.luau', '.js', '.ts', '.json', '.txt', '.md', '.xml', '.csv', '.log'].includes(extension)) {
        content = buffer.toString('utf-8');
      }

      uploadedFiles.push({
        id: uniqueId,
        fileName: sanitizedName,
        fileType: file.type,
        fileSize: file.size,
        fileUrl: `/uploads/${session.user.id}/${uniqueId}-${sanitizedName}`,
        content,
      });
    }

    return NextResponse.json({ files: uploadedFiles });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Failed to upload files' },
      { status: 500 }
    );
  }
}
