import React, { useState } from "react";

// 컴포넌트 불러오기
import Search from "../components/search/search";
import SortBy from "../components/sortButtons/sortBy";
import TransactionType from "../components/sortButtons/transactionType";
import AddProperty from "../components/addProperrty/addProperty";
import DeleteProperty from "../components/deleteProperty/deleteProperty";
import PropertyTable from "../components/PropertyTable/PropertyTable";

const Properties = () => {
  const [activeView, setActiveView] = useState("전체");

  // 샘플 데이터
  const allProperties = [
    {
      id: 1,
      image: null,
      complex: "파크리오",
      building: "101동",
      unit: "1312호",
      area: "151 m²",
      sellPrice: "24억 5000",
      deposit: "2억",
      rentDeposit: "500",
      monthlyRent: "60",
      transactionType: "매매",
      owner: "김규식",
      contact: "010-1234-2334",
      status: "개약전",
    },
    {
      id: 2,
      image: null,
      complex: "파크리오",
      building: "101동",
      unit: "1312호",
      area: "151 m²",
      sellPrice: "24억 5000",
      deposit: "2억",
      rentDeposit: "500",
      monthlyRent: "60",
      transactionType: "매매",
      owner: "김규식",
      contact: "010-1234-2334",
      status: "개약완료",
    },
    {
      id: 3,
      image: null,
      complex: "파크리오",
      building: "101동",
      unit: "1312호",
      area: "151 m²",
      sellPrice: "24억 5000",
      deposit: "2억",
      rentDeposit: "500",
      monthlyRent: "60",
      transactionType: "매매",
      owner: "김규식",
      contact: "010-1234-2334",
      status: "개약전",
    },
    {
      id: 4,
      image: null,
      complex: "파크리오",
      building: "101동",
      unit: "1312호",
      area: "151 m²",
      sellPrice: "24억 5000",
      deposit: "2억",
      rentDeposit: "500",
      monthlyRent: "60",
      transactionType: "매매",
      owner: "김규식",
      contact: "010-1234-2334",
      status: "개약전",
    },
    {
      id: 5,
      image: null,
      complex: "파크리오",
      building: "101동",
      unit: "1312호",
      area: "151 m²",
      sellPrice: "24억 5000",
      deposit: "2억",
      rentDeposit: "500",
      monthlyRent: "60",
      transactionType: "매매",
      owner: "김규식",
      contact: "010-1234-2334",
      status: "개약전",
    },
    {
      id: 6,
      image: null,
      complex: "파크리오",
      building: "101동",
      unit: "1312호",
      area: "151 m²",
      sellPrice: "24억 5000",
      deposit: "2억",
      rentDeposit: "500",
      monthlyRent: "60",
      transactionType: "매매",
      owner: "김규식",
      contact: "010-1234-2334",
      status: "개약완료",
    },
    {
      id: 7,
      image: null,
      complex: "파크리오",
      building: "101동",
      unit: "1312호",
      area: "151 m²",
      sellPrice: "24억 5000",
      deposit: "2억",
      rentDeposit: "500",
      monthlyRent: "60",
      transactionType: "매매",
      owner: "김규식",
      contact: "010-1234-2334",
      status: "개약완료",
    },
    {
      id: 8,
      image: null,
      complex: "파크리오",
      building: "101동",
      unit: "1312호",
      area: "151 m²",
      sellPrice: "24억 5000",
      deposit: "2억",
      rentDeposit: "500",
      monthlyRent: "60",
      transactionType: "매매",
      owner: "김규식",
      contact: "010-1234-2334",
      status: "개약완료",
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

  return (
    <div className="properties_page">
      {/* 페이지 헤더 영역 (수평 레이아웃) */}
      <div className="properties_header">
        <div className="header_left">
          <p className="page_title">매물 관리</p>
          <p className="page_description">현재 등록된 매물 목록입니다.</p>
        </div>
        <div className="properties_view_selector">
          <button
            className={`properties_view_option ${activeView === "전체" ? "properties_view_option--active" : ""}`}
            onClick={() => handleViewChange("전체")}
          >
            전체
          </button>
          <button
            className={`properties_view_option ${activeView === "내 물건" ? "properties_view_option--active" : ""}`}
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
      <div className="properties_content">
        {activeView === "전체" ? (
          <PropertyTable properties={allProperties} />
        ) : (
          <PropertyTable properties={myProperties} />
        )}
      </div>
    </div>
  );
};

export default Properties;
