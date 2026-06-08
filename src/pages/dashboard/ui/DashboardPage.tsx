import { useQuery } from "@tanstack/react-query";

import { fetchProfile } from "@/shared/api/mypage";
import { fetchPreferredComplexList } from "@/shared/api/region";
import { formatPhoneNumber } from "@/shared/utils";
import { dashboardData } from "../model/dashboardData";
import { DashboardKpiStrip } from "./DashboardKpiStrip";
import { ExpiryAlertCard } from "./ExpiryAlertCard";
import { OfficeProfileCard } from "./OfficeProfileCard";
import { RequestSummaryCard } from "./RequestSummaryCard";
import { ShareAlertCard } from "./ShareAlertCard";
import { SystemNoticeCard } from "./SystemNoticeCard";

export function DashboardPage() {
  const { data: profile } = useQuery({
    queryKey: ["profile"],
    queryFn: fetchProfile,
  });
  const { data: preferredComplexes } = useQuery({
    queryKey: ["preferredComplexes"],
    queryFn: fetchPreferredComplexList,
  });

  const office = {
    ...dashboardData.office,
    name: profile?.officeName || "-",
    representative: profile?.name ? `${profile.name} (대표)` : "-",
    plan:
      profile?.membershipType && profile.membershipType !== "대표"
        ? profile.membershipType
        : "Basic",
    phone:
      formatPhoneNumber(
        profile?.officePhone || profile?.phone || profile?.contact,
      ) || "-",
    businessNumber: "-",
    registrationNumber: "-",
    mainComplexes:
      preferredComplexes?.map((complex) => complex.apartmentName) ?? [],
  };

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
        <OfficeProfileCard office={office} />
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
