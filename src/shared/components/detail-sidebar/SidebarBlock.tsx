import { cn } from "@/shared/utils";
import type { PropsWithChildren, ReactNode } from "react";

interface SidebarBlockProps extends PropsWithChildren {
  /**
   * 블록 제목
   */
  title: string;
  /**
   * 제목 우측에 표시할 추가 액션 (버튼 등)
   */
  headerAction?: ReactNode;
  /**
   * 블록 내부 커스텀 className
   */
  contentClassName?: string;
  /**
   * 블록 전체 커스텀 className
   */
  className?: string;
}

/**
 * 사이드바 블록 레이아웃 컴포넌트
 * @example
 * <SidebarBlock title="고객 상담 내역">
 *   <p>내용</p>
 * </SidebarBlock>
 *
 * @example
 * <SidebarBlock
 *   title="계약 정보"
 *   tag="없음"
 *   headerAction={<Button>수정</Button>}
 * >
 *   <ContractForm />
 * </SidebarBlock>
 */
export function SidebarBlock({
  title,
  headerAction,
  contentClassName,
  className,
  children,
}: SidebarBlockProps) {
  return (
    <section
      className={cn(
        "rounded-lg border border-[rgba(177,182,199,0.4)] bg-[#F8F8F8] shadow-[0px_0px_8px_0px_rgba(177,182,199,0.4)]",
        "px-[18px] pt-5 pb-5",
        className,
      )}
    >
      {/* 제목 영역 */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-3">
          <h3 className="text-[18px] font-semibold leading-[1.2] tracking-[-0.025em] text-[#1B1B1B]">
            {title}
          </h3>
        </div>
        {headerAction && <div className="flex-shrink-0">{headerAction}</div>}
      </div>

      {/* 구분선 */}
      <div className="mt-4 border-t border-[rgba(177,182,199,0.4)]" />

      {/* 내용 영역 */}
      <div className={cn("mt-4", contentClassName)}>{children}</div>
    </section>
  );
}
