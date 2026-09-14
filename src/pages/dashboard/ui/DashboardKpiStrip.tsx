import {
  Building2,
  CalendarCheck2,
  FileSignature,
  MessagesSquare,
} from "lucide-react";

import type { DashboardKpi } from "../model/types";
import { StatusBadge } from "./DashboardPrimitives";
import { toneStyles } from "./dashboardToneStyles";

const kpiIcons = {
  properties: Building2,
  inquiries: MessagesSquare,
  visits: CalendarCheck2,
  contracts: FileSignature,
} as const;

interface DashboardKpiStripProps {
  kpis: DashboardKpi[];
}

export function DashboardKpiStrip({ kpis }: DashboardKpiStripProps) {
  return (
    <section
      aria-label="핵심 업무 지표"
      className="grid grid-cols-1 gap-3 sm:grid-cols-2 2xl:grid-cols-4"
    >
      {kpis.map((kpi) => {
        const Icon = kpiIcons[kpi.id as keyof typeof kpiIcons] ?? Building2;

        return (
          <article
            key={kpi.id}
            className="flex min-h-28 min-w-0 items-center justify-between rounded-2xl border border-[#E2E6F1] bg-white px-5 shadow-[0_12px_36px_-24px_rgba(28,40,130,0.42)] sm:px-6"
          >
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold tracking-[-0.02em] text-[#737A8C]">
                {kpi.label}
              </p>
              <div className="mt-2 flex items-end gap-2">
                <strong className="text-3xl font-bold leading-none tracking-[-0.03em] text-[#182037]">
                  {kpi.value}
                </strong>
                <StatusBadge tone={kpi.tone} className="mb-0.5 px-2">
                  {kpi.helper}
                </StatusBadge>
              </div>
            </div>
            <div
              className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${toneStyles[kpi.tone].bg}`}
            >
              <Icon
                aria-hidden="true"
                className={`h-5 w-5 ${toneStyles[kpi.tone].text}`}
              />
            </div>
          </article>
        );
      })}
    </section>
  );
}
