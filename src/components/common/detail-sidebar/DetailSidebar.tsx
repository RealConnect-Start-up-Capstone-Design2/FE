import { cn } from "@/shared/utils";
import type { PropsWithChildren, ReactNode } from "react";

interface DetailSidebarProps extends PropsWithChildren {
  title?: string;
  onClose?: () => void;
  headerActions?: ReactNode;
  className?: string;
  contentClassName?: string;
}

export function DetailSidebar({
  title,
  onClose,
  headerActions,
  className,
  contentClassName,
  children,
}: DetailSidebarProps) {
  return (
    <div
      className={cn(
        "flex h-full w-full flex-col bg-white shadow-xl",
        "border-l border-gray-200",
        className
      )}
    >
      {(title || headerActions || onClose) && (
        <div className="flex items-center justify-between gap-4 border-b border-gray-200 px-6 py-4">
          <div className="min-w-0">
            {title && (
              <h2 className="truncate text-xl font-semibold text-gray-900">
                {title}
              </h2>
            )}
          </div>
          <div className="flex flex-shrink-0 items-center gap-2">
            {headerActions}
            {onClose && (
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700"
                aria-label="사이드바 닫기"
              >
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            )}
          </div>
        </div>
      )}
      <div
        className={cn(
          "flex-1 overflow-y-auto px-6 py-6 flex flex-col gap-6",
          contentClassName
        )}
      >
        {children}
      </div>
    </div>
  );
}
