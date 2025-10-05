import { type ReactNode } from "react";

interface PageHeaderProps {
  title: string;
  children?: ReactNode;
}

export function PageHeader({ title, children }: PageHeaderProps) {
  return (
    <div>
      <p className="text-[28px] text-brand -text-brand-foreground font-bold pt-12 pb-11">
        {title}
      </p>
      {children}
    </div>
  );
}
