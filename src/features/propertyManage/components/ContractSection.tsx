import { ReactNode } from "react";
import { cn } from "@/shared/utils";

interface ContractSectionProps {
  children: ReactNode;
  className?: string;
}

/**
 * 계약 정보 섹션 래퍼 컴포넌트
 * #E8EDFF 배경색의 반복되는 박스 구조를 통일
 */
export function ContractSection({ children, className }: ContractSectionProps) {
  return (
    <div
      className={cn(
        "flex w-full items-start gap-[23px] rounded-[6px] bg-[#E8EDFF] px-4 py-4",
        className
      )}
    >
      {children}
    </div>
  );
}
