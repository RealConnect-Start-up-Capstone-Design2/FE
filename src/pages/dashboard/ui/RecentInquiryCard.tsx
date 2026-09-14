import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";

import type { DemoInquiryStatus } from "@/demo/types";
import {
  formatDemoDate,
  inquiryStatusLabels,
  transactionTypeLabels,
} from "../model/dashboardViewModel";
import type { RecentInquiryItem } from "../model/types";
import { DashboardCard, StatusBadge } from "./DashboardPrimitives";
import type { DashboardTone } from "./dashboardToneStyles";

const statusTones: Record<DemoInquiryStatus, DashboardTone> = {
  NEW: "primary",
  CONTACTED: "success",
  VISIT_SCHEDULED: "warning",
  NEGOTIATING: "danger",
  COMPLETED: "success",
  ON_HOLD: "warning",
};

interface RecentInquiryCardProps {
  inquiries: RecentInquiryItem[];
}

export function RecentInquiryCard({ inquiries }: RecentInquiryCardProps) {
  return (
    <DashboardCard
      title="최근 문의"
      action={
        <Link
          to="/inquiry-manage"
          className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-sm font-semibold text-[#1C2882] transition-colors hover:bg-[#F0F3FF] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1C2882]"
        >
          전체 보기
          <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
        </Link>
      }
      className="h-full"
    >
      {inquiries.length > 0 ? (
        <ul className="divide-y divide-[#ECEEF5]">
          {inquiries.map((inquiry) => (
            <li key={inquiry.id}>
              <Link
                to="/inquiry-manage"
                className="group flex items-center gap-3 rounded-lg px-1 py-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1C2882]"
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-[#182037] group-hover:text-[#1C2882]">
                    {inquiry.title}
                  </p>
                  <p className="mt-1 truncate text-xs font-medium text-[#858B9B]">
                    {inquiry.customerName} ·{" "}
                    {transactionTypeLabels[inquiry.transactionType]} · 수정{" "}
                    {formatDemoDate(inquiry.updatedAt)}
                  </p>
                </div>
                <StatusBadge
                  tone={statusTones[inquiry.status]}
                  className="shrink-0 px-2"
                >
                  {inquiryStatusLabels[inquiry.status]}
                </StatusBadge>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <div className="flex min-h-48 items-center justify-center rounded-xl border border-dashed border-[#D8DDEA] bg-[#FAFBFE] text-sm font-medium text-[#858B9B]">
          등록된 문의가 없습니다.
        </div>
      )}
    </DashboardCard>
  );
}
