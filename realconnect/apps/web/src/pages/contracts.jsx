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

const Contracts = () => {
  const [selectedContract, setSelectedContract] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
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

  const sortByOptions = [
    { value: "contractDate,desc", label: "최신 계약일순" },
    { value: "dueDate,asc", label: "만기일 임박순" },
  ];

  const {
    data: contracts,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["contracts", filters],
    queryFn: () => {
      const params = {
        transactionType:
          filters.transactionType === "ALL" ? null : filters.transactionType,
        contractStatus:
          filters.contractStatus === "ALL" ? null : filters.contractStatus,
        sort: filters.sort,
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

  const handleSelectContract = (contract) => {
    setSelectedContract(contract);
    setIsSidebarOpen(true);
    setIsClosing(false);
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

  return (
    <div className="page_section">
      <div className="page_header">
        <div className="header_left">
          <p className="page_title">계약 관리</p>
          <p className="page_description">모든 계약 내역을 확인하고 관리합니다.</p>
        </div>
        <div className="header_right">
          <Button
            label="+ 계약 추가하기"
            onClick={() => setIsModalOpen(true)}
            variant="primary"
          />
        </div>
      </div>
      
      <div className="table-controls">
         <div style={{ display: "flex", gap: "0.8rem" }}>
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
         <SortButton
            options={sortByOptions}
            value={filters.sort || "contractDate,desc"} // UI에서는 기본값을 보여주도록 처리
            onChange={(value) => handleFilterChange('sort', value)}
         />
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
  );
};

export default Contracts;