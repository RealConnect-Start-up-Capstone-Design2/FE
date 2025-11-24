import { type ReactNode } from "react";
import { cn } from "@/shared/utils";

interface PageHeaderProps {
  title: string;
  children?: ReactNode;
  titleClassName?: string;
}

export function PageHeader({
  title,
  children,
  titleClassName,
}: PageHeaderProps) {
  return (
    <div onClick={(e) => e.stopPropagation()}>
      <p
        className={cn(
          "text-[28px] text-brand -text-brand-foreground font-bold pb-11",
          titleClassName
        )}
      >
        {title}
      </p>
      {children}
    </div>
  );
}
