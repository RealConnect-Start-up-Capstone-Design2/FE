import { cn } from "@/shared/utils";
import type { ReactNode } from "react";

interface SidebarFieldProps {
  /**
   * 필드 라벨
   */
  label: string;
  /**
   * 라벨과 input 정렬 방향
   * - "vertical": 라벨 위, input 아래 (기본값)
   * - "horizontal": 라벨 왼쪽, input 오른쪽
   */
  direction?: "col" | "row";
  /**
   * 가로 정렬 시 라벨 너비 (기본값: 42px)
   */
  labelWidth?: number;
  /**
   * input 오른쪽에 표시할 suffix 텍스트 (예: "만원", "부동산")
   */
  suffix?: string;
  /**
   * 필드 전체 커스텀 className
   */
  className?: string;
  /**
   * 필드 내용 (input, select, dropdown 등)
   */
  children: ReactNode;
}

/**
 * @example
 * // 세로 정렬 (기본)
 * <SidebarField label="점유상태">
 *   <select>...</select>
 * </SidebarField>
 *
 * @example
 * // 가로 정렬
 * <SidebarField label="소유자" direction="row">
 *   <input type="text" />
 * </SidebarField>
 *
 * @example
 * // suffix가 있는 필드
 * <SidebarField label="기매입금" suffix="만원">
 *   <input type="text" />
 * </SidebarField>
 */
export function SidebarField({
  label,
  direction = "col",
  labelWidth = 42,
  suffix,
  className,
  children,
}: SidebarFieldProps) {
  const isRow = direction === "row";

  return (
    <div
      className={cn(
        "flex",
        isRow ? "flex-1 flex-row items-center gap-2" : "flex-col gap-[5px]",
        className,
      )}
    >
      {/* 라벨 */}
      <label
        className={cn(
          "flex text-[13px] font-medium tracking-[-0.025em] text-[#8D8D8D]",
          isRow && "flex-shrink-0 justify-center",
        )}
        style={isRow ? { width: labelWidth } : undefined}
      >
        {label}
      </label>

      {/* input + suffix 영역 */}
      <div className="flex items-center gap-[6px]">
        <div className="flex-1 min-w-0">{children}</div>
        {suffix && (
          <span className="flex text-[13px] font-normal text-[#8D8D8D]">
            {suffix}
          </span>
        )}
      </div>
    </div>
  );
}
