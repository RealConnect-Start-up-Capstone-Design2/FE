import { dashboardData } from "../model/dashboardData";
import { DashboardKpiStrip } from "./DashboardKpiStrip";
import { ExpiryAlertCard } from "./ExpiryAlertCard";
import { OfficeProfileCard } from "./OfficeProfileCard";
import { RequestSummaryCard } from "./RequestSummaryCard";
import { ShareAlertCard } from "./ShareAlertCard";
import { SystemNoticeCard } from "./SystemNoticeCard";

export function DashboardPage() {
  return (
    <main className="w-full min-w-[1471px]">
      <header className="shrink-0">
        <h1 className="text-[32px] font-bold tracking-[-0.025em] text-[#1C2882]">
          대시보드
        </h1>
        <p className="mt-1 text-[18px] font-medium tracking-[-0.025em] text-[#989898]">
          내 부동산의 대략적인 정보를 보여줍니다
        </p>
      </header>

      <DashboardKpiStrip kpis={dashboardData.kpis} />

      <div className="mt-5 grid h-[640px] grid-cols-[minmax(435px,1fr)_minmax(496px,1.08fr)_minmax(500px,1.12fr)] grid-rows-[332px_288px] gap-5 pb-1">
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
