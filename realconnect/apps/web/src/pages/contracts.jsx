import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button, SortButton } from "@realconnect/shared-ui";
import ContractTable from "@/components/domain/contractTable/contractTable";
import ContractDetailSidebar from "@/components/domain/rightSidebar/contractDetailSidebar";
import CreateContractModal from "@/pages/modal/createContractModal";
import {
  getContracts,
  createContract,
  updateContract,
} from "@/services/contractService";
import Search from "@/components/common/search/search";

const Contracts = () => {
  const [selectedContract, setSelectedContract] = useState(null);
  const [activeView, setActiveView] = useState("전체");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState("");
  const queryClient = useQueryClient();

  const [filters, setFilters] = useState({
    transactionType: null,
    contractStatus: null,
    sort: null, // 초기 정렬값 제거
  });

  const transactionTypeOptions = [
    { value: "ALL", label: "전체" },
    { value: "BUY", label: "매매" },
    { value: "JEONSE", label: "전세" },
    { value: "MONTH_RENT", label: "월세" },
  ];

  const contractStatusOptions = [
    { value: "ALL", label: "전체" },
    { value: "ACTIVE", label: "계약중" },
    { value: "TERMINATED", label: "계약파기" },
    { value: "EXPIRED", label: "계약만료" },
  ];

  const {
    data: contracts,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["contracts", {filters, searchKeyword}],
    queryFn: () => {
      const params = {
        transactionType:
          filters.transactionType === "ALL" ? null : filters.transactionType,
        contractStatus:
          filters.contractStatus === "ALL" ? null : filters.contractStatus,
        sort: filters.sort,
        keyword: searchKeyword || undefined,
      };
      // sort 파라미터가 null이 아닐 때만 요청에 포함
      if (!params.sort) {
        delete params.sort;
      }
      return getContracts(params);
    },
    initialData: [],
  });

  const createContractMutation = useMutation({
    mutationFn: createContract,
    onSuccess: () => {
      queryClient.invalidateQueries(["contracts"]);
      setIsModalOpen(false);
    },
  });

  const updateContractMutation = useMutation({
    mutationFn: (contractData) =>
      updateContract(contractData.id, contractData),
    onSuccess: () => {
      queryClient.invalidateQueries(["contracts"]);
      handleCloseSidebar();
    },
  });

  const handleSearch = (searchTerm) => {
    setSearchKeyword(searchTerm);
  };

  const handleSelectContract = (contract) => {
    if (selectedContract && selectedContract.id === contract.id) {
      handleCloseSidebar();
    } else {
      setSelectedContract(contract);
      setIsSidebarOpen(true);
      setIsClosing(false);
    }
  };
  
  const handleCloseSidebar = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsSidebarOpen(false);
      setSelectedContract(null);
    }, 300);
  };
  
  const handleUpdateContract = (updatedContract) => {
    updateContractMutation.mutate(updatedContract);
  };
  
  const handleFilterChange = (filterName, value) => {
    setFilters(prev => ({ ...prev, [filterName]: value }));
  };

  const handleViewChange = (view) => {
    setActiveView(view);
  };

  return (
    <div className={`page_section ${isSidebarOpen ? "with-sidebar" : ""}`}>
      <div className="page_header">
        <div className="header_left">
          <p className="page_title">계약 관리</p>
          <p className="page_description">모든 계약 내역을 확인하고 관리합니다.</p>
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
              activeView === "즐겨찾기" ? "view_option--active" : ""
            }`}
            onClick={() => handleViewChange("즐겨찾기")}
          >
            즐겨찾기
          </button>
        </div>
      </div>
      <div className="content_wrap">
      <div className="table_header">
        <div className="table_controls" style={{justifyContent: 'space-between', width: '100%'}}>
         <div style={{ display: "flex", gap: "0.8rem" }}>
          <Search onSearch={handleSearch} />
            <SortButton
                options={transactionTypeOptions}
                value={filters.transactionType || "ALL"}
                onChange={(value) => handleFilterChange('transactionType', value)}
            />
            <SortButton
                options={contractStatusOptions}
                value={filters.contractStatus || "ALL"}
                onChange={(value) => handleFilterChange('contractStatus', value)}
            />
         </div>
         <Button label="계약 추가" onClick={() => {}} variant="primary" />
         <Button label="계약 삭제" onClick={() => {}} variant="secondary" />
        </div>
      </div>
      {isLoading ? (
        <div>로딩 중...</div>
      ) : error ? (
        <div>계약 목록을 불러오는 데 실패했습니다.</div>
      ) : (
        <div className="table_section">
            <ContractTable
              contracts={contracts}
              onContractSelect={handleSelectContract}
              onContractUpdate={handleUpdateContract}
            />
        </div>
      )}
      
      {isSidebarOpen && selectedContract && (
        <ContractDetailSidebar
          contract={selectedContract}
          onClose={handleCloseSidebar}
          isClosing={isClosing}
          onUpdate={handleUpdateContract}
        />
      )}

      <CreateContractModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={(contractData) => createContractMutation.mutate(contractData)}
      />
    </div>
    </div>
  );
};

export default Contracts;