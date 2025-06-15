import { put } from '@vercel/blob';
import { NextResponse } from 'next/server';

export async function POST(request: Request): Promise<NextResponse> {
  const { searchParams } = new URL(request.url);
  const filename = searchParams.get('filename');

  if (!filename || !request.body) {
    return NextResponse.json({ error: 'No filename or file body provided.' }, { status: 400 });
  }

  // Vercel Blob SDK 会自动处理 Content-Type 和 Content-Length
  const blob = await put(filename, request.body, {
    access: 'public',
  });

  return NextResponse.json(blob);
}
