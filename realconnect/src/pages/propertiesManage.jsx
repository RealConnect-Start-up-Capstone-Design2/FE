import React, { useState, useRef } from "react";
import "./propertiesManage.css";

// 컴포넌트 불러오기
import Search from "../components/search/search";
import SortBy from "../components/sortButtons/sortBy";
import TransactionType from "../components/sortButtons/transactionType";
import AddProperty from "../components/addProperrty/addProperty";
import DeleteProperty from "../components/deleteProperty/deleteProperty";
import PropertyTable from "../components/PropertyTable/PropertyTable";
import PropertyDetailSidebar from "../components/rightSidebar/propertyDetailSidebar";

const Properties = () => {
  const [activeView, setActiveView] = useState("전체");
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [isClosingSidebar, setIsClosingSidebar] = useState(false);
  const closingSidebarRef = useRef(false);

  // 샘플 데이터
  const allProperties = [
    {
      id: 1,
      complex: "파크리오",
      building: "101동",
      unit: "101호",
      area: "151 m²",
      sellPrice: "24억 5000",
      deposit: "2억",
      rentDeposit: "500",
      monthlyRent: "60",
      transactionType: "매매/전세/월세",
      owner: "김규식",
      contact: "010-1234-2334",
      tenant: "김민채",
      tenantContact: "010-1234-2334",
      status: "계약 전",
    },
    {
      id: 2,
      complex: "파크리오",
      building: "101동",
      unit: "102호",
      area: "151 m²",
      sellPrice: "24억 5000",
      deposit: "2억",
      rentDeposit: "500",
      monthlyRent: "60",
      transactionType: "매매",
      owner: "김규식",
      contact: "010-1234-2334",
      tenant: "김민채",
      tenantContact: "010-1234-2334",
      status: "계약 완료",
    },
    {
      id: 3,
      complex: "파크리오",
      building: "101동",
      unit: "103호",
      area: "151 m²",
      sellPrice: "24억 5000",
      deposit: "2억",
      rentDeposit: "500",
      monthlyRent: "60",
      transactionType: "매매",
      owner: "김규식",
      contact: "010-1234-2334",
      tenant: "김민채",
      tenantContact: "010-1234-2334",
      status: "계약 전",
    },
    {
      id: 4,
      complex: "파크리오",
      building: "101동",
      unit: "104호",
      area: "151 m²",
      sellPrice: "24억 5000",
      deposit: "2억",
      rentDeposit: "500",
      monthlyRent: "60",
      transactionType: "매매",
      owner: "김규식",
      contact: "010-1234-2334",
      tenant: "김민채",
      tenantContact: "010-1234-2334",
      status: "계약 전",
    },
    {
      id: 5,
      complex: "파크리오",
      building: "101동",
      unit: "105호",
      area: "151 m²",
      sellPrice: "24억 5000",
      deposit: "2억",
      rentDeposit: "500",
      monthlyRent: "60",
      transactionType: "매매",
      owner: "김규식",
      contact: "010-1234-2334",
      tenant: "김민채",
      tenantContact: "010-1234-2334",
      status: "계약 전",
    },
    {
      id: 6,
      complex: "파크리오",
      building: "101동",
      unit: "106호",
      area: "151 m²",
      sellPrice: "24억 5000",
      deposit: "2억",
      rentDeposit: "500",
      monthlyRent: "60",
      transactionType: "매매",
      owner: "김규식",
      contact: "010-1234-2334",
      tenant: "신진범",
      tenantContact: "010-1234-2334",
      status: "계약 완료",
    },
    {
      id: 7,
      complex: "파크리오",
      building: "101동",
      unit: "107호",
      area: "151 m²",
      sellPrice: "24억 5000",
      deposit: "2억",
      rentDeposit: "500",
      monthlyRent: "60",
      transactionType: "매매",
      owner: "김규식",
      contact: "010-1234-2334",
      tenant: "김민채",
      tenantContact: "010-1234-2334",
      status: "계약 완료",
    },
    {
      id: 8,
      complex: "파크리오",
      building: "101동",
      unit: "108호",
      area: "151 m²",
      sellPrice: "24억 5000",
      deposit: "2억",
      rentDeposit: "500",
      monthlyRent: "60",
      transactionType: "매매",
      owner: "김규식",
      contact: "010-1234-2334",
      tenant: "김민채",
      tenantContact: "010-1234-2334",
      status: "계약 완료",
    },
    {
      id: 9,
      complex: "파크리오",
      building: "101동",
      unit: "109호",
      area: "151 m²",
      sellPrice: "24억 5000",
      deposit: "2억",
      rentDeposit: "500",
      monthlyRent: "60",
      transactionType: "매매",
      owner: "신진범",
      contact: "010-5555-6666",
      tenant: "최정현",
      tenantContact: "010-7777-8888",
      status: "계약 중",
    },
  ];

  // 내 물건 데이터 (전체 중 일부)
  const myProperties = allProperties.slice(0, 2);

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
    }
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
        <div style={{ width: "400px" }}>
          <Search onSearch={handleSearch} />
        </div>
        <div style={{ display: "flex", gap: "0.8rem" }}>
          <SortBy />
          <TransactionType />
          <AddProperty />
          <DeleteProperty />
        </div>
      </div>

      {/* 매물 컨텐츠 */}
      <div className="page_content">
        {activeView === "전체" ? (
          <PropertyTable
            properties={allProperties}
            onPropertySelect={handlePropertySelect}
          />
        ) : (
          <PropertyTable
            properties={myProperties}
            onPropertySelect={handlePropertySelect}
          />
        )}

        {selectedProperty && (
          <PropertyDetailSidebar
            property={selectedProperty}
            onClose={closeSidebar}
            isClosing={isClosingSidebar}
          />
        )}
      </div>
    </div>
  );
};

export default Properties;
