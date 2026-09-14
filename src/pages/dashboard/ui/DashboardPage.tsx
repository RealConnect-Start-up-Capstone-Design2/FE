import { ArrowRight, DatabaseZap, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";

import { isDemoRuntime } from "@/demo/session";
import { selectDashboardMetrics } from "@/demo/selectors";
import { useDemoState } from "@/demo/useDemoState";
import {
  buildDashboardKpis,
  buildPipeline,
  buildRecentInquiries,
  buildSchedule,
} from "../model/dashboardViewModel";
import { DashboardKpiStrip } from "./DashboardKpiStrip";
import { DemoGuideCard } from "./DemoGuideCard";
import { OfficeProfileCard } from "./OfficeProfileCard";
import { PipelineCard } from "./PipelineCard";
import { RecentInquiryCard } from "./RecentInquiryCard";
import { ScheduleCard } from "./ScheduleCard";

export function DashboardPage() {
  return isDemoRuntime() ? <DemoDashboard /> : <ApiDashboardNotice />;
}

function DemoDashboard() {
  const state = useDemoState();
  const metrics = selectDashboardMetrics(state);

  return (
    <main className="mx-auto w-full max-w-[1540px] pb-8">
      <header className="mb-6 rounded-2xl border border-[#DDE2F2] bg-white p-5 shadow-[0_12px_36px_-24px_rgba(28,40,130,0.42)] sm:p-6">
        <h1 className="text-2xl font-bold tracking-[-0.03em] text-[#17216D] sm:text-3xl">
          중개 업무 대시보드
        </h1>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-[#697083] sm:text-base">
          매물, 문의, 상담, 계약이 하나의 원장으로 연결됩니다. 다른 화면에서
          상태를 바꾸면 아래 지표도 바로 갱신됩니다.
        </p>
      </header>

      <DashboardKpiStrip kpis={buildDashboardKpis(state)} />

      <div className="mt-4 grid gap-4 lg:grid-cols-12">
        <div className="lg:col-span-5 2xl:col-span-4">
          <OfficeProfileCard
            office={state.office}
            complexes={state.complexes}
            metrics={metrics}
          />
        </div>
        <div className="lg:col-span-7 2xl:col-span-8">
          <PipelineCard stages={buildPipeline(state)} />
        </div>
        <div className="lg:col-span-7">
          <ScheduleCard items={buildSchedule(state)} />
        </div>
        <div className="lg:col-span-5">
          <RecentInquiryCard inquiries={buildRecentInquiries(state)} />
        </div>
        <div className="lg:col-span-12">
          <DemoGuideCard />
        </div>
      </div>
    </main>
  );
}

export function ApiDashboardNotice() {
  return (
    <main className="mx-auto w-full max-w-[1120px] pb-8">
      <header className="rounded-2xl border border-[#DDE2F2] bg-white p-6 shadow-[0_12px_36px_-24px_rgba(28,40,130,0.42)] sm:p-8">
        <div className="inline-flex items-center gap-2 rounded-full border border-[#C8D2FF] bg-[#F0F3FF] px-3 py-1.5 text-xs font-bold tracking-[0.08em] text-[#1C2882]">
          <DatabaseZap aria-hidden="true" className="h-3.5 w-3.5" />
          API DATA SOURCE
        </div>
        <h1 className="mt-5 text-2xl font-bold tracking-[-0.03em] text-[#17216D] sm:text-3xl">
          운영 데이터 모드
        </h1>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-[#697083] sm:text-base">
          이 환경은 API 데이터만 사용하도록 설정되어 있습니다. 샘플 사무소, 고객
          정보와 데모 KPI는 운영 데이터로 오인되지 않도록 표시하지 않습니다.
        </p>
      </header>

      <section className="mt-4 overflow-hidden rounded-2xl border border-[#E2E6F1] bg-white shadow-[0_12px_36px_-24px_rgba(28,40,130,0.42)]">
        <div className="p-6 sm:p-8">
          <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#E8EDFF] text-[#1C2882]">
            <ShieldCheck aria-hidden="true" className="h-6 w-6" />
          </span>
          <h2 className="mt-5 text-xl font-semibold tracking-[-0.02em] text-[#182037]">
            실데이터 대시보드 집계는 아직 연결되지 않았습니다
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-[#697083]">
            API 응답 계약이 확정되기 전까지 임의의 수치나 샘플 고객을 대신
            보여주지 않습니다. API가 연결된 환경에서는 아래 업무 화면에서 실제
            응답을 확인할 수 있습니다.
          </p>

          <nav aria-label="API 업무 화면" className="mt-6 flex flex-wrap gap-3">
            <DashboardLink to="/property-manage">매물장 열기</DashboardLink>
            <DashboardLink to="/inquiry-manage">문의장 열기</DashboardLink>
          </nav>
        </div>
        <div className="border-t border-[#E5E8F2] bg-[#F7F8FC] px-6 py-4 text-sm font-medium leading-6 text-[#5E6679] sm:px-8">
          데모와 운영 데이터의 경계를 분리해, 연결되지 않은 기능은 연결된 것처럼
          표현하지 않습니다.
        </div>
      </section>
    </main>
  );
}

function DashboardLink({
  to,
  children,
}: {
  to: "/property-manage" | "/inquiry-manage";
  children: string;
}) {
  return (
    <Link
      to={to}
      className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-[#1C2882] px-4 text-sm font-semibold text-white transition-colors hover:bg-[#17216D] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1C2882] focus-visible:ring-offset-2"
    >
      {children}
      <ArrowRight aria-hidden="true" className="h-4 w-4" />
    </Link>
  );
}
