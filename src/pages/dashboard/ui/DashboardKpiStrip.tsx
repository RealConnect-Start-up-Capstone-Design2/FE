import {
  AlertTriangle,
  Building2,
  CalendarCheck2,
  MessageSquareText,
} from "lucide-react";

import type { DashboardKpi } from "../model/types";
import { StatusBadge } from "./DashboardPrimitives";
import { toneStyles } from "./dashboardToneStyles";

const kpiIcons = {
  properties: Building2,
  expiry: AlertTriangle,
  consultations: CalendarCheck2,
  requests: MessageSquareText,
} as const;

interface DashboardKpiStripProps {
  kpis: DashboardKpi[];
}

export function DashboardKpiStrip({ kpis }: DashboardKpiStripProps) {
  return (
    <section className="mt-5 grid h-[96px] shrink-0 grid-cols-4 gap-5 overflow-hidden">
      {kpis.map((kpi) => {
        const Icon = kpiIcons[kpi.id as keyof typeof kpiIcons] ?? Building2;

        return (
          <article
            key={kpi.id}
            className="flex min-w-0 items-center justify-between rounded-lg border border-[#DDE2F2] bg-white px-6 shadow-[0px_0px_25px_-16px_#B1B6C7]"
          >
            <div className="min-w-0">
              <p className="truncate text-[15px] font-semibold tracking-[-0.025em] text-[#8D8D8D]">
                {kpi.label}
              </p>
              <div className="mt-2 flex items-end gap-2">
                <strong className="text-[32px] font-bold leading-none tracking-[-0.025em] text-[#1B1B1B]">
                  {kpi.value}
                </strong>
                <StatusBadge tone={kpi.tone} className="mb-0.5 h-6 px-2 text-[12px]">
                  {kpi.helper}
                </StatusBadge>
              </div>
            </div>
            <div
              className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${toneStyles[kpi.tone].bg}`}
            >
              <Icon className={`h-6 w-6 ${toneStyles[kpi.tone].text}`} />
            </div>
          </article>
        );
      })}
    </section>
  );
}
