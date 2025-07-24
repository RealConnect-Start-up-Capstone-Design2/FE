import React, { useState, useRef, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getInquiries,
  updateInquiry,
  createInquiry,
} from "../../services/inquiryService";

// 컴포넌트 불러오기
import Search from "../../components/common/search/search";
import { Button, SortButton } from "@realconnect/shared-ui";
import InquiriesTable from "../../components/domain/inquiries/inquiriesTable";
import InquiryDetailSidebar from "../../components/domain/inquiries/inquiryDetailSidebar";
import InquiryModifySidebar from "../../components/domain/inquiries/inquiryModifySidebar";
import TableHeaderControls from "../../components/common/TableHeaderControls";
import ViewSelector from "../../components/common/ViewSelector";
import { toInquiryTableRow } from "../../../../../packages/shared-model/InquiryModel";
import { toInquiryViewRow } from "../../../../../packages/web-viewmodel/inquiryViewModel";

// 아이콘 불러오기
import PlusIcon from "../../assets/icons/plus.svg?react";
import TrashIcon from "../../assets/icons/trash.svg?react";

const Inquiries = () => {
  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [activeView, setActiveView] = useState("전체");
  const [isClosingSidebar, setIsClosingSidebar] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [inquiryType, setInquiryType] = useState("ALL");
  const [isAddingInquiry, setIsAddingInquiry] = useState(false);
  const closingSidebarRef = useRef(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const queryClient = useQueryClient();

  const { data: rawInquiries, isLoading } = useQuery({
    queryKey: ["inquiries", { searchKeyword, inquiryType }],
    queryFn: () => {
      const params = {
        keyword: searchKeyword || undefined,
        inquiryType: inquiryType === "ALL" ? undefined : inquiryType,
      };
      return getInquiries(params);
    },
  });

  const saveInquiryMutation = useMutation({
    mutationFn: (inquiryData) => {
      // inquiryType -> type 변환
      const requestBody = { ...inquiryData, type: inquiryData.inquiryType };
      delete requestBody.inquiryType;
      if (inquiryData.id) {
        return updateInquiry(inquiryData.id, requestBody);
      } else {
        return createInquiry(requestBody);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["inquiries"]);
      closeSidebar();
      setIsAddingInquiry(false);
      setIsEditMode(false);
    },
  });

  const updateFavoriteMutation = useMutation({
    mutationFn: (inquiry) => {
      // inquiryType -> type 변환
      const requestBody = { ...inquiry, type: inquiry.inquiryType };
      delete requestBody.inquiryType;
      return updateInquiry(inquiry.id, requestBody);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["inquiries"]);
    },
  });

  const handleAddInquiryClick = () => {
    setIsAddingInquiry(true);
    if (selectedInquiry) {
      setSelectedInquiry(null);
      setIsEditMode(false);
    }
  };

  // Model과 ViewModel 배열을 모두 관리
  const models = React.useMemo(() => {
    if (!rawInquiries) return [];
    let processedData = rawInquiries.map(toInquiryTableRow);
    processedData.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    if (activeView === "즐겨찾기") {
      return processedData.filter((inquiry) => inquiry.favorite);
    }
    return processedData;
  }, [rawInquiries, activeView]);

  // ViewModel로 변환
  const viewRows = React.useMemo(() => models.map(toInquiryViewRow), [models]);

  useEffect(() => {
    if (selectedInquiry && models.length > 0) {
      const updatedInquiry = models.find(
        (inquiry) => inquiry.id === selectedInquiry.id
      );
      if (updatedInquiry) {
        setSelectedInquiry(updatedInquiry);
      }
    }
  }, [models, selectedInquiry]);

  const transactionTypeOptions = [
    { value: "ALL", label: "전체" },
    { value: "BUY", label: "매매" },
    { value: "JEONSE", label: "전세" },
    { value: "MONTH_RENT", label: "월세" },
  ];

  const handleViewChange = (view) => {
    setActiveView(view);
  };

  const handleSearch = (searchTerm) => {
    setSearchKeyword(searchTerm);
  };

  const handleTransactionTypeChange = (type) => {
    setInquiryType(type);
  };

  // 즐겨찾기 토글 시 Model을 찾아서 서버로 전달
  const handleFavoriteToggle = (viewRow) => {
    // viewRow에서 id 추출
    const model = models.find((item) => item.id === viewRow.id);
    if (!model) return;
    // rawInquiries에서 원본 entity 찾기
    const original = rawInquiries?.find((item) => item.id === model.id);
    if (!original) return;
    const updated = { ...original, favorite: !original.favorite };
    updateFavoriteMutation.mutate(updated);
  };

  const handleInquirySelect = (inquiry) => {
    if (isAddingInquiry) {
      setIsAddingInquiry(false);
    }
    if (closingSidebarRef.current) {
      return;
    }
    if (selectedInquiry && selectedInquiry.id === inquiry.id) {
      closeSidebar();
    } else {
      setSelectedInquiry(inquiry);
      setIsClosingSidebar(false);
      if (isEditMode) {
        setIsEditMode(false);
      }
    }
  };

  const closeSidebar = () => {
    if (closingSidebarRef.current) return;
    closingSidebarRef.current = true;
    setIsClosingSidebar(true);

    setTimeout(() => {
      setSelectedInquiry(null);
      setIsEditMode(false);
      setIsClosingSidebar(false);
      closingSidebarRef.current = false;
    }, 300);
  };

  const handleDeleteSuccess = () => {
    queryClient.invalidateQueries(["inquiries"]);
    if (selectedInquiry) {
      closeSidebar();
    }
  };

  const handleSaveInquiry = (inquiryData) => {
    saveInquiryMutation.mutate(inquiryData);
  };

  return (
    <div
      className={`page_section ${selectedInquiry || isAddingInquiry ? "with-sidebar" : ""}`}
    >
      <div className="page_header">
        <div className="header_left">
          <p className="page_title">문의 관리</p>
          <p className="page_description">
            모든 문의 내역을 확인하고 관리합니다.
          </p>
        </div>
        <ViewSelector
          options={[
            { value: "전체", label: "전체" },
            { value: "즐겨찾기", label: "즐겨찾기" },
          ]}
          active={activeView}
          onChange={handleViewChange}
        />
      </div>

      <div className="content_wrap">
        <TableHeaderControls
          search={<Search onSearch={handleSearch} />}
          rightChildren={
            <>
              <SortButton
                options={transactionTypeOptions}
                value={inquiryType}
                onChange={handleTransactionTypeChange}
              />
              <Button
                label="문의 추가"
                onClick={handleAddInquiryClick}
                variant="primary"
                disabled={isAddingInquiry}
                icon={<PlusIcon />}
              />
              <Button
                label="문의 삭제"
                onClick={() => {}}
                variant="secondary"
                icon={<TrashIcon />}
              />
            </>
          }
        />
        <div className="table_wrap">
          {isLoading ? (
            <div>로딩 중...</div>
          ) : (
            <InquiriesTable
              inquiries={viewRows}
              onInquirySelect={handleInquirySelect}
              onFavoriteToggle={handleFavoriteToggle}
            />
          )}
        </div>
        {(selectedInquiry || isAddingInquiry) && (
          <>
            {selectedInquiry &&
              (isEditMode ? (
                <InquiryModifySidebar
                  inquiry={selectedInquiry}
                  onClose={closeSidebar}
                  onSave={handleSaveInquiry}
                  isClosing={isClosingSidebar}
                />
              ) : (
                <InquiryDetailSidebar
                  inquiry={selectedInquiry}
                  onClose={closeSidebar}
                  onDelete={handleDeleteSuccess}
                  onEdit={() => setIsEditMode(true)}
                  isClosing={isClosingSidebar}
                />
              ))}
            {isAddingInquiry && !selectedInquiry && (
              <InquiryModifySidebar
                inquiry={{
                  id: null,
                  name: "",
                  phone: "",
                  apartmentName: "",
                  area: "",
                  inquiryType: "BUY",
                  status: "IN_PROGRESS",
                  salePrice: "",
                  deposit: "",
                  jeonsePrice: "",
                  monthPrice: "",
                  memo: "",
                  favorite: false,
                }}
                onClose={() => setIsAddingInquiry(false)}
                onSave={handleSaveInquiry}
                isClosing={isClosingSidebar}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Inquiries;
