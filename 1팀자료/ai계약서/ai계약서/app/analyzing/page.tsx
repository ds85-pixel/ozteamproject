'use client';

import { Suspense, useEffect, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { v4 as uuid } from 'uuid';
import SiteHeader from '@/components/SiteHeader';
import ProgressSteps from '@/components/ProgressSteps';
import { takePendingFile, saveRecord } from '@/lib/storage';
import { demoAnalysisResult, DEMO_FILE_NAME } from '@/lib/mockData';
import { AnalysisRecord } from '@/lib/types';

type Status = 'running' | 'error' | 'no-file' | 'no-api-key';

function AnalyzingInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isDemo = searchParams.get('mode') === 'demo';

  const [stepIndex, setStepIndex] = useState(0);
  const [status, setStatus] = useState<Status>('running');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const startedRef = useRef(false);

  function goToDemoResult() {
    const record: AnalysisRecord = {
      id: uuid(),
      fileName: DEMO_FILE_NAME,
      fileType: 'pdf',
      createdAt: new Date().toISOString(),
      result: demoAnalysisResult,
      isDemo: true
    };
    saveRecord(record);
    router.replace(`/result/${record.id}`);
  }

  async function runAnalysis(file: File) {
    setStatus('running');
    setErrorMessage('');
    setStepIndex(0);

    const stepTimer1 = setTimeout(() => setStepIndex(1), 900);
    const stepTimer2 = setTimeout(() => setStepIndex(2), 2200);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/analyze', { method: 'POST', body: formData });
      const data = await res.json();

      clearTimeout(stepTimer1);
      clearTimeout(stepTimer2);

      if (!res.ok) {
        if (data.error === 'NO_API_KEY') {
          setStatus('no-api-key');
          return;
        }
        setStatus('error');
        setErrorMessage(data.message || '분석 중 오류가 발생했습니다.');
        return;
      }

      setStepIndex(3);

      const record: AnalysisRecord = {
        id: uuid(),
        fileName: data.fileName,
        fileType: data.fileType,
        createdAt: new Date().toISOString(),
        result: data.result
      };
      saveRecord(record);

      setTimeout(() => router.replace(`/result/${record.id}`), 500);
    } catch (err) {
      clearTimeout(stepTimer1);
      clearTimeout(stepTimer2);
      setStatus('error');
      setErrorMessage('네트워크 오류로 분석에 실패했습니다. 인터넷 연결을 확인한 후 다시 시도해 주세요.');
    }
  }

  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;

    if (isDemo) {
      const t1 = setTimeout(() => setStepIndex(1), 700);
      const t2 = setTimeout(() => setStepIndex(2), 1500);
      const t3 = setTimeout(() => setStepIndex(3), 2300);
      const t4 = setTimeout(goToDemoResult, 2800);
      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
        clearTimeout(t3);
        clearTimeout(t4);
      };
    }

    const file = takePendingFile();
    if (!file) {
      setStatus('no-file');
      return;
    }
    runAnalysis(file);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDemo]);

  return (
    <div className="min-h-screen bg-canvas">
      <SiteHeader />
      <main className="container-page flex max-w-xl flex-col items-center py-16 text-center">
        {status === 'running' && (
          <>
            <div className="relative flex h-20 w-20 items-center justify-center">
              <span className="absolute inset-0 animate-ping rounded-full bg-primary/20" />
              <span className="relative flex h-16 w-16 items-center justify-center rounded-full bg-primary text-white">
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M4 4H14L20 10V20H4V4Z"
                    stroke="white"
                    strokeWidth="1.6"
                    strokeLinejoin="round"
                  />
                  <path d="M14 4V10H20" stroke="white" strokeWidth="1.6" strokeLinejoin="round" />
                  <path d="M7.5 13.5H16.5M7.5 16.5H13" stroke="white" strokeWidth="1.4" strokeLinecap="round" />
                </svg>
              </span>
            </div>
            <h1 className="mt-6 font-display text-2xl font-extrabold text-ink sm:text-3xl">
              계약서를 분석하고 있습니다
            </h1>
            <p className="mt-2 text-sm text-muted">평균 30~40초 정도 소요돼요. 잠시만 기다려 주세요.</p>

            <div className="card mt-8 w-full p-6 text-left">
              <ProgressSteps activeIndex={stepIndex} />
            </div>
          </>
        )}

        {status === 'no-file' && (
          <StatusCard
            tone="warning"
            title="업로드된 파일을 찾을 수 없습니다"
            desc="페이지를 새로고침했거나 파일 정보가 유실되었습니다. 업로드 화면으로 돌아가 다시 시도해 주세요."
            primaryLabel="업로드 화면으로 돌아가기"
            onPrimary={() => router.push('/upload')}
          />
        )}

        {status === 'no-api-key' && (
          <StatusCard
            tone="info"
            title="OpenAI API 키가 설정되지 않았습니다"
            desc="서버 환경변수 OPENAI_API_KEY를 .env.local에 설정하면 실제 계약서를 분석할 수 있습니다. 지금은 데모 결과로 화면을 확인해 보세요."
            primaryLabel="데모 결과 보기"
            onPrimary={goToDemoResult}
            secondaryLabel="업로드 화면으로 돌아가기"
            onSecondary={() => router.push('/upload')}
          />
        )}

        {status === 'error' && (
          <StatusCard
            tone="error"
            title="분석에 실패했습니다"
            desc={errorMessage || '알 수 없는 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.'}
            primaryLabel="다시 시도하기"
            onPrimary={() => router.push('/upload')}
            secondaryLabel="데모 결과 보기"
            onSecondary={goToDemoResult}
          />
        )}
      </main>
    </div>
  );
}

function StatusCard({
  tone,
  title,
  desc,
  primaryLabel,
  onPrimary,
  secondaryLabel,
  onSecondary
}: {
  tone: 'warning' | 'error' | 'info';
  title: string;
  desc: string;
  primaryLabel: string;
  onPrimary: () => void;
  secondaryLabel?: string;
  onSecondary?: () => void;
}) {
  const toneColor =
    tone === 'error' ? 'text-risk-high bg-risk-highBg' : tone === 'warning' ? 'text-risk-medium bg-risk-mediumBg' : 'text-primary bg-primary-light';

  return (
    <div className="card w-full p-8">
      <div className={`mx-auto flex h-14 w-14 items-center justify-center rounded-2xl ${toneColor}`}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" />
          <path d="M12 8V13" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          <circle cx="12" cy="16" r="0.9" fill="currentColor" />
        </svg>
      </div>
      <h2 className="mt-4 font-display text-xl font-bold text-ink">{title}</h2>
      <p className="mt-2 text-sm leading-relaxed text-muted">{desc}</p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <button
          onClick={onPrimary}
          className="focus-ring rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white transition hover:bg-primary-dark"
        >
          {primaryLabel}
        </button>
        {secondaryLabel && onSecondary && (
          <button
            onClick={onSecondary}
            className="focus-ring rounded-full border border-ink/10 bg-white px-6 py-3 text-sm font-semibold text-ink transition hover:border-primary/40"
          >
            {secondaryLabel}
          </button>
        )}
      </div>
    </div>
  );
}

export default function AnalyzingPage() {
  return (
    <Suspense fallback={null}>
      <AnalyzingInner />
    </Suspense>
  );
}
