import { useState } from "react";
import { ContentCard } from "@/components/common/ContentCard";
import EditNonBox from "@/components/common/EditNonBox.svg";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { cn } from "@/shared/utils";
import { ProfileEditModal } from "./ProfileEditModal";
import { RealtorCertificationModal } from "./RealtorCertificationModal";

const profileDetailSections = [
  {
    texts: [
      <div
        className="flex items-center gap-2 text-[24px] font-semibold text-[#1B1B1B]"
        key="ceo-info"
      >
        <span>최정현 (대표)</span>
        <Label className="flex h-5 w-[46px] items-center justify-center rounded-full bg-[#EDEDED] text-[12px] font-medium text-[#989898]">
          Basic
        </Label>
      </div>,
    ],
  },
  {
    label: "연락처",
    texts: ["010-1234-5678"],
  },
  {
    label: "이메일",
    texts: ["choi@example.com"],
  },
  {
    label: "주거래 단지",
    texts: ["파크리오", "잠실 래미안 아이파크"],
  },
  {
    label: "블로그 링크",
    texts: ["blog.naver.com/realconnect"],
  },
  {
    label: "중개사 홈페이지",
    texts: ["realconnect.co.kr"],
  },
];

const officeInfoSection = (
  <div className="flex flex-col gap-4">
    <div className="flex flex-col gap-2">
      <p className="text-[24px] font-semibold text-[#1B1B1B]">사무실 정보</p>
    </div>
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-1">
        <p className="text-[15px] font-medium text-[#8D8D8D]">상호명</p>
        <p className="text-[15px] font-medium text-[#1B1B1B]">
          리얼커넥트 부동산
        </p>
      </div>
      <div className="flex flex-col gap-1">
        <p className="text-[15px] font-medium text-[#8D8D8D]">사무실 주소</p>
        <p className="text-[15px] font-medium text-[#1B1B1B]">
          서울특별시 강남구 테헤란로 1234
        </p>
      </div>
      <div className="flex flex-col gap-1">
        <p className="text-[15px] font-medium text-[#8D8D8D]">
          중개사무사 대표 전화번호
        </p>
        <p className="text-[15px] font-medium text-[#1B1B1B]">02-1111-1111</p>
      </div>
    </div>
  </div>
);

interface ProfileSummaryCardProps {
  className?: string;
}

export function ProfileSummaryCard({ className }: ProfileSummaryCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCertificationModalOpen, setIsCertificationModalOpen] =
    useState(false);

  const handleComingSoon = () => {
    alert("추후 추가 예정입니다.");
  };

  const handleEditProfile = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleOpenCertificationModal = () => {
    setIsCertificationModalOpen(true);
  };

  const handleCloseCertificationModal = () => {
    setIsCertificationModalOpen(false);
  };

  const businessInfoSection = (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <p className="text-[24px] font-semibold text-[#1B1B1B]">사업자 정보</p>
      </div>
      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-1">
          <p className="text-[15px] font-medium text-[#8D8D8D]">
            사업자등록번호
          </p>
          <p className="text-[15px] font-medium text-[#1B1B1B]">123-45-67890</p>
        </div>
        <div className="flex flex-col gap-1">
          <p className="text-[15px] font-medium text-[#8D8D8D]">개설등록번호</p>
          <p className="text-[15px] font-medium text-[#1B1B1B]">123-45-67890</p>
        </div>
        <div className="flex flex-col gap-1">
          <p className="text-[15px] font-medium text-[#8D8D8D]">
            사업자등록증 사본
          </p>
          <p className="text-[15px] font-medium text-[#1B1B1B]">123-45-67890</p>
        </div>
        <div className="flex flex-col gap-1">
          <p className="text-[15px] font-medium text-[#8D8D8D]">
            중개사 자격증 사본
          </p>
          <p className="text-[15px] font-medium text-[#1B1B1B]">123-45-67890</p>
          <div className="mt-2 flex justify-end">
            <Button
              onClick={handleOpenCertificationModal}
              className="gap-2 px-5 py-3 text-[18px] font-semibold bg-[#1C2882] text-[#FFFFFF] hover:bg-[#1C2882]"
            >
              중개사 인증하기
            </Button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <ContentCard
        title="프로필 요약"
        detailLabel="개인 및 사무실 정보"
        detailSections={profileDetailSections}
        className={cn("w-[435px]", className)}
        action={
          <Button
            onClick={handleEditProfile}
            className="gap-2 px-5 py-3 text-[18px] font-semibold bg-[#1C2882] text-[#FFFFFF] hover:bg-[#1C2882]"
          >
            <img src={EditNonBox} alt="편집" className="h-5 w-5" />
            프로필 수정
          </Button>
        }
        showDivider
        dividerContent={officeInfoSection}
        footerDividerContent={businessInfoSection}
        showBottomDivider
        bottomContent={
          <div className="flex flex-col items-center gap-3">
            <div className="flex items-center gap-4 text-[15px] font-medium text-[#8D8D8D]">
              <button
                type="button"
                onClick={handleComingSoon}
                className="cursor-pointer transition-colors hover:text-[#1C2882] hover:underline"
              >
                개인정보 처리 방침
              </button>
              <span className="h-[12px] w-px bg-[#8D8D8D]" />
              <button
                type="button"
                onClick={handleComingSoon}
                className="cursor-pointer transition-colors hover:text-[#1C2882] hover:underline"
              >
                서비스 이용약관
              </button>
            </div>
          </div>
        }
      />
      <ProfileEditModal isOpen={isModalOpen} onClose={handleCloseModal} />
      <RealtorCertificationModal
        isOpen={isCertificationModalOpen}
        onClose={handleCloseCertificationModal}
      />
    </>
  );
}
