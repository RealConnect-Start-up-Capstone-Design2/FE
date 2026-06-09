import { useEffect, useRef } from 'react';
import { Check, Loader2, Sparkles } from 'lucide-react';
import { MOCK_FILES, taskForFile } from './mockData';
import { useCrmContext } from './useCrmContext';

interface Props {
  currentFileIndex: number;
  builtCount: number;
  totalCount: number;
  done: boolean;
}

export function ProgressPanel({ currentFileIndex, builtCount, totalCount, done }: Props) {
  const ctx = useCrmContext();
  const listRef = useRef<HTMLDivElement>(null);

  // 완료된 작업 목록 (현재 작업 직전까지)
  const completed = MOCK_FILES.slice(0, Math.max(0, builtCount));
  const current = currentFileIndex >= 0 ? MOCK_FILES[currentFileIndex] : undefined;
  const percent = Math.round((builtCount / totalCount) * 100);

  // 새 작업이 생길 때마다 맨 아래로 스크롤
  useEffect(() => {
    const el = listRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [builtCount, currentFileIndex]);

  return (
    <div className="flex h-full flex-col bg-slate-50">
      {/* 헤더 */}
      <div className="border-b border-slate-200 px-5 py-4">
        <div className="flex items-center gap-2">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-brand-600 text-white">
            <Sparkles className="h-4 w-4" />
          </span>
          <div>
            <p className="text-sm font-bold text-slate-900">RealConnect AI</p>
            <p className="text-xs text-slate-500">{ctx.agencyName} 웹사이트 생성</p>
          </div>
        </div>

        {/* 진행률 바 */}
        <div className="mt-4">
          <div className="mb-1.5 flex items-center justify-between text-xs">
            <span className="font-medium text-slate-600">
              {done ? '생성 완료' : '생성 중'}
            </span>
            <span className="font-semibold text-brand-600">{percent}%</span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-slate-200">
            <div
              className="h-full rounded-full bg-brand-600 transition-all duration-300"
              style={{ width: percent + '%' }}
            />
          </div>
          <p className="mt-1.5 text-xs text-slate-400">
            {builtCount} / {totalCount} 파일
          </p>
        </div>
      </div>

      {/* 작업 narration 목록 */}
      <div ref={listRef} className="code-scroll flex-1 space-y-1 overflow-y-auto px-3 py-3">
        {completed.map((file) => (
          <div
            key={file.path}
            className="flex items-start gap-2 rounded-lg px-2 py-1.5 text-sm text-slate-500"
          >
            <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
            <span>{taskForFile(file.path)}</span>
          </div>
        ))}

        {!done && current && (
          <div className="flex items-start gap-2 rounded-lg bg-brand-50 px-2 py-1.5 text-sm font-medium text-slate-800">
            <Loader2 className="mt-0.5 h-4 w-4 shrink-0 animate-spin text-brand-600" />
            <span>
              {taskForFile(current.path)}
              <span className="caret-blink ml-0.5">…</span>
            </span>
          </div>
        )}

        {done && (
          <div className="mt-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-center">
            <Check className="mx-auto h-6 w-6 text-emerald-500" />
            <p className="mt-2 text-sm font-semibold text-emerald-800">
              웹사이트 생성이 완료됐어요
            </p>
            <p className="mt-1 text-xs text-emerald-600">
              아래 ‘앱 배포’ 버튼으로 사이트를 공개할 수 있어요.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
