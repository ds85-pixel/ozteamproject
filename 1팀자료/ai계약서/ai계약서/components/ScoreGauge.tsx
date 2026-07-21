import { RiskLevel } from '@/lib/types';

const LEVEL_LABEL: Record<RiskLevel, string> = {
  high: '위험 등급: 높음',
  medium: '위험 등급: 보통',
  low: '위험 등급: 낮음'
};

const LEVEL_COLOR: Record<RiskLevel, string> = {
  high: '#E24C4B',
  medium: '#EF9D2E',
  low: '#1FA97A'
};

/**
 * risk_score: 0 (few/no risk issues) - 100 (many, severe risk issues).
 * The gauge arc fills proportionally to the score and is colored by risk_level,
 * with the numeric score and a text label always shown alongside — never
 * color alone.
 */
export default function ScoreGauge({
  score,
  level,
  size = 200
}: {
  score: number;
  level: RiskLevel;
  size?: number;
}) {
  const clamped = Math.max(0, Math.min(100, score));
  const radius = 80;
  const circumference = Math.PI * radius; // half circle
  const offset = circumference - (clamped / 100) * circumference;
  const color = LEVEL_COLOR[level];

  return (
    <div className="flex flex-col items-center" style={{ width: size }}>
      <svg viewBox="0 0 200 120" width={size} height={size * 0.6} role="img" aria-label={`위험 점수 ${clamped}점, ${LEVEL_LABEL[level]}`}>
        <path
          d="M 20 100 A 80 80 0 0 1 180 100"
          fill="none"
          stroke="#EAF0FF"
          strokeWidth="16"
          strokeLinecap="round"
        />
        <path
          d="M 20 100 A 80 80 0 0 1 180 100"
          fill="none"
          stroke={color}
          strokeWidth="16"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 1s ease-out' }}
        />
      </svg>
      <div className="-mt-8 flex flex-col items-center">
        <span className="font-display text-4xl font-extrabold text-ink">{clamped}</span>
        <span className="text-xs font-medium text-muted">/ 100점</span>
      </div>
      <span
        className="mt-2 rounded-full px-3 py-1 text-xs font-semibold"
        style={{ backgroundColor: `${color}1A`, color }}
      >
        {LEVEL_LABEL[level]}
      </span>
    </div>
  );
}
