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
        "flex min-h-0 flex-col overflow-hidden rounded-2xl border-[#E2E6F1] bg-white shadow-[0_12px_36px_-24px_rgba(28,40,130,0.42)]",
        className,
      )}
    >
      {title ? (
        <CardHeader className="flex shrink-0 flex-row items-center justify-between space-y-0 p-5 pb-4 sm:p-6 sm:pb-4">
          <CardTitle className="text-xl font-semibold leading-normal tracking-[-0.025em] text-[#182037]">
            {title}
          </CardTitle>
          {action}
        </CardHeader>
      ) : null}
      <CardContent
        className={cn(
          "min-h-0 flex-1 p-5 sm:p-6",
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
        "inline-flex min-h-7 items-center rounded-full border px-3 py-1 text-xs font-semibold tracking-[-0.025em]",
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
