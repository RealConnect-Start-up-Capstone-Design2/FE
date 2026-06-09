import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";

import { fetchProfile } from "@/shared/api/mypage";
import { fetchPreferredComplexList } from "@/shared/api/region";
import { formatPhoneNumber } from "@/shared/utils";
import { useAuthStore } from "@/features/auth/stores";
import { getCrmContext } from "@/config";
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

  // 로그인 계정 기준 사무소(목업). BE 응답이 없을 때 "-" 대신 이 값으로 폴백한다.
  const username = useAuthStore((s) => s.username);
  const crm = getCrmContext(username);

  const office = {
    ...dashboardData.office,
    name: profile?.officeName || crm.agencyName,
    representative: profile?.name
      ? `${profile.name} (대표)`
      : `${crm.agentName} (대표)`,
    plan:
      profile?.membershipType && profile.membershipType !== "대표"
        ? profile.membershipType
        : "Basic",
    phone:
      formatPhoneNumber(
        profile?.officePhone || profile?.phone || profile?.contact,
      ) || crm.phone,
    businessNumber: "-",
    registrationNumber: "-",
    mainComplexes:
      Array.isArray(preferredComplexes) && preferredComplexes.length > 0
        ? preferredComplexes.map((complex) => complex.apartmentName)
        : [crm.complex],
  };
  const expiryAlerts = useMemo(
    () =>
      dashboardData.expiryAlerts.map((alert) => {
        const preferredComplex = preferredComplexes?.find(
          (complex) =>
            complex.apartmentName.trim() ===
            alert.apartmentComplexName.trim(),
        );

        return preferredComplex
          ? {
              ...alert,
              apartmentComplexId: preferredComplex.apartmentComplexId,
            }
          : alert;
      }),
    [preferredComplexes],
  );

  // 전체 매물 KPI가 정적값(20)으로 고정돼 있어, 로그인 계정 매물 수로 맞춘다.
  const kpis = dashboardData.kpis.map((kpi) =>
    kpi.id === "properties"
      ? {
          ...kpi,
          value: String(crm.listingCount),
          helper: `활성 ${crm.listingCount - 2}건`,
        }
      : kpi,
  );

  // 만기 알림 목업이 단지명("파크리오")으로 고정돼 있어, 로그인 계정 단지로 맞춘다.
  const expiryAlerts = dashboardData.expiryAlerts.map((alert) => ({
    ...alert,
    propertyTitle: `${crm.complex} 아파트 ${alert.dong}동 ${alert.ho}호`,
  }));

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

      <DashboardKpiStrip kpis={kpis} />

      <div className="mt-5 grid h-[640px] grid-cols-[minmax(435px,1fr)_minmax(496px,1.08fr)_minmax(500px,1.12fr)] grid-rows-[332px_288px] gap-5 pb-1">
        <OfficeProfileCard office={office} />
        <RequestSummaryCard summaries={dashboardData.requestSummaries} />
        <SystemNoticeCard notices={dashboardData.systemNotices} />
        <ExpiryAlertCard alerts={expiryAlerts} />
        {dashboardData.unsupportedFeatures.map((feature) => (
          <ShareAlertCard key={feature.id} feature={feature} />
        ))}
      </div>
    </main>
  );
}
