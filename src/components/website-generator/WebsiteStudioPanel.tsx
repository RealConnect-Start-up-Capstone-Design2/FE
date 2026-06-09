import { useEffect, useMemo, useState } from 'react';
import { Check, Loader2, Rocket, X } from 'lucide-react';
import { cn } from '../../lib/utils';
import { DEPLOYING_MS } from '../../config';
import { ProgressPanel } from './ProgressPanel';
import { FileTreePanel } from './FileTreePanel';
import { CodeTypingPanel } from './CodeTypingPanel';
import { PricingScreen } from './PricingScreen';
import { DeployedScreen } from './DeployedScreen';
import { useGenerationEngine } from './useGenerationEngine';
import { buildMockFiles } from './mockData';
import { useCrmContext } from './useCrmContext';

interface Props {
  onClose: () => void;
}

export function WebsiteStudioPanel({ onClose }: Props) {
  const ctx = useCrmContext();
  // 로그인 계정 기준으로 "생성되는 파일"을 만든다 (식별 정보가 계정 따라 들어감)
  const files = useMemo(() => buildMockFiles(ctx), [ctx]);
  const engine = useGenerationEngine(files);
  const { step, openPricingFresh, reset } = engine;
  // 사용자가 탐색기에서 직접 고른 파일. null = 라이브(현재 작성 파일 따라감)
  const [selectedFileIndex, setSelectedFileIndex] = useState<number | null>(null);

  // 패널이 마운트되면 결제 화면부터 시작
  useEffect(() => {
    openPricingFresh();
  }, [openPricingFresh]);

  const inWorkbench = step === 'building' || step === 'done';
  const canDeploy = step === 'done';

  const viewIndex = selectedFileIndex ?? engine.currentFileIndex;
  const viewFile = viewIndex >= 0 ? files[viewIndex] : undefined;
  const isLiveView = step === 'building' && viewIndex === engine.currentFileIndex;
  const viewContent = isLiveView ? engine.typedContent : viewFile ? viewFile.content : '';
  const isHistory =
    step === 'building' &&
    selectedFileIndex !== null &&
    selectedFileIndex !== engine.currentFileIndex;

  function handleClose() {
    reset();
    setSelectedFileIndex(null);
    onClose();
  }

  return (
    <div className="flex h-full w-full flex-col overflow-hidden rounded-xl border border-slate-700 bg-slate-800 shadow-2xl">
      {/* 본문 */}
      <div className="relative flex-1 overflow-hidden">
        {/* 닫기 — 툴바 없이 우상단에 떠 있게 */}
        <button
          onClick={handleClose}
          className="absolute right-3 top-3 z-20 rounded-md bg-slate-900/60 p-1 text-slate-400 backdrop-blur transition hover:bg-slate-900 hover:text-slate-100"
        >
          <X className="h-4 w-4" />
        </button>

        {inWorkbench && (
          <div className="grid h-full grid-cols-[260px_200px_minmax(0,1fr)] divide-x divide-slate-700">
            {/* 진행상황 */}
            <ProgressPanel
              currentFileIndex={engine.currentFileIndex}
              builtCount={engine.builtCount}
              totalCount={engine.totalCount}
              done={canDeploy}
            />
            {/* 파일트리 */}
            <FileTreePanel
              currentFileIndex={engine.currentFileIndex}
              activeIndex={viewIndex}
              onSelectFile={(i) =>
                setSelectedFileIndex(i === engine.currentFileIndex ? null : i)
              }
            />
            {/* 코드 */}
            <CodeTypingPanel
              file={viewFile}
              content={viewContent}
              typing={isLiveView}
              writeLine={engine.currentWriteLine}
              isHistory={isHistory}
              onBackToLive={() => setSelectedFileIndex(null)}
            />
          </div>
        )}

        {/* (테스트용) 숨겨진 스킵 — 우하단 모서리 투명 버튼, 코드 생성 중에만 */}
        {step === 'building' && (
          <button
            onClick={engine.skipToEnd}
            aria-label="건너뛰기"
            title="건너뛰기"
            className="absolute bottom-0 right-0 z-30 h-8 w-8 cursor-default opacity-0"
          />
        )}

        {step === 'pricing' && <PricingScreen onSelect={engine.selectPlanAndBuild} />}

        {step === 'preparing' && <AnalyzingScreen />}

        {step === 'deploying' && (
          <DeployingScreen durationMs={DEPLOYING_MS} onSkip={engine.skipDeploy} />
        )}

        {step === 'deployed' && (
          <DeployedScreen siteUrl={ctx.deployedSiteUrl} onReset={engine.reset} />
        )}
      </div>

      {/* 하단 상태바 (작업대 화면에서만) */}
      {inWorkbench && (
        <div className="flex items-center justify-between border-t border-slate-700 bg-slate-800 px-5 py-3">
          <div>
            <p className="text-sm font-medium text-slate-200">
              {canDeploy
                ? '배포 준비 완료 · ' + engine.totalCount + '개 파일 생성됨'
                : '코드 생성 중 — ' + engine.builtCount + '/' + engine.totalCount + ' 파일'}
            </p>
            <p className="text-xs text-slate-400">
              {canDeploy
                ? '이제 웹사이트를 배포할 수 있습니다.'
                : 'AI가 매물 데이터를 분석해 웹사이트를 구현하고 있습니다.'}
            </p>
          </div>
          <button
            onClick={engine.deploy}
            disabled={!canDeploy}
            className={cn(
              'inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold transition',
              canDeploy
                ? 'bg-brand-600 text-white hover:bg-brand-700'
                : 'cursor-not-allowed bg-slate-700 text-slate-500',
            )}
          >
            <Rocket className="h-4 w-4" />
            앱 배포
          </button>
        </div>
      )}
    </div>
  );
}

