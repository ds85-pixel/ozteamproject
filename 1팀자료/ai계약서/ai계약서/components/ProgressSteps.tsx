export interface Step {
  label: string;
  detail: string;
}

export const ANALYSIS_STEPS: Step[] = [
  { label: '문서를 읽고 있습니다', detail: '텍스트와 구조를 파악하는 중' },
  { label: '핵심 조항을 추출하고 있습니다', detail: '당사자, 기간, 금액 등 핵심 정보 정리 중' },
  { label: '위험 요소를 검토하고 있습니다', detail: '주의가 필요한 조항을 가려내는 중' }
];

export default function ProgressSteps({ activeIndex }: { activeIndex: number }) {
  return (
    <div className="flex flex-col gap-4">
      {ANALYSIS_STEPS.map((step, i) => {
        const state = i < activeIndex ? 'done' : i === activeIndex ? 'active' : 'pending';
        return (
          <div key={step.label} className="flex items-start gap-4">
            <div
              className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-xs font-bold transition ${
                state === 'done'
                  ? 'bg-primary text-white'
                  : state === 'active'
                  ? 'bg-primary/10 text-primary animate-pulseSoft'
                  : 'bg-black/5 text-muted'
              }`}
            >
              {state === 'done' ? (
                <svg width="14" height="14" viewBox="0 0 12 12" fill="none">
                  <path
                    d="M2.5 6.2L4.8 8.5L9.5 3.5"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              ) : (
                i + 1
              )}
            </div>
            <div>
              <p className={`text-sm font-semibold ${state === 'pending' ? 'text-muted' : 'text-ink'}`}>
                {step.label}
              </p>
              <p className="text-xs text-muted">{step.detail}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
