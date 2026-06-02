export interface ExpiryAlert {
  id: number;
  apartmentComplexId: number;
  apartmentId: number;
  dong: string;
  ho: string;
  daysLeft: number;
  owner: string;
  dealType: string;
  expiryDate: string;
  propertyTitle: string;
  tone: "danger" | "warning" | "success";
}

export interface DashboardKpi {
  id: string;
  label: string;
  value: string;
  helper: string;
  tone: "primary" | "danger" | "warning" | "success";
}

export interface RequestSummaryItem {
  label: string;
  value: string;
  tone: "primary" | "danger" | "warning" | "success";
}

export interface RequestSummary {
  title: string;
  count: string;
  description: string;
  // items: RequestSummaryItem[];
  delta: string;
}

export interface UnsupportedFeatureStatus {
  id: "property-share" | "inquiry-share";
  title: string;
  eyebrow: string;
  description: string;
  // badges: {
  //   label: string;
  //   tone: "primary" | "warning" | "success";
  // }[];
}

export interface SystemNotice {
  id: number;
  title: string;
  description: string;
  date: string;
  tone: "primary" | "warning" | "success";
}

export interface DashboardData {
  office: {
    name: string;
    representative: string;
    plan: string;
    phone: string;
    businessNumber: string;
    registrationNumber: string;
    mainComplexes: string[];
    shareGroups: string[];
    todayTasks: {
      label: string;
      value: string;
      tone: "primary" | "danger" | "warning" | "success";
    }[];
  };
  kpis: DashboardKpi[];
  requestSummaries: RequestSummary[];
  systemNotices: SystemNotice[];
  expiryAlerts: ExpiryAlert[];
  unsupportedFeatures: UnsupportedFeatureStatus[];
}
