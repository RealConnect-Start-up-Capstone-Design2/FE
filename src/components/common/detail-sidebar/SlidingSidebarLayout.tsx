import { cn } from "@/shared/utils";
import type { PropsWithChildren, ReactNode } from "react";

interface SlidingSidebarLayoutProps extends PropsWithChildren {
  isOpen: boolean;
  sidebar: ReactNode;
  sidebarWidth?: number;
  className?: string;
  contentClassName?: string;
}

export function SlidingSidebarLayout({
  isOpen,
  sidebar,
  sidebarWidth = 480,
  className,
  contentClassName,
  children,
}: SlidingSidebarLayoutProps) {
  return (
    <div className={cn("relative w-full", className)}>
      <div className={cn(contentClassName)}>{children}</div>

      <aside
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
