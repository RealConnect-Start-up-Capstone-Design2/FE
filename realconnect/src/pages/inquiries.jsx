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
  const [adding, setAdding] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [inquiryType, setInquiryType] = useState("ALL");
  const [isAddingInquiry, setIsAddingInquiry] = useState(false);
  const [newInquiry, setNewInquiry] = useState(null);
  const closingSidebarRef = useRef(false);
  const accessToken = useAuthStore((state) => state.accessToken);
  const [isEditMode, setIsEditMode] = useState(false);

  const handleAddInquiryClick = (emptyInquiry) => {
    setNewInquiry(emptyInquiry);
    setIsAddingInquiry(true);
    if (selectedInquiry) {
      setSelectedInquiry(null);
      setIsEditMode(false);
    }
  };

  const handleSaveNewInquiry = async (inquiryData) => {
    setAdding(true);
    try {
      console.log(inquiryData.status);
      // 디버깅을 위한 원본 데이터 로깅
      const apiData = {
        name: inquiryData.name || "",
        phone: inquiryData.phone || "",
        apartmentName: inquiryData.apartmentName || "",
        area: inquiryData.area ? parseFloat(inquiryData.area) : null,
        inquiryType: inquiryData.inquiryType || "BUY",
        status: inquiryData.status || "COMPLETED", // 상태 명시적 추가
        salePrice:
          inquiryData.salePrice && inquiryData.salePrice !== "-"
            ? parseFloat(inquiryData.salePrice.replace(/[^0-9.]/g, "")) *
              100000000
            : null,
        jeonsePrice:
          inquiryData.jeonsePrice && inquiryData.jeonsePrice !== "-"
            ? parseFloat(inquiryData.jeonsePrice.replace(/[^0-9.]/g, "")) *
              100000000
            : null,
        deposit:
          inquiryData.deposit && inquiryData.deposit !== "-"
            ? parseFloat(inquiryData.deposit.replace(/[^0-9.]/g, "")) *
              100000000
            : null,
        monthPrice:
          inquiryData.monthPrice && inquiryData.monthPrice !== "-"
            ? parseInt(inquiryData.monthPrice.replace(/[^0-9]/g, ""))
            : null,
        memo: inquiryData.memo || "",
      };

      // 디버깅을 위한 API 요청 데이터 로깅
      console.log("API 요청 데이터:", apiData);

      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/inquiries`,
        apiData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      console.log("새 문의 생성 성공:", res.data);

      await fetchInquiries();

      setIsAddingInquiry(false);
      setNewInquiry(null);
    } catch (error) {
      console.error("문의 생성 실패:", error);
      alert("문의 등록에 실패했습니다.");
    } finally {
      setAdding(false);
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
      setNewInquiry(null);
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
      setNewInquiry(null);
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
          <AddInquiry onAddInquiry={handleAddInquiryClick} adding={adding} />
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
              onSave={(modified) => {
                // 수정된 문의 데이터를 서버에 저장하는 로직 추가
                const updateInquiry = async () => {
                  try {
                    // 디버깅을 위해 원본 데이터 확인
                    console.log("문의 수정 - 원본 데이터:", modified);
                    console.log("문의 유형:", modified.inquiryType);

                    // 필요한 데이터 변환 작업
                    const apiData = {
                      name: modified.name || "",
                      phone: modified.phone || "",
                      apartmentName: modified.apartmentName || "",
                      area: modified.area ? parseFloat(modified.area) : null,
                      inquiryType: modified.inquiryType || "BUY",
                      status: modified.status || "IN_PROGRESS",
                      salePrice:
                        modified.salePrice && modified.salePrice !== "-"
                          ? parseFloat(
                              modified.salePrice.replace(/[^0-9.]/g, "")
                            ) * 100000000
                          : null,
                      jeonsePrice:
                        modified.jeonsePrice && modified.jeonsePrice !== "-"
                          ? parseFloat(
                              modified.jeonsePrice.replace(/[^0-9.]/g, "")
                            ) * 100000000
                          : null,
                      deposit:
                        modified.deposit && modified.deposit !== "-"
                          ? parseFloat(
                              modified.deposit.replace(/[^0-9.]/g, "")
                            ) * 100000000
                          : null,
                      monthPrice:
                        modified.monthPrice && modified.monthPrice !== "-"
                          ? parseInt(modified.monthPrice.replace(/[^0-9]/g, ""))
                          : null,
                      memo: modified.memo || "",
                    };

                    // 월세 선택 시 inquiryType이 MONTH_RENT인지 확인
                    if (
                      modified.inquiryTypeDisplay === "월세" &&
                      apiData.inquiryType !== "MONTH_RENT"
                    ) {
                      apiData.inquiryType = "MONTH_RENT";
                    }

                    console.log("문의 수정 요청 데이터:", apiData);

                    // API 호출로 문의 수정
                    await axios.put(
                      `${import.meta.env.VITE_API_URL}/api/inquiries/${selectedInquiry.id}`,
                      apiData,
                      {
                        headers: {
                          Authorization: `Bearer ${accessToken}`,
                          "Content-Type": "application/json",
                        },
                        withCredentials: true,
                      }
                    );

                    // 수정 후 데이터 새로고침
                    await fetchInquiries();
                  } catch (error) {
                    console.error("문의 수정 실패:", error);
                    alert("문의 수정에 실패했습니다.");
                  }
                };

                // 수정 함수 실행
                updateInquiry();

                // 사이드바 닫기 및 편집 모드 종료
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

        {isAddingInquiry && newInquiry && (
          <InquiryModifySidebar
            inquiry={newInquiry}
            onClose={closeSidebar}
            onSave={handleSaveNewInquiry}
          />
        )}
      </div>
    </div>
  );
};

export default Inquiries;
