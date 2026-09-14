import { selectDashboardMetrics } from "@/demo/selectors";
import type {
  DemoInquiryStatus,
  DemoState,
  DemoTransactionType,
} from "@/demo/types";
import type {
  DashboardKpi,
  DashboardScheduleItem,
  PipelineStage,
  RecentInquiryItem,
} from "./types";

const PIPELINE_STAGES: ReadonlyArray<{
  status: DemoInquiryStatus;
  label: string;
  tone: PipelineStage["tone"];
}> = [
  { status: "NEW", label: "신규", tone: "primary" },
  { status: "CONTACTED", label: "응대 중", tone: "success" },
  { status: "VISIT_SCHEDULED", label: "방문 예정", tone: "warning" },
  { status: "NEGOTIATING", label: "조건 협의", tone: "danger" },
  { status: "COMPLETED", label: "완료", tone: "success" },
  { status: "ON_HOLD", label: "보류", tone: "warning" },
];

export const inquiryStatusLabels: Record<DemoInquiryStatus, string> = {
  NEW: "신규",
  CONTACTED: "응대 중",
  VISIT_SCHEDULED: "방문 예정",
  NEGOTIATING: "조건 협의",
  COMPLETED: "완료",
  ON_HOLD: "보류",
};

export const transactionTypeLabels: Record<DemoTransactionType, string> = {
  SALE: "매매",
  JEONSE: "전세",
  MONTHLY: "월세",
};

export function buildDashboardKpis(state: DemoState): DashboardKpi[] {
  const metrics = selectDashboardMetrics(state);

  return [
    {
      id: "properties",
      label: "전체 매물",
      value: metrics.totalProperties,
      helper: `활성 ${metrics.activeProperties}건`,
      tone: "primary",
    },
    {
      id: "inquiries",
      label: "활성 문의",
      value: metrics.activeInquiries,
      helper: `전체 ${state.inquiries.length}건`,
      tone: "success",
    },
    {
      id: "visits",
      label: "방문 예정",
      value: metrics.scheduledVisits,
      helper: "후속 확인 필요",
      tone: "warning",
    },
    {
      id: "contracts",
      label: "계약 진행",
      value: metrics.contractsInProgress,
      helper: `서명 완료 ${metrics.completedContracts}건`,
      tone: "danger",
    },
  ];
}

export function buildPipeline(state: DemoState): PipelineStage[] {
  const counts = new Map<DemoInquiryStatus, number>();
  state.inquiries.forEach((inquiry) => {
    counts.set(inquiry.status, (counts.get(inquiry.status) ?? 0) + 1);
  });

  return PIPELINE_STAGES.map((stage) => ({
    ...stage,
    count: counts.get(stage.status) ?? 0,
  }));
}

export function buildSchedule(state: DemoState): DashboardScheduleItem[] {
  const complexes = new Map(state.complexes.map((item) => [item.id, item]));
  const properties = new Map(state.properties.map((item) => [item.id, item]));

  const contractItems = state.contracts
    .filter(
      (contract) =>
        contract.status === "DRAFT" || contract.status === "IN_PROGRESS",
    )
    .map((contract): DashboardScheduleItem => {
      const property = properties.get(contract.propertyId);
      const complexName = property
        ? complexes.get(property.complexId)?.name
        : undefined;
      const propertyName = property
        ? [complexName, property.building, property.unit]
            .filter(Boolean)
            .join(" ")
        : "연결된 매물";

      return {
        id: `contract-${contract.id}`,
        source: "CONTRACT",
        date: contract.contractDate || contract.moveInDate,
        dateCaption: "계약 예정",
        eyebrow: contract.status === "DRAFT" ? "계약서 초안" : "계약 진행",
        title: propertyName,
        description: `${transactionTypeLabels[contract.transactionType]} · ${contract.lesseeOrBuyer.name}`,
        tone: contract.status === "DRAFT" ? "warning" : "danger",
        href: "/property-manage",
      };
    });

  const visitItems = state.inquiries
    .filter((inquiry) => inquiry.status === "VISIT_SCHEDULED")
    .map((inquiry): DashboardScheduleItem => ({
      id: `inquiry-${inquiry.id}`,
      source: "INQUIRY",
      date: inquiry.moveInBy,
      dateCaption: "입주 목표",
      eyebrow: "방문 후속",
      title: inquiry.title,
      description: `${inquiry.customer.name} · ${transactionTypeLabels[inquiry.transactionType]}`,
      tone: "primary",
      href: "/inquiry-manage",
    }));

  return [...contractItems, ...visitItems]
    .filter((item) => item.date.length > 0)
    .sort(
      (left, right) =>
        left.date.localeCompare(right.date) || left.id.localeCompare(right.id),
    )
    .slice(0, 5);
}

export function buildRecentInquiries(
  state: DemoState,
  limit = 4,
): RecentInquiryItem[] {
  return [...state.inquiries]
    .sort(
      (left, right) =>
        right.updatedAt.localeCompare(left.updatedAt) ||
        left.id.localeCompare(right.id),
    )
    .slice(0, limit)
    .map((inquiry) => ({
      id: inquiry.id,
      title: inquiry.title,
      customerName: inquiry.customer.name,
      transactionType: inquiry.transactionType,
      status: inquiry.status,
      updatedAt: inquiry.updatedAt,
    }));
}

export function formatDemoDate(value: string): string {
  const [year, month, day] = value.slice(0, 10).split("-");
  if (!year || !month || !day) return value;
  return `${year}. ${Number(month)}. ${Number(day)}.`;
}
