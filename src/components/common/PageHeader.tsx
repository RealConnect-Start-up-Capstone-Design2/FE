import { type ReactNode } from "react";
import { cn } from "@/shared/utils";

interface PageHeaderProps {
  title: string;
  description?: string;
  children?: ReactNode;
  className?: string;
}

export function PageHeader({
  title,
  description,
  children,
  className,
}: PageHeaderProps) {
  return (
    <div onClick={(e) => e.stopPropagation()}>
      <p
        className={cn(
          "text-[28px] text-brand-foreground font-bold pb-2 text-[#1C2882]",
          className
        )}
      >
        {title}
      </p>
      <p className="text-lg font-medium text-[#989898]">{description}</p>
      {children}
    </div>
  );
}
