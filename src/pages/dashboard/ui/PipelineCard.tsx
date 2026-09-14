import { ArrowUpRight, Workflow } from "lucide-react";
import { Link } from "react-router-dom";

import type { PipelineStage } from "../model/types";
import { DashboardCard, StatusBadge } from "./DashboardPrimitives";
import { toneStyles } from "./dashboardToneStyles";

interface PipelineCardProps {
  stages: PipelineStage[];
}

export function PipelineCard({ stages }: PipelineCardProps) {
  const total = stages.reduce((sum, stage) => sum + stage.count, 0);

  return (
    <DashboardCard
      title="문의 파이프라인"
      action={
        <Link
          to="/inquiry-manage"
          className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-sm font-semibold text-[#1C2882] transition-colors hover:bg-[#F0F3FF] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1C2882]"
        >
          문의장 열기
          <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
        </Link>
      }
      className="h-full"
    >
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {stages.map((stage) => (
          <div
            key={stage.status}
            className="rounded-xl border border-[#E5E8F2] bg-[#FAFBFE] p-4"
          >
            <div className="flex items-center justify-between gap-2">
              <span
                aria-hidden="true"
                className={`h-2.5 w-2.5 rounded-full ${toneStyles[stage.tone].solid}`}
              />
              <strong className="text-2xl font-bold tracking-[-0.03em] text-[#182037]">
                {stage.count}
              </strong>
            </div>
            <p className="mt-3 text-sm font-semibold text-[#697083]">
              {stage.label}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-4 flex items-center justify-between rounded-xl bg-[#F0F3FF] px-4 py-3">
        <div className="flex items-center gap-2 text-sm font-medium text-[#4D5673]">
          <Workflow aria-hidden="true" className="h-4 w-4 text-[#1C2882]" />
          등록된 문의가 상태별로 실시간 집계됩니다.
        </div>
        <StatusBadge tone="primary">전체 {total}건</StatusBadge>
      </div>
    </DashboardCard>
  );
}
