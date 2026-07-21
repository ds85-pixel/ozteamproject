'use client';

import { useState } from 'react';
import { RiskItem } from '@/lib/types';
import RiskBadge from './RiskBadge';

type Props = { risk: RiskItem; index: number };

export default function RiskCard({ risk, index }: Props) {
  const [open, setOpen] = useState(index === 0);

  return (
    <div className="card overflow-hidden">
      <button
        onClick={() => setOpen((v) => !v)}
        className="focus-ring flex w-full items-start justify-between gap-4 p-5 text-left"
        aria-expanded={open}
      >
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-muted">TOP {index + 1}</span>
            <RiskBadge severity={risk.severity} size="sm" />
          </div>
          <h3 className="mt-2 font-display text-base font-bold text-ink">{risk.title}</h3>
          {risk.clause_reference && (
            <p className="mt-0.5 text-xs text-muted">{risk.clause_reference}</p>
          )}
        </div>
        <svg
          width="18"
          height="18"
          viewBox="0 0 12 12"
          fill="none"
          className={`mt-1 flex-shrink-0 transition-transform ${open ? 'rotate-180' : ''}`}
        >
          <path d="M3 4.5L6 7.5L9 4.5" stroke="#767B99" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {open && (
        <div className="space-y-4 border-t border-black/5 px-5 pb-6 pt-4">
          <div>
            <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-muted">원문 인용</p>
            <blockquote className="rounded-xl bg-canvas px-4 py-3 text-sm italic leading-relaxed text-ink-soft">
              &ldquo;{risk.quote}&rdquo;
            </blockquote>
          </div>
          <div>
            <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-muted">쉬운 설명</p>
            <p className="text-sm leading-relaxed text-ink-soft">{risk.explanation}</p>
          </div>
          <div>
            <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-muted">왜 확인이 필요한가요</p>
            <p className="text-sm leading-relaxed text-ink-soft">{risk.why_it_matters}</p>
          </div>
          <div className="rounded-xl border border-primary/15 bg-primary-tint px-4 py-3.5">
            <p className="mb-1 flex items-center gap-1.5 text-xs font-semibold text-primary-dark">
              <svg width="13" height="13" viewBox="0 0 12 12" fill="none">
                <path
                  d="M6 1C3.8 1 2 2.8 2 5C2 6.4 2.7 7.6 3.8 8.3V9.5C3.8 9.8 4 10 4.3 10H7.7C8 10 8.2 9.8 8.2 9.5V8.3C9.3 7.6 10 6.4 10 5C10 2.8 8.2 1 6 1Z"
                  stroke="currentColor"
                  strokeWidth="1.1"
                  strokeLinejoin="round"
                />
                <path d="M4.5 11H7.5" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
              </svg>
              협상 시 확인해볼 질문
            </p>
            <p className="text-sm leading-relaxed text-primary-darker">{risk.suggested_question}</p>
          </div>
        </div>
      )}
    </div>
  );
}
