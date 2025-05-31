import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import useAuthStore from "../store/authStore";
import "./propertiesManage.css";

// 컴포넌트 불러오기
import Search from "../components/search/search";
import SortBy from "../components/sortButtons/sortBy";
import TransactionType from "../components/sortButtons/transactionType";
import AddProperty from "../components/addProperrty/addProperty";
import DeleteProperty from "../components/deleteProperty/deleteProperty";
import PropertyTable from "../components/PropertyTable/PropertyTable";
import PropertyDetailSidebar from "../components/rightSidebar/propertyDetailSidebar";
import PropertyModifySidebar from "../components/rightSidebar/propertyModifySidebar";

// API 응답을 PropertyTable용 데이터로 변환
const convertApiDataToTableData = (apiData) => {
  return apiData.map((item) => {
    const p = item.property || {};
    return {
      id: item.apartmentId,
      apartmentName: item.apartmentName,
      building: item.dong ? `${item.dong}동` : "",
      unit: item.ho ? `${item.ho}호` : "",
      area: item.area ? `${item.area} m²` : "",
      salePrice: p.salePrice || "-",
      deposit: p.deposit || "-",
      jeonsePrice: p.jeonsePrice || "-",
      // 월세
      monthPrice: p.monthPrice ? p.monthPrice.toLocaleString() : "-",
      transactionType: getTransactionType(p),
      ownerName: p.ownerName || "-",
      contact: p.ownerPhone || "-",
      tenant: p.tenantName || "-",
      tenantContact: p.tenantPhone || "-",
      // API 응답의 원본 상태값을 한글로 변환하여 저장
      status: getStatusText(p.status) || "미등록",
      memo: p.memo || "",
      img: item.img || null,
      // 추가 정보 저장
      startDate: p.startDate || "-",
      endDate: p.endDate || "-",
      // 원본 데이터도 저장 (필요 시 활용)
      rawData: item,
    };
  });
};

// 거래 유형 반환 함수
const getTransactionType = (property) => {
  if (!property || !property.status) return "-";

  // 상태값에 따른 거래 유형 분류
  if (property.salePrice && property.salePrice > 0) return "매매";
  if (property.jeonsePrice && property.jeonsePrice > 0) return "전세";
  if (property.deposit && property.monthPrice) return "월세";

  return "-";
};

// 상태 텍스트 변환 함수
const getStatusText = (status) => {
  if (!status) return "미등록";

  // 상태값 한글화
  switch (status) {
    case "CONTRACTED":
      return "계약 완료";
    case "RESERVED":
      return "계약 중";
    case "WAITING":
      return "계약 전";
    default:
      return status;
  }
};

