import { ArrowUpRight, CalendarDays } from "lucide-react";
import { Link } from "react-router-dom";

import type { DashboardScheduleItem } from "../model/types";
import { formatDemoDate } from "../model/dashboardViewModel";
import { DashboardCard } from "./DashboardPrimitives";
import { toneStyles } from "./dashboardToneStyles";

interface ScheduleCardProps {
  items: DashboardScheduleItem[];
}

export function ScheduleCard({ items }: ScheduleCardProps) {
  return (
    <DashboardCard
      title="주요 일정"
      action={
        <CalendarDays aria-hidden="true" className="h-5 w-5 text-[#1C2882]" />
      }
      className="h-full"
    >
      {items.length > 0 ? (
        <ul className="space-y-3">
          {items.map((item) => (
            <li key={item.id}>
              <Link
                to={item.href}
                className="group grid grid-cols-[92px_minmax(0,1fr)_auto] items-center gap-4 rounded-xl border border-[#E5E8F2] p-4 transition-colors hover:border-[#C8D2FF] hover:bg-[#FAFBFF] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1C2882]"
              >
                <div>
                  <p className="text-sm font-bold tabular-nums text-[#182037]">
                    {formatDemoDate(item.date)}
                  </p>
                  <p className="mt-1 text-xs font-medium text-[#858B9B]">
                    {item.dateCaption}
                  </p>
                </div>
                <div className="min-w-0 border-l border-[#E5E8F2] pl-4">
                  <div className="flex items-center gap-2">
                    <span
                      aria-hidden="true"
                      className={`h-2 w-2 shrink-0 rounded-full ${toneStyles[item.tone].solid}`}
                    />
                    <span
                      className={`text-xs font-semibold ${toneStyles[item.tone].text}`}
                    >
                      {item.eyebrow}
                    </span>
                  </div>
                  <p className="mt-1 truncate text-sm font-semibold text-[#182037]">
                    {item.title}
                  </p>
                  <p className="mt-1 truncate text-xs font-medium text-[#737A8C]">
                    {item.description}
                  </p>
                </div>
                <ArrowUpRight
                  aria-hidden="true"
                  className="h-4 w-4 text-[#A4AABA] transition-colors group-hover:text-[#1C2882]"
                />
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <div className="flex min-h-48 items-center justify-center rounded-xl border border-dashed border-[#D8DDEA] bg-[#FAFBFE] px-6 text-center">
          <div>
            <p className="font-semibold text-[#4D5673]">
              확인할 일정이 없습니다.
            </p>
            <p className="mt-1 text-sm text-[#858B9B]">
              계약 진행 또는 방문 예정 상태가 생기면 여기에 표시됩니다.
            </p>
          </div>
        </div>
      )}
    </DashboardCard>
  );
}
