import { createClient } from '@deepgram/sdk';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(request) {
  const formData = await request.formData();
  const file = formData.get('audio');

  if (!file) {
    return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
  }

  // Check if the file is an audio file
  if (!file.type.startsWith('audio/')) {
    return NextResponse.json({ error: 'Uploaded file is not an audio file' }, { status: 400 });
  }

  const deepgramApiKey = process.env.DEEPGRAM_API_KEY;
  const deepgram = createClient(deepgramApiKey);

  try {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const { result, error } = await deepgram.listen.prerecorded.transcribeFile(
      buffer,
      {
        mimetype: file.type,
        model: 'nova-2',
        language: 'en',
        smart_format: true,
      }
    );

    if (error) {
      throw new Error(error);
    }

    const transcript = result.results.channels[0].alternatives[0].transcript;
    return NextResponse.json({ transcript });
  } catch (error) {
    console.error('Deepgram error:', error);
    return NextResponse.json({ error: 'An error occurred during transcription' }, { status: 500 });
  }
}

