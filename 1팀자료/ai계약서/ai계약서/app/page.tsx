import Link from 'next/link';
import SiteHeader from '@/components/SiteHeader';
import ScoreGauge from '@/components/ScoreGauge';
import RecentScansPreview from '@/components/RecentScansPreview';

const FEATURES = [
  {
    title: '빠른 분석',
    desc: '업로드 후 약 30~40초면 계약서 전체를 읽고 핵심을 정리합니다.',
    icon: (
      <path d="M11 1L3 12H10L9 19L17 8H10L11 1Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
    )
  },
  {
    title: '쉬운 설명',
    desc: '법률 용어를 풀어서, 실생활 예시로 무엇이 문제인지 알려드립니다.',
    icon: (
      <path
        d="M10 2C5.6 2 2 5.1 2 9C2 11 3 12.8 4.6 14L4 18L8.2 16.3C8.8 16.4 9.4 16.5 10 16.5C14.4 16.5 18 13.4 18 9.5C18 5.6 14.4 2 10 2Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    )
  },
  {
    title: '안전한 계약',
    desc: '서명 전 반드시 확인해야 할 조항을 위험도 순으로 짚어드립니다.',
    icon: (
      <path
        d="M10 1L17 4V9C17 13 14 16.8 10 18C6 16.8 3 13 3 9V4L10 1Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    )
  }
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-canvas">
      <SiteHeader />

      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute -right-40 -top-40 h-[520px] w-[520px] rounded-full bg-primary/10 blur-3xl" />
        <div className="pointer-events-none absolute -left-32 top-40 h-[360px] w-[360px] rounded-full bg-primary/[0.07] blur-3xl" />

        <div className="container-page relative grid gap-12 py-16 sm:py-24 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
          <div className="animate-fadeUp">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-primary-light px-3.5 py-1.5 text-xs font-semibold text-primary-dark">
              계약 전, 30초 안전 점검
            </span>
            <h1 className="mt-5 font-display text-4xl font-extrabold leading-[1.12] tracking-tight text-ink sm:text-5xl lg:text-[3.4rem]">
              AI가 계약서의
              <br />
              위험을 찾아드립니다
            </h1>
            <p className="mt-5 max-w-md text-base leading-relaxed text-muted sm:text-lg">
              복잡한 법률 조항을 쉬운 말로 풀어서 설명하고, 서명 전에 반드시 짚어야 할 위험 조항을
              가려냅니다.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/upload"
                className="focus-ring rounded-full bg-primary px-7 py-3.5 text-sm font-semibold text-white shadow-cardHover transition hover:bg-primary-dark"
              >
                계약서 업로드하기
              </Link>
              <Link
                href="/analyzing?mode=demo"
                className="focus-ring rounded-full border border-ink/10 bg-white px-7 py-3.5 text-sm font-semibold text-ink transition hover:border-primary/40 hover:text-primary"
              >
                예시 계약서로 체험하기
              </Link>
            </div>
            <p className="mt-4 text-xs text-muted">
              PDF, DOCX 지원 · 로그인 없이 바로 사용 · 분석 결과는 브라우저에만 저장됩니다
            </p>
          </div>

          <div className="animate-fadeUp card mx-auto flex w-full max-w-sm flex-col items-center gap-3 p-8" style={{ animationDelay: '120ms' }}>
            <span className="text-sm font-semibold text-muted">계약서 위험 점수 예시</span>
            <ScoreGauge score={58} level="medium" />
            <p className="text-center text-xs leading-relaxed text-muted">
              위험 점수가 높을수록 서명 전 검토가 더 필요한 조항이 많다는 뜻입니다.
            </p>
          </div>
        </div>
      </section>

      <section className="container-page py-4">
        <div className="grid gap-5 sm:grid-cols-3">
          {FEATURES.map((f) => (
            <div key={f.title} className="card p-6">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  {f.icon}
                </svg>
              </div>
              <h3 className="mt-4 font-display text-lg font-bold text-ink">{f.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-muted">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <RecentScansPreview />

      <section className="container-page py-16">
        <div className="card flex flex-col items-center gap-4 bg-primary px-8 py-14 text-center">
          <h2 className="font-display text-2xl font-extrabold text-white sm:text-3xl">
            서명하기 전에, 먼저 확인하세요
          </h2>
          <p className="max-w-md text-sm text-primary-light/90">
            근로계약서, 프리랜서 용역계약서, 임대차계약서 등 어떤 계약서든 업로드하면 AI가
            핵심을 짚어드립니다.
          </p>
          <Link
            href="/upload"
            className="focus-ring mt-2 rounded-full bg-white px-7 py-3.5 text-sm font-semibold text-primary-dark transition hover:bg-primary-tint"
          >
            지금 계약서 분석하기
          </Link>
        </div>
      </section>

      <footer className="border-t border-black/5 py-8 text-center text-xs text-muted">
        본 서비스는 정보 제공 목적이며 법률 자문을 대체하지 않습니다. 중요한 계약은 변호사 등
        전문가의 검토를 받으세요.
      </footer>
    </div>
  );
}
