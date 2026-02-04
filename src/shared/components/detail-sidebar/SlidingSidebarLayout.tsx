import { cn } from "@/shared/utils";
import type { PropsWithChildren, ReactNode, RefObject } from "react";
import { SidebarToggleButton } from "./SidebarToggleButton";

interface SlidingSidebarLayoutProps extends PropsWithChildren {
  isOpen: boolean;
  sidebar: ReactNode;
  sidebarWidth?: number;
  className?: string;
  contentClassName?: string;
  onToggle?: () => void;
  showToggleButton?: boolean;
  sidebarRef?: RefObject<HTMLElement | null>;
}

export function SlidingSidebarLayout({
  isOpen,
  sidebar,
  sidebarWidth = 480,
  className,
  contentClassName,
  onToggle,
  showToggleButton = true,
  sidebarRef,
  children,
}: SlidingSidebarLayoutProps) {
  return (
    <div className={cn("relative w-full h-full", className)}>
      <div
        className={cn(
          "w-full h-full box-border transition-[padding-right] duration-300 ease-in-out",
          contentClassName
        )}
        style={{
          paddingRight: isOpen ? sidebarWidth : 0,
        }}
      >
        {children}
      </div>

      {/* 토글 버튼 */}
      {showToggleButton && onToggle && (
        <SidebarToggleButton isOpen={isOpen} onClick={onToggle} />
      )}

      {/* 사이드바 */}
      <aside
        ref={sidebarRef}
        className={cn(
          "fixed inset-y-0 right-0 z-40",
          "transform transition-transform duration-300 ease-in-out"
        )}
        style={{
          width: sidebarWidth,
          transform: `translateX(${isOpen ? 0 : sidebarWidth}px)`,
          pointerEvents: isOpen ? "auto" : "none",
        }}
        aria-hidden={!isOpen}
      >
        {sidebar}
      </aside>
    </div>
  );
}