const Properties = () => {
  const [activeView, setActiveView] = useState("전체");
  const [properties, setProperties] = useState([]);
  const [transactionType, setTransactionType] = useState("ALL");
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [isClosingSidebar, setIsClosingSidebar] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const closingSidebarRef = useRef(false);
  const accessToken = useAuthStore((state) => state.accessToken);

  // 매물 데이터 다시 불러오기 함수
  const fetchProperties = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/apartments-properties?page=0&size=30`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          withCredentials: true,
        }
      );
      // API 응답 데이터 확인 및 적절한 구조로 변환
      const responseData = res.data.content || [];
      console.log("API 응답 데이터:", responseData);

      // 변환된 데이터 저장
      const convertedData = convertApiDataToTableData(responseData);
      setProperties(convertedData);

      // 초기 필터링 적용
      applyFilters(convertedData, activeView, transactionType);

      // 변환된 데이터 반환
      return convertedData;
    } catch (error) {
      console.error("매물 데이터 조회 중 오류 발생:", error);
      setProperties([]);
      setFilteredProperties([]);
      return [];
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, [accessToken]);

  // 필터링 함수: 모든 필터 적용
  const applyFilters = (propertiesList, view, type) => {
    let filtered = [...propertiesList];

    // 1. 내 물건 필터 적용
    if (view === "내 물건") {
      filtered = filtered.filter((property) => {
        // 소유주, 임차인, 가격 등 주요 정보가 입력된 매물만 표시
        return (
          (property.ownerName && property.ownerName !== "-") ||
          (property.contact && property.contact !== "-") ||
          (property.tenant && property.tenant !== "-") ||
          (property.tenantContact && property.tenantContact !== "-") ||
          (property.salePrice && property.salePrice !== "-") ||
          (property.deposit && property.deposit !== "-") ||
          (property.jeonsePrice && property.jeonsePrice !== "-") ||
          (property.monthPrice && property.monthPrice !== "-") ||
          (property.startDate && property.startDate !== "-") ||
          (property.endDate && property.endDate !== "-") ||
          (property.memo && property.memo !== "")
        );
      });
    }

    // 2. 거래 유형 필터 적용
    if (type !== "ALL") {
      const typeMapping = {
        BUY: "매매",
        JEONSE: "전세",
        MONTH_RENT: "월세", // 월세에 대한 API 값은 MONTH_RENT로 통일
      };

      const displayType = typeMapping[type];
      if (displayType) {
        filtered = filtered.filter(
          (property) => property.transactionType === displayType
        );
      }
    }

    setFilteredProperties(filtered);
  };

  // activeView나 transactionType이 변경될 때마다 필터링 적용
  useEffect(() => {
    applyFilters(properties, activeView, transactionType);
  }, [activeView, transactionType, properties]);

  const handleViewChange = (view) => {
    setActiveView(view);
  };

  const handleSearch = (searchTerm) => {
    console.log(searchTerm);
  };

  const handlePropertySelect = (property) => {
    if (closingSidebarRef.current) {
      // 닫히는 애니메이션 중이면 무시
      return;
    }

    // 동일한 행을 다시 클릭하면 사이드바 닫기
    if (selectedProperty && selectedProperty.id === property.id) {
      // 사이드바를 닫으려면 handleCloseSidebar 실행
      closeSidebar();
    } else {
      // 다른 행을 클릭하면 새로운 프로퍼티 설정
      setIsClosingSidebar(false);
      setSelectedProperty(property);
      // 수정 중이었다면 수정 모드 종료
      if (isEditMode) {
        setIsEditMode(false);
      }
    }
  };

  const handleSaveProperty = async (updatedProperty) => {
    // 먼저 서버에서 최신 데이터를 가져옴
    const latestProperties = await fetchProperties();

    // 최신 데이터에서 해당 id의 항목을 찾아 선택
    const freshProperty = latestProperties.find(
      (p) => p.id === updatedProperty.id
    );

    if (freshProperty) {
      // 서버의 최신 데이터로 선택된 항목 업데이트
      setSelectedProperty(freshProperty);
    } else {
      // 서버에서 찾지 못한 경우 업데이트된 로컬 데이터 사용
      setSelectedProperty(updatedProperty);
    }

    // 편집 모드 종료 (사이드바는 닫지 않음)
    setIsEditMode(false);
  };

  const handleTransactionTypeChange = (type) => {
    console.log("거래 유형 변경:", type);
    setTransactionType(type);
  };

  const closeSidebar = () => {
    // 닫기 애니메이션 시작
    setIsClosingSidebar(true);

    // 사이드바가 닫힐 때 상태 업데이트하지 않기 위한 플래그
    closingSidebarRef.current = true;

    // 애니메이션 시간 후에 선택된 프로퍼티 null로 설정
    setTimeout(() => {
      setSelectedProperty(null);
      setIsClosingSidebar(false);
      closingSidebarRef.current = false;
    }, 300);
  };

  return (
    <div className={`page_section ${selectedProperty ? "with-sidebar" : ""}`}>
      {/* 페이지 헤더 영역 (수평 레이아웃) */}
      <div className="page_header">
        <div className="header_left">
          <p className="page_title">매물 관리</p>
          <p className="page_description">현재 등록된 매물 목록입니다.</p>
        </div>
        <div className="view_selector">
          <button
            className={`view_option ${activeView === "전체" ? "view_option--active" : ""}`}
            onClick={() => handleViewChange("전체")}
          >
            전체
          </button>
          <button
            className={`view_option ${activeView === "내 물건" ? "view_option--active" : ""}`}
            onClick={() => handleViewChange("내 물건")}
          >
            내 물건
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
          <Search onSearch={handleSearch} />
        </div>
        <div style={{ display: "flex", gap: "0.8rem" }}>
          <SortBy />
          <TransactionType
            onTransactionTypeChange={handleTransactionTypeChange}
          />
          <AddProperty />
          <DeleteProperty />
        </div>
      </div>

      {/* 매물 컨텐츠 */}
      <div className={`page_content ${selectedProperty ? "with-sidebar" : ""}`}>
        {loading ? (
          <div>로딩 중...</div>
        ) : (
          <PropertyTable
            properties={filteredProperties}
            onPropertySelect={handlePropertySelect}
          />
        )}

        {selectedProperty &&
          (isEditMode ? (
            <PropertyModifySidebar
              property={selectedProperty}
              onClose={() => {
                // 닫기 버튼을 눌렀을 때만 사이드바를 닫음
                closeSidebar();
                setIsEditMode(false);
              }}
              onSave={handleSaveProperty}
              onCancel={() => setIsEditMode(false)}
            />
          ) : (
            <PropertyDetailSidebar
              property={selectedProperty}
              onClose={closeSidebar}
              isClosing={isClosingSidebar}
              onEdit={() => setIsEditMode(true)}
            />
          ))}
      </div>
    </div>
  );
};

export default Properties;
