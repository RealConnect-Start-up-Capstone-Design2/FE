import { useCallback, useEffect, useRef, useState } from 'react';
import { TARGET_DURATION_MS, DEPLOYING_MS } from '../../config';
import { MOCK_FILES } from './mockData';
import type { GenerationStep } from './types';

const TICK_MS = 16; // ~60fps

/** 각 파일이 차지하는 시작/종료 오프셋(ms)을 코드 길이 비례로 계산 */
function buildSchedule(buildMs: number) {
  const totalChars = MOCK_FILES.reduce((sum, f) => sum + f.content.length, 0);
  let acc = 0;
  return MOCK_FILES.map((file) => {
    const slice = (file.content.length / totalChars) * buildMs;
    const start = acc;
    acc += slice;
    return { start, end: acc };
  });
}

/**
 * 파일별 "블록 비순차 작성" 메타.
 * 코드를 위에서 아래로 쭉 쓰지 않고, 골격(짝수 블록)을 먼저 깔고
 * 사이(홀수 블록)를 나중에 채우는 순서로 작성해 실제 AI 편집처럼 보이게 한다.
 */
interface FileMeta {
  lines: string[];
  blocks: number[][]; // 각 블록이 가진 라인 인덱스(원래 순서)
  order: number[]; // 작성 순서 (블록 인덱스 순열)
  totalLines: number;
}

function buildFileMeta(content: string): FileMeta {
  const lines = content.split('\n');
  const blocks: number[][] = [];
  let cur: number[] = [];
  lines.forEach((line, i) => {
    cur.push(i);
    if (line.trim() === '' || cur.length >= 6) {
      blocks.push(cur);
      cur = [];
    }
  });
  if (cur.length) blocks.push(cur);

  const idx = blocks.map((_, i) => i);
  const evens = idx.filter((i) => i % 2 === 0);
  const odds = idx.filter((i) => i % 2 === 1);
  const order = [...evens, ...odds]; // 골격 먼저 → 사이 채우기

  return { lines, blocks, order, totalLines: lines.length };
}

const FILE_METAS = MOCK_FILES.map((f) => buildFileMeta(f.content));

/** 파일 진행도(0~1)에 따라 지금까지 작성된 텍스트와 현재 작성 줄 위치를 조립 */
function assemble(meta: FileMeta, progress: number) {
  const targetLines = Math.floor(progress * meta.totalLines);
  let remaining = targetLines;
  const done = new Set<number>();
  let partialBlock = -1;
  let partialCount = 0;

  for (const b of meta.order) {
    const len = meta.blocks[b].length;
    if (remaining >= len) {
      done.add(b);
      remaining -= len;
    } else {
      partialBlock = b;
      partialCount = remaining;
      break;
    }
  }

  const out: string[] = [];
  let writeLine = out.length;
  for (let bi = 0; bi < meta.blocks.length; bi++) {
    if (done.has(bi)) {
      for (const li of meta.blocks[bi]) out.push(meta.lines[li]);
    } else if (bi === partialBlock) {
      for (let k = 0; k < partialCount; k++) out.push(meta.lines[meta.blocks[bi][k]]);
      writeLine = out.length - 1; // 지금 막 쓴 줄
    }
  }
  return { text: out.join('\n'), writeLine: Math.max(0, writeLine) };
}

export interface GenerationEngine {
  step: GenerationStep;
  currentFileIndex: number;
  builtCount: number;
  totalCount: number;
  typedContent: string;
  /** 현재 작성 중인 줄(표시 텍스트 기준 인덱스) — 에디터 스크롤용 */
  currentWriteLine: number;
  selectedPlanId: string | null;
  reset: () => void;
  openPricingFresh: () => void;
  selectPlanAndBuild: (planId: string) => void;
  deploy: () => void;
}

export function useGenerationEngine(): GenerationEngine {
  const [step, setStep] = useState<GenerationStep>('idle');
  const [currentFileIndex, setCurrentFileIndex] = useState(-1);
  const [builtCount, setBuiltCount] = useState(0);
  const [typedContent, setTypedContent] = useState('');
  const [currentWriteLine, setCurrentWriteLine] = useState(0);
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
    const buildMs = TARGET_DURATION_MS;
    const schedule = buildSchedule(buildMs);
    const buildStart = performance.now();

    intervalRef.current = setInterval(() => {
      const elapsed = performance.now() - buildStart;

      if (elapsed >= buildMs) {
        const last = MOCK_FILES.length - 1;
        setCurrentFileIndex(last);
        setBuiltCount(MOCK_FILES.length);
        setTypedContent(MOCK_FILES[last].content);
        setCurrentWriteLine(FILE_METAS[last].totalLines - 1);
        setStep('done');
        if (intervalRef.current !== null) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
        return;
      }

      let idx = 0;
      for (let i = 0; i < schedule.length; i++) {
        if (schedule[i].start <= elapsed) idx = i;
        else break;
      }
      const seg = schedule[idx];
      const progress = Math.min(1, (elapsed - seg.start) / (seg.end - seg.start));
      const { text, writeLine } = assemble(FILE_METAS[idx], progress);

      setCurrentFileIndex(idx);
      setBuiltCount(schedule.filter((s) => s.end <= elapsed).length);
      setTypedContent(text);
      setCurrentWriteLine(writeLine);
    }, TICK_MS);
  }, []);

  const openPricingFresh = useCallback(() => {
    clearAll();
    setCurrentFileIndex(-1);
    setBuiltCount(0);
    setTypedContent('');
    setCurrentWriteLine(0);
    setSelectedPlanId(null);
    setStep('pricing');
  }, [clearAll]);

  const reset = useCallback(() => {
    clearAll();
    setStep('idle');
    setCurrentFileIndex(-1);
    setBuiltCount(0);
    setTypedContent('');
    setCurrentWriteLine(0);
    setSelectedPlanId(null);
  }, [clearAll]);

  const selectPlanAndBuild = useCallback(
    (planId: string) => {
      setSelectedPlanId(planId);
      setCurrentFileIndex(-1);
      setBuiltCount(0);
      setTypedContent('');
      setCurrentWriteLine(0);
      setStep('building');
      startBuild();
    },
    [startBuild],
  );

  const deploy = useCallback(() => {
    setStep('deploying');
    after(DEPLOYING_MS, () => setStep('deployed'));
  }, [after]);

  useEffect(() => clearAll, [clearAll]);

  return {
    step,
    currentFileIndex,
    builtCount,
    totalCount: MOCK_FILES.length,
    typedContent,
    currentWriteLine,
    selectedPlanId,
    reset,
    openPricingFresh,
    selectPlanAndBuild,
    deploy,
  };
}
