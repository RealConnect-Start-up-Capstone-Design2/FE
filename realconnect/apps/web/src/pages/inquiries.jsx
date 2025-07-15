import React, { useState, useRef, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getInquiries,
  updateInquiry,
  createInquiry,
} from "../services/inquiryService";

// 컴포넌트 불러오기
import Search from "../components/common/search/search";
import { Button, SortButton } from "@realconnect/shared-ui";
import DeleteInquiry from "../components/domain/deleteInquiry/deleteInquiry";
import InquiryTable from "../components/domain/inquiriesTable/inquiryTable";
import InquiryDetailSidebar from "../components/domain/rightSidebar/inquiryDetailSidebar";
import InquiryModifySidebar from "../components/domain/rightSidebar/inquiryModifySidebar";

// API 응답을 InquiryTable용 데이터로 변환
const convertApiDataToInquiryTable = (apiData) => {
  return apiData.map((item) => {
    // 날짜 포맷 변환 함수
    const formatDate = (dateString) => {
      if (!dateString) return "-";
      try {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return "-"; // 유효하지 않은 날짜

        // YYYY-MM-DD 형태로 포맷팅
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");

        return `${year}-${month}-${day}`;
      } catch {
        return "-";
      }
    };

    return {
      id: item.id,
      name: item.name,
      phone: item.phone,
      apartmentName: item.apartmentName,
      area: item.area ? `${item.area}` : "-",
      inquiryType:
        item.inquiryType === "BUY"
          ? "매매"
          : item.inquiryType === "JEONSE"
            ? "전세"
            : item.inquiryType === "MONTH_RENT"
              ? "월세"
              : "-",
      status:
        item.status === "IN_PROGRESS"
          ? "진행 중"
          : item.status === "COMPLETED"
            ? "완료"
            : item.status === "CANCEL"
              ? "취소"
              : "-",
      salePrice: item.salePrice
        ? (item.salePrice / 100000000).toFixed(1) + "억"
        : "-",
      deposit: item.deposit ? item.deposit.toLocaleString() : "-",
      jeonsePrice: item.jeonsePrice
        ? (item.jeonsePrice / 100000000).toFixed(1) + "억"
        : "-",
      monthPrice: item.monthPrice ? item.monthPrice.toLocaleString() : "-",
      memo: item.memo || "-",
      favorite: item.favorite === true,
      createdAt: formatDate(item.createdAt),
    };
  });
};

