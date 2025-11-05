import { useCallback, useState, useEffect } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { Button } from "@/components/ui/button";
import { DropdownMenu } from "@/components/ui/dropdown-menu";
import type { DropdownOption } from "@/components/ui/dropdown-menu";
import PlusIcon from "@/assets/Plus.svg";
import { Search } from "lucide-react";
import {
  InputGroup,
  InputGroupInput,
  InputGroupAddon,
} from "@/components/ui/input-group";
import { MainComplexModal } from "@/shared/components/MainComplexModal";
import type { ComplexData } from "@/shared/types/complex";

interface PropertyManagerHeaderProps {
  complexOptions: DropdownOption[];
  selectedComplexId?: number;
  onSelectComplex: (apartmentComplexId: number) => void;
  onRefreshPreferredComplexes: () => void;
  isComplexLoading?: boolean;
  selectedRequestType?: string;
  onSelectRequestType?: (requestType: string | undefined) => void;
  selectedPropertyStatus?: string;
  onSelectPropertyStatus?: (propertyStatus: string | undefined) => void;
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
}

export function PropertyManagerHeader({
  complexOptions,
  selectedComplexId,
  onSelectComplex,
  onRefreshPreferredComplexes,
  isComplexLoading = false,
  selectedRequestType,
  onSelectRequestType,
  selectedPropertyStatus,
  onSelectPropertyStatus,
  selectedManageType,
  onSelectManageType,
  areaOptions = [],
  selectedArea,
  onSelectArea,
  phoneNumber,
  onPhoneNumberChange,
  dong,
  onDongChange,
  ho,
  onHoChange,
}: PropertyManagerHeaderProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
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

  const manageTypeOptions: DropdownOption[] = [
    { label: "전체", value: "ALL" },
    { label: "기본", value: "NONE" },
    { label: "관심", value: "ATTENTION" },
    { label: "주의", value: "CAUTION" },
  ];

  const requestTypeOptions: DropdownOption[] = [
    { label: "전체", value: "ALL" },
    { label: "없음", value: "NONE" },
    { label: "입주", value: "SELF" },
    { label: "매도", value: "SALE" },
    { label: "전세", value: "JEONSE" },
    { label: "월세", value: "MONTHLY" },
    { label: "미수신", value: "NOT_RECEIVED" },
    { label: "고민중", value: "THINKING" },
  ];

  const propertyStatusOptions: DropdownOption[] = [
    { label: "전체", value: "ALL" },
    { label: "없음", value: "NONE" },
    { label: "거래 전", value: "BEFORE" },
    { label: "광고 중", value: "ADVERTISING" },
    { label: "거래 완료", value: "COMPLETED" },
  ];

  const handleSelectRequestType = useCallback(
    (value: string) => {
      if (onSelectRequestType) {
        // "전체" 선택 시 undefined로 전달하여 필터 해제
        onSelectRequestType(value === "ALL" ? undefined : value);
      }
    },
    [onSelectRequestType]
  );

  const handleSelectPropertyStatus = useCallback(
    (value: string) => {
      if (onSelectPropertyStatus) {
        // "전체" 선택 시 undefined로 전달하여 필터 해제
        onSelectPropertyStatus(value === "ALL" ? undefined : value);
      }
    },
    [onSelectPropertyStatus]
  );

  const handleSelectManageType = useCallback(
    (value: string) => {
      if (onSelectManageType) {
        // "전체" 선택 시 undefined로 전달하여 필터 해제
        onSelectManageType(value === "ALL" ? undefined : value);
      }
    },
    [onSelectManageType]
  );

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

  const handleSelectArea = useCallback(
    (value: string) => {
      if (onSelectArea) {
        // "전체" 선택 시 undefined로 전달하여 필터 해제
        onSelectArea(value === "ALL" ? undefined : value);
      }
    },
    [onSelectArea]
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

  const handleSaveComplexes = async (complexes: ComplexData[]) => {
    console.log("Saving complexes:", complexes);
    // TODO: 실제 API 호출
    alert(`${complexes.length}개의 주거래 단지가 저장되었습니다.`);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    onRefreshPreferredComplexes();
  };

  return (
    <>
      <PageHeader title="매물장">
        <div className="flex w-full flex-col gap-2.5">
          <div className="flex flex-row gap-3 justify-between">
            <div className="flex flex-row gap-3">
              <Button
                className="bg-[#1B1B1B]"
                onClick={() => setIsModalOpen(true)}
              >
                <span className="text-white font-semibold">단지 추가</span>
                <img src={PlusIcon} alt="plus" />
              </Button>
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
              <div className="w-98">
                <InputGroup>
                  <InputGroupInput
                    placeholder="전화번호 검색"
                    value={localPhoneNumber}
                    onChange={handlePhoneNumberChange}
                    type="text"
                    inputMode="numeric"
                    className="text-black dark:text-white"
                  />
                  <InputGroupAddon>
                    <Search />
                  </InputGroupAddon>
                </InputGroup>
              </div>
            </div>
          </div>
          <div className="flex flex-row gap-3">
            <div className="flex flex-row gap-3">
              <DropdownMenu
                className="font-semibold min-w-[100px]"
                placeholder="즐겨찾기"
                options={manageTypeOptions}
                value={selectedManageType}
                onChange={handleSelectManageType}
              />
              <InputGroup className="w-32 h-12">
                <InputGroupAddon>
                  <InputGroupInput
                    placeholder="동 검색"
                    value={localDong}
                    onChange={handleDongChange}
                    className="text-black dark:text-white"
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
                    className="text-black dark:text-white"
                  />
                  <Search />
                </InputGroupAddon>
              </InputGroup>
              <DropdownMenu
                className="font-semibold min-w-[100px]"
                placeholder="면적 선택"
                options={areaOptions}
                disabled={areaOptions.length === 0}
                value={selectedArea}
                onChange={handleSelectArea}
              />
              <DropdownMenu
                className="font-semibold min-w-[100px]"
                placeholder="의뢰 유형"
                options={requestTypeOptions}
                value={selectedRequestType}
                onChange={handleSelectRequestType}
              />
              <DropdownMenu
                className="font-semibold min-w-[100px]"
                placeholder="매물 상태"
                options={propertyStatusOptions}
                value={selectedPropertyStatus}
                onChange={handleSelectPropertyStatus}
              />
            </div>
          </div>
        </div>
      </PageHeader>

      <MainComplexModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveComplexes}
      />
    </>
  );
}
