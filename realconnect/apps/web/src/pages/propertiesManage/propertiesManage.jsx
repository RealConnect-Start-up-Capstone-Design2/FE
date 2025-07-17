import React, { useState, useRef, useEffect, useMemo } from "react";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { getProperties, updateProperty } from "../../services/propertyService";

// 컴포넌트 불러오기
import Search from "../../components/common/search/search";
import { Button, SortButton } from "@realconnect/shared-ui";
import PropertiesTable from "../../components/domain/propertiesManage/propertiesTable";
import PropertyDetailSidebar from "../../components/domain/propertiesManage/propertyDetailSidebar";
import PropertyModifySidebar from "../../components/domain/propertiesManage/propertyModifySidebar";

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
  const [transactionType, setTransactionType] = useState("ALL");
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [isClosingSidebar, setIsClosingSidebar] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const closingSidebarRef = useRef(false);
  const queryClient = useQueryClient();
  const [sortStandard, setSortStandard] = useState("DONG_HO");

  const handleSortStandardChange = (value) => {
    setSortStandard(value);
  };

  const { data: propertiesData } = useQuery({
    queryKey: ["properties"],
    queryFn: () => getProperties({ page: 0, size: 30 }),
  });

  const updatePropertyMutation = useMutation({
    mutationFn: ({ propertyId, data }) => updateProperty(propertyId, data),
    onSuccess: () => {
      queryClient.invalidateQueries(["properties"]);
    },
  });

  const properties = useMemo(
    () =>
      propertiesData
        ? convertApiDataToTableData(propertiesData.content || [])
        : [],
    [propertiesData]
  );

  // 필터링 함수: 모든 필터 적용
  const applyFilters = (propertiesList, view, type) => {
    let filtered = [...propertiesList];

    // 1. 내 물건 필터 적용
    if (view === "내 물건") {
      filtered = filtered.filter((property) => {
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
        MONTH_RENT: "월세",
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

  const transactionTypeOptions = [
    { value: "ALL", label: "전체" },
    { value: "BUY", label: "매매" },
    { value: "JEONSE", label: "전세" },
    { value: "MONTH_RENT", label: "월세" },
  ];

  const SortStandardOptions = [
    { value: "DONG_HO", label: "동호수 기준" },
    { value: "END_DATE", label: "만기일 기준" },
    { value: "CREATED_AT", label: "등록일 기준" },
  ];

  const handleViewChange = (view) => {
    setActiveView(view);
  };

  const handleSearch = (searchTerm) => {
    console.log(searchTerm);
  };

  const handlePropertySelect = (property) => {
    if (closingSidebarRef.current) return;

    if (selectedProperty && selectedProperty.id === property.id) {
      closeSidebar();
    } else {
      setIsClosingSidebar(false);
      setSelectedProperty(property);
      if (isEditMode) {
        setIsEditMode(false);
      }
    }
  };

  const handleSaveProperty = (updatedProperty) => {
    updatePropertyMutation.mutate({
      propertyId: updatedProperty.id,
      data: updatedProperty,
    });
    // The mutation's onSuccess will invalidate the query, causing a refetch.
    // We can close the sidebar immediately for a better user experience.
    closeSidebar();
  };

  const handleTransactionTypeChange = (type) => {
    setTransactionType(type);
  };

  const closeSidebar = () => {
    setIsClosingSidebar(true);
    closingSidebarRef.current = true;
    setTimeout(() => {
      setSelectedProperty(null);
      setIsClosingSidebar(false);
      closingSidebarRef.current = false;
    }, 300);
  };

  return (
    <div className={`page_section ${selectedProperty ? "with-sidebar" : ""}`}>
      <div className="page_header">
        <div className="header_left">
          <p className="page_title">매물 관리</p>
          <p className="page_description">
            현재 등록된 또는 등록할 매물 목록입니다.
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
              activeView === "내 물건" ? "view_option--active" : ""
            }`}
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
        <div style={{ width: "400px" }}>
          <Search onSearch={handleSearch} />
        </div>
        <div style={{ display: "flex", gap: "0.8rem" }}>
          <SortButton
            options={SortStandardOptions}
            value={sortStandard}
            onChange={handleSortStandardChange}
            placeholder="정렬 기준"
          />
          <SortButton
            options={transactionTypeOptions}
            value={transactionType}
            onChange={handleTransactionTypeChange}
            placeholder="거래 유형"
          />
          <Button label="매물 추가" onClick={() => {}} />
          <Button label="매물 삭제" onClick={() => {}} variant="secondary" />
        </div>
      </div>
      <div className="page_content">
        <PropertiesTable
          properties={filteredProperties}
          onPropertySelect={handlePropertySelect}
        />
      </div>
      {selectedProperty &&
        (isEditMode ? (
          <PropertyModifySidebar
            property={selectedProperty}
            onClose={closeSidebar}
            onSave={handleSaveProperty}
            isClosing={isClosingSidebar}
          />
        ) : (
          <PropertyDetailSidebar
            property={selectedProperty}
            onClose={closeSidebar}
            onEdit={() => setIsEditMode(true)}
            isClosing={isClosingSidebar}
          />
        ))}
    </div>
  );
};

export default Properties;