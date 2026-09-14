import { Building2, Mail, MapPin, Phone } from "lucide-react";

import type {
  DemoComplex,
  DemoDashboardMetrics,
  DemoOffice,
} from "@/demo/types";
import { DashboardCard, StatusBadge } from "./DashboardPrimitives";

interface OfficeProfileCardProps {
  office: DemoOffice;
  complexes: DemoComplex[];
  metrics: DemoDashboardMetrics;
}

export function OfficeProfileCard({
  office,
  complexes,
  metrics,
}: OfficeProfileCardProps) {
  return (
    <DashboardCard className="h-full" contentClassName="flex flex-col">
      <div className="shrink-0 border-b border-[#E5E8F2] pb-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex min-w-0 items-start gap-3">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#E8EDFF] text-[#1C2882]">
              <Building2 aria-hidden="true" className="h-5 w-5" />
            </span>
            <div className="min-w-0">
              <h2 className="text-xl font-semibold tracking-[-0.025em] text-[#182037]">
                {office.name}
              </h2>
              <p className="mt-1 text-sm font-medium text-[#737A8C]">
                {office.representativeName} 대표
              </p>
            </div>
          </div>
          <StatusBadge tone="primary" className="shrink-0">
            가상 사무소
          </StatusBadge>
        </div>
        <p className="mt-4 text-sm leading-6 text-[#5E6679]">
          {office.introduction}
        </p>
        <div className="mt-4 space-y-2 text-sm text-[#4D5673]">
          <ContactLine icon={MapPin} value={office.address} />
          <ContactLine icon={Phone} value={office.phone} />
          <ContactLine icon={Mail} value={office.email} />
        </div>
      </div>

      <div className="grid gap-5 pt-5 sm:grid-cols-2 lg:grid-cols-1 2xl:grid-cols-2">
        <InfoList
          label="주거래 단지"
          values={complexes.map((complex) => complex.name)}
        />
        <div>
          <p className="text-sm font-semibold text-[#737A8C]">사무소 정보</p>
          <dl className="mt-3 space-y-2 text-sm">
            <InfoPair label="개설등록번호" value={office.registrationNumber} />
            <InfoPair label="영업시간" value={office.businessHours} />
          </dl>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-3 gap-2 rounded-xl bg-[#F5F7FC] p-3">
        <Metric label="관심 매물" value={metrics.favoriteProperties} />
        <Metric label="상담 기록" value={metrics.consultationCount} />
        <Metric label="관리 단지" value={complexes.length} />
      </div>
    </DashboardCard>
  );
}

function ContactLine({
  icon: Icon,
  value,
}: {
  icon: typeof MapPin;
  value: string;
}) {
  return (
    <div className="flex items-start gap-2">
      <Icon
        aria-hidden="true"
        className="mt-0.5 h-4 w-4 shrink-0 text-[#7882A5]"
      />
      <span className="min-w-0 break-words">{value}</span>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg bg-white px-2 py-3 text-center">
      <strong className="text-lg font-bold text-[#182037]">{value}</strong>
      <p className="mt-1 text-[11px] font-semibold text-[#858B9B]">{label}</p>
    </div>
  );
}

function InfoPair({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid grid-cols-[88px_minmax(0,1fr)] gap-2">
      <dt className="text-[#858B9B]">{label}</dt>
      <dd className="break-words font-medium text-[#374056]">{value}</dd>
    </div>
  );
}

function InfoList({ label, values }: { label: string; values: string[] }) {
  const displayValues = values.length > 0 ? values : ["-"];

  return (
    <div className="min-w-0">
      <p className="text-sm font-semibold text-[#737A8C]">{label}</p>
      <div className="mt-3 flex flex-wrap gap-2">
        {displayValues.map((value) => (
          <span
            key={value}
            className="rounded-lg border border-[#E1E5F0] bg-white px-3 py-2 text-sm font-medium text-[#374056]"
          >
            {value}
          </span>
        ))}
      </div>
    </div>
  );
}
