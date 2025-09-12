import React, { useState, useRef, useMemo, useEffect } from "react";
import {
  useInfiniteQuery,
  useQueryClient,
  useMutation,
} from "@tanstack/react-query";
import {
  getProperties,
  updateProperty,
  searchProperties,
} from "../../services/propertyService";

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

// API 응답을 UI용 데이터로 변환
import { toPropertyTableRow } from "../../../../../packages/shared-model/PropertyTableRow";
import { toPropertyDetailModel } from "../../../../../packages/shared-model/PropertyDetailModel";
import { toPropertyTableViewModel } from "../../../../../packages/web-viewmodel/propertyViewModel";

const Properties = () => {
  const [activeView, setActiveView] = useState("전체");
  const [transactionType, setTransactionType] = useState("ALL");
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [isClosingSidebar, setIsClosingSidebar] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState("");
  const closingSidebarRef = useRef(false);
  const queryClient = useQueryClient();
  const [sortStandard, setSortStandard] = useState("DONG_HO");
  const observerRef = useRef();
  const [selectedPropertyIds, setSelectedPropertyIds] = useState([]);
  const clearSelectionRef = useRef(null);

  // 페이지 마운트 시 무한스크롤 캐시 리셋
  useEffect(() => {
    queryClient.resetQueries(["properties"]);
  }, [queryClient]); // queryClient를 의존성에 추가

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
    queryKey: [
      "properties",
      activeView,
      transactionType,
      sortStandard,
      searchKeyword,
    ],
    queryFn: ({ pageParam = 0 }) => {
      // 검색어가 있으면 검색 API 사용, 없으면 일반 API 사용
      if (searchKeyword) {
        return searchProperties({
          q: searchKeyword,
          page: pageParam,
          size: 20,
        });
      } else {
        return getProperties({
          page: pageParam,
          size: 20, // 한 번에 가져올 아이템 수
          sort: sortStandard,
          // 필터링 파라미터 추가
          view: activeView,
          transactionType:
            transactionType !== "ALL" ? transactionType : undefined,
        });
      }
    },
    getNextPageParam: (lastPage, allPages) => {
      // 마지막 페이지가 아니면 다음 페이지 번호 반환
      return lastPage.last ? undefined : allPages.length;
    },
    initialPageParam: 0,
  });

  // 모든 페이지의 데이터를 UI용으로 변환 (Entity → Model → ViewModel)
  const allProperties = useMemo(() => {
    if (!propertiesData?.pages) return [];
    return propertiesData.pages.flatMap(
      (page) =>
        (page.content || [])
          .map(toPropertyTableRow) // Entity → Model
          .map(toPropertyTableViewModel) // Model → ViewModel
    );
  }, [propertiesData]);
  console.log("allProperties", allProperties);

  // 원본 Entity 데이터도 저장 (상세보기용)
  const allPropertyEntities = useMemo(() => {
    if (!propertiesData?.pages) return [];
    return propertiesData.pages.flatMap((page) => page.content || []);
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
          fetchNextPage();
        }
      },
      {
        threshold: 0.1,
        rootMargin: "20px", // 스크롤 끝에서 20px 전에 로드 시작 (100px에서 축소)
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

  const clearPropertiesMutation = useMutation({
    mutationFn: async (propertyIds) => {
      // 빈 값으로 설정할 데이터 (서버 API 형식에 맞춤)
      const emptyPropertyData = {
        status: "WAITING", // 기본 상태로 설정
        ownerName: "",
        ownerPhone: "",
        tenantName: "",
        tenantPhone: "",
        salePrice: 0, // null 대신 0 사용
        jeonsePrice: 0, // null 대신 0 사용
        deposit: 0, // null 대신 0 사용
        monthPrice: 0, // null 대신 0 사용
        memo: "",
        startDate: null,
        endDate: null,
      };

      // 각 매물에 대해 기존 updateProperty 함수 사용
      const updatePromises = propertyIds.map((propertyId) =>
        updateProperty(propertyId, emptyPropertyData)
      );

      return Promise.all(updatePromises);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["properties"]);
      // 선택 상태 초기화
      if (clearSelectionRef.current) {
        clearSelectionRef.current();
      }
      alert("선택된 매물들의 정보가 초기화되었습니다.");
    },
    onError: (error) => {
      console.error("매물 정보 초기화 중 오류 발생:", error);
      alert(
        `매물 정보 초기화에 실패했습니다.\n오류: ${error.message || "알 수 없는 오류"}`
      );
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
    setSearchKeyword(searchTerm);
  };

  const handlePropertySelect = (property) => {
    if (closingSidebarRef.current) return;

    // 매물을 식별할 수 있는 고유한 키 생성 (동/호수 포함)
    const createPropertyKey = (prop) => {
      return `${prop.apartmentId}-${prop.dong}-${prop.ho}`; // apartmentId + 동/호수로 고유 키 생성
    };

    const currentPropertyKey = selectedProperty
      ? createPropertyKey(selectedProperty)
      : null;
    const newPropertyKey = createPropertyKey(property);
    if (selectedProperty && currentPropertyKey === newPropertyKey) {
      closeSidebar();
    } else {
      setIsClosingSidebar(false);
      // 원본 Entity에서 해당 property 찾기
      const originalEntity = allPropertyEntities.find(
        (entity) =>
          entity.apartmentId === property.apartmentId &&
          entity.dong === property.dong.replace("동", "") &&
          entity.ho === property.ho.replace("호", "")
      );

      if (originalEntity) {
        // Entity를 상세보기 모델로 변환하고 rawData 추가
        const detailProperty = toPropertyDetailModel(originalEntity);
        // property 객체의 id를 추가
        if (property.property?.id) {
          detailProperty.id = property.property.id;
        }
        setSelectedProperty(detailProperty);
      } else {
        // 원본 Entity를 찾을 수 없는 경우 테이블 데이터 사용
        setSelectedProperty(property);
      }

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

  // 선택된 매물 변경 핸들러 - useCallback으로 메모이제이션
  const handleSelectionChange = React.useCallback((selectedIds, clearFn) => {
    setSelectedPropertyIds(selectedIds);
    clearSelectionRef.current = clearFn;
  }, []);

  // 매물 삭제(빈값 초기화) 핸들러
  const handleDeleteProperties = () => {
    if (selectedPropertyIds.length === 0) {
      alert("삭제할 매물을 선택해주세요.");
      return;
    }

    // 실제 property.id가 있는 매물만 필터링 (임시 ID 제외)
    const validPropertyIds = selectedPropertyIds.filter(
      (id) =>
        typeof id === "number" ||
        (typeof id === "string" && !id.startsWith("temp-"))
    );

    if (validPropertyIds.length === 0) {
      alert("선택된 매물 중 삭제 가능한 매물이 없습니다.");
      return;
    }

    const confirmMessage = `선택된 ${validPropertyIds.length}개 매물의 모든 정보를 빈값으로 초기화하시겠습니까?\n\n이 작업은 되돌릴 수 없습니다.`;

    if (window.confirm(confirmMessage)) {
      clearPropertiesMutation.mutate(validPropertyIds);
    }
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
              onClick={handleDeleteProperties}
              variant="secondary"
              icon={<TrashIcon />}
              disabled={
                selectedPropertyIds.length === 0 ||
                clearPropertiesMutation.isPending
              }
            />
          </>
        }
      />
      <div className="content_wrap">
        <PropertiesTable
          properties={filteredProperties}
          onPropertySelect={handlePropertySelect}
          onSelectionChange={handleSelectionChange}
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
            onUpdateProperty={updatePropertyMutation.mutate}
            isClosing={isClosingSidebar}
          />
        ) : (
          <PropertyDetailSidebar
            property={selectedProperty}
            onClose={closeSidebar}
            onEdit={(updatedData) => {
              console.log(
                "PropertyDetailSidebar onEdit called with:",
                updatedData
              );
              console.log("Current selectedProperty:", selectedProperty);
              if (updatedData) {
                // 수정된 데이터가 있으면 캐시 새로고침
                console.log("Property updated:", updatedData);
                // 선택된 매물 정보도 업데이트
                setSelectedProperty(updatedData);
                // React Query 캐시 무효화하여 최신 데이터 가져오기
                queryClient.invalidateQueries(["properties"]);
              } else {
                // 데이터가 없으면 편집 모드 진입
                console.log("Entering edit mode");
                setIsEditMode(true);
              }
            }}
            isClosing={isClosingSidebar}
          />
        ))}
    </div>
  );
};

export default Properties;
