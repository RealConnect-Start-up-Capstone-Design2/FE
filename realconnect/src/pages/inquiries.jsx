import React, { useState, useRef } from "react";

// 컴포넌트 불러오기
import Search from "../components/search/search";
import TransactionType from "../components/sortButtons/transactionType";
import AddInquiry from "../components/addInquiry/addInquiry";
import DeleteInquiry from "../components/deleteInquiry/deleteInquiry";
import InquiryTable from "../components/inquiriesTable/inquiryTable";
import InquiryDetailSidebar from "../components/rightSidebar/inquiryDetailSidebar";

const Inquiries = () => {
  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [activeView, setActiveView] = useState("전체");
  const [isClosingSidebar, setIsClosingSidebar] = useState(false);
  const closingSidebarRef = useRef(false);

  const allInquiries = [
    {
      id: 1,
      complex: "파크리오",
      content: "문의 내용",
      area: "151",
      transactionType: "매매",
      sellPrice: "24억 5000",
      deposit: "2억",
      rentDeposit: "500",
      monthlyRent: "60",
      name: "김규식",
      phone: "010-1234-5678",
      date: "2025. 3. 2.",
      status: "완료",
      favorite: false,
    },
    {
      id: 2,
      complex: "파크리오",
      content: "문의 내용",
      area: "151",
      transactionType: "매매",
      sellPrice: "24억 5000",
      deposit: "2억",
      rentDeposit: "500",
      monthlyRent: "60",
      name: "김규식",
      phone: "010-1234-5678",
      date: "2025. 3. 2.",
      status: "진행 중",
      favorite: false,
    },
  ];

  const handleViewChange = (view) => {
    setActiveView(view);
  };

  const handleSearch = (searchTerm) => {
    console.log(searchTerm);
    // 검색 기능 구현
  };

  const handleInquirySelect = (inquiry) => {
    if (closingSidebarRef.current) {
      // 닫히는 애니메이션 중이면 무시
      return;
    }

    // 동일한 행을 다시 클릭하면 사이드바 닫기
    if (selectedInquiry && selectedInquiry.id === inquiry.id) {
      // 사이드바를 닫으려면 handleCloseSidebar 실행
      closeSidebar();
    } else {
      // 다른 행을 클릭하면 새로운 프로퍼티 설정
      setIsClosingSidebar(false);
      setSelectedInquiry(inquiry);
    }
  };

  const closeSidebar = () => {
    // 닫기 애니메이션 시작
    setIsClosingSidebar(true);

    // 사이드바가 닫힐 때 상태 업데이트하지 않기 위한 플래그
    closingSidebarRef.current = true;

    // 애니메이션 시간 후에 선택된 프로퍼티 null로 설정
    setTimeout(() => {
      setSelectedInquiry(null);
      setIsClosingSidebar(false);
      closingSidebarRef.current = false;
    }, 300);
  };

  return (
    <div className={`page_section ${selectedInquiry ? "with-sidebar" : ""}`}>
      <div className="page_header">
        <div className="header_left">
          <p className="page_title">문의 관리</p>
          <p className="page_description">
            현재 등록된 고객들의 문의 목록입니다.
          </p>
        </div>
        <div className="view_selector">
          <button
            className={`view_option ${activeView === "전체" ? "view_option--active" : ""}`}
            onClick={() => handleViewChange("전체")}
          >
            전체
          </button>
          <button
            className={`view_option ${activeView === "즐겨찾기" ? "view_option--active" : ""}`}
            onClick={() => handleViewChange("즐겨찾기")}
          >
            즐겨찾기
          </button>
        </div>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          width: "100%",
          marginBottom: "1.6rem",
        }}
      >
        <div style={{ width: "400px" }}>
          <Search onSearch={handleSearch} />
        </div>
        <div style={{ display: "flex", gap: "0.8rem" }}>
          <TransactionType />
          <AddInquiry />
          <DeleteInquiry />
        </div>
      </div>
      <div className="page_content">
        {activeView === "전체" ? (
          <InquiryTable
            inquiries={allInquiries}
            onInquirySelect={handleInquirySelect}
          />
        ) : (
          <InquiryTable
            inquiries={allInquiries}
            onInquirySelect={handleInquirySelect}
          />
        )}

        {selectedInquiry && (
          <InquiryDetailSidebar
            inquiry={selectedInquiry}
            onClose={closeSidebar}
            isClosing={isClosingSidebar}
          />
        )}
      </div>
    </div>
  );
};

export default Inquiries;
