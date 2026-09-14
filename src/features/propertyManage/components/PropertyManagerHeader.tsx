import { useCallback } from "react";
import { PageHeader } from "@/shared/components/PageHeader";
import { Button } from "@/shared/ui/button";
import { DropdownMenu } from "@/shared/ui/dropdown-menu";
import type { DropdownOption } from "@/shared/ui/dropdown-menu";
import { Search } from "lucide-react";
import {
  InputGroup,
  InputGroupInput,
  InputGroupAddon,
} from "@/shared/ui/input-group";

// 이미지 불러오기
import RefreshIcon from "@/assets/Refresh.svg";

interface PropertyManagerHeaderProps {
  complexOptions: DropdownOption[];
  selectedComplexId?: number;
  onSelectComplex: (apartmentComplexId: number) => void;
  isComplexLoading?: boolean;
  selectedRequestType?: string;
  onSelectRequestType?: (requestType: string | undefined) => void;
  selectedManageType?: string;
  onSelectManageType?: (manageType: string | undefined) => void;
  areaOptions?: DropdownOption[];
  selectedArea?: string;
  onSelectArea?: (area: string | undefined) => void;
  phoneNumber?: string;
  onPhoneNumberChange?: (phoneNumber: string) => void;
  dong?: string;
  onDongChange?: (dong: string) => void;
  ho?: string;
  onHoChange?: (ho: string) => void;
  isSqmOrPyeong?: "sqm" | "pyeong";
  onSqmOrPyeongChange?: () => void;
  onAddComplexClick?: () => void;
}

export function PropertyManagerHeader({
  complexOptions,
  selectedComplexId,
  onSelectComplex,
  isComplexLoading = false,
  phoneNumber,
  onPhoneNumberChange,
  dong,
  onDongChange,
  ho,
  onHoChange,
  isSqmOrPyeong,
  onSqmOrPyeongChange,
  onAddComplexClick,
}: PropertyManagerHeaderProps) {
  const handlePhoneNumberChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      // 숫자만 입력 가능하도록 필터링
      const numericValue = value.replace(/[^0-9]/g, "");
      onPhoneNumberChange?.(numericValue);
    },
    [onPhoneNumberChange],
  );

  const handleDongChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      onDongChange?.(value);
    },
    [onDongChange],
  );

  const handleHoChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      onHoChange?.(value);
    },
    [onHoChange],
  );

  const handleSelectComplex = useCallback(
    (value: string) => {
      const parsedValue = Number(value);
      if (!Number.isNaN(parsedValue)) {
        onSelectComplex(parsedValue);
      }
    },
    [onSelectComplex],
  );

  return (
    <PageHeader className="pb-0" title="매물장">
      <div className="mt-5 grid w-full grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-[minmax(220px,268px)_128px_128px_minmax(240px,1fr)_auto]">
        <DropdownMenu
          className="w-full font-semibold"
          placeholder={
            isComplexLoading
              ? "단지 불러오는 중..."
              : complexOptions.length > 0
                ? "단지 선택"
                : "등록된 단지가 없습니다"
          }
          options={complexOptions}
          value={
            selectedComplexId !== undefined
              ? String(selectedComplexId)
              : undefined
          }
          onChange={handleSelectComplex}
          disabled={isComplexLoading}
          footerAction={
            onAddComplexClick
              ? {
                  label: "+ 주거래단지 추가",
                  onClick: onAddComplexClick,
                }
              : undefined
          }
        />
        <InputGroup className="h-12 w-full">
          <InputGroupAddon>
            <InputGroupInput
              aria-label="동 검색"
              placeholder="동 검색"
              value={dong ?? ""}
              onChange={handleDongChange}
              className="text-black"
            />
            <Search aria-hidden="true" />
          </InputGroupAddon>
        </InputGroup>
        <InputGroup className="w-full">
          <InputGroupAddon>
            <InputGroupInput
              aria-label="호 검색"
              placeholder="호 검색"
              value={ho ?? ""}
              onChange={handleHoChange}
              className="text-black"
            />
            <Search aria-hidden="true" />
          </InputGroupAddon>
        </InputGroup>
        <InputGroup className="w-full">
          <InputGroupInput
            aria-label="전화번호 검색"
            placeholder="전화번호 검색"
            value={phoneNumber ?? ""}
            onChange={handlePhoneNumberChange}
            type="text"
            inputMode="numeric"
            className="text-black"
          />
          <InputGroupAddon>
            <Search aria-hidden="true" />
          </InputGroupAddon>
        </InputGroup>
        <Button
          className="w-full bg-white sm:w-auto"
          onClick={onSqmOrPyeongChange}
        >
          <span className="font-semibold text-black shadow-drop">
            {isSqmOrPyeong === "sqm" ? "평으로 보기" : "㎡로 보기"}
          </span>
          <img src={RefreshIcon} alt="" aria-hidden="true" />
        </Button>
      </div>
    </PageHeader>
  );
}
