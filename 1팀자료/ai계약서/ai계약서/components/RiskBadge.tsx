import { Severity } from '@/lib/types';

const CONFIG: Record<
  Severity,
  { label: string; bg: string; text: string; icon: React.ReactNode }
> = {
  high: {
    label: '위험도 높음',
    bg: 'bg-risk-highBg',
    text: 'text-risk-high',
    icon: (
      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
        <path d="M6 1L11 10.5H1L6 1Z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
        <path d="M6 4.5V7" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
        <circle cx="6" cy="8.7" r="0.6" fill="currentColor" />
      </svg>
    )
  },
  medium: {
    label: '위험도 보통',
    bg: 'bg-risk-mediumBg',
    text: 'text-risk-medium',
    icon: (
      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
        <circle cx="6" cy="6" r="4.7" stroke="currentColor" strokeWidth="1.3" />
        <path d="M6 3.8V6.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
        <circle cx="6" cy="8.2" r="0.6" fill="currentColor" />
      </svg>
    )
  },
  low: {
    label: '위험도 낮음',
    bg: 'bg-risk-lowBg',
    text: 'text-risk-low',
    icon: (
      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
        <path d="M2.5 6.2L4.8 8.5L9.5 3.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    )
  }
};

export default function RiskBadge({ severity, size = 'md' }: { severity: Severity; size?: 'sm' | 'md' }) {
  const c = CONFIG[severity];
  const sizeCls = size === 'sm' ? 'text-[11px] px-2 py-1' : 'text-xs px-3 py-1.5';
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-semibold ${c.bg} ${c.text} ${sizeCls}`}
    >
      {c.icon}
      {c.label}
    </span>
  );
}
