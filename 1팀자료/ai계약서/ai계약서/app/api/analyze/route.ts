import { NextRequest, NextResponse } from 'next/server';
import { analyzePdfContract, analyzeTextContract } from '@/lib/openai';
import { extractDocxText } from '@/lib/docx';

export const runtime = 'nodejs';
export const maxDuration = 60;

const MAX_FILE_SIZE_BYTES = 20 * 1024 * 1024; // 20MB, matches the upload screen's stated limit

export async function POST(req: NextRequest) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        {
          error: 'NO_API_KEY',
          message:
            '서버에 OPENAI_API_KEY가 설정되어 있지 않습니다. .env.local 파일을 확인하거나, "데모 결과 보기" 기능을 이용해 주세요.'
        },
        { status: 503 }
      );
    }

    const formData = await req.formData();
    const file = formData.get('file');

    if (!file || !(file instanceof File)) {
      return NextResponse.json(
        { error: 'NO_FILE', message: '업로드된 파일이 없습니다.' },
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      return NextResponse.json(
        { error: 'FILE_TOO_LARGE', message: '파일 크기는 최대 20MB까지 가능합니다.' },
        { status: 400 }
      );
    }

    const fileName = file.name || '업로드된 파일';
    const lowerName = fileName.toLowerCase();
    const isPdf = lowerName.endsWith('.pdf') || file.type === 'application/pdf';
    const isDocx =
      lowerName.endsWith('.docx') ||
      file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';

    if (!isPdf && !isDocx) {
      return NextResponse.json(
        {
          error: 'UNSUPPORTED_FILE_TYPE',
          message: 'PDF 또는 DOCX 파일만 지원합니다. 다른 형식의 파일이 업로드되었습니다.'
        },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    if (isPdf) {
      const base64Pdf = buffer.toString('base64');
      const result = await analyzePdfContract({ base64Pdf, fileName });
      return NextResponse.json({ result, fileType: 'pdf', fileName });
    }

    // DOCX path: extract text on the server, then send text to the model.
    let text: string;
    try {
      text = await extractDocxText(buffer);
    } catch (err) {
      return NextResponse.json(
        {
          error: 'DOCX_PARSE_FAILED',
          message: 'DOCX 파일에서 텍스트를 추출하지 못했습니다. 파일이 손상되었거나 지원되지 않는 형식일 수 있습니다.'
        },
        { status: 422 }
      );
    }

    const result = await analyzeTextContract({ text, fileName });
    return NextResponse.json({ result, fileType: 'docx', fileName });
  } catch (err: any) {
    console.error('[analyze] error', err);

    const message: string =
      err?.message && typeof err.message === 'string'
        ? err.message
        : '분석 중 알 수 없는 오류가 발생했습니다.';

    // Surface OpenAI rate limit / auth errors distinctly so the client can
    // show a tailored retry message.
    const status = err?.status || err?.response?.status || 500;

    return NextResponse.json(
      {
        error: status === 429 ? 'RATE_LIMITED' : 'ANALYSIS_FAILED',
        message
      },
      { status: status === 429 ? 429 : 500 }
    );
  }
}
