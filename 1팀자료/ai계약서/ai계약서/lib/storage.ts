'use client';

import { AnalysisRecord } from './types';

const STORAGE_KEY = 'contract-analyzer:history';
const PENDING_KEY = 'contract-analyzer:pending-file';

export function getHistory(): AnalysisRecord[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as AnalysisRecord[];
    return parsed.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
  } catch {
    return [];
  }
}

export function getRecord(id: string): AnalysisRecord | null {
  return getHistory().find((r) => r.id === id) ?? null;
}

export function saveRecord(record: AnalysisRecord): void {
  if (typeof window === 'undefined') return;
  const history = getHistory();
  const next = [record, ...history.filter((r) => r.id !== record.id)].slice(0, 50);
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
}

export function deleteRecord(id: string): void {
  if (typeof window === 'undefined') return;
  const next = getHistory().filter((r) => r.id !== id);
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
}

// Used to pass the just-selected File object from the upload page to the
// analyzing page without a page reload (File objects can't be serialized
// into localStorage, so we keep it in memory via a module-level holder).
let pendingFile: File | null = null;

export function setPendingFile(file: File): void {
  pendingFile = file;
}

export function takePendingFile(): File | null {
  const f = pendingFile;
  pendingFile = null;
  return f;
}