const Inquiries = () => {
  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [activeView, setActiveView] = useState("전체");
  const [isClosingSidebar, setIsClosingSidebar] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [inquiryType, setInquiryType] = useState("ALL");
  const [isAddingInquiry, setIsAddingInquiry] = useState(false);
  const closingSidebarRef = useRef(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const queryClient = useQueryClient();

  const { data: rawInquiries, isLoading } = useQuery({
    queryKey: ["inquiries", { searchKeyword, inquiryType }],
    queryFn: () => {
      const params = {
        keyword: searchKeyword || undefined,
        inquiryType: inquiryType === "ALL" ? undefined : inquiryType,
      };
      return getInquiries(params);
    },
  });

  const saveInquiryMutation = useMutation({
    mutationFn: (inquiryData) => {
      if (inquiryData.id) {
        return updateInquiry(inquiryData.id, inquiryData);
      } else {
        return createInquiry(inquiryData);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["inquiries"]);
      closeSidebar();
      setIsAddingInquiry(false);
      setIsEditMode(false);
    },
  });

  const updateFavoriteMutation = useMutation({
    mutationFn: (inquiry) => updateInquiry(inquiry.id, inquiry),
    onSuccess: () => {
      queryClient.invalidateQueries(["inquiries"]);
    },
  });


  const handleAddInquiryClick = () => {
    setIsAddingInquiry(true);
    if (selectedInquiry) {
      setSelectedInquiry(null);
      setIsEditMode(false);
    }
  };

  const inquiries = React.useMemo(() => {
    if (!rawInquiries) return [];
    let processedData = convertApiDataToInquiryTable(rawInquiries);
    processedData.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    if (activeView === "즐겨찾기") {
      return processedData.filter((inquiry) => inquiry.favorite);
    }
    return processedData;
  }, [rawInquiries, activeView]);

  useEffect(() => {
    if (selectedInquiry && inquiries.length > 0) {
      const updatedInquiry = inquiries.find(
        (inquiry) => inquiry.id === selectedInquiry.id
      );
      if (updatedInquiry) {
        setSelectedInquiry(updatedInquiry);
      }
    }
  }, [inquiries, selectedInquiry]);

  const transactionTypeOptions = [
    { value: "ALL", label: "전체" },
    { value: "BUY", label: "매매" },
    { value: "JEONSE", label: "전세" },
    { value: "MONTH_RENT", label: "월세" },
  ];

  const handleViewChange = (view) => {
    setActiveView(view);
  };

  const handleSearch = (searchTerm) => {
    setSearchKeyword(searchTerm);
  };

  const handleTransactionTypeChange = (type) => {
    setInquiryType(type);
  };

  const handleFavoriteToggle = (inquiry) => {
    const apiData = {
      name: inquiry.name,
      phone: inquiry.phone,
      apartmentName: inquiry.apartmentName,
      area: inquiry.area === "-" ? null : parseInt(inquiry.area),
      inquiryType:
        inquiry.inquiryType === "매매"
          ? "BUY"
          : inquiry.inquiryType === "전세"
            ? "JEONSE"
            : "MONTH_RENT",
      status:
        inquiry.status === "진행 중"
          ? "IN_PROGRESS"
          : inquiry.status === "완료"
            ? "COMPLETED"
            : "CANCEL",
      salePrice:
        inquiry.salePrice === "-"
          ? null
          : Math.round(
              parseFloat(inquiry.salePrice.replace("억", "")) * 100000000
            ),
      deposit:
        inquiry.deposit === "-"
          ? null
          : parseInt(inquiry.deposit.replace(/,/g, "")),
      jeonsePrice:
        inquiry.jeonsePrice === "-"
          ? null
          : Math.round(
              parseFloat(inquiry.jeonsePrice.replace("억", "")) * 100000000
            ),
      monthPrice:
        inquiry.monthPrice === "-"
          ? null
          : parseInt(inquiry.monthPrice.replace(/,/g, "")),
      memo: inquiry.memo === "-" ? null : inquiry.memo,
      favorite: !inquiry.favorite,
    };
    updateFavoriteMutation.mutate(apiData);
  };

  const handleInquirySelect = (inquiry) => {
    if (isAddingInquiry) {
      setIsAddingInquiry(false);
    }
    if (closingSidebarRef.current) {
      return;
    }
    if (isEditMode) {
      setIsEditMode(false);
    }
    setSelectedInquiry(inquiry);
  };

  const closeSidebar = () => {
    if (closingSidebarRef.current) return;
    closingSidebarRef.current = true;
    setIsClosingSidebar(true);

    setTimeout(() => {
      setSelectedInquiry(null);
      setIsEditMode(false);
      setIsClosingSidebar(false);
      closingSidebarRef.current = false;
    }, 300);
  };

  const handleDeleteSuccess = () => {
    queryClient.invalidateQueries(["inquiries"]);
    if (selectedInquiry) {
      closeSidebar();
    }
  };

  const handleSaveInquiry = (inquiryData) => {
    saveInquiryMutation.mutate(inquiryData);
  };

  return (
    <div className="page_section">
      <div className="page_header">
        <div className="header_left">
          <p className="page_title">문의 관리</p>
          <p className="page_description">
            모든 문의 내역을 확인하고 관리합니다.
          </p>
        </div>
        <div className="view_selector">
          <button
            className={`view_option ${
              activeView === "전체" ? "view_option--active" : ""
            }`}
            onClick={() => handleViewChange("전체")}
          >
            전체
          </button>
          <button
            className={`view_option ${
              activeView === "즐겨찾기" ? "view_option--active" : ""
            }`}
            onClick={() => handleViewChange("즐겨찾기")}
          >
            즐겨찾기
          </button>
        </div>
      </div>

      <div className="content_wrap">
        <div className="table_wrap">
          <div className="table_header">
            <div className="table_controls" style={{justifyContent: 'space-between', width: '100%'}}>
              <div style={{ display: "flex", gap: "0.8rem", alignItems: 'center' }}>
                <Search onSearch={handleSearch} />
                <SortButton
                  options={transactionTypeOptions}
                  value={inquiryType}
                  onChange={handleTransactionTypeChange}
                />
              </div>
              <Button
                label="+ 문의 추가"
                onClick={handleAddInquiryClick}
                variant="primary"
                disabled={isAddingInquiry}
              />
            </div>
          </div>
          {isLoading ? (
            <div>로딩 중...</div>
          ) : (
            <InquiryTable
              inquiries={inquiries}
              onSelect={handleInquirySelect}
              onFavoriteToggle={handleFavoriteToggle}
            />
          )}
        </div>
        {selectedInquiry ? (
          isEditMode ? (
            <InquiryModifySidebar
              inquiry={selectedInquiry}
              onClose={closeSidebar}
              onSave={handleSaveInquiry}
              isClosing={isClosingSidebar}
            />
          ) : (
            <InquiryDetailSidebar
              inquiry={selectedInquiry}
              onClose={closeSidebar}
              onDelete={handleDeleteSuccess}
              onEdit={() => setIsEditMode(true)}
              isClosing={isClosingSidebar}
            />
          )
        ) : isAddingInquiry ? (
          <InquiryModifySidebar
            inquiry={{
              id: null,
              name: "",
              phone: "",
              apartmentName: "",
              area: "",

              inquiryType: "BUY",
              status: "IN_PROGRESS",
              salePrice: "",
              deposit: "",
              jeonsePrice: "",
              monthPrice: "",
              memo: "",
              favorite: false,
            }}
            onClose={() => setIsAddingInquiry(false)}
            onSave={handleSaveInquiry}
            isClosing={isClosingSidebar}
          />
        ) : null}
      </div>
    </div>
  );
};

export default Inquiries;
