import { type ReactNode } from "react";

interface PageDescriptionProps {
  title: string;
  children?: ReactNode;
}

export function PageDescription({ title, children }: PageDescriptionProps) {
  return (
    <div onClick={(e) => e.stopPropagation()}>
      <p className="text-lg font-medium text-[#989898]">{title}</p>
      {children}
    </div>
  );
}
