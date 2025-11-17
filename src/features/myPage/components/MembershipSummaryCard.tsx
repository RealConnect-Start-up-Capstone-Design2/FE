import { ContentCard } from "@/components/common/ContentCard";
import { Label } from "@/components/ui/label";
import { cn } from "@/shared/utils";

interface MembershipSummaryCardProps {
  className?: string;
}

export function MembershipSummaryCard({
  className,
}: MembershipSummaryCardProps) {
  return (
    <ContentCard
      title="내 멤버십"
      titleExtra={
        <Label className="flex h-5 w-[46px] items-center justify-center rounded-full bg-[#EDEDED] text-[12px] font-medium text-[#989898]">
          Basic
        </Label>
      }
      className={cn("w-full h-[242px]", className)}
      contentClassName="p-6"
      detailSections={[
        {
          texts: [
            <div
              className="mt-[30px] flex h-[123px] flex-row gap-4"
              key="membership-badges"
            >
              <div className="flex-1 basis-[45%] min-w-[220px] rounded-lg bg-[#1B1B1B]" />
              <div className="flex-1 basis-[24%] min-w-[160px] rounded-lg bg-[#1B1B1B]" />
              <div className="flex-1 basis-[31%] min-w-[220px] rounded-lg bg-[#1B1B1B]" />
            </div>,
          ],
        },
      ]}
    />
  );
}
