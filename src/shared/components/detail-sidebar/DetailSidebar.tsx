// TODO: 삭제 예정
import { cn } from "@/shared/utils";
import type { PropsWithChildren, ReactNode } from "react";

interface DetailSidebarProps extends PropsWithChildren {
  header?: ReactNode;
  className?: string;
  contentClassName?: string;
}

export function DetailSidebar({
  header,
  className,
  contentClassName,
  children,
}: DetailSidebarProps) {
  return (
    <div
      className={cn(
        "flex h-full w-full flex-col bg-white shadow-xl",
        "border-l border-gray-200",
        className,
      )}
    >
      {header}

      <div
        className={cn(
          "flex-1 overflow-y-auto flex flex-col gap-3",
          contentClassName,
        )}
      >
        {children}
      </div>
    </div>
  );
}
