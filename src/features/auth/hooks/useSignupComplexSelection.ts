import { useCallback, useEffect, useMemo, useState } from "react";
import {
  fetchApartmentComplexList,
  fetchEmdList,
  fetchSigunguList,
  fetchSidoList,
} from "@/shared/api/region";
import type { ApartmentComplex, Emd, Sigungu, Sido } from "@/shared/api/region";
import type { RegionOption } from "@/shared/types/complex";

interface ComplexSelectionState {
  sidoCode: string;
  sidoName: string;
  sigunguCode: string;
  sigunguName: string;
  emdCode: string;
  emdName: string;
  apartmentComplexId?: number;
  apartmentName: string;
}

const createInitialSelection = (): ComplexSelectionState => ({
  sidoCode: "",
  sidoName: "",
  sigunguCode: "",
  sigunguName: "",
  emdCode: "",
  emdName: "",
  apartmentComplexId: undefined,
  apartmentName: "",
});

const clearSigunguTrail = (
  state: ComplexSelectionState
): ComplexSelectionState => ({
  ...state,
  sigunguCode: "",
  sigunguName: "",
  emdCode: "",
  emdName: "",
  apartmentComplexId: undefined,
  apartmentName: "",
});

const clearEupmyeondongTrail = (
  state: ComplexSelectionState
): ComplexSelectionState => ({
  ...state,
  emdCode: "",
  emdName: "",
  apartmentComplexId: undefined,
  apartmentName: "",
});

const clearComplexSelection = (
  state: ComplexSelectionState
): ComplexSelectionState => ({
  ...state,
  apartmentComplexId: undefined,
  apartmentName: "",
});

const buildSelectedComplexLabel = (selection: ComplexSelectionState): string => {
  if (!selection.apartmentComplexId) {
    return "";
  }

  const hierarchy = [selection.sidoName, selection.sigunguName, selection.emdName]
    .filter(Boolean)
    .join(" ");

  return hierarchy
    ? `${selection.apartmentName} (${hierarchy})`
    : selection.apartmentName;
};

interface UseSignupComplexSelectionOptions {
  onSelect?: (payload: {
    apartmentComplexId?: number;
    apartmentName: string;
  }) => void;
}

export interface UseSignupComplexSelectionResult {
  selection: ComplexSelectionState;
  selectedComplexLabel: string;
  hasSelectedComplex: boolean;
  sidoOptions: RegionOption[];
  sigunguOptions: RegionOption[];
  eupmyeondongOptions: RegionOption[];
  complexOptions: RegionOption[];
  selectSido: (value?: string) => void;
  selectSigungu: (value?: string) => void;
  selectEupmyeondong: (value?: string) => void;
  selectComplex: (value?: string) => void;
  resetSelection: () => void;
}

