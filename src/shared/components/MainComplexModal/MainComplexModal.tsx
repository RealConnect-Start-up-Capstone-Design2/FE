import { useState, useEffect, useRef, useCallback } from "react";
import { DropdownMenu } from "@/components/ui/dropdown-menu";
import { cn } from "@/shared/utils";
import type {
  ComplexData,
  MainComplexItem,
  MainComplexModalProps,
  RegionOption,
} from "@/shared/types/complex";
import {
  fetchSidoList,
  fetchSigunguList,
  fetchEmdList,
  fetchApartmentComplexList,
  addApartmentComplex,
  deleteApartmentComplex,
  fetchPreferredComplexList,
} from "@/shared/api/region";
import type {
  Sido,
  Sigungu,
  Emd,
  ApartmentComplex,
  PreferredComplex,
} from "@/shared/api/region";

// MainComplexItem 확장 타입 (preferredComplexId와 apartmentComplexId 추가)
interface ExtendedMainComplexItem extends MainComplexItem {
  preferredComplexId?: number; // 서버에 저장된 주거래 단지 ID
  apartmentComplexId?: number; // 선택한 아파트 단지 ID
  apartmentName?: string; // 선택한 아파트 단지 이름
  isExisting?: boolean; // 이미 저장된 주거래 단지 여부 (지역 정보 없이 단지명만 있음)
}

