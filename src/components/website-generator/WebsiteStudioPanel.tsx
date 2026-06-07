import { useEffect, useState } from 'react';
import { Loader2, Lock, Rocket, X } from 'lucide-react';
import { cn } from '../../lib/utils';
import { ProgressPanel } from './ProgressPanel';
import { FileTreePanel } from './FileTreePanel';
import { CodeTypingPanel } from './CodeTypingPanel';
import { PricingScreen } from './PricingScreen';
import { DeployedScreen } from './DeployedScreen';
import { useGenerationEngine } from './useGenerationEngine';
import { MOCK_FILES } from './mockData';

interface Props {
  onClose: () => void;
}

export function WebsiteStudioPanel({ onClose }: Props) {
  const engine = useGenerationEngine();
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
  const viewFile = viewIndex >= 0 ? MOCK_FILES[viewIndex] : undefined;
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
      {/* 브라우저 크롬바 */}
      <div className="flex items-center gap-3 border-b border-slate-700 bg-slate-800 px-4 py-2.5">
        <div className="flex gap-1.5">
          <span className="h-3 w-3 rounded-full bg-red-400" />
          <span className="h-3 w-3 rounded-full bg-amber-400" />
          <span className="h-3 w-3 rounded-full bg-emerald-400" />
        </div>
        <div className="flex flex-1 items-center gap-2 rounded-md bg-slate-900/70 px-3 py-1 text-xs text-slate-400">
          <Lock className="h-3 w-3 text-emerald-500" />
          realconnect.app/studio
        </div>
        {step === 'building' && (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-700 px-2.5 py-1 text-xs text-slate-300">
            <Loader2 className="h-3 w-3 animate-spin text-sky-400" />
            생성 중
          </span>
        )}
        <button
          onClick={handleClose}
          className="rounded-md p-1 text-slate-400 hover:bg-slate-700 hover:text-slate-100"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* 본문 */}
      <div className="relative flex-1 overflow-hidden">
        {inWorkbench && (
          <div className="grid h-full grid-cols-[260px_200px_1fr] divide-x divide-slate-700">
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

        {step === 'pricing' && <PricingScreen onSelect={engine.selectPlanAndBuild} />}

        {step === 'deploying' && (
          <div className="grid h-full place-items-center bg-white">
            <div className="text-center">
              <Loader2 className="mx-auto h-10 w-10 animate-spin text-brand-600" />
              <p className="mt-4 font-semibold text-slate-800">배포 중입니다…</p>
              <p className="mt-1 text-sm text-slate-500">
                도메인 연결 · 빌드 · CDN 업로드를 진행하고 있어요.
              </p>
            </div>
          </div>
        )}

        {step === 'deployed' && <DeployedScreen onReset={engine.reset} />}
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
