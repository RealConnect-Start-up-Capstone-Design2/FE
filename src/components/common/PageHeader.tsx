import { type ReactNode } from "react";
import { cn } from "@/shared/utils";

interface PageHeaderProps {
  title: string;
  description?: string;
  children?: ReactNode;
  titleClassName?: string;
}

export function PageHeader({
  title,
  description,
  children,
  titleClassName,
}: PageHeaderProps) {
  return (
    <div onClick={(e) => e.stopPropagation()}>
      <p
        className={cn(
          "text-[28px] text-brand-foreground font-bold pb-11",
          titleClassName
        )}
      >
        {title}
      </p>
      <p className="text-lg font-medium text-[#989898]">{description}</p>
      {children}
    </div>
  );
}
