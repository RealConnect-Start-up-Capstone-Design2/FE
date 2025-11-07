import { ContentCard } from "@/components/common/ContentCard";
import EditNonBox from "@/components/common/EditNonBox.svg";
import { Button } from "@/components/ui/button";

const profileDetailSections = [
  {
    label: "대표",
    texts: ["최정현"],
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
    </div>
  </div>
);

const businessInfoSection = (
  <div className="flex flex-col gap-4">
    <div className="flex flex-col gap-2">
      <p className="text-[24px] font-semibold text-[#1B1B1B]">사업자 정보</p>
    </div>
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-1">
        <p className="text-[15px] font-medium text-[#8D8D8D]">사업자등록번호</p>
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
      </div>
    </div>
  </div>
);

export function ProfileSummaryCard() {
  return (
    <ContentCard
      title="프로필 요약"
      detailLabel="개인 및 사무실 정보"
      detailSections={profileDetailSections}
      className="w-[435px]"
      action={
        <Button className="gap-2 px-5 py-3 text-[18px] font-semibold bg-[#1C2882] text-[#FFFFFF] hover:bg-[#1C2882]/90">
          <img src={EditNonBox} alt="편집" className="h-5 w-5" />
          프로필 수정
        </Button>
      }
      showDivider
      dividerContent={officeInfoSection}
      footerDividerContent={businessInfoSection}
      showBottomDivider
    />
  );
}
