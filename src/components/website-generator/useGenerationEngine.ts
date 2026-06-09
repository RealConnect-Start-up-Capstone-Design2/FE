import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { TARGET_DURATION_MS, DEPLOYING_MS, PREPARE_MS } from '../../config';
import { MOCK_FILES } from './mockData';
import type { GenerationStep, MockFile } from './types';

const TICK_MS = 16; // ~60fps

/**
 * 파일별 "생각하는 멈춤" 가중치 — 타이핑량 대비 비율 + 인덱스로 변주(랜덤 금지).
 * 파일을 다 쓴 뒤 잠깐 멈춰 다음 파일로 넘어가게 해서 완급을 준다.
 */
function pauseWeight(content: string, i: number) {
  const wobble = 0.6 + (0.8 * ((i * 7) % 5)) / 4; // 0.6~1.4 사이로 파일마다 다르게
  return content.length * 0.22 * wobble;
}

/** 토큰 단위로 쪼개기 — 실제 LLM 스트리밍처럼 단어·기호·공백을 토큰으로, 긴 식별자는 더 잘게 */
function tokenize(content: string): string[] {
  const raw = content.match(/\n|[ \t]+|[A-Za-z0-9_$]+|[^\sA-Za-z0-9_$]/g) ?? [];
  const out: string[] = [];
  for (const t of raw) {
    if (t.length > 6 && /^[A-Za-z0-9_$]+$/.test(t)) {
      for (let i = 0; i < t.length; i += 4) out.push(t.slice(i, i + 4));
    } else {
      out.push(t);
    }
  }
  return out;
}

/** 결정적 의사난수 — 파일마다 같은 리듬을 재현해 리렌더에도 안 흔들리게 */
function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

interface TypingPlan {
  /** 토큰 i까지의 누적 글자 수 */
  cumChars: number[];
  /** 토큰 i가 화면에 나타나는 시점 (0~1, 파일 타이핑 구간 기준) */
  cumTimeNorm: number[];
}

/**
 * 실제 AI가 코드를 스트리밍하듯, 파일마다 "불규칙한" 토큰 타이밍 계획을 만든다.
 * - 큰 흐름: 빠르게 쓰는 구간 ↔ 천천히 쓰는 구간 (tempo)
 * - 토큰별 미세한 빠름/느림 (지터)
 * - 줄바꿈·괄호·세미콜론 같은 구조 경계에서의 짧은 정지
 * - 가끔 길게 멈췄다가 다시 시작 (생각하는 척)
 */
function buildTypingPlan(content: string, seed: number): TypingPlan {
  const tokens = tokenize(content);
  const rnd = mulberry32(seed + 1);
  const tempoPhase = rnd() * Math.PI * 2;
  const tempoCycles = 2 + Math.floor(rnd() * 3); // 파일 안에서 빠름↔느림 큰 흐름 2~4회
  const cumChars: number[] = [];
  const cumTime: number[] = [];
  let chars = 0;
  let time = 0;
  let sincePause = 0;
  const n = tokens.length;
  for (let i = 0; i < n; i++) {
    const tok = tokens[i];
    chars += tok.length;
    let gap = 16 + tok.length * 11; // 기본 입력 시간(글자 수 비례)
    const tempo = 1 + 0.7 * Math.sin(tempoPhase + (i / n) * Math.PI * 2 * tempoCycles);
    gap *= tempo; // 빠른 구간/느린 구간
    gap *= 0.5 + rnd() * 1.1; // 토큰별 지터
    if (tok === '\n') gap += 25 + rnd() * 80;
    else if (tok === '{' || tok === '(' || tok === '[') gap += 50 + rnd() * 120;
    else if (tok === ';' || tok === '}') gap += 35 + rnd() * 120;
    sincePause++;
    if (sincePause > 6 && rnd() < 0.13) {
      gap += 350 + rnd() * 700; // 가끔 멈췄다가 다시 시작
      sincePause = 0;
    }
    time += gap;
    cumChars.push(chars);
    cumTime.push(time);
  }
  const total = time || 1;
  return { cumChars, cumTimeNorm: cumTime.map((t) => t / total) };
}

/**
 * 각 파일의 타이핑 구간[start, typeEnd]과 그 뒤 멈춤까지 포함한 종료[end]를 계산.
 * 타이핑은 코드 길이 비례, 멈춤은 pauseWeight 비례 — 전체 합이 buildMs가 되도록 정규화.
 */
function buildSchedule(files: MockFile[], buildMs: number) {
  const typeW = files.map((f) => f.content.length);
  const pauseW = files.map((f, i) => pauseWeight(f.content, i));
  const total = typeW.reduce((a, b) => a + b, 0) + pauseW.reduce((a, b) => a + b, 0);
  let acc = 0;
  return files.map((_, i) => {
    const start = acc;
    acc += (typeW[i] / total) * buildMs;
    const typeEnd = acc;
    acc += (pauseW[i] / total) * buildMs;
    return { start, typeEnd, end: acc };
  });
}

