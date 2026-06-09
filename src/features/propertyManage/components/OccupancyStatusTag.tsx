import { cn } from "@/shared/utils";

type OccupancyStatusValue =
  | "NONE"
  | "SELF"
  | "JEONSE"
  | "MONTHLY_RENT"
  | "VACANT";

interface OccupancyStatusTagProps {
  status: OccupancyStatusValue | string | null | undefined;
  className?: string;
}

const STATUS_CONFIG: Record<
  OccupancyStatusValue,
  { label: string; variant: "primary" | "secondary" }
> = {
  NONE: { label: "없음", variant: "secondary" },
  SELF: { label: "자가", variant: "primary" },
  JEONSE: { label: "전세", variant: "primary" },
  MONTHLY_RENT: { label: "월세", variant: "primary" },
  VACANT: { label: "공실", variant: "primary" },
};

/**
 * 점유상태 태그 컴포넌트
 * - 자가/전세/월세/공실: 파란색 배경
 * - 없음: 회색 배경
 */
export function OccupancyStatusTag({
  status,
  className,
}: OccupancyStatusTagProps) {
  const normalizedStatus = (status || "NONE") as OccupancyStatusValue;
  const config = STATUS_CONFIG[normalizedStatus] || STATUS_CONFIG.NONE;

  return (
    <span
      className={cn(
        "inline-flex items-center justify-center px-3 py-1 rounded-full text-[13px] font-medium",
        config.variant === "primary"
          ? "bg-[#E8EDFF] text-[#1C2882]"
          : "bg-[#EDEDED] text-[#1B1B1B]",
        className,
      )}
    >
      {config.label}
    </span>
  );
}
