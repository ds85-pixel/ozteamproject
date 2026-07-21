'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import SiteHeader from '@/components/SiteHeader';
import UploadDropzone from '@/components/UploadDropzone';
import { setPendingFile } from '@/lib/storage';

const NOTES = [
  'PDF, DOCX 파일을 지원합니다.',
  '파일 크기는 최대 20MB까지 가능합니다.',
  '스캔본의 경우 글자가 선명하게 보이도록 촬영·스캔해 주세요.',
  '업로드한 파일은 분석 목적으로만 사용되며 서버에 영구 저장되지 않습니다.'
];

export default function UploadPage() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);

  function handleStart() {
    if (!file) return;
    setPendingFile(file);
    router.push('/analyzing');
  }

  return (
    <div className="min-h-screen bg-canvas">
      <SiteHeader />
      <main className="container-page max-w-2xl py-14">
        <p className="text-sm font-semibold text-primary">1단계 · 계약서 업로드</p>
        <h1 className="mt-2 font-display text-3xl font-extrabold text-ink">
          검사할 계약서를 올려주세요
        </h1>
        <p className="mt-2 text-muted">PDF 또는 DOCX 파일 하나를 선택하면 바로 분석을 시작합니다.</p>

        <div className="mt-8">
          <UploadDropzone onFileSelected={setFile} />
        </div>

        <div className="card mt-6 p-5">
          <p className="mb-3 text-sm font-semibold text-ink">업로드 안내</p>
          <ul className="space-y-2">
            {NOTES.map((n) => (
              <li key={n} className="flex items-start gap-2 text-sm text-muted">
                <span className="mt-1.5 h-1 w-1 flex-shrink-0 rounded-full bg-primary" />
                {n}
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-8 flex flex-wrap items-center gap-3">
          <button
            onClick={handleStart}
            disabled={!file}
            className="focus-ring rounded-full bg-primary px-7 py-3.5 text-sm font-semibold text-white shadow-card transition enabled:hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-40"
          >
            AI 분석 시작하기
          </button>
          <a
            href="/analyzing?mode=demo"
            className="focus-ring rounded-full border border-ink/10 bg-white px-7 py-3.5 text-sm font-semibold text-ink transition hover:border-primary/40 hover:text-primary"
          >
            예시 계약서로 체험하기
          </a>
        </div>
      </main>
    </div>
  );
}