interface FileMeta {
  content: string;
  totalLines: number;
  plan: TypingPlan;
}

function buildFileMeta(file: MockFile, index: number): FileMeta {
  return {
    content: file.content,
    totalLines: file.content.split('\n').length,
    plan: buildTypingPlan(file.content, (index + 1) * 0x9e3779b1),
  };
}

/** 표시 텍스트 기준 현재 작성 중인 줄(에디터 스크롤·캐럿용) */
function lineAt(text: string): number {
  let n = 0;
  for (let i = 0; i < text.length; i++) if (text.charCodeAt(i) === 10) n++;
  return n;
}

/** 파일 타이핑 구간 진행(frac 0~1)에서 지금까지 나타난 글자 수 (토큰 계획 기준, 이진탐색) */
function revealedChars(plan: TypingPlan, frac: number): number {
  const { cumTimeNorm, cumChars } = plan;
  const n = cumTimeNorm.length;
  if (n === 0 || frac <= 0) return 0;
  if (frac >= 1) return cumChars[n - 1];
  let lo = 0;
  let hi = n - 1;
  let ans = -1;
  while (lo <= hi) {
    const mid = (lo + hi) >> 1;
    if (cumTimeNorm[mid] <= frac) {
      ans = mid;
      lo = mid + 1;
    } else {
      hi = mid - 1;
    }
  }
  return ans >= 0 ? cumChars[ans] : 0;
}

/**
 * 파일 진행도(0~1)에 따라 지금까지 작성된 텍스트와 현재 작성 줄 위치를 조립.
 * 토큰 단위로 나타나서 "AI가 코드를 스트리밍하듯" 보이게 한다(버스트·멈춤 포함).
 */
function assemble(meta: FileMeta, frac: number) {
  const c = revealedChars(meta.plan, frac);
  return { text: meta.content.slice(0, c), writeLine: lineAt(meta.content.slice(0, c)) };
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
  /** (테스트용) 코드 생성 연출을 즉시 끝내고 배포 준비 상태로 점프 */
  skipToEnd: () => void;
  deploy: () => void;
  /** (테스트용) 배포 연출을 즉시 끝내고 배포 완료로 점프 */
  skipDeploy: () => void;
}

export function useGenerationEngine(files: MockFile[] = MOCK_FILES): GenerationEngine {
  const fileMetas = useMemo(() => files.map(buildFileMeta), [files]);

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
    const schedule = buildSchedule(files, buildMs);
    const buildStart = performance.now();

    intervalRef.current = setInterval(() => {
      const elapsed = performance.now() - buildStart;

      if (elapsed >= buildMs) {
        const last = files.length - 1;
        setCurrentFileIndex(last);
        setBuiltCount(files.length);
        setTypedContent(files[last].content);
        setCurrentWriteLine(fileMetas[last].totalLines - 1);
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
      // 타이핑 구간이면 가감속 적용, 멈춤 구간이면 100%로 완성된 채 대기
      const frac = Math.min(1, Math.max(0, (elapsed - seg.start) / (seg.typeEnd - seg.start)));
      const { text, writeLine } = assemble(fileMetas[idx], frac);

      setCurrentFileIndex(idx);
      setBuiltCount(schedule.filter((s) => s.typeEnd <= elapsed).length);
      setTypedContent(text);
      setCurrentWriteLine(writeLine);
    }, TICK_MS);
  }, [files, fileMetas]);

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
      // 선택/결제 후 "AI가 매물을 분석하는" 로딩을 잠깐 보여주고 코드 생성 시작
      setStep('preparing');
      after(PREPARE_MS, () => {
        setStep('building');
        startBuild();
      });
    },
    [after, startBuild],
  );

  const skipToEnd = useCallback(() => {
    clearAll();
    const last = files.length - 1;
    if (last < 0) return;
    setCurrentFileIndex(last);
    setBuiltCount(files.length);
    setTypedContent(files[last].content);
    setCurrentWriteLine(fileMetas[last].totalLines - 1);
    setStep('done');
  }, [clearAll, files, fileMetas]);

  const deploy = useCallback(() => {
    setStep('deploying');
    after(DEPLOYING_MS, () => setStep('deployed'));
  }, [after]);

  const skipDeploy = useCallback(() => {
    clearAll();
    setStep('deployed');
  }, [clearAll]);

  useEffect(() => clearAll, [clearAll]);

  return {
    step,
    currentFileIndex,
    builtCount,
    totalCount: files.length,
    typedContent,
    currentWriteLine,
    selectedPlanId,
    reset,
    openPricingFresh,
    selectPlanAndBuild,
    skipToEnd,
    deploy,
    skipDeploy,
  };
}
