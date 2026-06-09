import { useState } from "react";
import {
  Building2,
  Globe,
  MapPin,
  Phone,
  Sparkles,
  Store,
  Tag,
  User,
} from "lucide-react";
import { WebsiteStudioPanel } from "../../../components/website-generator/WebsiteStudioPanel";
import { useCrmContext } from "../../../components/website-generator/useCrmContext";
import { cn } from "../../../lib/utils";

export default function App() {
  const [studioOpen, setStudioOpen] = useState(false);
  // 로그인 계정의 사무소(목업). 기존 CRM_CONTEXT.x 참조를 그대로 쓰도록 같은 이름으로 받는다.
  const CRM_CONTEXT = useCrmContext();

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 text-slate-900">
      {/* 왼쪽: CRM 대시보드 (스튜디오 열리면 좁아짐) */}
      <div
        className={cn(
          "flex h-full flex-col overflow-y-auto transition-all duration-500",
          studioOpen
            ? "w-[380px] shrink-0 border-r border-slate-200"
            : "w-full",
        )}
      >
        {/* <header className="sticky top-0 z-10 border-b border-slate-200 bg-white">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
            <div className="flex items-center gap-2">
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-brand-600 text-white">
                <Building2 className="h-5 w-5" />
              </span>
              <span className="text-lg font-bold">RealConnect</span>
              <span className="ml-1 rounded-md bg-slate-100 px-2 py-0.5 text-xs text-slate-500">
                매물 CRM
              </span>
            </div>
            {!studioOpen && (
              <nav className="hidden gap-6 text-sm font-medium text-slate-500 md:flex">
                <span>대시보드</span>
                <span>매물 관리</span>
                <span>고객</span>
                <span className="text-brand-600">웹사이트</span>
              </nav>
            )}
            <div className="flex items-center gap-2 text-sm">
              <span className="grid h-8 w-8 place-items-center rounded-full bg-brand-100 font-bold text-brand-700">
                {CRM_CONTEXT.agentName.charAt(0)}
              </span>
            </div>
          </div>
        </header> */}

        <main className="mx-auto w-full max-w-6xl px-6 py-8">
          <div className="mb-6">
            <h1 className="text-2xl font-bold">
              {CRM_CONTEXT.agentName} 님, 안녕하세요
            </h1>
            <p className="mt-1 flex items-center gap-1.5 text-slate-500">
              <MapPin className="h-4 w-4 text-brand-600" />
              {CRM_CONTEXT.agencyName} · {CRM_CONTEXT.region}
            </p>
          </div>

          {/* 통계 카드 — 스튜디오 열리면 1열로 */}
          <div
            className={cn(
              "mb-8 grid gap-4",
              studioOpen ? "grid-cols-1" : "grid-cols-1 sm:grid-cols-3",
            )}
          >
            <StatCard
              icon={<Building2 className="h-5 w-5" />}
              label="연동 매물"
              value={CRM_CONTEXT.listingCount + "건"}
              sub="사이트에 자동 게시"
            />
            <StatCard
              icon={<MapPin className="h-5 w-5" />}
              label="지역 · 단지"
              value={CRM_CONTEXT.complex}
              sub={CRM_CONTEXT.region}
            />
            <StatCard
              icon={<Phone className="h-5 w-5" />}
              label="대표 연락처"
              value={CRM_CONTEXT.phone}
              sub="상담 버튼으로 연결"
            />
            <StatCard
              icon={<Store className="h-5 w-5" />}
              label="사무소"
              value={CRM_CONTEXT.agencyName}
              sub="사이트 상호 · 푸터"
            />
            <StatCard
              icon={<User className="h-5 w-5" />}
              label="대표 중개사"
              value={CRM_CONTEXT.agentName}
              sub="소개 · 상담 담당"
            />
            <StatCard
              icon={<Tag className="h-5 w-5" />}
              label="거래 유형"
              value="매매 · 전세 · 월세"
              sub="매물 필터 자동 구성"
            />
          </div>

          {/* 웹사이트 생성 카드 */}
          <div className="overflow-hidden rounded-3xl border border-brand-100 bg-gradient-to-br from-brand-50 to-white p-8">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-brand-600 px-3 py-1 text-xs font-semibold text-white">
              <Sparkles className="h-3.5 w-3.5" />
              NEW
            </div>
            <h2 className="mt-4 max-w-xl text-2xl font-black leading-snug">
              내 매물로 나만의 부동산 웹사이트를 자동으로
            </h2>
            <p className="mt-3 max-w-lg text-slate-500">
              지금 등록된{" "}
              <b className="text-slate-700">{CRM_CONTEXT.listingCount}건</b>의
              매물과 <b className="text-slate-700">{CRM_CONTEXT.region}</b> 지역
              정보를 그대로 연동해, 고객에게 보여줄 전용 웹사이트를 AI가 만들어
              드립니다.
            </p>
            <button
              onClick={() => setStudioOpen(true)}
              disabled={studioOpen}
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-brand-600 px-6 py-3 font-semibold text-white shadow-lg shadow-brand-600/20 transition hover:bg-brand-700 disabled:opacity-50"
            >
              <Globe className="h-5 w-5" />
              {studioOpen ? "스튜디오 작업 중…" : "내 웹사이트 만들기"}
            </button>
          </div>
        </main>
      </div>

      {/* 오른쪽: 웹사이트 스튜디오 (브라우저 패널) */}
      {studioOpen && (
        <div className="h-full flex-1 overflow-hidden p-3">
          <WebsiteStudioPanel onClose={() => setStudioOpen(false)} />
        </div>
      )}
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  sub,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5">
      <div className="flex items-center gap-2 text-slate-400">
        <span className="grid h-8 w-8 place-items-center rounded-lg bg-brand-50 text-brand-600">
          {icon}
        </span>
        <span className="text-sm font-medium text-slate-500">{label}</span>
      </div>
      <p className="mt-3 text-2xl font-black text-slate-900">{value}</p>
      <p className="mt-0.5 text-xs text-slate-400">{sub}</p>
    </div>
  );
}
