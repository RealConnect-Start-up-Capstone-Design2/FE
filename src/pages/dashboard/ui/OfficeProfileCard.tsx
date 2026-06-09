import { useState } from "react";
import { Loader2, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { Button } from "@/shared/ui";
import type { DashboardData } from "../model/types";
import { DashboardCard, StatusBadge } from "./DashboardPrimitives";

interface OfficeProfileCardProps {
  office: DashboardData["office"];
}

export function OfficeProfileCard({ office }: OfficeProfileCardProps) {
  const navigate = useNavigate();
  // 즉시 이동하면 목업 티가 나서, 1.5초 준비 연출 후 스튜디오로 이동
  const [generating, setGenerating] = useState(false);

  function handleGenerate() {
    setGenerating(true);
    setTimeout(() => navigate("/website-generate"), 1500);
  }

  return (
    <DashboardCard className="h-full" contentClassName="flex flex-col">
      <div className="shrink-0 border-b border-[#D4D8E5] pb-5">
        <div className="flex items-start justify-between gap-4">
          <h2 className="min-w-0 flex-1 text-[24px] font-semibold tracking-[-0.025em] text-[#1B1B1B]">
            {office.name}
          </h2>
          <Button
            onClick={handleGenerate}
            disabled={generating}
            className="h-[35px] shrink-0 rounded-lg bg-[#1B1B1B] px-4 text-[16px] font-semibold tracking-[-0.025em] text-white shadow-none hover:bg-[#2A2A2A] disabled:opacity-60"
          >
            {generating ? (
              <Loader2 className="h-[14px] w-[14px] animate-spin" />
            ) : (
              <Plus className="h-[14px] w-[14px]" />
            )}
            {generating ? "준비 중…" : "홈페이지 생성"}
          </Button>
        </div>
        <div className="mt-5 flex items-end gap-2">
          <p className="text-[22px] font-semibold tracking-[-0.025em] text-[#1B1B1B]">
            {office.representative}
          </p>
          <span className="flex h-5 items-center rounded-full bg-[#EDEDED] px-[14px] text-[12px] font-medium tracking-[-0.025em] text-[#989898]">
            {office.plan}
          </span>
        </div>
        <p className="mt-2 text-[15px] font-medium tracking-[-0.025em] text-[#1B1B1B]">
          {office.phone}
        </p>
        <div className="mt-5 grid grid-cols-2 gap-x-8 gap-y-4">
          <InfoPair label="사업자등록번호" value={office.businessNumber} />
          <InfoPair label="개설등록번호" value={office.registrationNumber} />
        </div>
      </div>

      <div className="grid min-h-0 flex-1 grid-cols-[minmax(0,1fr)_auto] gap-x-5 gap-y-3 pt-4">
        <InfoList
          label="주거래 단지"
          values={office.mainComplexes.slice(0, 3)}
          className="col-span-2"
        />
        <InfoList label="공유 그룹" values={office.shareGroups} />
        <Button className="mt-6 h-[35px] rounded-lg bg-[#1B1B1B] px-4 text-[16px] font-semibold tracking-[-0.025em] text-white shadow-none hover:bg-[#2A2A2A]">
          <Plus className="h-[14px] w-[14px]" />
          그룹 설정
        </Button>
        <div className="col-span-2 mt-1 rounded-lg bg-[#F8FAFF] p-4">
          <p className="mb-3 text-[15px] font-semibold tracking-[-0.025em] text-[#8D8D8D]">
            오늘 업무 상태
          </p>
          <div className="flex flex-wrap gap-2">
            {office.todayTasks.map((task) => (
              <StatusBadge key={task.label} tone={task.tone}>
                {task.label} {task.value}
              </StatusBadge>
            ))}
          </div>
        </div>
      </div>
    </DashboardCard>
  );
}

function InfoPair({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-[7px]">
      <p className="text-[18px] font-medium tracking-[-0.025em] text-[#8D8D8D]">
        {label}
      </p>
      <p className="text-[15px] font-medium tracking-[-0.025em] text-[#1B1B1B]">
        {value}
      </p>
    </div>
  );
}

function InfoList({
  label,
  values,
  className,
}: {
  label: string;
  values: string[];
  className?: string;
}) {
  const displayValues = values.length > 0 ? values : ["-"];

  return (
    <div className={`flex min-w-0 flex-col gap-[7px] ${className ?? ""}`}>
      <p className="text-[18px] font-medium tracking-[-0.025em] text-[#8D8D8D]">
        {label}
      </p>
      {displayValues.map((value) => (
        <p
          key={value}
          className="truncate text-[15px] font-medium tracking-[-0.025em] text-[#1B1B1B]"
        >
          {value}
        </p>
      ))}
    </div>
  );
}
