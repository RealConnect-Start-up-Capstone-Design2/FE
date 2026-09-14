import { cn } from "@/shared/utils";
import {
  useCallback,
  useEffect,
  useRef,
  type CSSProperties,
  type PropsWithChildren,
  type ReactNode,
  type RefObject,
} from "react";
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
  const internalSidebarRef = useRef<HTMLElement | null>(null);
  const setSidebarRef = useCallback(
    (node: HTMLElement | null) => {
      internalSidebarRef.current = node;
      if (sidebarRef) sidebarRef.current = node;
    },
    [sidebarRef],
  );

  useEffect(() => {
    if (!isOpen) return;

    internalSidebarRef.current?.focus({ preventScroll: true });
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") onToggle?.();
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onToggle]);

  const sidebarVariable = {
    "--detail-sidebar-width": `${sidebarWidth}px`,
  } as CSSProperties;

  return (
    <div
      className={cn("relative h-full w-full", className)}
      style={sidebarVariable}
    >
      <div
        className={cn(
          "box-border h-full w-full transition-[padding-right] duration-300 ease-in-out",
          isOpen && "2xl:pr-[var(--detail-sidebar-width)]",
          contentClassName,
        )}
      >
        {children}
      </div>

      {/* 토글 버튼 */}
      {showToggleButton && onToggle && (
        <SidebarToggleButton
          isOpen={isOpen}
          onClick={onToggle}
          sidebarWidth={sidebarWidth}
        />
      )}

      {/* 사이드바 */}
      <aside
        ref={setSidebarRef}
        tabIndex={-1}
        className={cn(
          "fixed inset-y-0 right-0 z-[60] w-full max-w-[var(--detail-sidebar-width)] outline-none",
          "transform transition-transform duration-300 ease-in-out",
        )}
        style={{
          transform: `translateX(${isOpen ? 0 : 100}%)`,
          pointerEvents: isOpen ? "auto" : "none",
        }}
        aria-hidden={!isOpen}
        inert={!isOpen}
        aria-label="상세 카드"
      >
        {sidebar}
      </aside>
    </div>
  );
}
