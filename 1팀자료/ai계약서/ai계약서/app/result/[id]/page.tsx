'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import SiteHeader from '@/components/SiteHeader';
import ScoreGauge from '@/components/ScoreGauge';
import RiskCard from '@/components/RiskCard';
import { AnalysisRecord } from '@/lib/types';
import { getRecord } from '@/lib/storage';

export default function ResultPage() {
  const params = useParams<{ id: string }>();
  const [record, setRecord] = useState<AnalysisRecord | null | undefined>(undefined);

  useEffect(() => {
    setRecord(getRecord(params.id));
  }, [params.id]);

  if (record === undefined) {
    return (
      <div className="min-h-screen bg-canvas">
        <SiteHeader />
        <div className="container-page py-20 text-center text-muted">불러오는 중...</div>
      </div>
    );
  }

  if (record === null) {
    return (
      <div className="min-h-screen bg-canvas">
        <SiteHeader />
        <div className="container-page flex flex-col items-center gap-4 py-24 text-center">
          <h1 className="font-display text-xl font-bold text-ink">결과를 찾을 수 없습니다</h1>
          <p className="text-sm text-muted">
            이 브라우저에 저장된 분석 결과가 아니거나 삭제되었을 수 있습니다.
          </p>
          <Link
            href="/upload"
            className="focus-ring rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white"
          >
            새 계약서 분석하기
          </Link>
        </div>
      </div>
    );
  }

  const { result } = record;

  if (!result.is_contract) {
    return (
      <div className="min-h-screen bg-canvas">
        <SiteHeader />
        <main className="container-page max-w-xl py-16 text-center">
          <div className="card p-10">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-risk-mediumBg text-risk-medium">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" />
                <path d="M12 8V13" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                <circle cx="12" cy="16" r="0.9" fill="currentColor" />
              </svg>
            </div>
            <h1 className="mt-4 font-display text-xl font-bold text-ink">
              계약서로 판단되지 않았습니다
            </h1>
            <p className="mt-2 text-sm leading-relaxed text-muted">{result.summary}</p>
            <p className="mt-1 text-xs text-muted">판별 신뢰도 {result.contract_confidence}%</p>
            <Link
              href="/upload"
              className="focus-ring mt-6 inline-block rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white"
            >
              다른 파일 업로드하기
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-canvas pb-20">
      <SiteHeader />
      <main className="container-page max-w-3xl py-10">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-primary">검사 결과</p>
            <h1 className="mt-1 font-display text-2xl font-extrabold text-ink sm:text-3xl">
              {record.fileName}
            </h1>
            <p className="mt-1 text-xs text-muted">
              {new Date(record.createdAt).toLocaleString('ko-KR')} 분석 완료
              {record.isDemo && ' · 예시 데이터'}
            </p>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-primary-light px-3.5 py-1.5 text-xs font-semibold text-primary-dark">
            계약서 판별: {result.is_contract ? '계약서 맞음' : '판단 불가'} · 신뢰도{' '}
            {result.contract_confidence}%
          </span>
        </div>

        {/* Score + summary */}
        <section className="card mt-8 grid gap-8 p-8 sm:grid-cols-[auto_1fr] sm:items-center">
          <ScoreGauge score={result.risk_score} level={result.risk_level} />
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted">계약서 유형</p>
            <p className="mt-1 font-display text-lg font-bold text-ink">{result.contract_type}</p>
            <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-muted">핵심 요약</p>
            <p className="mt-1 text-sm leading-relaxed text-ink-soft">{result.summary}</p>
          </div>
        </section>

        {/* Parties */}
        <section className="mt-8">
          <h2 className="mb-3 font-display text-lg font-bold text-ink">계약 당사자</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {result.parties.map((p, i) => (
              <div key={i} className="card p-4">
                <p className="text-xs font-semibold text-muted">{p.role}</p>
                <p className="mt-1 text-sm font-semibold text-ink">{p.name}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Key terms */}
        <section className="mt-8">
          <h2 className="mb-3 font-display text-lg font-bold text-ink">계약 기간 · 금액 · 지급 조건</h2>
          <div className="card grid gap-5 p-6 sm:grid-cols-2">
            <KeyTerm label="계약 시작일" value={result.key_terms.effective_date} />
            <KeyTerm label="계약 종료일" value={result.key_terms.end_date} />
            <KeyTerm label="계약 금액" value={result.key_terms.payment_amount} />
            <KeyTerm label="지급 조건" value={result.key_terms.payment_schedule} />
            <KeyTerm label="자동 갱신" value={result.key_terms.auto_renewal} />
            <KeyTerm label="해지 조건" value={result.key_terms.termination} />
            <KeyTerm label="준거법 / 관할" value={result.key_terms.governing_law} />
            <KeyTerm label="감지된 관할지" value={result.jurisdiction_detected} />
          </div>
        </section>

        {/* Risks */}
        <section className="mt-8">
          <div className="mb-3 flex items-baseline justify-between">
            <h2 className="font-display text-lg font-bold text-ink">위험 및 확인 필요 조항</h2>
            <span className="text-xs font-medium text-muted">총 {result.risks.length}건</span>
          </div>
          {result.risks.length === 0 ? (
            <div className="card p-6 text-sm text-muted">
              뚜렷한 위험 조항이 발견되지 않았습니다. 다만 AI 분석은 참고용이므로 서명 전
              전문가 검토를 권장합니다.
            </div>
          ) : (
            <div className="space-y-3">
              {result.risks.map((r, i) => (
                <RiskCard key={r.id} risk={r} index={i} />
              ))}
            </div>
          )}
        </section>

        {/* Missing / unclear */}
        {result.missing_or_unclear_items.length > 0 && (
          <section className="mt-8">
            <h2 className="mb-3 font-display text-lg font-bold text-ink">
              추가로 확인이 필요한 항목
            </h2>
            <div className="card space-y-2.5 p-6">
              {result.missing_or_unclear_items.map((item, i) => (
                <div key={i} className="flex items-start gap-2.5 text-sm text-ink-soft">
                  <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-risk-medium" />
                  {item}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Disclaimer */}
        <div className="mt-8 rounded-2xl border border-black/5 bg-white/60 p-5 text-xs leading-relaxed text-muted">
          {result.disclaimer}
        </div>

        <div className="mt-10 flex flex-wrap gap-3">
          <Link
            href="/upload"
            className="focus-ring rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white transition hover:bg-primary-dark"
          >
            새 계약서 검사하기
          </Link>
          <Link
            href="/history"
            className="focus-ring rounded-full border border-ink/10 bg-white px-6 py-3 text-sm font-semibold text-ink transition hover:border-primary/40"
          >
            검사 이력 보기
          </Link>
        </div>
      </main>
    </div>
  );
}

function KeyTerm({ label, value }: { label: string; value: string | null }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wide text-muted">{label}</p>
      <p className="mt-1 text-sm font-medium text-ink">{value ?? '문서에서 확인되지 않음'}</p>
    </div>
  );
}
