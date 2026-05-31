import { Clock3 } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { ScrollArea } from "@/shared/ui";
import { cn } from "@/shared/utils";
import type { ExpiryAlert } from "../model/types";
import {
  DashboardCard,
  Dot,
  SegmentedFilter,
  StatusBadge,
} from "./DashboardPrimitives";
import { toneStyles } from "./dashboardToneStyles";

interface ExpiryAlertCardProps {
  alerts: ExpiryAlert[];
}

const toneClassName: Record<ExpiryAlert["tone"], string> = {
  danger: "text-[#EA3B3B]",
  warning: "text-[#F5A623]",
  success: "text-[#2DA66F]",
};

const toneLabel: Record<ExpiryAlert["tone"], string> = {
  danger: "긴급",
  warning: "주의",
  success: "예정",
};

export function ExpiryAlertCard({ alerts }: ExpiryAlertCardProps) {
  return (
    <DashboardCard title="만기일 알림" className="h-full">
      <div className="mb-5 shrink-0">
        <SegmentedFilter options={["1개월 전", "3개월 전", "6개월 전"]} />
      </div>
      <ScrollArea className="h-[calc(100%-71px)] pr-2">
        <div className="flex flex-col gap-3">
          {alerts.map((alert) => (
            <ExpiryAlertItem key={alert.id} alert={alert} />
          ))}
        </div>
      </ScrollArea>
    </DashboardCard>
  );
}

function ExpiryAlertItem({ alert }: { alert: ExpiryAlert }) {
  const navigate = useNavigate();

  const handleClick = () => {
    const searchParams = new URLSearchParams({
      complexId: String(alert.apartmentComplexId),
      apartmentId: String(alert.apartmentId),
      dong: alert.dong,
      ho: alert.ho,
    });

    navigate(`/property-manage?${searchParams.toString()}`);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={cn(
        "w-full rounded-lg border border-[#DDE2F2] border-l-4 bg-white px-5 py-4 text-left transition-colors hover:bg-[#F8FAFF] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1499FF]",
        toneStyles[alert.tone].border,
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <p className="truncate text-[15px] font-medium tracking-[-0.025em] text-[#1B1B1B]">
          {alert.propertyTitle}
        </p>
        <div className="flex shrink-0 items-center gap-[5px]">
          <Clock3 className={cn("h-5 w-5", toneClassName[alert.tone])} />
          <span className="text-[15px] font-medium tracking-[-0.025em] text-[#1B1B1B]">
            {alert.daysLeft}일 남음
          </span>
        </div>
      </div>
      <div className="mt-2 flex items-center gap-[5px] text-[15px] font-medium tracking-[-0.025em] text-[#8D8D8D]">
        <span>{alert.owner}</span>
        <Dot />
        <span>{alert.dealType}</span>
        <Dot />
        <span>만기일 {alert.expiryDate}</span>
      </div>
      <div className="mt-3 flex items-center justify-between gap-3">
        <StatusBadge tone={alert.tone} className="h-6 px-2 text-[12px]">
          {toneLabel[alert.tone]}
        </StatusBadge>
        <span className="text-[12px] font-semibold tracking-[-0.025em] text-[#8D8D8D]">
          소유자 확인 필요
        </span>
      </div>
    </button>
  );
}
