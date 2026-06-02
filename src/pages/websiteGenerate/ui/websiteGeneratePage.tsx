import { useState } from "react";
import "./websiteGeneratePage.css";
import { Sparkles } from "lucide-react";
import { WebsiteGeneratorModal } from "@/components/website-generator/WebsiteGeneratorModal";

export default function WebsiteGeneratorPage() {
  const [open, setOpen] = useState(false);

  return (
    <main className="flex min-h-full w-full flex-col text-slate-900">
      <header className="shrink-0">
        <h1 className="text-[32px] font-bold tracking-[-0.025em] text-[#1C2882]">
          홈페이지 생성
        </h1>
        <p className="mt-1 text-[18px] font-medium tracking-[-0.025em] text-[#989898]">
          내 매물 데이터로 중개사무소 전용 웹사이트를 자동 생성합니다
        </p>
      </header>

      <section className="mt-8 w-full flex-1">
        <div className="flex min-h-[420px] flex-col justify-center overflow-hidden rounded-xl border border-[#D4D8E5] bg-gradient-to-br from-[#F8FAFF] to-white p-10 shadow-[0px_0px_25px_-18px_rgba(177,182,199,1)]">
          <div className="inline-flex w-fit items-center gap-1.5 rounded-full bg-brand-600 px-3 py-1 text-xs font-semibold text-white">
            <Sparkles className="h-3.5 w-3.5" />
            NEW
          </div>
          <h1 className="mt-4 max-w-xl text-3xl font-black leading-snug">
            내 매물로 나만의 웹사이트를
            <br />
            1분 만에 자동 생성
          </h1>
          <p className="mt-3 max-w-lg text-slate-500">
            RealConnect에 등록된 매물 데이터를 분석해, 고객에게 보여줄 전용
            웹사이트를 AI가 자동으로 만들어 드립니다.
          </p>
          <button
            onClick={() => setOpen(true)}
            className="mt-7 inline-flex w-fit items-center gap-2 rounded-xl bg-brand-600 px-6 py-3 font-semibold text-white shadow-lg shadow-brand-600/20 transition hover:bg-brand-700"
          >
            <Sparkles className="h-5 w-5" />
            AI 웹사이트 생성하기
          </button>
        </div>
      </section>

      <WebsiteGeneratorModal open={open} onClose={() => setOpen(false)} />
    </main>
  );
}
