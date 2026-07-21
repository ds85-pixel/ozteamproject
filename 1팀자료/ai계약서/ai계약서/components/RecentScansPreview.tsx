'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { AnalysisRecord } from '@/lib/types';
import { getHistory } from '@/lib/storage';

export default function RecentScansPreview() {
  const [records, setRecords] = useState<AnalysisRecord[] | null>(null);

  useEffect(() => {
    setRecords(getHistory().slice(0, 3));
  }, []);

  if (!records || records.length === 0) return null;

  return (
    <section className="container-page py-4">
      <div className="mb-4 flex items-baseline justify-between">
        <h2 className="font-display text-xl font-bold text-ink">최근 검사 결과</h2>
        <Link href="/history" className="text-sm font-semibold text-primary hover:underline">
          전체 이력 보기
        </Link>
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        {records.map((r) => (
          <Link
            key={r.id}
            href={`/result/${r.id}`}
            className="card focus-ring block p-5 transition hover:-translate-y-0.5 hover:shadow-cardHover"
          >
            <p className="truncate text-sm font-semibold text-ink">{r.fileName}</p>
            <p className="mt-1 text-xs text-muted">
              {new Date(r.createdAt).toLocaleDateString('ko-KR')} 검사 완료
            </p>
            <p className="mt-3 text-2xl font-extrabold text-primary">
              {r.result.risk_score}
              <span className="ml-1 text-sm font-medium text-muted">/ 100점</span>
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}
