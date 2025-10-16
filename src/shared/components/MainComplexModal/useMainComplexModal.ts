import { useState, useEffect, useRef, useCallback } from "react";
import type { ComplexData, RegionOption } from "@/shared/types/complex";
import {
  fetchSidoList,
  addApartmentComplex,
  deleteApartmentComplex,
  fetchPreferredComplexList,
} from "@/shared/api/region";
import type { Sido, PreferredComplex } from "@/shared/api/region";
import type { ExtendedMainComplexItem } from "./types";

interface UseMainComplexModalParams {
  isOpen: boolean;
  onClose: () => void;
  onSave: (complexes: ComplexData[]) => Promise<void>;
  initialData?: ComplexData[];
}

const MAX_COMPLEX_ITEMS = 5;

const createEmptyItem = (id: number): ExtendedMainComplexItem => ({
  id,
  sido: "",
  sigungu: "",
  eupmyeondong: "",
  complex: "",
  isDirty: false,
  preferredComplexId: undefined,
  apartmentComplexId: undefined,
  apartmentName: undefined,
  isExisting: false,
});

const createItemFromPreferredComplex = (
  index: number,
  preferredComplex?: PreferredComplex
): ExtendedMainComplexItem => {
  const base = createEmptyItem(index + 1);

  if (!preferredComplex) {
    return base;
  }

  return {
    ...base,
    complex: preferredComplex.apartmentName,
    preferredComplexId: preferredComplex.id,
    apartmentComplexId: preferredComplex.apartmentComplexId,
    apartmentName: preferredComplex.apartmentName,
    isExisting: true,
  };
};

const isItemComplete = (item: ExtendedMainComplexItem) =>
  Boolean(
    item.sido &&
      item.sigungu &&
      item.eupmyeondong &&
      item.complex &&
      item.apartmentComplexId
  );

export function useMainComplexModal({
  isOpen,
  onClose,
  onSave,
  initialData: _initialData,
}: UseMainComplexModalParams) {
  const [complexItems, setComplexItems] = useState<ExtendedMainComplexItem[]>(
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

  useEffect(() => {
    if (!isOpen) return;

    savingItemIdsRef.current.clear();
    setSavingItemMap({});

    let isMounted = true;

    const loadInitialData = async () => {
      try {
        const preferredComplexes = await fetchPreferredComplexList();

        if (!isMounted) return;

        const items = Array.from({ length: MAX_COMPLEX_ITEMS }, (_, index) =>
          createItemFromPreferredComplex(index, preferredComplexes[index])
        );

        setComplexItems(items);
      } catch (error) {
        console.error("주거래 단지 목록 조회 실패:", error);

        const items = Array.from({ length: MAX_COMPLEX_ITEMS }, (_, index) =>
          createEmptyItem(index + 1)
        );
        setComplexItems(items);
      }
    };

    void loadInitialData();

    return () => {
      isMounted = false;
    };
  }, [isOpen, _initialData]);

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

  const handleFieldChange = useCallback(
    (
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

          if (field === "complex" && apartmentComplexId && apartmentName) {
            updated.apartmentComplexId = apartmentComplexId;
            updated.apartmentName = apartmentName;
          }

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
    },
    []
  );

  const handleSaveItem = useCallback(
    async (id: number) => {
      if (savingItemIdsRef.current.has(id)) {
        return;
      }

      const item = complexItems.find((c) => c.id === id);
      if (!item) return;

      if (!isItemComplete(item)) {
        alert("모든 항목을 선택해주세요.");
        return;
      }

      setItemSavingState(id, true);
      try {
        const preferredComplex: PreferredComplex = {
          id: item.preferredComplexId || 0,
          apartmentComplexId: item.apartmentComplexId!,
          apartmentName: item.apartmentName || item.complex,
        };

        const savedComplex = await addApartmentComplex(preferredComplex);

        const updatedItem: ExtendedMainComplexItem = {
          ...item,
          isDirty: false,
          preferredComplexId: savedComplex.id,
          isExisting: true,
        };

        setComplexItems((prev) =>
          prev.map((c) => (c.id === id ? updatedItem : c))
        );

        alert(`주거래 단지 ${id}이(가) 저장되었습니다.`);
      } catch (error) {
        console.error("Failed to save item:", error);
        alert("저장에 실패했습니다.");
      } finally {
        setItemSavingState(id, false);
      }
    },
    [complexItems, setItemSavingState]
  );

  const handleDeleteItem = useCallback(
    async (id: number) => {
      const item = complexItems.find((c) => c.id === id);
      if (!item) return;

      if (!item.preferredComplexId || !item.apartmentComplexId) {
        return;
      }

      const confirmDelete = window.confirm(
        `주거래 단지 ${id}을(를) 삭제하시겠습니까?`
      );
      if (!confirmDelete) return;

      try {
        await deleteApartmentComplex(item.apartmentComplexId);

        const emptyItem = createEmptyItem(item.id);

        setComplexItems((prev) =>
          prev.map((c) => (c.id === id ? emptyItem : c))
        );

        alert(`주거래 단지 ${id}이(가) 삭제되었습니다.`);
      } catch (error) {
        console.error("Failed to delete item:", error);
        alert("삭제에 실패했습니다.");
      }
    },
    [complexItems]
  );

  const handleFinalSave = useCallback(async () => {
    if (isFinalSavingRef.current) {
      return;
    }

    if (savingItemIdsRef.current.size > 0) {
      alert("항목 저장이 진행중입니다. 잠시 후 다시 시도해주세요.");
      return;
    }

    const incompleteItem = complexItems.find(
      (item) => item.isDirty && !isItemComplete(item)
    );

    if (incompleteItem) {
      alert("모든 항목을 선택해주세요.");
      return;
    }

    isFinalSavingRef.current = true;
    setIsSaving(true);
    try {
      const itemsToPersist = complexItems.filter(
        (item) => item.isDirty && isItemComplete(item)
      );
      const savedItemMap: Record<number, ExtendedMainComplexItem> = {};
      let hasError = false;

      for (const item of itemsToPersist) {
        setItemSavingState(item.id, true);
        try {
          const preferredComplex: PreferredComplex = {
            id: item.preferredComplexId || 0,
            apartmentComplexId: item.apartmentComplexId!,
            apartmentName: item.apartmentName || item.complex,
          };

          const savedComplex = await addApartmentComplex(preferredComplex);

          savedItemMap[item.id] = {
            ...item,
            isDirty: false,
            preferredComplexId: savedComplex.id,
            isExisting: true,
          };
        } catch (error) {
          console.error("Failed to save item:", error);
          alert("저장에 실패했습니다.");
          hasError = true;
          break;
        } finally {
          setItemSavingState(item.id, false);
        }
      }

      const nextComplexItems =
        Object.keys(savedItemMap).length > 0
          ? complexItems.map((item) => savedItemMap[item.id] ?? item)
          : complexItems;

      if (Object.keys(savedItemMap).length > 0) {
        setComplexItems(nextComplexItems);
      }

      if (hasError) {
        return;
      }

      const validComplexes = nextComplexItems
        .filter(isItemComplete)
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
  }, [complexItems, onClose, onSave, setItemSavingState]);

  return {
    complexItems,
    sidoOptions,
    savingItemMap,
    isSaving,
    handleFieldChange,
    handleSaveItem,
    handleDeleteItem,
    handleFinalSave,
  };
}
