import { Fragment, type ReactNode } from "react";

import { cn } from "@/shared/utils";

interface ContentCardDetailSection {
  label?: string;
  texts?: string[];
}

interface ContentCardProps {
  title: string;
  detailLabel?: string;
  detailTexts?: string[];
  detailSections?: ContentCardDetailSection[];
  showDivider?: boolean;
  action?: ReactNode;
  dividerContent?: ReactNode;
  footerDividerContent?: ReactNode;
  showBottomDivider?: boolean;
  bottomContent?: ReactNode;
  children?: ReactNode;
  className?: string;
  contentClassName?: string;
}

export function ContentCard({
  title,
  detailLabel,
  detailTexts,
  detailSections,
  showDivider = false,
  action,
  dividerContent,
  footerDividerContent,
  showBottomDivider = false,
  bottomContent,
  children,
  className,
  contentClassName,
}: ContentCardProps) {
  return (
    <div
      className={cn(
        "w-full rounded-lg border border-[#DDE2F2] bg-white shadow-[0_12px_24px_-12px_rgba(15,23,42,0.25)]",
        className
      )}
    >
      <div className={cn("flex flex-col gap-4 p-6", contentClassName)}>
        <div className="flex flex-col gap-2">
          <p className="text-[24px] font-semibold text-[#1B1B1B]">{title}</p>
          {detailLabel ? (
            <p className="text-[15px] font-medium text-[#8D8D8D]">
              {detailLabel}
            </p>
          ) : null}
        </div>

        {detailTexts && detailTexts.length > 0 ? (
          <div className="flex flex-col gap-1">
            {detailTexts.map((text, index) => (
              <Fragment key={`${text}-${index}`}>
                <p className="text-[15px] font-medium text-[#1B1B1B]">{text}</p>
              </Fragment>
            ))}
          </div>
        ) : null}

        {detailSections && detailSections.length > 0 ? (
          <div className="flex flex-col gap-3">
            {detailSections.map(({ label, texts }, sectionIndex) => (
              <div
                key={`detail-section-${sectionIndex}`}
                className="flex flex-col gap-1"
              >
                {label ? (
                  <p className="text-[15px] font-medium text-[#8D8D8D]">
                    {label}
                  </p>
                ) : null}
                {texts && texts.length > 0 ? (
                  <div className="flex flex-col gap-1">
                    {texts.map((text, textIndex) => (
                      <p
                        key={`detail-section-${sectionIndex}-text-${textIndex}`}
                        className="text-[15px] font-medium text-[#1B1B1B]"
                      >
                        {text}
                      </p>
                    ))}
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        ) : null}

        {children}
      </div>

      {action ? (
        <div className="flex justify-end p-6 pt-0">{action}</div>
      ) : null}

      {showDivider ? (
        <div className="mt-[30px]">
          <div className="mx-[30px] h-px bg-[#D4D8E5]" />
          {dividerContent ? (
            <div className="px-6 pb-6 pt-[30px]">{dividerContent}</div>
          ) : (
            <div className="mb-[30px]" />
          )}
        </div>
      ) : null}

      {footerDividerContent ? (
        <div>
          <div className="mx-[30px] h-px bg-[#D4D8E5]" />
          <div className="px-6 pb-6 pt-[30px]">{footerDividerContent}</div>
        </div>
      ) : null}

      {showBottomDivider ? (
        <div className="mx-[30px] h-px bg-[#D4D8E5]" />
      ) : null}

      {bottomContent ? (
        <div className="px-6 pb-6 pt-[30px]">{bottomContent}</div>
      ) : null}
    </div>
  );
}
