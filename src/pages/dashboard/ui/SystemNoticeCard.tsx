import { Bell } from "lucide-react";

import { ScrollArea } from "@/shared/ui";
import type { SystemNotice } from "../model/types";
import { DashboardCard, SeverityDot, StatusBadge } from "./DashboardPrimitives";

interface SystemNoticeCardProps {
  notices: SystemNotice[];
}

export function SystemNoticeCard({ notices }: SystemNoticeCardProps) {
  return (
    <DashboardCard
      title="시스템 공지"
      action={<Bell className="h-6 w-6 text-[#1B1B1B]" />}
      className="h-full"
    >
      <ScrollArea className="h-full pr-2">
        <div className="flex flex-col gap-3">
          {notices.map((notice) => (
            <article
              key={notice.id}
              className="rounded-lg border border-[#DDE2F2] bg-white p-5"
            >
              <div className="flex items-start gap-3">
                <SeverityDot tone={notice.tone} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <p className="text-[15px] font-semibold tracking-[-0.025em] text-[#1B1B1B]">
                      {notice.title}
                    </p>
                    <StatusBadge tone={notice.tone} className="h-6 px-2 text-[12px]">
                      공지
                    </StatusBadge>
                  </div>
                  <p className="mt-2 text-[14px] font-medium leading-5 tracking-[-0.025em] text-[#8D8D8D]">
                    {notice.description}
                  </p>
                  <p className="mt-3 text-[12px] font-medium tracking-[-0.025em] text-[#8D8D8D]">
                    {notice.date}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </ScrollArea>
    </DashboardCard>
  );
}