export function MainComplexModal({
  isOpen,
  onClose,
  onSave,
  initialData,
}: MainComplexModalProps) {
  const [complexItems, setComplexItems] = useState<ExtendedMainComplexItem[]>(
    []
  );
  const [originalData, setOriginalData] = useState<ExtendedMainComplexItem[]>(
    []
  );
  const [isSaving, setIsSaving] = useState(false);
  const [savingItemMap, setSavingItemMap] = useState<Record<number, boolean>>(
    {}
  );
  const [sidoOptions, setSidoOptions] = useState<RegionOption[]>([]);
  const savingItemIdsRef = useRef<Set<number>>(new Set());
  const isFinalSavingRef = useRef(false);

  const setItemSavingState = useCallback((id: number, nextValue: boolean) => {
    setSavingItemMap((prev) => {
      const isAlreadySaving = Boolean(prev[id]);

      if (nextValue) {
        if (isAlreadySaving) {
          return prev;
        }
        return {
          ...prev,
          [id]: true,
        };
      }

      if (!isAlreadySaving) {
        return prev;
      }

      const { [id]: _removed, ...rest } = prev;
      return rest;
    });

    if (nextValue) {
      savingItemIdsRef.current.add(id);
    } else {
      savingItemIdsRef.current.delete(id);
    }
  }, []);

  // 초기 데이터 설정: 사용자의 주거래 단지 목록 조회
  useEffect(() => {
    if (!isOpen) return;

    savingItemIdsRef.current.clear();
    setSavingItemMap({});

    let isMounted = true;

    const loadInitialData = async () => {
      try {
        // 사용자의 주거래 단지 목록 조회
        const preferredComplexes = await fetchPreferredComplexList();

        if (!isMounted) return;

        // 최대 5개의 항목 생성
        const items: ExtendedMainComplexItem[] = Array.from(
          { length: 5 },
          (_, i) => {
            const preferredComplex = preferredComplexes[i];

            // preferredComplex가 있으면 해당 데이터 사용 (이미 등록된 주거래 단지)
            if (preferredComplex) {
              return {
                id: i + 1,
                sido: "",
                sigungu: "",
                eupmyeondong: "",
                complex: preferredComplex.apartmentName,
                isDirty: false,
                preferredComplexId: preferredComplex.id,
                apartmentComplexId: preferredComplex.apartmentComplexId,
                apartmentName: preferredComplex.apartmentName,
                isExisting: true, // 이미 저장된 단지 (지역 정보 없음)
              };
            }

            // preferredComplex가 없으면 빈 항목 (새로 추가 가능)
            return {
              id: i + 1,
              sido: "",
              sigungu: "",
              eupmyeondong: "",
              complex: "",
              isDirty: false,
              preferredComplexId: undefined,
              apartmentComplexId: undefined,
              apartmentName: undefined,
              isExisting: false,
            };
          }
        );

        setComplexItems(items);
        setOriginalData(JSON.parse(JSON.stringify(items)));
      } catch (error) {
        console.error("주거래 단지 목록 조회 실패:", error);

        // 에러 발생 시 빈 항목으로 초기화
        const items: ExtendedMainComplexItem[] = Array.from(
          { length: 5 },
          (_, i) => ({
            id: i + 1,
            sido: "",
            sigungu: "",
            eupmyeondong: "",
            complex: "",
            isDirty: false,
            preferredComplexId: undefined,
            apartmentComplexId: undefined,
            apartmentName: undefined,
            isExisting: false,
          })
        );
        setComplexItems(items);
        setOriginalData(JSON.parse(JSON.stringify(items)));
      }
    };

    void loadInitialData();

    return () => {
      isMounted = false;
    };
  }, [isOpen, initialData]);

  useEffect(() => {
    if (!isOpen) return;

    let isMounted = true;

    const loadSidoOptions = async () => {
      try {
        const data = await fetchSidoList();
        if (!isMounted) return;

        const options = data.map((sido: Sido): RegionOption => {
          return {
            label: sido.name_kr,
            value: sido.sidoCode,
          };
        });

        setSidoOptions(options);
      } catch (error) {
        console.error("시/도 목록을 조회하는데 실패했습니다:", error);
      }
    };

    void loadSidoOptions();

    return () => {
      isMounted = false;
    };
  }, [isOpen]);

  const handleFieldChange = (
    id: number,
    field: keyof ComplexData,
    value: string,
    apartmentComplexId?: number,
    apartmentName?: string
  ) => {
    setComplexItems((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;

        const updated: ExtendedMainComplexItem = {
          ...item,
          [field]: value,
          isDirty: true,
        };

        // 단지 선택 시 apartmentComplexId와 apartmentName 저장
        if (field === "complex" && apartmentComplexId && apartmentName) {
          updated.apartmentComplexId = apartmentComplexId;
          updated.apartmentName = apartmentName;
        }

        // 상위 필드가 변경되면 하위 필드 초기화
        if (field === "sido") {
          updated.sigungu = "";
          updated.eupmyeondong = "";
          updated.complex = "";
          updated.apartmentComplexId = undefined;
          updated.apartmentName = undefined;
        } else if (field === "sigungu") {
          updated.eupmyeondong = "";
          updated.complex = "";
          updated.apartmentComplexId = undefined;
          updated.apartmentName = undefined;
        } else if (field === "eupmyeondong") {
          updated.complex = "";
          updated.apartmentComplexId = undefined;
          updated.apartmentName = undefined;
        }

        return updated;
      })
    );
  };

  const handleSaveItem = async (id: number) => {
    if (savingItemIdsRef.current.has(id)) {
      return;
    }

    const item = complexItems.find((c) => c.id === id);
    if (!item) return;

    // 모든 필드가 채워져 있는지 확인
    if (
      !item.sido ||
      !item.sigungu ||
      !item.eupmyeondong ||
      !item.complex ||
      !item.apartmentComplexId
    ) {
      alert("모든 항목을 선택해주세요.");
      return;
    }

    // 개별 저장 로직 (실제 API 호출)
    setItemSavingState(id, true);
    try {
      const preferredComplex: PreferredComplex = {
        id: item.preferredComplexId || 0, // 새로 추가하는 경우 0 또는 생략
        apartmentComplexId: item.apartmentComplexId,
        apartmentName: item.apartmentName || item.complex,
      };

      const savedComplex = await addApartmentComplex(preferredComplex);

      // 저장 완료 후 isDirty 초기화 및 preferredComplexId 업데이트
      const updatedItem: ExtendedMainComplexItem = {
        ...item,
        isDirty: false,
        preferredComplexId: savedComplex.id,
        isExisting: true, // 저장 후에는 기존 단지로 취급
      };

      setComplexItems((prev) =>
        prev.map((c) => (c.id === id ? updatedItem : c))
      );

      // originalData도 업데이트
      setOriginalData((prev) =>
        prev.map((c) => (c.id === id ? updatedItem : c))
      );

      alert(`주거래 단지 ${id}이(가) 저장되었습니다.`);
    } catch (error) {
      console.error("Failed to save item:", error);
      alert("저장에 실패했습니다.");
    } finally {
      setItemSavingState(id, false);
    }
  };

  const handleDeleteItem = async (id: number) => {
    const item = complexItems.find((c) => c.id === id);
    if (!item) return;

    // 이미 저장된 주거래 단지인 경우
    if (item.preferredComplexId && item.apartmentComplexId) {
      const confirmDelete = window.confirm(
        `주거래 단지 ${id}을(를) 삭제하시겠습니까?`
      );
      if (!confirmDelete) return;

      try {
        await deleteApartmentComplex(item.apartmentComplexId);

        // 삭제 성공 시 필드 초기화
        const emptyItem: ExtendedMainComplexItem = {
          id: item.id,
          sido: "",
          sigungu: "",
          eupmyeondong: "",
          complex: "",
          isDirty: false,
          preferredComplexId: undefined,
          apartmentComplexId: undefined,
          apartmentName: undefined,
          isExisting: false,
        };

        setComplexItems((prev) =>
          prev.map((c) => (c.id === id ? emptyItem : c))
        );

        setOriginalData((prev) =>
          prev.map((c) => (c.id === id ? emptyItem : c))
        );

        alert(`주거래 단지 ${id}이(가) 삭제되었습니다.`);
      } catch (error) {
        console.error("Failed to delete item:", error);
        alert("삭제에 실패했습니다.");
      }
    } else {
      // 아직 저장되지 않은 경우 원래 데이터로 되돌리기
      const original = originalData.find((item) => item.id === id);
      if (original) {
        setComplexItems((prev) =>
          prev.map((item) => (item.id === id ? { ...original } : item))
        );
      }
    }
  };

  const handleFinalSave = async () => {
    if (isFinalSavingRef.current) {
      return;
    }

    isFinalSavingRef.current = true;
    setIsSaving(true);
    try {
      // 빈 항목이 아닌 것만 필터링
      const validComplexes = complexItems
        .filter(
          (item) =>
            item.sido && item.sigungu && item.eupmyeondong && item.complex
        )
        .map(({ sido, sigungu, eupmyeondong, complex }) => ({
          sido,
          sigungu,
          eupmyeondong,
          complex,
        }));

      await onSave(validComplexes);
      onClose();
    } catch (error) {
      console.error("Failed to save:", error);
      alert("저장에 실패했습니다.");
    } finally {
      setIsSaving(false);
      isFinalSavingRef.current = false;
    }
  };

  const handleCancel = () => {
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" onClick={handleCancel} />

      {/* Modal Content */}
      <div className="relative z-[101] w-[750px] h-[720px] bg-white rounded-lg shadow-[0px_4px_25px_1px_rgba(0,0,0,0.25)] flex flex-col">
        {/* Header */}
        <div className="px-[50px] pt-[50px] pb-6">
          <h2 className="text-2xl font-semibold text-black">단지 추가</h2>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 px-[50px] overflow-y-auto">
          <div className="flex flex-col gap-[30px] pb-[30px]">
            {complexItems.map((item) => (
              <ComplexItem
                key={item.id}
                item={item}
                onFieldChange={handleFieldChange}
                onSave={handleSaveItem}
                onDelete={handleDeleteItem}
                sidoOptions={sidoOptions}
                isSaving={Boolean(savingItemMap[item.id])}
              />
            ))}
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="px-[50px] py-8 flex justify-end gap-3">
          <button
            onClick={handleCancel}
            className="w-[97px] h-[41px] bg-black text-white rounded-lg text-lg font-semibold"
          >
            취소
          </button>
          <button
            onClick={handleFinalSave}
            disabled={isSaving}
            className="w-[97px] h-[41px] bg-[#1C2882] text-white rounded-lg text-lg font-semibold disabled:opacity-50"
          >
            {isSaving ? "저장중..." : "저장하기"}
          </button>
        </div>
      </div>
    </div>
  );
}

