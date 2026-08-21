// app/api/files/upload/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { randomUUID } from 'crypto';
import { prisma } from '@/lib/prisma';

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
];

const ALLOWED_EXTENSIONS = [
  '.lua', '.luau', '.js', '.ts', '.html', '.css', '.json',
  '.txt', '.md', '.xml', '.csv', '.log', '.png', '.jpg',
  '.jpeg', '.gif', '.webp',
];

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession();
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
      if (!ALLOWED_MIME_TYPES.includes(file.type)) {
        return NextResponse.json(
          { error: `MIME type ${file.type} is not supported` },
          { status: 400 }
        );
      }

      // Sanitize filename
      const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
      const uniqueId = randomUUID();
      const uploadDir = join(process.cwd(), 'uploads', session.user.id);
      const filePath = join(uploadDir, `${uniqueId}-${sanitizedName}`);

      // Create upload directory if it doesn't exist
      await mkdir(uploadDir, { recursive: true });

      // Save file
      const buffer = Buffer.from(await file.arrayBuffer());
      await writeFile(filePath, buffer);

      uploadedFiles.push({
        fileName: sanitizedName,
        fileType: file.type,
        fileSize: file.size,
        fileUrl: `/uploads/${session.user.id}/${uniqueId}-${sanitizedName}`,
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
