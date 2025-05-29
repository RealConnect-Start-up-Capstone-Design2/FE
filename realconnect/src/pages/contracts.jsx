import React, { useState, useRef } from "react";
import "./contracts.css";

// 컴포넌트 불러오기
import ContractTable from "../components/contractTable/contractTable";
import Search from "../components/search/search";
import SortBy from "../components/sortButtons/sortBy";
import ContractStatus from "../components/sortButtons/contractStatus";
import AddContract from "../components/addContract/addContract";
import DeleteContract from "../components/deleteContract/deleteContract";
import ContractDetailSidebar from "../components/rightSidebar/contractDetailSidebar";

const Contracts = () => {
  const [activeView, setActiveView] = useState("전체");
  const [selectedContract, setSelectedContract] = useState(null);
  const [isClosingSidebar, setIsClosingSidebar] = useState(false);
  const closingSidebarRef = useRef(false);

  // 샘플 데이터
  const [allContracts, setAllContracts] = useState([
    {
      id: 1,
      complex: "파크리오",
      building: "101",
      unit: "102",
      area: "16",
      price: "2억 5000",
      owner: "김규식",
      ownerContact: "010-1234-2334",
      tenant: "최정현",
      tenantContact: "010-2334-3456",
      transactionType: "매매",
      sellPrice: "24억 5000",
      startDate: "2025. 5. 27.",
      endDate: "2026. 12. 12.",
      status: "계약 완료",
      contractFile: "전세계약서_김규식.pdf",
      fileSize: "203.5 KB",
      fileDate: "2025. 3. 2.",
      isFavorite: true,
    },
    {
      id: 2,
      complex: "파크리오",
      building: "101",
      unit: "1010",
      area: "151",
      price: "2억 5000",
      owner: "김규식",
      ownerContact: "010-1234-2334",
      tenant: "최정현",
      tenantContact: "010-2334-3456",
      transactionType: "매매",
      sellPrice: "24억 5000",
      startDate: "2025. 3. 2.",
      endDate: "2026. 12. 12.",
      status: "계약 완료",
      contractFile: "전세계약서_김규식.pdf",
      fileSize: "203.5 KB",
      fileDate: "2025. 3. 2.",
      isFavorite: true,
    },
    {
      id: 3,
      complex: "파크리오",
      building: "101",
      unit: "107",
      area: "151",
      price: "2억 5000",
      owner: "김규식",
      ownerContact: "010-1234-2334",
      tenant: "최정현",
      tenantContact: "010-2334-3456",
      transactionType: "매매",
      sellPrice: "24억 5000",
      startDate: "2025. 3. 2.",
      endDate: "2026. 12. 12.",
      status: "계약 중",
      contractFile: "전세계약서_김규식.pdf",
      fileSize: "203.5 KB",
      fileDate: "2025. 3. 2.",
      isFavorite: true,
    },
    // 추가 데이터는 나중에 추가
  ]);

  // 즐겨찾기 데이터
  const favoriteContracts = allContracts.filter(
    (contract) => contract.isFavorite
  );

  const handleViewChange = (view) => {
    setActiveView(view);
  };

  const handleSearch = (searchTerm) => {
    console.log(searchTerm);
    // 검색 기능 구현
  };

  const handleContractSelect = (contract) => {
    if (closingSidebarRef.current) {
      // 닫히는 애니메이션 중이면 무시
      return;
    }

    // 동일한 행을 다시 클릭하면 사이드바 닫기
    if (selectedContract && selectedContract.id === contract.id) {
      // 사이드바를 닫으려면 handleCloseSidebar 실행
      closeSidebar();
    } else {
      // 다른 행을 클릭하면 새로운 계약 설정
      setIsClosingSidebar(false);
      setSelectedContract(contract);
    }
  };

  const closeSidebar = () => {
    // 닫기 애니메이션 시작
    setIsClosingSidebar(true);

    // 사이드바가 닫힐 때 상태 업데이트하지 않기 위한 플래그
    closingSidebarRef.current = true;

    // 애니메이션 시간 후에 선택된 계약 null로 설정
    setTimeout(() => {
      setSelectedContract(null);
      setIsClosingSidebar(false);
      closingSidebarRef.current = false;
    }, 300);
  };

  // 계약 정보 업데이트 처리
  const handleContractUpdate = (updatedData) => {
    // API 호출 구현 부분 (추후 구현)
    // const response = await api.updateContract(updatedData);

    // 임시로 로컬 상태 업데이트 (API 연동 전)
    const updatedContracts = allContracts.map((contract) => {
      if (contract.id === selectedContract.id) {
        // 업데이트된 계약 데이터로 변환
        return {
          ...contract,
          ...updatedData, // 이미 변환된 데이터를 그대로 사용
          // 파일 날짜 업데이트
          fileDate:
            updatedData.contractFile &&
            updatedData.contractFile !== contract.contractFile
              ? new Date()
                  .toLocaleDateString("ko-KR", {
                    year: "numeric",
                    month: "numeric",
                    day: "numeric",
                  })
                  .replace(/\./g, ". ")
                  .replace(/\s$/, "")
              : contract.fileDate,
        };
      }
      return contract;
    });

    setAllContracts(updatedContracts);

    // 선택된 계약 정보도 업데이트
    const updatedSelectedContract = updatedContracts.find(
      (contract) => contract.id === selectedContract.id
    );

    setSelectedContract(updatedSelectedContract);
    console.log("업데이트된 선택 계약:", updatedSelectedContract);
  };

  return (
    <div className={`page_section ${selectedContract ? "with-sidebar" : ""}`}>
      {/* 페이지 헤더 영역 (수평 레이아웃) */}
      <div className="page_header">
        <div className="header_left">
          <p className="page_title">계약 관리</p>
          <p className="page_description">
            현재 등록된 고객들의 계약 목록입니다.
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
        <div style={{ width: "30rem" }}>
          <Search onSearch={handleSearch} />
        </div>
        <div style={{ display: "flex", gap: "0.8rem" }}>
          <SortBy />
          <ContractStatus />
          <AddContract />
          <DeleteContract />
        </div>
      </div>

      {/* 계약 컨텐츠 */}
      <div className="page_content">
        {activeView === "전체" ? (
          <ContractTable
            contracts={allContracts}
            onContractSelect={handleContractSelect}
          />
        ) : (
          <ContractTable
            contracts={favoriteContracts}
            onContractSelect={handleContractSelect}
          />
        )}

        {selectedContract && (
          <ContractDetailSidebar
            contract={selectedContract}
            onClose={closeSidebar}
            isClosing={isClosingSidebar}
            onUpdate={handleContractUpdate}
          />
        )}
      </div>
    </div>
  );
};

export default Contracts;
