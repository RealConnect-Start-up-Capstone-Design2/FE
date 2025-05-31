import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import useAuthStore from "../store/authStore";

// 컴포넌트 불러오기
import Search from "../components/search/search";
import TransactionType from "../components/sortButtons/transactionType";
import AddInquiry from "../components/addInquiry/addInquiry";
import DeleteInquiry from "../components/deleteInquiry/deleteInquiry";
import InquiryTable from "../components/inquiriesTable/inquiryTable";
import InquiryDetailSidebar from "../components/rightSidebar/inquiryDetailSidebar";
import InquiryModifySidebar from "../components/rightSidebar/inquiryModifySidebar";

// API 응답을 InquiryTable용 데이터로 변환
const convertApiDataToInquiryTable = (apiData) => {
  return apiData.map((item) => {
    // 날짜 포맷 변환 함수
    const formatDate = (dateString) => {
      if (!dateString) return "-";
      try {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return "-"; // 유효하지 않은 날짜

        return date.toLocaleDateString("ko-KR", {
          year: "numeric",
          month: "numeric",
          day: "numeric",
        });
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
      deposit: item.deposit
        ? (item.deposit / 100000000).toFixed(1) + "억"
        : "-",
      jeonsePrice: item.jeonsePrice
        ? (item.jeonsePrice / 100000000).toFixed(1) + "억"
        : "-",
      monthPrice: item.monthPrice ? item.monthPrice.toLocaleString() : "-",
      memo: item.memo || "-",
      favorite: item.favorite || false,
      createdAt: formatDate(item.createdAt),
    };
  });
};

const Inquiries = () => {
  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [activeView, setActiveView] = useState("전체");
  const [isClosingSidebar, setIsClosingSidebar] = useState(false);
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [inquiryType, setInquiryType] = useState("ALL");
  const [isAddingInquiry, setIsAddingInquiry] = useState(false);
  const closingSidebarRef = useRef(false);
  const accessToken = useAuthStore((state) => state.accessToken);
  const [isEditMode, setIsEditMode] = useState(false);

  const handleAddInquiryClick = () => {
    setIsAddingInquiry(true);
    if (selectedInquiry) {
      setSelectedInquiry(null);
      setIsEditMode(false);
    }
  };

  const fetchInquiries = async () => {
    setLoading(true);
    try {
      let queryParams = [];

      if (searchKeyword) {
        queryParams.push(`keyword=${encodeURIComponent(searchKeyword)}`);
      }

      if (inquiryType && inquiryType !== "ALL") {
        queryParams.push(`inquiryType=${inquiryType}`);
      }

      const queryString =
        queryParams.length > 0 ? `?${queryParams.join("&")}` : "";

      const url = `${import.meta.env.VITE_API_URL}/api/inquiries${queryString}`;

      const res = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        withCredentials: true,
      });

      let processedData = convertApiDataToInquiryTable(res.data || []);

      if (activeView === "즐겨찾기") {
        processedData = processedData.filter((inquiry) => inquiry.favorite);
      }

      setInquiries(processedData);
      console.log(processedData);
    } catch (error) {
      console.error("문의 데이터 조회 실패:", error);
      setInquiries([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInquiries();
  }, [accessToken, searchKeyword, inquiryType, activeView]);

  const handleViewChange = (view) => {
    setActiveView(view);
  };

  const handleSearch = (searchTerm) => {
    setSearchKeyword(searchTerm);
  };

  const handleTransactionTypeChange = (type) => {
    setInquiryType(type);
  };

  const handleFavoriteToggle = async (inquiry) => {
    const res = await axios.put(
      `${import.meta.env.VITE_API_URL}/api/inquiries/${inquiry.id}`,
      {
        favorite: !inquiry.favorite,
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        withCredentials: true,
      }
    );
    console.log(res);
  };

  const handleInquirySelect = (inquiry) => {
    if (isAddingInquiry) {
      setIsAddingInquiry(false);
    }

    if (closingSidebarRef.current) {
      return;
    }

    if (selectedInquiry && selectedInquiry.id === inquiry.id) {
      closeSidebar();
    } else {
      setIsClosingSidebar(false);
      setSelectedInquiry(inquiry);
    }
  };

  const closeSidebar = () => {
    if (isAddingInquiry) {
      setIsAddingInquiry(false);
      return;
    }

    setIsClosingSidebar(true);

    closingSidebarRef.current = true;

    setTimeout(() => {
      setSelectedInquiry(null);
      setIsClosingSidebar(false);
      closingSidebarRef.current = false;
    }, 300);
  };

  return (
    <div
      className={`page_section ${selectedInquiry || isAddingInquiry ? "with-sidebar" : ""}`}
    >
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
          <TransactionType
            onTransactionTypeChange={handleTransactionTypeChange}
          />
          <AddInquiry onAddInquiry={handleAddInquiryClick} />
          <DeleteInquiry />
        </div>
      </div>
      <div className="page_content">
        {loading ? (
          <div>로딩 중...</div>
        ) : (
          <InquiryTable
            inquiries={inquiries}
            onFavoriteToggle={handleFavoriteToggle}
            onInquirySelect={handleInquirySelect}
          />
        )}
        {selectedInquiry &&
          (isEditMode ? (
            <InquiryModifySidebar
              inquiry={selectedInquiry}
              onClose={() => {
                closeSidebar();
                setIsEditMode(false);
              }}
              onSave={async (success) => {
                if (success) {
                  // 수정 성공 시 데이터 새로고침
                  await fetchInquiries();
                  setIsEditMode(false);
                  closeSidebar();
                }
              }}
            />
          ) : (
            <InquiryDetailSidebar
              inquiry={selectedInquiry}
              onClose={closeSidebar}
              isClosing={isClosingSidebar}
              onEdit={() => setIsEditMode(true)}
            />
          ))}

        {isAddingInquiry && (
          <InquiryModifySidebar
            inquiry={{}}
            onClose={closeSidebar}
            onSave={async (success) => {
              if (success) {
                // 추가 성공 시 데이터 새로고침
                await fetchInquiries();
                setIsAddingInquiry(false);
                closeSidebar();
              }
            }}
          />
        )}
      </div>
    </div>
  );
};

export default Inquiries;