export const useSignupComplexSelection = (
  options?: UseSignupComplexSelectionOptions
): UseSignupComplexSelectionResult => {
  const [selection, setSelection] = useState<ComplexSelectionState>(
    () => createInitialSelection()
  );
  const [sidoOptions, setSidoOptions] = useState<RegionOption[]>([]);
  const [sigunguOptions, setSigunguOptions] = useState<RegionOption[]>([]);
  const [eupmyeondongOptions, setEupmyeondongOptions] = useState<RegionOption[]>(
    []
  );
  const [complexOptions, setComplexOptions] = useState<RegionOption[]>([]);

  const notifySelectionChange = useCallback(
    (apartmentComplexId?: number, apartmentName = "") => {
      options?.onSelect?.({ apartmentComplexId, apartmentName });
    },
    [options]
  );

  const notifySelectionCleared = useCallback(() => {
    notifySelectionChange(undefined, "");
  }, [notifySelectionChange]);

  const resetSelection = useCallback(() => {
    setSelection(createInitialSelection());
    setSigunguOptions([]);
    setEupmyeondongOptions([]);
    setComplexOptions([]);
    notifySelectionCleared();
  }, [notifySelectionCleared]);

  useEffect(() => {
    let isMounted = true;

    const loadSidoOptions = async () => {
      try {
        const data = await fetchSidoList();
        if (!isMounted) return;

        const options = data.map(
          (sido: Sido): RegionOption => ({
            label: sido.name_kr,
            value: sido.sidoCode,
          })
        );
        setSidoOptions(options);
      } catch (error) {
        console.error("시/도 목록을 조회하는데 실패했습니다:", error);
      }
    };

    void loadSidoOptions();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (!selection.sidoCode) {
      setSigunguOptions([]);
      setEupmyeondongOptions([]);
      setComplexOptions([]);
      return;
    }

    let isMounted = true;

    const loadSigunguOptions = async () => {
      try {
        const data = await fetchSigunguList(selection.sidoCode);
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
  }, [selection.sidoCode]);

  useEffect(() => {
    if (!selection.sigunguCode) {
      setEupmyeondongOptions([]);
      setComplexOptions([]);
      return;
    }

    let isMounted = true;

    const loadEupmyeondongOptions = async () => {
      try {
        const data = await fetchEmdList(selection.sigunguCode);
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
  }, [selection.sigunguCode]);

  useEffect(() => {
    if (!selection.emdCode) {
      setComplexOptions([]);
      return;
    }

    let isMounted = true;

    const loadComplexOptions = async () => {
      try {
        const data = await fetchApartmentComplexList(selection.emdCode);
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
  }, [selection.emdCode]);

  const selectSido = useCallback(
    (value?: string) => {
      if (!value) {
        resetSelection();
        return;
      }

      const selected = sidoOptions.find((option) => option.value === value);
      setSelection(() => ({
        ...createInitialSelection(),
        sidoCode: value,
        sidoName: selected?.label ?? "",
      }));
      setSigunguOptions([]);
      setEupmyeondongOptions([]);
      setComplexOptions([]);
      notifySelectionCleared();
    },
    [notifySelectionCleared, resetSelection, sidoOptions]
  );

  const selectSigungu = useCallback(
    (value?: string) => {
      setSelection((prev) => {
        const cleared = clearSigunguTrail(prev);

        if (!value) {
          return cleared;
        }

        const selected = sigunguOptions.find((option) => option.value === value);
        return {
          ...cleared,
          sigunguCode: value,
          sigunguName: selected?.label ?? "",
        };
      });
      setEupmyeondongOptions([]);
      setComplexOptions([]);
      notifySelectionCleared();
    },
    [notifySelectionCleared, sigunguOptions]
  );

  const selectEupmyeondong = useCallback(
    (value?: string) => {
      setSelection((prev) => {
        const cleared = clearEupmyeondongTrail(prev);

        if (!value) {
          return cleared;
        }

        const selected = eupmyeondongOptions.find(
          (option) => option.value === value
        );
        return {
          ...cleared,
          emdCode: value,
          emdName: selected?.label ?? "",
        };
      });
      setComplexOptions([]);
      notifySelectionCleared();
    },
    [notifySelectionCleared, eupmyeondongOptions]
  );

  const selectComplex = useCallback(
    (value?: string) => {
      setSelection((prev) => {
        const cleared = clearComplexSelection(prev);

        if (!value) {
          return cleared;
        }

        const selected = complexOptions.find((option) => option.value === value);
        const apartmentComplexId = Number(value);

        if (Number.isNaN(apartmentComplexId)) {
          return cleared;
        }

        return {
          ...cleared,
          apartmentComplexId,
          apartmentName: selected?.label ?? "",
        };
      });

      if (!value) {
        notifySelectionCleared();
        return;
      }

      const selected = complexOptions.find((option) => option.value === value);
      const apartmentComplexId = Number(value);

      if (Number.isNaN(apartmentComplexId)) {
        notifySelectionCleared();
        return;
      }

      notifySelectionChange(apartmentComplexId, selected?.label ?? "");
    },
    [complexOptions, notifySelectionChange, notifySelectionCleared]
  );

  const selectedComplexLabel = useMemo(
    () => buildSelectedComplexLabel(selection),
    [selection]
  );
  const hasSelectedComplex = Boolean(selection.apartmentComplexId);

  return {
    selection,
    selectedComplexLabel,
    hasSelectedComplex,
    sidoOptions,
    sigunguOptions,
    eupmyeondongOptions,
    complexOptions,
    selectSido,
    selectSigungu,
    selectEupmyeondong,
    selectComplex,
    resetSelection,
  };
};
