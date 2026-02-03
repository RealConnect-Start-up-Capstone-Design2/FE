import { useEffect, useState } from "react";
import { DropdownMenu } from "@/shared/ui/dropdown-menu";
import { cn } from "@/shared/utils";
import type { ComplexData, RegionOption } from "@/shared/types/complex";
import {
  fetchSigunguList,
  fetchEmdList,
  fetchApartmentComplexList,
} from "@/shared/api/region";
import type { Sigungu, Emd, ApartmentComplex } from "@/shared/api/region";
import type { ExtendedMainComplexItem } from "./types";

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

export function ComplexItem({
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
            disabled={!item.isExisting}
            className={cn(
              "w-[94px] h-[38px] rounded-md text-[15px] font-medium",
              item.isExisting
                ? "bg-[#1B1B1B] text-white"
                : "border border-[#D9D9D9] bg-white text-[#8D8D8D]",
              !item.isExisting && "cursor-not-allowed opacity-60"
            )}
          >
            삭제
          </button>
        </div>
      </div>
    </div>
  );
}
