import React, { useState, useRef, useMemo, useEffect } from "react";
import {
  useInfiniteQuery,
  useQueryClient,
  useMutation,
} from "@tanstack/react-query";
import { getProperties, updateProperty } from "../../services/propertyService";

// 컴포넌트 불러오기
import Search from "../../components/common/search/search";
import { Button, SortButton } from "@realconnect/shared-ui";
import PropertiesTable from "../../components/domain/propertiesManage/propertiesTable";
import PropertyDetailSidebar from "../../components/domain/propertiesManage/propertyDetailSidebar";
import PropertyModifySidebar from "../../components/domain/propertiesManage/propertyModifySidebar";
import TableHeaderControls from "../../components/common/TableHeaderControls";
import ViewSelector from "../../components/common/ViewSelector";

// 아이콘 불러오기
import PlusIcon from "../../assets/icons/plus.svg?react";
import TrashIcon from "../../assets/icons/trash.svg?react";

// API 응답을 PropertyTable용 데이터로 변환
import { toPropertyTableRow } from "../../../../../packages/shared-model/PropertyTableRow";

const Properties = () => {
  const [activeView, setActiveView] = useState("전체");
  const [transactionType, setTransactionType] = useState("ALL");
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [isClosingSidebar, setIsClosingSidebar] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const closingSidebarRef = useRef(false);
  const queryClient = useQueryClient();
  const [sortStandard, setSortStandard] = useState("DONG_HO");
  const observerRef = useRef();

  const handleSortStandardChange = (value) => {
    setSortStandard(value);
  };

  // useInfiniteQuery로 변경
  const {
    data: propertiesData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useInfiniteQuery({
    queryKey: ["properties", activeView, transactionType, sortStandard],
    queryFn: ({ pageParam = 0 }) =>
      getProperties({
        page: pageParam,
        size: 20, // 한 번에 가져올 아이템 수
        sort: sortStandard,
        // 필터링 파라미터 추가
        view: activeView,
        transactionType:
          transactionType !== "ALL" ? transactionType : undefined,
      }),
    getNextPageParam: (lastPage, allPages) => {
      // 마지막 페이지가 아니면 다음 페이지 번호 반환
      return lastPage.last ? undefined : allPages.length;
    },
    initialPageParam: 0,
  });

  // 모든 페이지의 데이터를 하나의 배열로 합치기
  const allProperties = useMemo(() => {
    if (!propertiesData?.pages) return [];
    return propertiesData.pages.flatMap((page) =>
      (page.content || []).map(toPropertyTableRow)
    );
  }, [propertiesData]);

  // Intersection Observer를 사용한 무한 스크롤
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (
          entries[0].isIntersecting &&
          hasNextPage &&
          !isFetchingNextPage &&
          !isLoading
        ) {
          console.log("Loading next page...");
          fetchNextPage();
        }
      },
      {
        threshold: 0.1,
        rootMargin: "100px", // 스크롤 끝에서 100px 전에 로드 시작
      }
    );

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, isLoading, fetchNextPage]);

  const updatePropertyMutation = useMutation({
    mutationFn: ({ propertyId, data }) => updateProperty(propertyId, data),
    onSuccess: () => {
      queryClient.invalidateQueries(["properties"]);
    },
  });

  // 필터링된 매물 목록 (서버에서 이미 필터링된 데이터 사용)
  const filteredProperties = useMemo(() => {
    return allProperties;
  }, [allProperties]);

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
        <ViewSelector
          options={[
            { value: "전체", label: "전체" },
            { value: "내 물건", label: "내 물건" },
          ]}
          active={activeView}
          onChange={handleViewChange}
        />
      </div>
      <TableHeaderControls
        search={<Search onSearch={handleSearch} />}
        rightChildren={
          <>
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
            <Button label="매물 추가" onClick={() => {}} icon={<PlusIcon />} />
            <Button
              label="매물 삭제"
              onClick={() => {}}
              variant="secondary"
              icon={<TrashIcon />}
            />
          </>
        }
      />
      <div className="content_wrap">
        <PropertiesTable
          properties={filteredProperties}
          onPropertySelect={handlePropertySelect}
          isLoading={isLoading}
          isFetchingNextPage={isFetchingNextPage}
          observerRef={observerRef}
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
