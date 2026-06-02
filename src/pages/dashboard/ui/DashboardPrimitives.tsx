import type { ReactNode } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui";
import { cn } from "@/shared/utils";
import { toneStyles, type DashboardTone } from "./dashboardToneStyles";

interface DashboardCardProps {
  title?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
  contentClassName?: string;
}

export function DashboardCard({
  title,
  action,
  children,
  className,
  contentClassName,
}: DashboardCardProps) {
  return (
    <Card
      className={cn(
        "flex min-h-0 flex-col overflow-hidden border-[#DDE2F2] bg-white shadow-[0px_0px_25px_-10px_#B1B6C7]",
        className,
      )}
    >
      {title ? (
        <CardHeader className="flex shrink-0 flex-row items-center justify-between space-y-0 p-[30px] pb-5">
          <CardTitle className="text-[24px] font-semibold leading-normal tracking-[-0.025em] text-[#1B1B1B]">
            {title}
          </CardTitle>
          {action}
        </CardHeader>
      ) : null}
      <CardContent
        className={cn(
          "min-h-0 flex-1 overflow-hidden p-[30px]",
          title && "pt-0",
          contentClassName,
        )}
      >
        {children}
      </CardContent>
    </Card>
  );
}

export function Dot() {
  return <span className="h-0.5 w-0.5 shrink-0 rounded-full bg-[#8D8D8D]" />;
}

interface StatusBadgeProps {
  children: ReactNode;
  tone?: DashboardTone;
  className?: string;
}

export function StatusBadge({
  children,
  tone = "primary",
  className,
}: StatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex h-7 items-center rounded-full border px-3 text-[13px] font-semibold tracking-[-0.025em]",
        toneStyles[tone].bg,
        toneStyles[tone].border,
        toneStyles[tone].text,
        className,
      )}
    >
      {children}
    </span>
  );
}

export function SeverityDot({ tone = "primary" }: { tone?: DashboardTone }) {
  return (
    <span
      className={cn(
        "mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full",
        toneStyles[tone].solid,
      )}
    />
  );
}

interface SegmentedFilterProps {
  options: string[];
  activeIndex?: number;
}

export function SegmentedFilter({
  options,
  activeIndex = 0,
}: SegmentedFilterProps) {
  return (
    <div className="inline-flex h-[51px] items-center gap-[5px] rounded-full bg-[#E8EDFF] p-1">
      {options.map((label, index) => (
        <button
          key={label}
          type="button"
          className={cn(
            "h-[32px] rounded-full px-4 text-[12px] font-medium tracking-[-0.025em] text-[#1B1B1B]",
            index === activeIndex && "bg-white",
          )}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
