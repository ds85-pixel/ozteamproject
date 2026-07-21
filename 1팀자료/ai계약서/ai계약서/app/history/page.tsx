'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import SiteHeader from '@/components/SiteHeader';
import { AnalysisRecord } from '@/lib/types';
import { getHistory, deleteRecord } from '@/lib/storage';

const LEVEL_LABEL = { high: '위험', medium: '주의', low: '안전' } as const;
const LEVEL_STYLE = {
  high: 'bg-risk-highBg text-risk-high',
  medium: 'bg-risk-mediumBg text-risk-medium',
  low: 'bg-risk-lowBg text-risk-low'
} as const;

export default function HistoryPage() {
  const [records, setRecords] = useState<AnalysisRecord[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setRecords(getHistory());
    setLoaded(true);
  }, []);

  function handleDelete(id: string) {
    deleteRecord(id);
    setRecords(getHistory());
  }

  return (
    <div className="min-h-screen bg-canvas">
      <SiteHeader />
      <main className="container-page max-w-3xl py-14">
        <p className="text-sm font-semibold text-primary">검사 이력</p>
        <h1 className="mt-1 font-display text-3xl font-extrabold text-ink">
          지금까지 분석한 계약서
        </h1>
        <p className="mt-2 text-sm text-muted">
          이 브라우저에만 저장됩니다. 다른 기기나 시크릿 창에서는 보이지 않아요.
        </p>

        {loaded && records.length === 0 && (
          <div className="card mt-8 flex flex-col items-center gap-3 p-12 text-center">
            <p className="font-semibold text-ink">아직 분석한 계약서가 없습니다</p>
            <p className="text-sm text-muted">첫 계약서를 업로드하고 위험 조항을 확인해보세요.</p>
            <Link
              href="/upload"
              className="focus-ring mt-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white"
            >
              계약서 업로드하기
            </Link>
          </div>
        )}

        <div className="mt-8 space-y-3">
          {records.map((r) => (
            <div key={r.id} className="card flex items-center gap-4 p-5">
              <Link href={`/result/${r.id}`} className="focus-ring min-w-0 flex-1">
                <p className="truncate font-semibold text-ink">{r.fileName}</p>
                <p className="mt-1 text-xs text-muted">
                  {new Date(r.createdAt).toLocaleString('ko-KR')} · {r.result.contract_type}
                </p>
              </Link>
              <span
                className={`flex-shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold ${LEVEL_STYLE[r.result.risk_level]}`}
              >
                {LEVEL_LABEL[r.result.risk_level]} · {r.result.risk_score}점
              </span>
              <button
                onClick={() => handleDelete(r.id)}
                aria-label="이력 삭제"
                className="focus-ring flex-shrink-0 rounded-full p-2 text-muted transition hover:bg-black/5 hover:text-risk-high"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path
                    d="M3 4H13M6 4V2.5C6 2.2 6.2 2 6.5 2H9.5C9.8 2 10 2.2 10 2.5V4M4.5 4L5 13C5 13.6 5.4 14 6 14H10C10.6 14 11 13.6 11 13L11.5 4"
                    stroke="currentColor"
                    strokeWidth="1.3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
