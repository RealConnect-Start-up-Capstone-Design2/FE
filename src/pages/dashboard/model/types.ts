import type { DemoInquiryStatus, DemoTransactionType } from "@/demo/types";
import type { DashboardTone } from "../ui/dashboardToneStyles";

export interface DashboardKpi {
  id: "properties" | "inquiries" | "visits" | "contracts";
  label: string;
  value: number;
  helper: string;
  tone: DashboardTone;
}

export interface PipelineStage {
  status: DemoInquiryStatus;
  label: string;
  count: number;
  tone: DashboardTone;
}

export interface DashboardScheduleItem {
  id: string;
  source: "CONTRACT" | "INQUIRY";
  date: string;
  dateCaption: string;
  eyebrow: string;
  title: string;
  description: string;
  tone: DashboardTone;
  href: "/property-manage" | "/inquiry-manage";
}

export interface RecentInquiryItem {
  id: string;
  title: string;
  customerName: string;
  transactionType: DemoTransactionType;
  status: DemoInquiryStatus;
  updatedAt: string;
}
