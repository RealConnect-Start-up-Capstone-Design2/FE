import { useState, useEffect } from "react";
import { ContentCard } from "@/components/common/ContentCard";
import EditNonBox from "@/components/common/EditNonBox.svg";
import UsersIcon from "@/assets/Users.svg";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { cn, formatPhoneNumber } from "@/shared/utils";
import { ProfileEditModal } from "./ProfileEditModal";
import { RealtorCertificationModal } from "./RealtorCertificationModal";
import { EmployeeManagementModal } from "./EmployeeManagementModal/EmployeeManagementModal";
import {
  fetchProfile,
  type ProfileData,
  getOfficeStatus,
  type CertificationStatus,
} from "@/shared/api/mypage";
import { fetchPreferredComplexList } from "@/shared/api/region";

const getProfileDetailSections = (
  profile: ProfileData | null,
  preferredComplexNames: string[]
) => {
  if (!profile) {
    return [];
  }

  return [
    {
      texts: [
        <div
          className="flex items-center gap-2 text-[24px] font-semibold text-[#1B1B1B]"
          key="ceo-info"
        >
          <span>{profile.name} (대표)</span>
          <Label className="flex h-5 w-[46px] items-center justify-center rounded-full bg-[#EDEDED] text-[12px] font-medium text-[#989898]">
            {profile.membershipType && profile.membershipType !== "대표"
              ? profile.membershipType
              : "Basic"}
          </Label>
        </div>,
      ],
    },
    {
      label: "연락처",
      texts: [formatPhoneNumber(profile.phone || profile.contact) || ""],
    },
    {
      label: "이메일",
      texts: [profile.email || ""],
    },
    {
      label: "비밀번호",
      texts: ["****"],
    },
    {
      label: "주거래 단지",
      texts: preferredComplexNames.length > 0 ? preferredComplexNames : [],
    },
    {
      label: "블로그 링크",
      texts:
        profile.blogUrl || profile.blogLink
          ? [profile.blogUrl || profile.blogLink || ""]
          : [],
    },
    {
      label: "중개사 홈페이지",
      texts:
        profile.homepageUrl || profile.homepage
          ? [profile.homepageUrl || profile.homepage || ""]
          : [],
    },
  ];
};

const getOfficeInfoSection = (
  profile: ProfileData | null,
  onEmployeeManage: () => void
) => (
  <div className="flex flex-col gap-4">
    <div className="flex flex-col gap-2">
      <p className="text-[24px] font-semibold text-[#1B1B1B]">사무실 정보</p>
    </div>
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-1">
        <p className="text-[15px] font-medium text-[#8D8D8D]">상호명</p>
        <p className="text-[15px] font-medium text-[#1B1B1B]">
          {profile?.officeName || ""}
        </p>
      </div>
      <div className="flex flex-col gap-1">
        <p className="text-[15px] font-medium text-[#8D8D8D]">사무실 주소</p>
        <p className="text-[15px] font-medium text-[#1B1B1B]">
          {profile?.officeAddress || ""}
        </p>
      </div>
      <div className="flex flex-col gap-1">
        <p className="text-[15px] font-medium text-[#8D8D8D]">
          중개사무사 대표 전화번호
        </p>
        <p className="text-[15px] font-medium text-[#1B1B1B]">
          {formatPhoneNumber(profile?.officePhone) || ""}
        </p>
      </div>
      <div className="flex flex-col gap-1">
        <p className="text-[15px] font-medium text-[#8D8D8D]">직원 수</p>
        <p className="text-[15px] font-medium text-[#1B1B1B]">
          {profile?.employeeCount ? `${profile.employeeCount}명` : ""}
        </p>
        <div className="mt-2 flex justify-end">
          <Button
            onClick={onEmployeeManage}
            className="gap-2 px-5 py-3 text-[18px] font-semibold bg-[#1C2882] text-[#FFFFFF] hover:bg-[#1C2882]"
          >
            <img src={UsersIcon} alt="직원 관리" className="h-5 w-5" />
            직원 관리
          </Button>
        </div>
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
  const [isEmployeeModalOpen, setIsEmployeeModalOpen] = useState(false);
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [preferredComplexNames, setPreferredComplexNames] = useState<string[]>(
    []
  );
  const [certificationStatus, setCertificationStatus] =
    useState<CertificationStatus | null>(null);

  const loadProfileData = async () => {
    try {
      const [profileData, preferredComplexes] = await Promise.all([
        fetchProfile(),
        fetchPreferredComplexList(),
      ]);
      setProfile(profileData);
      setPreferredComplexNames(
        preferredComplexes.map((complex) => complex.apartmentName)
      );

      try {
        const officeStatus = await getOfficeStatus();
        setCertificationStatus(officeStatus);
      } catch {
        setCertificationStatus("BEFORE");
      }
    } catch {
      // 프로필 데이터 로드 실패 시 무시
    }
  };

  useEffect(() => {
    loadProfileData();
  }, []);

  const handleComingSoon = () => {
    alert("추후 추가 예정입니다.");
  };

  const handleEmployeeManage = () => {
    setIsEmployeeModalOpen(true);
  };

  const handleCloseEmployeeModal = () => {
    setIsEmployeeModalOpen(false);
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

  const getStatusLabel = (status: CertificationStatus | null): string => {
    const labels: Record<string, string> = {
      BEFORE: "인증 전",
      PENDING: "승인 대기",
      REJECTED: "반려",
      APPROVED: "승인",
    };
    return labels[status || "BEFORE"] || "인증 전";
  };

  const businessInfoSection = (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <p className="text-[24px] font-semibold text-[#1B1B1B]">
            사업자 정보
          </p>
          <span className="text-[15px] font-medium text-[#8D8D8D]">
            ({getStatusLabel(certificationStatus)})
          </span>
        </div>
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
          {certificationStatus === "PENDING" ? (
            <div className="mt-2 flex justify-end">
              <div className="px-5 py-3 text-[18px] font-semibold bg-[#1C2882] text-[#FFFFFF] rounded-lg">
                중개사 인증 심사 중
              </div>
            </div>
          ) : (
            <div className="mt-2 flex justify-end">
              <Button
                onClick={handleOpenCertificationModal}
                className="gap-2 px-5 py-3 text-[18px] font-semibold bg-[#1C2882] text-[#FFFFFF] hover:bg-[#1C2882]"
              >
                중개사 인증하기
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <>
      <ContentCard
        title="프로필 요약"
        detailLabel="개인 및 사무실 정보"
        detailSections={getProfileDetailSections(
          profile,
          preferredComplexNames
        )}
        className={cn(
          "min-w-[300px] max-w-[435px] flex-1 flex-shrink",
          className
        )}
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
        dividerContent={getOfficeInfoSection(profile, handleEmployeeManage)}
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
      <ProfileEditModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onProfileUpdated={loadProfileData}
      />
      <RealtorCertificationModal
        isOpen={isCertificationModalOpen}
        onClose={handleCloseCertificationModal}
        profileName={profile?.name}
        onProfileUpdated={loadProfileData}
      />
      <EmployeeManagementModal
        isOpen={isEmployeeModalOpen}
        onClose={handleCloseEmployeeModal}
      />
    </>
  );
}
