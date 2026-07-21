'use client';

import { useCallback, useRef, useState } from 'react';

const MAX_SIZE_MB = 20;
const ACCEPTED_EXTENSIONS = ['.pdf', '.docx'];

function isAccepted(file: File): boolean {
  const name = file.name.toLowerCase();
  return ACCEPTED_EXTENSIONS.some((ext) => name.endsWith(ext));
}

function formatSize(bytes: number): string {
  const mb = bytes / (1024 * 1024);
  return `${mb.toFixed(mb < 10 ? 2 : 1)}MB`;
}

export default function UploadDropzone({
  onFileSelected
}: {
  onFileSelected: (file: File) => void;
}) {
  const [isDragging, setIsDragging] = useState(false);
  const [selected, setSelected] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(
    (file: File) => {
      setError(null);
      if (!isAccepted(file)) {
        setError('PDF 또는 DOCX 파일만 업로드할 수 있습니다.');
        setSelected(null);
        return;
      }
      if (file.size > MAX_SIZE_MB * 1024 * 1024) {
        setError(`파일 크기는 최대 ${MAX_SIZE_MB}MB까지 가능합니다.`);
        setSelected(null);
        return;
      }
      setSelected(file);
      onFileSelected(file);
    },
    [onFileSelected]
  );

  return (
    <div className="w-full">
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          const file = e.dataTransfer.files?.[0];
          if (file) handleFile(file);
        }}
        onClick={() => inputRef.current?.click()}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') inputRef.current?.click();
        }}
        className={`focus-ring flex cursor-pointer flex-col items-center justify-center gap-4 rounded-card border-2 border-dashed px-6 py-14 text-center transition ${
          isDragging
            ? 'border-primary bg-primary-tint'
            : 'border-primary/25 bg-white hover:border-primary/50 hover:bg-primary-tint/60'
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".pdf,.docx"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFile(file);
          }}
        />
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
            <path
              d="M12 15V4M12 4L7.5 8.5M12 4L16.5 8.5"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M4 15V17.5C4 18.9 5.1 20 6.5 20H17.5C18.9 20 20 18.9 20 17.5V15"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        {selected ? (
          <div>
            <p className="font-semibold text-ink">{selected.name}</p>
            <p className="mt-1 text-sm text-muted">{formatSize(selected.size)} · 업로드 준비 완료</p>
          </div>
        ) : (
          <div>
            <p className="font-semibold text-ink">
              계약서 파일을 이곳에 끌어다 놓거나 클릭해서 선택하세요
            </p>
            <p className="mt-1 text-sm text-muted">PDF, DOCX · 최대 {MAX_SIZE_MB}MB</p>
          </div>
        )}
      </div>
      {error && (
        <p className="mt-3 flex items-center gap-1.5 text-sm font-medium text-risk-high">
          <svg width="14" height="14" viewBox="0 0 12 12" fill="none">
            <circle cx="6" cy="6" r="5" stroke="currentColor" strokeWidth="1.2" />
            <path d="M6 3.5V6.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
            <circle cx="6" cy="8.3" r="0.6" fill="currentColor" />
          </svg>
          {error}
        </p>
      )}
    </div>
  );
}
