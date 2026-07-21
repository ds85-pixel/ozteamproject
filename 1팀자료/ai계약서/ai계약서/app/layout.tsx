import type { Metadata } from 'next';
import { Sora, Inter } from 'next/font/google';
import './globals.css';

const display = Sora({
  subsets: ['latin'],
  weight: ['600', '700', '800'],
  variable: '--font-display'
});

const body = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-body'
});

export const metadata: Metadata = {
  title: '계약서 검사 | AI 계약서 분석',
  description: 'AI가 계약서를 읽고 위험 조항을 찾아드립니다. 서명 전 30초 만에 확인하세요.'
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" className={`${display.variable} ${body.variable}`}>
      <body className="font-body antialiased">{children}</body>
    </html>
  );
}
