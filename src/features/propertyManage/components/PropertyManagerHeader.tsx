import { useCallback, useState, useEffect } from "react";
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
}: PropertyManagerHeaderProps) {
  const [localPhoneNumber, setLocalPhoneNumber] = useState(phoneNumber || "");
  const [localDong, setLocalDong] = useState(dong || "");
  const [localHo, setLocalHo] = useState(ho || "");

  // phoneNumber prop이 변경되면 localPhoneNumber 동기화
  useEffect(() => {
    setLocalPhoneNumber(phoneNumber || "");
  }, [phoneNumber]);

  // dong prop이 변경되면 localDong 동기화
  useEffect(() => {
    setLocalDong(dong || "");
  }, [dong]);

  // ho prop이 변경되면 localHo 동기화
  useEffect(() => {
    setLocalHo(ho || "");
  }, [ho]);

  const handlePhoneNumberChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      // 숫자만 입력 가능하도록 필터링
      const numericValue = value.replace(/[^0-9]/g, "");
      setLocalPhoneNumber(numericValue);
      if (onPhoneNumberChange) {
        onPhoneNumberChange(numericValue);
      }
    },
    [onPhoneNumberChange]
  );

  const handleDongChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setLocalDong(value);
      if (onDongChange) {
        onDongChange(value);
      }
    },
    [onDongChange]
  );

  const handleHoChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setLocalHo(value);
      if (onHoChange) {
        onHoChange(value);
      }
    },
    [onHoChange]
  );

  const handleSelectComplex = useCallback(
    (value: string) => {
      const parsedValue = Number(value);
      if (!Number.isNaN(parsedValue)) {
        onSelectComplex(parsedValue);
      }
    },
    [onSelectComplex]
  );

  return (
    <>
      <PageHeader className="pb-11" title="매물장">
        <div className="flex w-full flex-col gap-2.5">
          <div className="flex justify-between gap-3">
            <div className="flex flex-row gap-3">
              <DropdownMenu
                className="w-67 font-semibold"
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
                disabled={isComplexLoading || complexOptions.length === 0}
              />
              <InputGroup className="w-32 h-12">
                <InputGroupAddon>
                  <InputGroupInput
                    placeholder="동 검색"
                    value={localDong}
                    onChange={handleDongChange}
                    className="text-black"
                  />
                  <Search />
                </InputGroupAddon>
              </InputGroup>
              <InputGroup className="w-32">
                <InputGroupAddon>
                  <InputGroupInput
                    placeholder="호 검색"
                    value={localHo}
                    onChange={handleHoChange}
                    className="text-black"
                  />
                  <Search />
                </InputGroupAddon>
              </InputGroup>
              <div className="w-98">
                <InputGroup>
                  <InputGroupInput
                    placeholder="전화번호 검색"
                    value={localPhoneNumber}
                    onChange={handlePhoneNumberChange}
                    type="text"
                    inputMode="numeric"
                    className="text-black"
                  />
                  <InputGroupAddon>
                    <Search />
                  </InputGroupAddon>
                </InputGroup>
              </div>
            </div>
            <div>
              <Button className="bg-[#ffffff]" onClick={onSqmOrPyeongChange}>
                <span className="text-black font-semibold shadow-drop">
                  {isSqmOrPyeong === "sqm" ? "㎡ 변환" : "평 변환"}
                </span>
                <img src={RefreshIcon} alt="refresh" />
              </Button>
            </div>
          </div>
        </div>
      </PageHeader>
    </>
  );
}
