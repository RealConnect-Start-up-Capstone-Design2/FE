import { dashboardData } from "../model/dashboardData";
import { DashboardKpiStrip } from "./DashboardKpiStrip";
import { ExpiryAlertCard } from "./ExpiryAlertCard";
import { OfficeProfileCard } from "./OfficeProfileCard";
import { RequestSummaryCard } from "./RequestSummaryCard";
import { ShareAlertCard } from "./ShareAlertCard";
import { SystemNoticeCard } from "./SystemNoticeCard";

export function DashboardPage() {
  return (
    <main className="flex h-[calc(100vh-72px)] min-h-0 flex-col overflow-hidden bg-[#FDFEFE]">
      <header className="shrink-0">
        <h1 className="text-[32px] font-bold tracking-[-0.025em] text-[#1C2882]">
          대시보드
        </h1>
        <p className="mt-1 text-[18px] font-medium tracking-[-0.025em] text-[#989898]">
          내 부동산의 대략적인 정보를 보여줍니다
        </p>
      </header>

      <DashboardKpiStrip kpis={dashboardData.kpis} />

      <div className="mt-5 grid min-h-0 flex-1 grid-cols-[435px_496px_500px] grid-rows-[minmax(0,332px)_minmax(0,1fr)] gap-5 overflow-x-auto overflow-y-hidden pb-1">
        <OfficeProfileCard office={dashboardData.office} />
        <RequestSummaryCard summaries={dashboardData.requestSummaries} />
        <SystemNoticeCard notices={dashboardData.systemNotices} />
        <ExpiryAlertCard alerts={dashboardData.expiryAlerts} />
        {dashboardData.unsupportedFeatures.map((feature) => (
          <ShareAlertCard key={feature.id} feature={feature} />
        ))}
      </div>
    </main>
  );
}