/** 배포 연출 — 빌드·CDN 업로드·도메인 연결을 진행률 + 단계 로그로 (약 3분). 우하단 숨김 스킵. */
function DeployingScreen({
  durationMs,
  onSkip,
}: {
  durationMs: number;
  onSkip: () => void;
}) {
  const steps = [
    '프로젝트 빌드 (vite build)',
    '정적 자산 번들 · 최적화',
    '이미지 · 폰트 압축',
    'CDN 엣지 서버에 업로드',
    '도메인 연결 · SSL 인증서 발급',
    '캐시 무효화 · 헬스 체크',
    '배포 마무리',
  ];
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const t0 = performance.now();
    const id = setInterval(() => {
      const p = Math.min(1, (performance.now() - t0) / durationMs);
      setProgress(p);
      if (p >= 1) clearInterval(id);
    }, 100);
    return () => clearInterval(id);
  }, [durationMs]);

  const pct = Math.round(progress * 100);
  const active = Math.min(steps.length - 1, Math.floor(progress * steps.length));

  return (
    <div className="relative grid h-full place-items-center bg-white">
      <div className="w-full max-w-md px-8">
        <div className="flex items-center gap-2 text-slate-800">
          <Loader2 className="h-5 w-5 animate-spin text-brand-600" />
          <p className="text-base font-semibold">웹사이트를 배포하고 있습니다</p>
        </div>
        <p className="mt-1 text-sm text-slate-500">
          빌드 · CDN 업로드 · 도메인 연결을 실제 서비스처럼 진행합니다.
        </p>

        <div className="mt-5">
          <div className="mb-1.5 flex items-center justify-between text-xs">
            <span className="font-medium text-slate-500">배포 진행률</span>
            <span className="font-semibold text-brand-600">{pct}%</span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-brand-600 transition-all duration-200"
              style={{ width: pct + '%' }}
            />
          </div>
        </div>

        <div className="mt-5 space-y-2">
          {steps.map((s, idx) => (
            <div
              key={s}
              className={cn(
                'flex items-center gap-2 text-sm transition-colors',
                idx < active
                  ? 'text-slate-400'
                  : idx === active
                    ? 'font-medium text-slate-800'
                    : 'text-slate-300',
              )}
            >
              {idx < active ? (
                <Check className="h-4 w-4 shrink-0 text-emerald-500" />
              ) : idx === active ? (
                <Loader2 className="h-4 w-4 shrink-0 animate-spin text-brand-600" />
              ) : (
                <span className="h-4 w-4 shrink-0" />
              )}
              <span>{s}</span>
            </div>
          ))}
        </div>
      </div>

      {/* (테스트용) 숨겨진 스킵 — 우하단 모서리 투명 */}
      <button
        onClick={onSkip}
        aria-label="배포 건너뛰기"
        title="배포 건너뛰기"
        className="absolute bottom-0 right-0 z-30 h-8 w-8 cursor-default opacity-0"
      />
    </div>
  );
}

/** 플랜 선택/결제 후 코드 생성 직전 — "AI가 매물을 분석하는" 로딩 화면 */
function AnalyzingScreen() {
  const steps = [
    '매물 데이터를 분석하고 있어요',
    '지역·단지 정보를 정리하고 있어요',
    '디자인 시스템을 고르고 있어요',
    '페이지 구조를 설계하고 있어요',
  ];
  const [i, setI] = useState(0);
  useEffect(() => {
    const id = setInterval(
      () => setI((p) => (p < steps.length - 1 ? p + 1 : p)),
      2400,
    );
    return () => clearInterval(id);
  }, [steps.length]);

  return (
    <div className="grid h-full place-items-center bg-slate-900">
      <div className="w-full max-w-sm px-8">
        <div className="flex items-center justify-center gap-2 text-slate-100">
          <Loader2 className="h-5 w-5 animate-spin text-brand-400" />
          <p className="text-base font-semibold">AI가 웹사이트를 준비하고 있습니다</p>
        </div>
        <div className="mt-6 space-y-2.5">
          {steps.map((s, idx) => (
            <div
              key={s}
              className={cn(
                'flex items-center gap-2 text-sm transition-colors',
                idx < i
                  ? 'text-emerald-400'
                  : idx === i
                    ? 'text-slate-200'
                    : 'text-slate-600',
              )}
            >
              {idx < i ? (
                <Check className="h-4 w-4 shrink-0" />
              ) : idx === i ? (
                <Loader2 className="h-4 w-4 shrink-0 animate-spin text-brand-400" />
              ) : (
                <span className="h-4 w-4 shrink-0" />
              )}
              <span>{s}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
