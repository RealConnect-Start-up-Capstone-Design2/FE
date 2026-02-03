import { cn } from "@/shared/utils";

type RequestTypeValue =
  | "NONE"
  | "SALE"
  | "JEONSE"
  | "MONTHLY"
  | "SALE_JEONSE"
  | "SALE_MONTHLY"
  | "JEONSE_MONTHLY"
  | "SALE_JEONSE_MONTHLY"
  | "HOLD";

interface RequestTypeTagProps {
  type: RequestTypeValue | string | null | undefined;
  className?: string;
}

const TYPE_CONFIG: Record<
  RequestTypeValue,
  { label: string; variant: "primary" | "secondary" }
> = {
  NONE: { label: "없음", variant: "secondary" },
  SALE: { label: "매도", variant: "primary" },
  JEONSE: { label: "전세", variant: "primary" },
  MONTHLY: { label: "월세", variant: "primary" },
  SALE_JEONSE: { label: "매/전", variant: "primary" },
  SALE_MONTHLY: { label: "매/월", variant: "primary" },
  JEONSE_MONTHLY: { label: "전/월", variant: "primary" },
  SALE_JEONSE_MONTHLY: { label: "매/전/월", variant: "primary" },
  HOLD: { label: "보류", variant: "secondary" },
};

/**
 * 의뢰 유형 태그 컴포넌트
 * - 매도/전세/월세/전월/매전월: 파란색 배경
 * - 없음/보류: 회색 배경
 */
export function RequestTypeTag({ type, className }: RequestTypeTagProps) {
  const normalizedType = (type || "NONE") as RequestTypeValue;
  const config = TYPE_CONFIG[normalizedType] || TYPE_CONFIG.NONE;

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
