import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import useAuthStore from "../store/authStore";
import RegionalFilter from "../components/regionalFilter/regionalFilter";
import TransactionType from "../components/sortButtons/transactionType";
import AddProperty from "../components/addProperrty/addProperty";
import DeleteProperty from "../components/deleteProperty/deleteProperty";
import SharedInquiriesTable from "../components/sharedInquiriesTable/sharedInquiriesTable";
import SharedInquiryDetailSidebar from "../components/rightSidebar/sharedInquiryDetailSidebar";
import "./sharedInquiries.css";

const SharedInquiries = () => {
  const [activeView, setActiveView] = useState("all");
  const [sharedInquiries, setSharedInquiries] = useState([]);
  const [mySharedInquiries, setMySharedInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMyShares, setLoadingMyShares] = useState(false);
  const accessToken = useAuthStore((state) => state.accessToken);
  const userId = useAuthStore((state) => state.user?.id);

  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const closingSidebarRef = useRef(false);

  const handleViewChange = (view) => {
    setActiveView(view);
  };

  // 내가 공유한 문의 가져오기
  const fetchMySharedInquiries = async () => {
    setLoadingMyShares(true);
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/shares/my`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          withCredentials: true,
        }
      );
      console.log("내가 공유한 문의 데이터:", res.data);
      setMySharedInquiries(res.data);
    } catch (error) {
      console.error("내가 공유한 문의 조회 중 오류 발생:", error);
      setMySharedInquiries([]);
    } finally {
      setLoadingMyShares(false);
    }
  };

  const handleSharedInquirySelect = async (inquiry) => {
    if (closingSidebarRef.current) {
      return;
    }

    // 같은 행을 다시 선택하면 사이드바를 닫음
    if (selectedInquiry && selectedInquiry.id === inquiry.id) {
      closeSidebar();
      return;
    }

    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/shares/${inquiry.id}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          withCredentials: true,
        }
      );
      setSelectedInquiry(res.data);
      setSidebarOpen(true);
      setIsClosing(false);
    } catch (error) {
      console.error("공유 문의 상세 정보 조회 중 오류 발생:", error);
    }
  };

  const handleRegionFilterChange = async (filterData) => {
    try {
      console.log("필터 데이터:", filterData);
      setLoading(true);
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/shares`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          params: {
            l1: filterData.l1,
            l2: filterData.l2,
            l3: filterData.l3,
          },
          withCredentials: true,
        }
      );
      console.log("API 응답 데이터:", res.data);
      console.log("응답 데이터 길이:", res.data.length);
      console.log("응답 데이터 타입:", typeof res.data);
      setSharedInquiries(res.data);
    } catch (error) {
      console.error("문의 공유 데이터 조회 중 오류 발생:", error);
      setSharedInquiries([]);
    } finally {
      setLoading(false);
    }
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
    // 수정 기능 구현
  };

  // 초기 로딩 시 API 호출
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/shares`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
            withCredentials: true,
          }
        );
        console.log("API 응답 데이터:", res.data);
        setSharedInquiries(res.data);
      } catch (error) {
        console.error("문의 공유 데이터 조회 중 오류 발생:", error);
        setSharedInquiries([]);
      } finally {
        setLoading(false);
      }
    };

    if (accessToken) {
      fetchInitialData();
      fetchMySharedInquiries();
    }
  }, [accessToken]);

  // 컴포넌트가 언마운트될 때 상태 초기화
  useEffect(() => {
    return () => {
      setLoading(false);
    };
  }, []);

  // 현재 표시할 데이터 결정
  const currentData = activeView === "all" ? sharedInquiries : mySharedInquiries;
  const currentLoading = activeView === "all" ? loading : loadingMyShares;

  return (
    <div className={`page_section ${sidebarOpen ? "with-sidebar" : ""}`}>
      <div className="page_header">
        <div className="header_left">
          <div className="page_title">문의 공유</div>
          <div className="page_description">
            타 부동산 업소와 공유하는 고객의 문의 목록입니다
          </div>
        </div>
        <div className="view_selector">
          <button
            className={`view_option ${activeView === "all" ? "view_option--active" : ""}`}
            onClick={() => handleViewChange("all")}
          >
            전체
          </button>
          <button
            className={`view_option ${activeView === "my" ? "view_option--active" : ""}`}
            onClick={() => handleViewChange("my")}
          >
            내 문의
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
        <div style={{ width: "30rem" }}>
          <RegionalFilter onFilterChange={handleRegionFilterChange} />
        </div>
        <div style={{ display: "flex", gap: "0.8rem" }}>
          <TransactionType />
          <AddProperty />
          <DeleteProperty />
        </div>
      </div>
      <div className={`page_content ${sidebarOpen ? "with-sidebar" : ""}`}>
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
        <SharedInquiryDetailSidebar
          inquiry={selectedInquiry}
          onClose={closeSidebar}
          isClosing={isClosing}
          onEdit={handleEditInquiry}
          isMyInquiry={selectedInquiry.userId === userId}
        />
      )}
    </div>
  );
};

export default SharedInquiries;
