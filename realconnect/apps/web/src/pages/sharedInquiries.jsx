import React, { useState, useRef } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import useAuthStore from "../store/authStore";
import RegionalFilter from "../components/domain/regionalFilter/regionalFilter";
import { Button, SortButton } from "@realconnect/shared-ui";
import SharedInquiriesTable from "../components/domain/sharedInquiriesTable/sharedInquiriesTable";
import SharedInquiryDetailSidebar from "../components/domain/rightSidebar/sharedInquiryDetailSidebar";
import {
  getSharedInquiries,
  getMySharedInquiries,
  getSharedInquiryById,
} from "../services/shareService";

const SharedInquiries = () => {
  const [activeView, setActiveView] = useState("all");
  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const closingSidebarRef = useRef(false);
  const queryClient = useQueryClient();
  const userId = useAuthStore((state) => state.user?.id);

  const [transactionType, setTransactionType] = useState("ALL");
  const [regionFilter, setRegionFilter] = useState(null);

  const transactionTypeOptions = [
    { value: "ALL", label: "전체" },
    { value: "BUY", label: "매매" },
    { value: "JEONSE", label: "전세" },
    { value: "MONTH_RENT", label: "월세" },
  ];

  const { data: sharedInquiries, isLoading: isLoadingAll } = useQuery({
    queryKey: ["sharedInquiries", regionFilter, transactionType],
    queryFn: () => {
      const params = { ...regionFilter };
      if (transactionType !== "ALL") {
        params.inquiryType = transactionType;
      }
      return getSharedInquiries(params);
    },
    enabled: activeView === "all",
  });

  const { data: mySharedInquiries, isLoading: isLoadingMy } = useQuery({
    queryKey: ["mySharedInquiries"],
    queryFn: getMySharedInquiries,
    enabled: activeView === "my",
  });

  const handleViewChange = (view) => {
    setActiveView(view);
  };

  const handleSharedInquirySelect = async (inquiry) => {
    if (closingSidebarRef.current) return;
    if (selectedInquiry && selectedInquiry.id === inquiry.id) {
      closeSidebar();
      return;
    }
    try {
      const data = await queryClient.fetchQuery({
        queryKey: ["sharedInquiry", inquiry.id],
        queryFn: () => getSharedInquiryById(inquiry.id),
      });
      setSelectedInquiry(data);
      setSidebarOpen(true);
      setIsClosing(false);
    } catch (error) {
      console.error("공유 문의 상세 정보 조회 중 오류 발생:", error);
    }
  };

  const handleRegionFilterChange = (filterData) => {
    setRegionFilter(filterData);
  };

  const handleTransactionTypeChange = (type) => {
    setTransactionType(type);
  };

  const closeSidebar = () => {
    setIsClosing(true);
    closingSidebarRef.current = true;
    setTimeout(() => {
      setSidebarOpen(false);
      setIsClosing(false);
      setSelectedInquiry(null);
      closingSidebarRef.current = false;
    }, 300);
  };

  const handleEditInquiry = () => {
    console.log("문의 수정:", selectedInquiry);
  };

  const currentData = activeView === "all" ? sharedInquiries : mySharedInquiries;
  const currentLoading = activeView === "all" ? isLoadingAll : isLoadingMy;

  return (
    <div className={`page_section ${sidebarOpen ? "with-sidebar" : ""}`}>
      <div className="page_header">
        <div className="header_left">
          <p className="page_title">문의 공유</p>
          <p className="page_description">
            타 부동산 업소와 공유하는 고객의 문의 목록입니다
          </p>
        </div>
        <div className="view_selector">
          <button
            className={`view_option ${
              activeView === "all" ? "view_option--active" : ""
            }`}
            onClick={() => handleViewChange("all")}
          >
            전체
          </button>
          <button
            className={`view_option ${
              activeView === "my" ? "view_option--active" : ""
            }`}
            onClick={() => handleViewChange("my")}
          >
            내 문의
          </button>
        </div>
      </div>
      
      <div className="table-controls" style={{justifyContent: 'flex-end', width: '100%'}}>
        <div style={{ display: "flex", gap: "0.8rem" }}>
          <RegionalFilter onFilterChange={handleRegionFilterChange} />
          <SortButton
            options={transactionTypeOptions}
            value={transactionType}
            onChange={handleTransactionTypeChange}
          />
        </div>
      </div>
      <div className="table_section">
        {currentLoading ? (
          <div>로딩 중...</div>
        ) : (
          <SharedInquiriesTable
            sharedInquiries={currentData}
            onSharedInquirySelect={handleSharedInquirySelect}
          />
        )}
      </div>

      {sidebarOpen && selectedInquiry && (
         <div
          className={`sidebar_section ${
            isClosing ? "closing" : "opening"
          }`}
        >
          <SharedInquiryDetailSidebar
            inquiry={selectedInquiry}
            onClose={closeSidebar}
            isClosing={isClosing}
            onEdit={handleEditInquiry}
            isMyInquiry={selectedInquiry.userId === userId}
          />
        </div>
      )}
    </div>
  );
};

export default SharedInquiries;