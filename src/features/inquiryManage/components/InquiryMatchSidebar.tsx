import { useQuery } from "@tanstack/react-query";
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  MapPin,
  Phone,
  Scale,
  Sparkles,
  X,
  XCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import { DetailSidebar } from "@/shared/components/detail-sidebar";
import { formatNumber } from "@/shared/utils";
import { fetchInquiryDetail } from "../services/inquiryService";
import {
  INQUIRY_STATUS_LABELS,
  MANAGE_TYPE_LABELS,
  REQUEST_TYPE_LABELS,
} from "../types/enums";
import type { Inquiry } from "../types/inquiry";

interface InquiryMatchSidebarProps {
  inquiry?: Inquiry;
  onClose: () => void;
}

export function InquiryMatchSidebar({
  inquiry,
  onClose,
}: InquiryMatchSidebarProps) {
  const navigate = useNavigate();
  const { data, isLoading, isError } = useQuery({
    queryKey: ["inquiry-detail", inquiry?.inquiryId],
    queryFn: () => fetchInquiryDetail(inquiry!.inquiryId),
    enabled: Boolean(inquiry),
  });

  return (
    <DetailSidebar
      header={
        <div className="border-b border-[#E2E6F0] px-6 py-5">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <div className="mb-2 flex items-center gap-2">
                <span className="rounded-full bg-[#E8EDFF] px-2.5 py-1 text-xs font-semibold text-[#1C2882]">
                  문의 상세
                </span>
                {inquiry ? (
                  <span className="text-xs text-[#7A8295]">
                    #{String(inquiry.inquiryId).padStart(3, "0")}
                  </span>
                ) : null}
              </div>
              <h2 className="truncate text-xl font-bold text-[#222A3A]">
                {inquiry?.title ?? "문의를 선택하세요"}
              </h2>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="문의 상세 닫기"
              className="rounded-lg p-2 text-[#7A8295] transition-colors hover:bg-[#F3F5FA] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1C2882]"
            >
              <X aria-hidden="true" className="h-5 w-5" />
            </button>
          </div>
        </div>
      }
      contentClassName="p-6 gap-5"
    >
      {!inquiry ? (
        <EmptyMessage>
          문의 행을 선택하면 상세 조건을 볼 수 있습니다.
        </EmptyMessage>
      ) : isLoading ? (
        <EmptyMessage>적합한 매물을 계산하고 있습니다.</EmptyMessage>
      ) : isError || !data ? (
        <EmptyMessage>문의 상세 정보를 불러오지 못했습니다.</EmptyMessage>
      ) : (
        <>
          <section className="rounded-xl border border-[#E1E5F0] bg-[#FAFBFF] p-5">
            <div className="flex flex-wrap gap-2">
              <Tag>{REQUEST_TYPE_LABELS[inquiry.requestType]}</Tag>
              <Tag>{INQUIRY_STATUS_LABELS[inquiry.inquiryStatus ?? "NEW"]}</Tag>
              <Tag>{MANAGE_TYPE_LABELS[inquiry.manageType]}</Tag>
            </div>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <InfoRow
                icon={<Phone aria-hidden="true" />}
                label="고객"
                value={`${inquiry.inquirerInfo.inquirerName} · ${inquiry.inquirerInfo.contractPhone}`}
              />
              <InfoRow
                icon={<MapPin aria-hidden="true" />}
                label="희망 지역"
                value={
                  data.desiredComplexNames.join(", ") ||
                  data.inquiry.desiredDongs.join(", ") ||
                  data.inquiry.desiredDistricts.join(", ") ||
                  "제한 없음"
                }
              />
              <InfoRow
                icon={<Scale aria-hidden="true" />}
                label="희망 면적"
                value={`${data.inquiry.area.min}~${data.inquiry.area.max}㎡`}
              />
              <InfoRow
                icon={<ArrowRight aria-hidden="true" />}
                label="입주 희망일"
                value={data.inquiry.moveInBy || "미지정"}
              />
            </div>
            {data.inquiry.privateNote ? (
              <div className="mt-5 rounded-lg bg-white p-4">
                <p className="text-xs font-semibold text-[#7A8295]">
                  내부 메모
                </p>
                <p className="mt-2 text-sm leading-6 text-[#37405A]">
                  {data.inquiry.privateNote}
                </p>
              </div>
            ) : null}
          </section>

          <section>
            <div className="mb-3 flex items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <Sparkles
                    aria-hidden="true"
                    className="h-5 w-5 text-[#6577D8]"
                  />
                  <h3 className="font-bold text-[#222A3A]">조건 매칭 매물</h3>
                </div>
                <p className="mt-1 text-xs leading-5 text-[#7A8295]">
                  거래 35 · 위치 25 · 면적 20 · 가격 20점
                </p>
              </div>
              <span className="rounded-full bg-[#F1F3F8] px-3 py-1 text-xs font-semibold text-[#596174]">
                {data.matches.length}건
              </span>
            </div>

            <div className="space-y-3">
              {data.matches.length === 0 ? (
                <EmptyMessage>35점 이상인 보유 매물이 없습니다.</EmptyMessage>
              ) : (
                data.matches.map((match) => (
                  <button
                    key={match.apartmentId}
                    type="button"
                    onClick={() => {
                      const params = new URLSearchParams({
                        complexName: match.complexName,
                        apartmentId: String(match.apartmentId),
                      });
                      navigate(`/property-manage?${params.toString()}`);
                    }}
                    className="w-full rounded-xl border border-[#DFE4F0] bg-white p-4 text-left transition-all hover:-translate-y-0.5 hover:border-[#AEB9EA] hover:shadow-[0_12px_24px_-20px_rgba(28,40,130,0.8)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1C2882]"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <p className="truncate font-bold text-[#222A3A]">
                          {match.complexName} {match.building} {match.unit}
                        </p>
                        <p className="mt-1 text-xs text-[#737B8E]">
                          전용 {match.exclusiveArea}㎡ ·{" "}
                          {formatMatchPrice(match)}
                        </p>
                      </div>
                      <div className="shrink-0 text-right">
                        <strong className="text-2xl font-bold text-[#1C2882]">
                          {match.score}
                        </strong>
                        <span className="text-xs text-[#8D94A6]">/100</span>
                      </div>
                    </div>
                    <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-[#EEF0F5]">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-[#6577D8] to-[#1C2882]"
                        style={{ width: `${match.score}%` }}
                      />
                    </div>
                    <div className="mt-3 space-y-1.5">
                      {match.reasons.map((reason) => (
                        <p
                          key={reason.message}
                          className="flex items-start gap-2 text-xs leading-5 text-[#5F687C]"
                        >
                          <ReasonIcon level={reason.level} />
                          {reason.message}
                        </p>
                      ))}
                    </div>
                  </button>
                ))
              )}
            </div>
          </section>
        </>
      )}
    </DetailSidebar>
  );
}

function ReasonIcon({ level }: { level: "match" | "partial" | "miss" }) {
  const className = "mt-0.5 h-3.5 w-3.5 shrink-0";

  if (level === "partial") {
    return (
      <AlertCircle
        aria-hidden="true"
        className={`${className} text-[#C48A22]`}
      />
    );
  }

  if (level === "miss") {
    return (
      <XCircle aria-hidden="true" className={`${className} text-[#C35B5B]`} />
    );
  }

  return (
    <CheckCircle2
      aria-hidden="true"
      className={`${className} text-[#4D9B72]`}
    />
  );
}

function Tag({ children }: { children: string }) {
  return (
    <span className="rounded-full border border-[#DCE2F6] bg-white px-3 py-1 text-xs font-semibold text-[#445074]">
      {children}
    </span>
  );
}

function InfoRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="min-w-0">
      <p className="flex items-center gap-1.5 text-xs font-semibold text-[#7A8295] [&_svg]:h-3.5 [&_svg]:w-3.5">
        {icon}
        {label}
      </p>
      <p className="mt-1.5 truncate text-sm font-semibold text-[#37405A]">
        {value}
      </p>
    </div>
  );
}

function EmptyMessage({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-36 items-center justify-center rounded-xl border border-dashed border-[#D9DEEB] bg-[#FAFBFD] px-6 text-center text-sm leading-6 text-[#7A8295]">
      {children}
    </div>
  );
}

function formatMatchPrice(
  match: Awaited<ReturnType<typeof fetchInquiryDetail>>["matches"][number],
): string {
  if (match.transactionType === "SALE") {
    return `매매 ${formatNumber(match.price.sale)}만원`;
  }
  if (match.transactionType === "JEONSE") {
    return `전세 ${formatNumber(match.price.jeonse)}만원`;
  }
  return `월세 ${formatNumber(match.price.monthlyDeposit)}/${formatNumber(match.price.monthlyRent)}만원`;
}
