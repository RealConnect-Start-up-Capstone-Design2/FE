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
      deposit: item.deposit
        ? (item.deposit / 100000000).toFixed(1) + "억"
        : "-",
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
        const favoriteData = processedData.filter(
          (inquiry) => inquiry.favorite
        );
        processedData = favoriteData;
      }

      setInquiries(processedData);
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

  // inquiries가 업데이트될 때 selectedInquiry도 최신 정보로 업데이트
  useEffect(() => {
    console.log(inquiries);
    if (selectedInquiry && inquiries.length > 0) {
      const updatedInquiry = inquiries.find(
        (inquiry) => inquiry.id === selectedInquiry.id
      );
      if (updatedInquiry) {
        setSelectedInquiry(updatedInquiry);
      }
    }
  }, [inquiries]);

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
    try {
      // inquiry 객체를 원본 API 형태로 변환
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
              : inquiry.inquiryType === "월세"
                ? "MONTH_RENT"
                : null,
        status:
          inquiry.status === "진행 중"
            ? "IN_PROGRESS"
            : inquiry.status === "완료"
              ? "COMPLETED"
              : inquiry.status === "취소"
                ? "CANCEL"
                : null,
        salePrice:
          inquiry.salePrice === "-"
            ? null
            : Math.round(
                parseFloat(inquiry.salePrice.replace("억", "")) * 100000000
              ),
        deposit:
          inquiry.deposit === "-"
            ? null
            : Math.round(
                parseFloat(inquiry.deposit.replace("억", "")) * 100000000
              ),
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
        favorite: !inquiry.favorite, // 즐겨찾기 상태 토글
      };
      console.log(apiData);
      const res = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/inquiries/${inquiry.id}`,
        apiData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      console.log(res.data);

      // API 호출 성공 후 데이터 새로고침
      await fetchInquiries();
    } catch (error) {
      console.error("즐겨찾기 업데이트 실패:", error);
    }
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
      setSelectedInquiry(inquiry);
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

                  // fetchInquiries 완료 후 inquiries 상태가 업데이트되므로
                  // 다음 렌더링에서 업데이트된 정보를 가져오기 위해 useEffect 사용
                  setIsEditMode(false);
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
