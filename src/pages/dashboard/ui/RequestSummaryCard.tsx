import type { RequestSummary } from "../model/types";
import { DashboardCard, StatusBadge } from "./DashboardPrimitives";

interface RequestSummaryCardProps {
  summaries: RequestSummary[];
}

export function RequestSummaryCard({ summaries }: RequestSummaryCardProps) {
  return (
    <DashboardCard
      title="의뢰 현황"
      className="h-full"
      contentClassName="flex flex-col gap-4"
    >
      {summaries.map((summary, index) => (
        <section
          key={summary.title}
          className="min-h-0 rounded-lg border border-[#DDE2F2] bg-[#F8FAFF] p-5"
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[16px] font-semibold tracking-[-0.025em] text-[#8D8D8D]">
                {summary.title}
              </p>
              <div className="mt-2 flex items-end gap-2">
                <strong className="text-[30px] font-bold leading-none tracking-[-0.025em] text-[#1B1B1B]">
                  {summary.count}
                </strong>
                <StatusBadge
                  tone={index === 0 ? "primary" : "warning"}
                  className="h-6 px-2 text-[12px]"
                >
                  {summary.delta}
                </StatusBadge>
              </div>
            </div>
            <span className="rounded-full bg-white px-3 py-1 text-[13px] font-semibold tracking-[-0.025em] text-[#1C2882]">
              {index === 0 ? "매물" : "문의"}
            </span>
          </div>
        </section>
      ))}
    </DashboardCard>
  );
}
