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
      inquiryType: item.inquiryType === "BUY" ? "매매" : "전세",
      status:
        item.status === "IN_PROGRESS"
          ? "진행 중"
          : item.status === "COMPLETED"
            ? "완료"
            : item.status === "CANCELLED"
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
  const [adding, setAdding] = useState(false);
  const closingSidebarRef = useRef(false);
  const accessToken = useAuthStore((state) => state.accessToken);
  const [isEditMode, setIsEditMode] = useState(false);
  const handleAddInquiry = async (inquiryData, onSuccess, onError) => {
    setAdding(true);
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/inquiries`,
        inquiryData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          withCredentials: true,
        }
      );
      await fetchInquiries();
      if (onSuccess) onSuccess(res.data);
    } catch (err) {
      if (onError) onError(err);
    } finally {
      setAdding(false);
    }
  };

  const fetchInquiries = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/inquiries`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          withCredentials: true,
        }
      );
      setInquiries(convertApiDataToInquiryTable(res.data || []));
    } catch {
      setInquiries([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInquiries();
  }, [accessToken]);

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
          <AddInquiry onAddInquiry={handleAddInquiry} adding={adding} />
          <DeleteInquiry />
        </div>
      </div>
      <div className="page_content">
        {loading ? (
          <div>로딩 중...</div>
        ) : (
          <InquiryTable
            inquiries={inquiries}
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
              onSave={(modified) => {
                console.log("수정된 문의:", modified);
                setIsEditMode(false);
                closeSidebar();
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
      </div>
    </div>
  );
};

export default Inquiries;
