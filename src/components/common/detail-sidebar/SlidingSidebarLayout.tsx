import { cn } from "@/shared/utils";
import type { PropsWithChildren, ReactNode } from "react";

interface SlidingSidebarLayoutProps extends PropsWithChildren {
  isOpen: boolean;
  sidebar: ReactNode;
  sidebarWidth?: number;
  gap?: number;
  className?: string;
  contentClassName?: string;
}

export function SlidingSidebarLayout({
  isOpen,
  sidebar,
  sidebarWidth = 480,
  gap = 24,
  className,
  contentClassName,
  children,
}: SlidingSidebarLayoutProps) {
  const sidebarGap = isOpen ? gap : 0;
  const containerWidth = isOpen ? sidebarWidth : 0;

  return (
    <div className={cn("relative w-full", className)}>
      <div
        className="flex items-start"
        style={{
          gap: sidebarGap,
          transition: "gap 300ms ease-in-out",
        }}
      >
        <div className={cn("flex-1 min-w-0", contentClassName)}>{children}</div>
        <div
          className="relative flex-shrink-0 overflow-hidden"
          style={{
            width: containerWidth,
            transition: "width 300ms ease-in-out",
            pointerEvents: isOpen ? "auto" : "none",
          }}
          aria-hidden={!isOpen}
        >
          <div
            className="h-full w-full transform transition-transform duration-300 ease-in-out"
            style={{
              transform: `translateX(${isOpen ? 0 : sidebarWidth}px)`,
            }}
          >
            {sidebar}
          </div>
        </div>
      </div>
    </div>
  );
}
