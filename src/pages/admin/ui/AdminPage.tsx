import { useState } from "react";
import {
  AdminTable,
  AdminFilters,
  AdminPagination,
  MemberDetailModal,
  type CertificationStatus,
} from "@/features/admin";
import type { RealtorMember } from "@/features/admin";
import { PageHeader } from "@/components/common/PageHeader";

// 목 데이터 생성
const generateMockData = (): RealtorMember[] => {
  const statuses: RealtorMember["certificationStatus"][] = [
    "approved",
    "pending",
    "rejected",
    "not_certified",
  ];

  return Array.from({ length: 50 }, (_, i) => {
    const status = statuses[i % statuses.length];
    const hasCertification = status !== "not_certified";

    return {
      id: `member-${i + 1}`,
      registrationDate: "2025. 10. 31 06:12",
      ownerName: "여지훈",
      ownerPhone: "010-1234-2334",
      businessName: hasCertification ? "리얼커넥트 부동산" : null,
      businessPhone: hasCertification ? "031-111-1234" : null,
      approvalRequestDate: hasCertification ? "2025. 11. 27 11:24" : null,
      certificationStatus: status,
    };
  });
};

const mockData = generateMockData();

export function AdminPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [certificationStatus, setCertificationStatus] =
    useState<CertificationStatus>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedMember, setSelectedMember] = useState<RealtorMember | null>(
    null
  );
  const itemsPerPage = 20;

  // 필터링 로직
  const filteredData = mockData.filter((member) => {
    // 검색어 필터
    const matchesSearch = searchQuery
      ? member.ownerPhone.includes(searchQuery) ||
        member.businessPhone?.includes(searchQuery)
      : true;

    // 인증 상태 필터
    const matchesStatus =
      certificationStatus === "all"
        ? true
        : member.certificationStatus === certificationStatus;

    return matchesSearch && matchesStatus;
  });

  // 페이지네이션 계산
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = filteredData.slice(startIndex, endIndex);

  const handleViewDetails = (memberId: string) => {
    const member = mockData.find((m) => m.id === memberId);
    if (member) {
      setSelectedMember(member);
    }
  };

  const handleCloseModal = () => {
    setSelectedMember(null);
  };

  const handleApprove = (memberId: string) => {
    console.log("승인:", memberId);
    alert(`${memberId} 회원을 승인했습니다.`);
  };

  const handleReject = (memberId: string) => {
    console.log("반려:", memberId);
    alert(`${memberId} 회원을 반려했습니다.`);
  };

  return (
    <>
      {/* 헤더 */}
      <div className="mb-6 flex-shrink-0">
        <PageHeader
          title="관리자 페이지"
          description="공인중개사 회원을 관리하고, 공인중개사의 중개사 회원 인증을 검토합니다"
          className="pb-[7px]"
        />
      </div>

      {/* 메인 컨텐츠 카드 */}
      <div className="bg-white rounded-lg border border-[#DDE2F2] shadow-[0px_0px_25px_-10px_rgba(177,182,199,1)] p-[30px] flex-1 flex flex-col overflow-hidden">
        {/* 제목 */}
        <h2 className="text-[24px] font-semibold leading-[1.193] tracking-[-0.025em] text-[#1B1B1B] mb-[30px] flex-shrink-0">
          가입 중개사 목록
        </h2>

        {/* 필터 섹션 */}
        <div className="mb-[30px] flex-shrink-0">
          <AdminFilters
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            certificationStatus={certificationStatus}
            onStatusChange={(status) => {
              setCertificationStatus(status);
              setCurrentPage(1); // 필터 변경 시 첫 페이지로
            }}
          />
        </div>

        {/* 테이블 */}
        <div className="flex-1 overflow-hidden mb-[30px]">
          <AdminTable data={paginatedData} onViewDetails={handleViewDetails} />
        </div>

        {/* 페이지네이션 */}
        {totalPages > 1 && (
          <div className="flex-shrink-0">
            <AdminPagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        )}
      </div>

      {/* 회원 정보 상세 모달 */}
      {selectedMember && (
        <MemberDetailModal
          member={selectedMember}
          onClose={handleCloseModal}
          onApprove={handleApprove}
          onReject={handleReject}
        />
      )}
    </>
  );
}
