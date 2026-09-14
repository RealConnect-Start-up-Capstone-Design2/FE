import { DatabaseBackup, RotateCcw } from "lucide-react";

import { resetDemoState } from "@/demo/repository";
import { isDemoRuntime } from "@/demo/session";

export function DemoModeBar() {
  if (!isDemoRuntime()) return null;

  const handleReset = () => {
    resetDemoState();
    window.location.reload();
  };

  return (
    <div className="flex min-h-11 shrink-0 flex-wrap items-center justify-between gap-2 border-b border-[#DDE2F2] bg-[#EEF1FF] px-4 py-2 text-sm lg:px-6">
      <div className="flex min-w-0 items-center gap-2 text-[#445074]">
        <DatabaseBackup
          aria-hidden="true"
          className="h-4 w-4 shrink-0 text-[#1C2882]"
        />
        <p className="truncate">
          <strong className="font-semibold text-[#1C2882]">샘플 데이터</strong>
          <span className="hidden sm:inline">
            {" "}
            · 변경 내용은 이 브라우저에만 저장됩니다.
          </span>
        </p>
      </div>
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={handleReset}
          className="inline-flex items-center gap-1.5 rounded-lg border border-[#CCD4F1] bg-white px-3 py-1.5 text-xs font-semibold text-[#1C2882] transition-colors hover:bg-[#F8F9FF] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1C2882]"
        >
          <RotateCcw aria-hidden="true" className="h-3.5 w-3.5" />
          데이터 초기화
        </button>
      </div>
    </div>
  );
}
