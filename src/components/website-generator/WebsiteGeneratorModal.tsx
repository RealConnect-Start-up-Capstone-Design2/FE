import { useState } from "react";
import { Loader2, Rocket, Sparkles, X } from "lucide-react";
import { cn } from "../../lib/utils";
import { GenerationStepsPanel } from "./GenerationStepsPanel";
import { FileTreePanel } from "./FileTreePanel";
import { CodeTypingPanel } from "./CodeTypingPanel";
import { PricingScreen } from "./PricingScreen";
import { DeployedScreen } from "./DeployedScreen";
import { useGenerationEngine } from "./useGenerationEngine";
import { MOCK_FILES } from "./mockData";

interface Props {
  open: boolean;
  onClose: () => void;
}

const EXAMPLE_PROMPT = "내 매물들로 깔끔한 부동산 중개사무소 웹사이트 만들어줘";

export function WebsiteGeneratorModal({ open, onClose }: Props) {
  const engine = useGenerationEngine();
  const [prompt, setPrompt] = useState(EXAMPLE_PROMPT);
  // 사용자가 탐색기에서 직접 고른 파일. null = 라이브(현재 타이핑 파일 따라감)
  const [selectedFileIndex, setSelectedFileIndex] = useState<number | null>(
    null,
  );

  if (!open) return null;

  const { step } = engine;
  const inWorkbench = ["preparing", "planning", "building", "done"].includes(
    step,
  );
  const canDeploy = step === "done";

  // 지금 코드창에 보여줄 파일: 사용자가 고른 게 있으면 그것, 없으면 현재 진행 파일
  const viewIndex = selectedFileIndex ?? engine.currentFileIndex;
  const viewFile = viewIndex >= 0 ? MOCK_FILES[viewIndex] : undefined;
  // 라이브 = building 중이고, 보고 있는 파일이 현재 타이핑 중인 파일일 때
  const isLiveView =
    step === "building" && viewIndex === engine.currentFileIndex;
  const viewContent = isLiveView
    ? engine.typedContent
    : viewFile
      ? viewFile.content
      : "";
  const isHistory =
    step === "building" &&
    selectedFileIndex !== null &&
    selectedFileIndex !== engine.currentFileIndex;

  function handleStart() {
    setSelectedFileIndex(null);
    engine.start();
  }

  function handleClose() {
    engine.reset();
    setSelectedFileIndex(null);
    setPrompt(EXAMPLE_PROMPT);
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-slate-900/40 p-4 backdrop-blur-sm sm:p-8">
      <div className="mx-auto flex h-full w-full max-w-7xl flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
        {/* 상단 바 */}
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-3">
          <div className="flex items-center gap-2">
            <span className="grid h-7 w-7 place-items-center rounded-lg bg-brand-600 text-white">
              <Sparkles className="h-4 w-4" />
            </span>
            <span className="font-bold text-slate-900">
              RealConnect · AI 웹사이트 생성
            </span>
          </div>
          <button
            onClick={handleClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* 본문 */}
        <div className="relative flex-1 overflow-hidden">
          {step === "idle" && (
            <div className="grid h-full place-items-center p-6">
              <div className="w-full max-w-xl text-center">
                <h2 className="text-2xl font-bold text-slate-900">
                  어떤 웹사이트를 만들어 드릴까요?
                </h2>
                <p className="mt-2 text-slate-500">
                  내 계정의 매물 정보를 분석해 맞춤 웹사이트를 생성합니다.
                </p>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  rows={3}
                  className="mt-6 w-full resize-none rounded-2xl border border-slate-200 p-4 text-left outline-none focus:border-brand-500"
                  placeholder="예: 내 매물들로 부동산 중개사무소 웹사이트 만들어줘"
                />
                <button
                  onClick={handleStart}
                  disabled={!prompt.trim()}
                  className="mt-4 inline-flex items-center gap-2 rounded-xl bg-brand-600 px-6 py-3 font-semibold text-white transition hover:bg-brand-700 disabled:opacity-40"
                >
                  <Sparkles className="h-5 w-5" />
                  생성하기
                </button>
              </div>
            </div>
          )}

          {inWorkbench && (
            <div className="grid h-full grid-cols-[260px_240px_1fr] divide-x divide-slate-200">
              <GenerationStepsPanel
                step={step}
                planVisible={engine.planVisible}
                currentPhaseIndex={engine.currentPhaseIndex}
                currentFileIndex={engine.currentFileIndex}
                builtCount={engine.builtCount}
                totalCount={engine.totalCount}
              />
              <FileTreePanel
                revealedCount={engine.revealedCount}
                currentFileIndex={engine.currentFileIndex}
                activeIndex={viewIndex}
                onSelectFile={(i) =>
                  setSelectedFileIndex(i === engine.currentFileIndex ? null : i)
                }
              />
              <CodeTypingPanel
                file={viewFile}
                content={viewContent}
                typing={isLiveView}
                isHistory={isHistory}
                onBackToLive={() => setSelectedFileIndex(null)}
              />
            </div>
          )}

          {step === "pricing" && <PricingScreen onSelect={engine.deploy} />}

          {step === "deploying" && (
            <div className="grid h-full place-items-center">
              <div className="text-center">
                <Loader2 className="mx-auto h-10 w-10 animate-spin text-brand-600" />
                <p className="mt-4 font-semibold text-slate-800">
                  배포 중입니다…
                </p>
                <p className="mt-1 text-sm text-slate-500">
                  도메인 연결 · 빌드 · CDN 업로드를 진행하고 있어요.
                </p>
              </div>
            </div>
          )}

          {step === "deployed" && <DeployedScreen onReset={engine.reset} />}
        </div>

        {/* 하단 상태바 (작업대 화면에서만) */}
        {inWorkbench && (
          <div className="flex items-center justify-between border-t border-slate-200 bg-slate-50 px-5 py-3">
            <div>
              <p className="text-sm font-medium text-slate-700">
                {canDeploy ? "배포 준비 완료" : "앱 공개 준비 중"}
              </p>
              <p className="text-xs text-slate-400">
                {canDeploy
                  ? "이제 웹사이트를 배포할 수 있습니다."
                  : "첫 구현이 완료되면 앱을 배포할 수 있습니다."}
              </p>
            </div>
            <button
              onClick={engine.openPricing}
              disabled={!canDeploy}
              className={cn(
                "inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold transition",
                canDeploy
                  ? "bg-brand-600 text-white hover:bg-brand-700"
                  : "cursor-not-allowed bg-slate-200 text-slate-400",
              )}
            >
              <Rocket className="h-4 w-4" />앱 배포
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
