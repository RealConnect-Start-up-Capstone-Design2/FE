import { useState } from "react";
import type { RealtorMember } from "../types/admin";
import { AdminMemoBlock } from "./AdminMemoBlock";
import { Check, X } from "lucide-react";

interface MemberDetailModalProps {
  member: RealtorMember | null;
  onClose: () => void;
  onApprove?: (memberId: string) => void;
  onReject?: (memberId: string) => void;
}

interface MemberInfo {
  label: string;
  value: string | null;
}

export function MemberDetailModal({
  member,
  onClose,
  onApprove,
  onReject,
}: MemberDetailModalProps) {
  const [isApproving, setIsApproving] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);

  if (!member) return null;

  // 사용자 입력 값 (실제 API에서는 다른 데이터일 수 있음)
  const userInputInfo: MemberInfo[] = [
    { label: "대표자 성명", value: member.ownerName },
    { label: "상호명", value: member.businessName },
    { label: "사업장 대표 전화번호", value: member.businessPhone },
    { label: "중개사무소 주소", value: "서울시 강남구 테헤란로 131" }, // 임시 데이터
    { label: "사업자등록번호", value: member.approvalRequestDate }, // 임시로 날짜 표시
    { label: "중개사무소 개설등록번호", value: "서울강남중개소-112233-001" }, // 임시 데이터
    { label: "중개사 인증 상태", value: getStatusLabel(member.certificationStatus) },
  ];

  // API 결과 (검증된 데이터)
  const apiResultInfo: MemberInfo[] = [
    { label: "대표자 성명", value: member.ownerName },
    { label: "상호명", value: member.businessName },
    { label: "사업장 대표 전화번호", value: member.businessPhone },
    { label: "중개사무소 주소", value: "서울시 강남구 테헤란로 131" }, // 임시 데이터
    { label: "사업자등록번호", value: member.approvalRequestDate }, // 임시로 날짜 표시
    { label: "중개사무소 개설등록번호", value: "서울강남중개소-112233-001" }, // 임시 데이터
    { label: "중개사 인증 상태", value: getStatusLabel(member.certificationStatus) },
  ];

  const handleApprove = () => {
    setIsApproving(true);
    if (onApprove) {
      onApprove(member.id);
    }
    setTimeout(() => {
      setIsApproving(false);
      onClose();
    }, 500);
  };

  const handleReject = () => {
    setIsRejecting(true);
    if (onReject) {
      onReject(member.id);
    }
    setTimeout(() => {
      setIsRejecting(false);
      onClose();
    }, 500);
  };

  return (
    <>
      {/* 배경 오버레이 */}
      <div
        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        {/* 모달 컨텐츠 */}
        <div
          className="bg-white rounded-lg shadow-[0px_4px_25px_1px_rgba(0,0,0,0.25)] w-[986px] max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-[50px]">
            {/* 헤더 */}
            <div className="flex items-center justify-between mb-[48px]">
              <h2 className="text-[24px] font-semibold leading-[1.193] tracking-[-0.025em] text-black">
                회원 정보 조회 ({member.ownerName}{" "}
                {member.businessName || "정보 없음"})
              </h2>
              <button
                onClick={onClose}
                className="w-[33.92px] h-[33.92px] flex items-center justify-center hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-6 h-6 text-[#1B1B1B]" strokeWidth={3} />
              </button>
            </div>

            {/* 메모장 */}
            <AdminMemoBlock memberId={member.id} />

            {/* 구분선 */}
            <div className="my-[50px] h-px bg-[rgba(177,182,199,0.4)]" />

            {/* 정보 박스들 */}
            <div className="grid grid-cols-2 gap-[46px] mb-[30px]">
              {/* 사용자 입력 값 */}
              <div>
                <h3 className="text-[20px] font-medium leading-[1.193] tracking-[-0.025em] text-[#1B1B1B] mb-3">
                  사용자 입력 값
                </h3>
                <InfoBox info={userInputInfo} variant="default" />
              </div>

              {/* API 결과 */}
              <div>
                <h3 className="text-[20px] font-medium leading-[1.193] tracking-[-0.025em] text-[#1C2882] mb-3">
                  API 결과
                </h3>
                <InfoBox info={apiResultInfo} variant="highlighted" />
              </div>
            </div>

            {/* 승인/반려 버튼 */}
            <div className="flex justify-end gap-3">
              <button
                onClick={handleApprove}
                disabled={isApproving || isRejecting}
                className="w-[122px] h-[41px] bg-[#1499FF] hover:bg-[#1499FF]/90 text-white rounded-lg flex items-center justify-center gap-2 text-[18px] font-semibold leading-[1.193] tracking-[-0.025em] transition-colors disabled:opacity-50"
              >
                <Check className="w-5 h-5" strokeWidth={2} />
                승인
              </button>
              <button
                onClick={handleReject}
                disabled={isApproving || isRejecting}
                className="w-[122px] h-[41px] bg-[#FE340C] hover:bg-[#FE340C]/90 text-white rounded-lg flex items-center justify-center gap-2 text-[18px] font-semibold leading-[1.193] tracking-[-0.025em] transition-colors disabled:opacity-50"
              >
                <X className="w-5 h-5" strokeWidth={2} />
                반려
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

interface InfoBoxProps {
  info: MemberInfo[];
  variant: "default" | "highlighted";
}

function InfoBox({ info, variant }: InfoBoxProps) {
  const isHighlighted = variant === "highlighted";

  return (
    <div
      className={`
        rounded-md p-[30px] space-y-12
        ${
          isHighlighted
            ? "bg-[#F4F6FF] border-[3px] border-[#1C2882]"
            : "bg-white border border-[#1B1B1B]"
        }
      `}
    >
      {info.map((item, index) => (
        <div key={index} className="flex items-start justify-between">
          <span className="text-[15px] font-medium leading-[1.193] tracking-[-0.025em] text-[#989898]">
            {item.label}
          </span>
          <span
            className={`text-[15px] font-semibold leading-[1.193] tracking-[-0.025em] ${
              isHighlighted ? "text-[#1C2882]" : "text-[#1B1B1B]"
            }`}
          >
            {item.value || "-"}
          </span>
        </div>
      ))}
    </div>
  );
}

function getStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    approved: "승인",
    pending: "승인 대기",
    rejected: "반려",
    pending_rejection: "반려 대기",
    not_certified: "인증 전",
  };
  return labels[status] || status;
}

