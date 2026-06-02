import { CheckCircle2, Circle, Loader2 } from 'lucide-react';
import { cn } from '../../lib/utils';
import {
  BUILD_PHASES,
  firstFileOfPhase,
  lastFileOfPhase,
  MOCK_FILES,
  PLAN_ITEMS,
} from './mockData';
import type { GenerationStep } from './types';

type StepStatus = 'pending' | 'current' | 'done';

interface Props {
  step: GenerationStep;
  planVisible: boolean;
  currentPhaseIndex: number;
  currentFileIndex: number;
  builtCount: number;
  totalCount: number;
}

const STEP_ORDER: GenerationStep[] = ['preparing', 'planning', 'building'];
const FINISHED = ['done', 'pricing', 'deploying', 'deployed'];

function statusOf(target: GenerationStep, step: GenerationStep): StepStatus {
  if (FINISHED.includes(step)) return 'done';
  const cur = STEP_ORDER.indexOf(step);
  const t = STEP_ORDER.indexOf(target);
  if (t < cur) return 'done';
  if (t === cur) return 'current';
  return 'pending';
}

function StepIcon({ status }: { status: StepStatus }) {
  if (status === 'done') return <CheckCircle2 className="h-5 w-5 text-brand-600" />;
  if (status === 'current')
    return <Loader2 className="h-5 w-5 animate-spin text-brand-600" />;
  return <Circle className="h-5 w-5 text-slate-300" />;
}

export function GenerationStepsPanel({
  step,
  planVisible,
  currentPhaseIndex,
  currentFileIndex,
  builtCount,
  totalCount,
}: Props) {
  const building = step === 'building' || FINISHED.includes(step);
  const allDone = FINISHED.includes(step);

  const labels: { id: GenerationStep; label: string }[] = [
    { id: 'preparing', label: '작업 환경 준비 중' },
    { id: 'planning', label: '구현 계획 정리 중' },
    {
      id: 'building',
      label: '화면과 기능 구현 중 — ' + builtCount + '/' + totalCount + '단계',
    },
  ];

  return (
    <div className="flex h-full flex-col gap-4 overflow-y-auto p-5">
      <div className="space-y-2">
        {labels.map(({ id, label }) => {
          const status = statusOf(id, step);
          return (
            <div
              key={id}
              className={cn(
                'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition',
                status === 'current' && 'animate-pulse bg-brand-50 font-semibold text-slate-900',
                status === 'done' && 'text-slate-800',
                status === 'pending' && 'text-slate-300',
              )}
            >
              <StepIcon status={status} />
              <span>{label}</span>
            </div>
          );
        })}
      </div>

      {/* 계획 단계: 계획 카드 */}
      {planVisible && !building && (
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="mb-3 text-xs font-bold uppercase tracking-wide text-brand-600">
            구현 계획
          </p>
          <ul className="space-y-3">
            {PLAN_ITEMS.map((item, i) => (
              <li key={item.title} className="flex gap-3">
                <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-brand-100 text-[11px] font-bold text-brand-700">
                  {i + 1}
                </span>
                <div>
                  <p className="text-sm font-medium text-slate-800">{item.title}</p>
                  <p className="text-xs text-slate-500">{item.detail}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* 빌드 단계: phase별 파일 체크리스트 (piko 스타일) */}
      {building && (
        <div className="space-y-3">
          {BUILD_PHASES.map((phase, pIdx) => {
            if (pIdx > currentPhaseIndex) return null; // 아직 시작 안 한 phase는 숨김
            const first = firstFileOfPhase(pIdx);
            const last = lastFileOfPhase(pIdx);
            const phaseDone = allDone || builtCount > last;
            const files = MOCK_FILES.slice(first, last + 1);

            return (
              <div
                key={phase.title}
                className="animate-[fadeIn_0.3s_ease] rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
              >
                <div className="mb-3 flex items-center gap-2">
                  {phaseDone ? (
                    <CheckCircle2 className="h-4 w-4 text-brand-600" />
                  ) : (
                    <Loader2 className="h-4 w-4 animate-spin text-brand-600" />
                  )}
                  <p className="text-sm font-semibold text-slate-800">
                    Phase {pIdx + 1}. {phase.title}
                    <span className="ml-1 font-normal text-slate-400">
                      {phaseDone ? '완료' : '구현 중'}
                    </span>
                  </p>
                </div>
                <ul className="space-y-1.5">
                  {files.map((file, i) => {
                    const g = first + i;
                    const done = allDone || g < builtCount;
                    const active = !done && g === currentFileIndex;
                    return (
                      <li
                        key={file.path}
                        className={cn(
                          'flex items-center justify-between gap-2 rounded-md px-1.5 py-1 text-xs',
                          active && 'bg-brand-50',
                        )}
                      >
                        <span className="flex min-w-0 items-center gap-1.5">
                          {done ? (
                            <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-emerald-500" />
                          ) : active ? (
                            <Loader2 className="h-3.5 w-3.5 shrink-0 animate-spin text-brand-600" />
                          ) : (
                            <Circle className="h-3.5 w-3.5 shrink-0 text-slate-300" />
                          )}
                          <span
                            className={cn(
                              'truncate',
                              done || active ? 'text-slate-700' : 'text-slate-400',
                            )}
                          >
                            {file.name}
                          </span>
                        </span>
                        {(done || active) && (
                          <span className="shrink-0 font-medium text-emerald-600">
                            +{file.linesAdded}
                          </span>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
