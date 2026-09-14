import { ArrowRight, ClipboardCheck, ListChecks, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

const guideSteps = [
  {
    number: "01",
    title: "매물장을 살펴보세요",
    description: "검색·필터·즐겨찾기와 상세 상담 기록을 확인합니다.",
    href: "/property-manage" as const,
    icon: ListChecks,
    cta: "매물장 열기",
  },
  {
    number: "02",
    title: "문의 흐름을 바꿔보세요",
    description: "문의 등록과 상태 변경이 대시보드 지표에 바로 반영됩니다.",
    href: "/inquiry-manage" as const,
    icon: ClipboardCheck,
    cta: "문의장 열기",
  },
  {
    number: "03",
    title: "조건 매칭을 확인하세요",
    description: "거래유형·위치·면적·가격 근거로 추천 매물을 비교합니다.",
    href: "/inquiry-manage" as const,
    icon: Sparkles,
    cta: "추천 보기",
  },
];

export function DemoGuideCard() {
  return (
    <section
      aria-labelledby="demo-guide-title"
      className="overflow-hidden rounded-2xl bg-[#17216D] text-white shadow-[0_18px_42px_-24px_rgba(23,33,109,0.72)]"
    >
      <div className="border-b border-white/10 px-5 py-5 sm:px-6">
        <p className="text-xs font-bold tracking-[0.16em] text-[#AEBBFF]">
          PORTFOLIO WALKTHROUGH
        </p>
        <h2 id="demo-guide-title" className="mt-2 text-xl font-semibold">
          3분 안에 핵심 흐름을 체험해 보세요
        </h2>
      </div>
      <ol className="grid gap-px bg-white/10 lg:grid-cols-3">
        {guideSteps.map((step) => {
          const Icon = step.icon;
          return (
            <li key={step.number} className="bg-[#17216D] p-5 sm:p-6">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-[#AEBBFF]">
                  {step.number}
                </span>
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10">
                  <Icon aria-hidden="true" className="h-4 w-4" />
                </span>
              </div>
              <h3 className="mt-5 font-semibold">{step.title}</h3>
              <p className="mt-2 min-h-10 text-sm leading-5 text-[#CCD3F8]">
                {step.description}
              </p>
              <Link
                to={step.href}
                className="mt-5 inline-flex items-center gap-2 rounded-md text-sm font-semibold text-white underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                {step.cta}
                <ArrowRight aria-hidden="true" className="h-4 w-4" />
              </Link>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
