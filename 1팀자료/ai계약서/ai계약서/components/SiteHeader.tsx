import Link from 'next/link';

export default function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-black/5 bg-white/80 backdrop-blur-md">
      <div className="container-page flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2 focus-ring">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-white">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                d="M8 1L14 4V8C14 11.3 11.3 14.2 8 15C4.7 14.2 2 11.3 2 8V4L8 1Z"
                fill="white"
              />
              <path
                d="M5.5 8.2L7.1 9.8L10.5 6"
                stroke="#4B82F4"
                strokeWidth="1.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
          <span className="font-display text-lg font-bold tracking-tight text-ink">
            계약서 검사
          </span>
        </Link>
        <nav className="hidden items-center gap-8 text-sm font-medium text-ink-soft sm:flex">
          <Link href="/" className="transition hover:text-primary">
            홈
          </Link>
          <Link href="/history" className="transition hover:text-primary">
            검사 이력
          </Link>
        </nav>
        <Link
          href="/upload"
          className="focus-ring rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-card transition hover:bg-primary-dark"
        >
          분석 시작하기
        </Link>
      </div>
    </header>
  );
}