interface ComplexItemProps {
  item: ExtendedMainComplexItem;
  onFieldChange: (
    id: number,
    field: keyof ComplexData,
    value: string,
    apartmentComplexId?: number,
    apartmentName?: string
  ) => void;
  onSave: (id: number) => void;
  onDelete: (id: number) => void;
  sidoOptions: RegionOption[];
  isSaving: boolean;
}

function ComplexItem({
  item,
  onFieldChange,
  onSave,
  onDelete,
  sidoOptions,
  isSaving,
}: ComplexItemProps) {
  const [sigunguOptions, setSigunguOptions] = useState<RegionOption[]>([]);
  const [eupmyeondongOptions, setEupmyeondongOptions] = useState<
    RegionOption[]
  >([]);
  const [complexOptions, setComplexOptions] = useState<RegionOption[]>([]);

  // 시/군/구 옵션 로드
  useEffect(() => {
    if (!item.sido) {
      setSigunguOptions([]);
      return;
    }

    let isMounted = true;

    const loadSigunguOptions = async () => {
      try {
        const data = await fetchSigunguList(item.sido);
        if (!isMounted) return;

        const options = data.map(
          (sigungu: Sigungu): RegionOption => ({
            label: sigungu.name_kr,
            value: sigungu.sigunguCode,
          })
        );
        setSigunguOptions(options);
      } catch (error) {
        console.error("시/군/구 목록을 조회하는데 실패했습니다:", error);
      }
    };

    void loadSigunguOptions();

    return () => {
      isMounted = false;
    };
  }, [item.sido]);

  // 읍/면/동 옵션 로드
  useEffect(() => {
    if (!item.sigungu) {
      setEupmyeondongOptions([]);
      return;
    }

    let isMounted = true;

    const loadEupmyeondongOptions = async () => {
      try {
        const data = await fetchEmdList(item.sigungu);
        if (!isMounted) return;

        const options = data.map(
          (emd: Emd): RegionOption => ({
            label: emd.name_kr,
            value: emd.emdCode,
          })
        );
        setEupmyeondongOptions(options);
      } catch (error) {
        console.error("읍/면/동 목록을 조회하는데 실패했습니다:", error);
      }
    };

    void loadEupmyeondongOptions();

    return () => {
      isMounted = false;
    };
  }, [item.sigungu]);

  // 아파트 단지 옵션 로드
  useEffect(() => {
    if (!item.eupmyeondong) {
      setComplexOptions([]);
      return;
    }

    let isMounted = true;

    const loadComplexOptions = async () => {
      try {
        const data = await fetchApartmentComplexList(item.eupmyeondong);
        if (!isMounted) return;

        const options = data.map(
          (complex: ApartmentComplex): RegionOption => ({
            label: complex.apartmentName,
            value: String(complex.id),
          })
        );
        setComplexOptions(options);
      } catch (error) {
        console.error("아파트 단지 목록을 조회하는데 실패했습니다:", error);
      }
    };

    void loadComplexOptions();

    return () => {
      isMounted = false;
    };
  }, [item.eupmyeondong]);

  const isFilled =
    item.sido && item.sigungu && item.eupmyeondong && item.complex;
  const isSaveButtonEnabled =
    isFilled && item.isDirty && !item.isExisting && !isSaving;

  return (
    <div className="w-full h-[122px]">
      {/* Title */}
      <div className="mb-3">
        <h3
          className={cn(
            "text-xl font-medium",
            isFilled ? "text-[#1C2882]" : "text-[#1C2882]"
          )}
        >
          주거래 단지 {item.id}
        </h3>
      </div>

      {/* Dropdowns and Buttons Container */}
      <div className="flex gap-3">
        {/* Left: Dropdowns Column */}
        <div className="flex flex-col gap-[10px]">
          {/* 이미 등록된 단지인 경우 단지명만 표시 */}
          {item.isExisting ? (
            <div className="flex items-center w-[519px] h-[86px]">
              <div className="w-full h-[38px] rounded-md border border-[#B1B6C7] bg-[#F5F5F5] px-3 flex items-center">
                <span className="text-[15px] font-medium text-[#1B1B1B]">
                  {item.complex || item.apartmentName}
                </span>
              </div>
            </div>
          ) : (
            <>
              {/* Dropdowns Row 1 */}
              <div className="flex gap-3">
                <DropdownMenu
                  placeholder="시/도"
                  options={sidoOptions}
                  value={item.sido}
                  onChange={(value) => onFieldChange(item.id, "sido", value)}
                  buttonClassName="w-[165px] h-[38px] rounded-md border border-[#B1B6C7] bg-white px-3 text-[15px] font-medium"
                  className="w-[165px]"
                  selectedTextColor="text-[#1B1B1B]"
                  placeholderTextColor="text-[#989898]"
                />
                <DropdownMenu
                  placeholder="시/군/구"
                  options={sigunguOptions}
                  value={item.sigungu}
                  onChange={(value) => onFieldChange(item.id, "sigungu", value)}
                  disabled={!item.sido}
                  buttonClassName="w-[165px] h-[38px] rounded-md border border-[#B1B6C7] bg-white px-3 text-[15px] font-medium"
                  className="w-[165px]"
                  selectedTextColor="text-[#1B1B1B]"
                  placeholderTextColor="text-[#989898]"
                />
                <DropdownMenu
                  placeholder="읍/면/동"
                  options={eupmyeondongOptions}
                  value={item.eupmyeondong}
                  onChange={(value) =>
                    onFieldChange(item.id, "eupmyeondong", value)
                  }
                  disabled={!item.sigungu}
                  buttonClassName="w-[165px] h-[38px] rounded-md border border-[#B1B6C7] bg-white px-3 text-[15px] font-medium"
                  className="w-[165px]"
                  selectedTextColor="text-[#1B1B1B]"
                  placeholderTextColor="text-[#989898]"
                />
              </div>

              {/* Dropdowns Row 2 */}
              <div>
                <DropdownMenu
                  placeholder="단지"
                  options={complexOptions}
                  value={
                    item.apartmentComplexId
                      ? String(item.apartmentComplexId)
                      : undefined
                  }
                  onChange={(value) => {
                    // value는 apartmentComplexId (string)
                    const selectedComplex = complexOptions.find(
                      (opt) => opt.value === value
                    );
                    onFieldChange(
                      item.id,
                      "complex",
                      selectedComplex?.label || value,
                      Number(value),
                      selectedComplex?.label
                    );
                  }}
                  disabled={!item.eupmyeondong}
                  buttonClassName="w-[519px] h-[38px] rounded-md border border-[#B1B6C7] bg-white px-3 text-[15px] font-medium"
                  className="w-[519px]"
                  selectedTextColor="text-[#1B1B1B]"
                  placeholderTextColor="text-[#989898]"
                />
              </div>
            </>
          )}
        </div>

        {/* Right: Buttons Column - 세로 배치 */}
        <div className="flex flex-col gap-[10px] pl-[10px]">
          {/* 이미 등록된 단지는 저장 버튼 비활성화 */}
          <button
            onClick={() => onSave(item.id)}
            disabled={!isSaveButtonEnabled}
            className={cn(
              "w-[94px] h-[38px] rounded-md text-[15px] font-medium",
              isSaveButtonEnabled
                ? "bg-[#1B1B1B] text-white"
                : "bg-[#EDEDED] text-[#8D8D8D]"
            )}
          >
            {isSaving ? "저장중..." : "저장"}
          </button>
          <button
            onClick={() => onDelete(item.id)}
            className={cn(
              "w-[94px] h-[38px] rounded-md text-[15px] font-medium",
              item.isExisting
                ? "bg-[#1B1B1B] text-white"
                : "border border-[#D9D9D9] bg-white text-[#8D8D8D]"
            )}
          >
            삭제
          </button>
        </div>
      </div>
    </div>
  );
}
