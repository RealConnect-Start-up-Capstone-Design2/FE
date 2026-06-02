import { useCallback, useEffect, useRef, useState } from 'react';
import {
  PLANNING_MS,
  PREPARING_MS,
  TARGET_DURATION_MS,
  DEPLOYING_MS,
} from '../../config';
import { MOCK_FILES, lastFileOfPhase, phaseOfFile } from './mockData';
import type { GenerationStep } from './types';

const TICK_MS = 40;

/** 빌드 구간에서 각 파일이 차지하는 시작/종료 오프셋(ms)을 코드 길이 비례로 미리 계산 */
function buildSchedule(buildMs: number) {
  const totalChars = MOCK_FILES.reduce((sum, f) => sum + f.content.length, 0);
  let acc = 0;
  return MOCK_FILES.map((file) => {
    const slice = (file.content.length / totalChars) * buildMs;
    const start = acc;
    acc += slice;
    return { start, end: acc, len: file.content.length };
  });
}

export interface GenerationEngine {
  step: GenerationStep;
  planVisible: boolean;
  /** 트리에 등장한 파일 수 */
  revealedCount: number;
  /** 현재 진행 중인 phase 인덱스 */
  currentPhaseIndex: number;
  /** 현재 타이핑 중인 파일 인덱스 (-1 = 없음) */
  currentFileIndex: number;
  /** 완료된 파일 수 */
  builtCount: number;
  totalCount: number;
  /** 현재 파일의 누적 타이핑 텍스트 */
  typedContent: string;
  selectedPlanId: string | null;
  start: () => void;
  reset: () => void;
  openPricing: () => void;
  deploy: (planId: string) => void;
}

export function useGenerationEngine(): GenerationEngine {
  const [step, setStep] = useState<GenerationStep>('idle');
  const [planVisible, setPlanVisible] = useState(false);
  const [revealedCount, setRevealedCount] = useState(0);
  const [currentPhaseIndex, setCurrentPhaseIndex] = useState(0);
  const [currentFileIndex, setCurrentFileIndex] = useState(-1);
  const [builtCount, setBuiltCount] = useState(0);
  const [typedContent, setTypedContent] = useState('');
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);

  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const clearAll = useCallback(() => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const after = useCallback((ms: number, fn: () => void) => {
    timers.current.push(setTimeout(fn, ms));
  }, []);

  const startBuild = useCallback(() => {
    const buildMs = Math.max(8_000, TARGET_DURATION_MS - PREPARING_MS - PLANNING_MS);
    const schedule = buildSchedule(buildMs);
    const buildStart = performance.now();

    intervalRef.current = setInterval(() => {
      const elapsed = performance.now() - buildStart;

      if (elapsed >= buildMs) {
        // 마지막 파일까지 완전히 채우고 종료
        const last = MOCK_FILES.length - 1;
        setCurrentFileIndex(last);
        setCurrentPhaseIndex(phaseOfFile(last));
        setRevealedCount(MOCK_FILES.length);
        setBuiltCount(MOCK_FILES.length);
        setTypedContent(MOCK_FILES[last].content);
        setStep('done');
        if (intervalRef.current !== null) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
        return;
      }

      // 현재 파일 = start <= elapsed 인 마지막 파일
      let idx = 0;
      for (let i = 0; i < schedule.length; i++) {
        if (schedule[i].start <= elapsed) idx = i;
        else break;
      }
      const seg = schedule[idx];
      const progress = Math.min(1, (elapsed - seg.start) / (seg.end - seg.start));
      const chars = Math.floor(progress * seg.len);

      // phase 단위로 파일을 한꺼번에 등장시켜 "폴더 동시 작업" 느낌을 준다
      const phase = phaseOfFile(idx);
      setCurrentFileIndex(idx);
      setCurrentPhaseIndex(phase);
      setRevealedCount(lastFileOfPhase(phase) + 1);
      setBuiltCount(schedule.filter((s) => s.end <= elapsed).length);
      setTypedContent(MOCK_FILES[idx].content.slice(0, chars));
    }, TICK_MS);
  }, []);

  const start = useCallback(() => {
    clearAll();
    setPlanVisible(false);
    setRevealedCount(0);
    setCurrentPhaseIndex(0);
    setCurrentFileIndex(-1);
    setBuiltCount(0);
    setTypedContent('');
    setSelectedPlanId(null);

    setStep('preparing');
    after(PREPARING_MS, () => {
      setStep('planning');
      setPlanVisible(true);
    });
    after(PREPARING_MS + PLANNING_MS, () => {
      setStep('building');
      startBuild();
    });
  }, [clearAll, after, startBuild]);

  const reset = useCallback(() => {
    clearAll();
    setStep('idle');
    setPlanVisible(false);
    setRevealedCount(0);
    setCurrentPhaseIndex(0);
    setCurrentFileIndex(-1);
    setBuiltCount(0);
    setTypedContent('');
    setSelectedPlanId(null);
  }, [clearAll]);

  const openPricing = useCallback(() => setStep('pricing'), []);

  const deploy = useCallback(
    (planId: string) => {
      setSelectedPlanId(planId);
      setStep('deploying');
      after(DEPLOYING_MS, () => setStep('deployed'));
    },
    [after],
  );

  // 언마운트 시 타이머 정리
  useEffect(() => clearAll, [clearAll]);

  return {
    step,
    planVisible,
    revealedCount,
    currentPhaseIndex,
    currentFileIndex,
    builtCount,
    totalCount: MOCK_FILES.length,
    typedContent,
    selectedPlanId,
    start,
    reset,
    openPricing,
    deploy,
  };
}
