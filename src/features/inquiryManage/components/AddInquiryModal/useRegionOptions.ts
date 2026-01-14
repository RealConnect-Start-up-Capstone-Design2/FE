import { useState, useEffect } from "react";
import {
  fetchSidoList,
  fetchSigunguList,
  fetchEmdList,
} from "@/shared/api/region";
import type { Sido, Sigungu } from "@/shared/api/region";
import type { RegionOption } from "./types";

interface UseRegionOptionsParams {
  isOpen: boolean;
  selectedSido: string;
  selectedSigungu: string;
}

interface UseRegionOptionsReturn {
  sidoOptions: RegionOption[];
  sigunguOptions: RegionOption[];
  emdOptions: RegionOption[];
  isLoadingSido: boolean;
  isLoadingSigungu: boolean;
  isLoadingEmd: boolean;
}

/**
 * 지역 선택 옵션을 관리하는 커스텀 훅
 * 시/도 → 시/군/구 → 읍/면/동 계층 구조로 데이터 로드
 */
export function useRegionOptions({
  isOpen,
  selectedSido,
  selectedSigungu,
}: UseRegionOptionsParams): UseRegionOptionsReturn {
  // 옵션 상태
  const [sidoOptions, setSidoOptions] = useState<RegionOption[]>([]);
  const [sigunguOptions, setSigunguOptions] = useState<RegionOption[]>([]);
  const [emdOptions, setEmdOptions] = useState<RegionOption[]>([]);

  // 원본 데이터 (코드 매핑용)
  const [sidoData, setSidoData] = useState<Sido[]>([]);
  const [sigunguData, setSigunguData] = useState<Sigungu[]>([]);

  // 로딩 상태
  const [isLoadingSido, setIsLoadingSido] = useState(false);
  const [isLoadingSigungu, setIsLoadingSigungu] = useState(false);
  const [isLoadingEmd, setIsLoadingEmd] = useState(false);

  // 시/도 목록 로드
  useEffect(() => {
    if (!isOpen) return;

    let isMounted = true;

    const loadSido = async () => {
      setIsLoadingSido(true);
      try {
        const data = await fetchSidoList();
        if (!isMounted) return;

        setSidoData(data);
        setSidoOptions(
          data.map((sido) => ({ label: sido.name_kr, value: sido.name_kr }))
        );
      } catch (error) {
        console.error("시/도 목록 조회 실패:", error);
      } finally {
        if (isMounted) setIsLoadingSido(false);
      }
    };

    void loadSido();
    return () => {
      isMounted = false;
    };
  }, [isOpen]);

  // 시/군/구 목록 로드
  useEffect(() => {
    if (!selectedSido) {
      setSigunguOptions([]);
      setSigunguData([]);
      return;
    }

    const sido = sidoData.find((s) => s.name_kr === selectedSido);
    if (!sido) return;

    let isMounted = true;

    const loadSigungu = async () => {
      setIsLoadingSigungu(true);
      try {
        const data = await fetchSigunguList(sido.sidoCode);
        if (!isMounted) return;

        setSigunguData(data);
        setSigunguOptions(
          data.map((sigungu) => ({
            label: sigungu.name_kr,
            value: sigungu.name_kr,
          }))
        );
      } catch (error) {
        console.error("시/군/구 목록 조회 실패:", error);
      } finally {
        if (isMounted) setIsLoadingSigungu(false);
      }
    };

    void loadSigungu();
    return () => {
      isMounted = false;
    };
  }, [selectedSido, sidoData]);

  // 읍/면/동 목록 로드
  useEffect(() => {
    if (!selectedSigungu) {
      setEmdOptions([]);
      return;
    }

    const sigungu = sigunguData.find((s) => s.name_kr === selectedSigungu);
    if (!sigungu) return;

    let isMounted = true;

    const loadEmd = async () => {
      setIsLoadingEmd(true);
      try {
        const data = await fetchEmdList(sigungu.sigunguCode);
        if (!isMounted) return;

        setEmdOptions(
          data.map((emd) => ({ label: emd.name_kr, value: emd.name_kr }))
        );
      } catch (error) {
        console.error("읍/면/동 목록 조회 실패:", error);
      } finally {
        if (isMounted) setIsLoadingEmd(false);
      }
    };

    void loadEmd();
    return () => {
      isMounted = false;
    };
  }, [selectedSigungu, sigunguData]);

  return {
    sidoOptions,
    sigunguOptions,
    emdOptions,
    isLoadingSido,
    isLoadingSigungu,
    isLoadingEmd,
  };
}
