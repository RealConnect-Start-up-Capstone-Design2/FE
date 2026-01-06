import { PageHeader } from "@/components/common/PageHeader";
import { Button } from "@/components/ui/button";
import { DropdownMenu } from "@/components/ui/dropdown-menu";
import type { DropdownOption } from "@/components/ui/dropdown-menu";
import PlusIcon from "@/assets/Plus.svg";
import RefreshIcon from "@/assets/Refresh.svg";
import { Search } from "lucide-react";
import {
  InputGroup,
  InputGroupInput,
  InputGroupAddon,
} from "@/components/ui/input-group";

// 가격 종류 옵션
const priceTypeOptions: DropdownOption[] = [
  { label: "매매가", value: "SALE" },
  { label: "전세가", value: "JEONSE" },
  { label: "보증금", value: "DEPOSIT" },
  { label: "월세", value: "MONTHLY" },
];

// 숫자만 추출하는 헬퍼
const extractNumbers = (value: string) => value.replace(/[^0-9]/g, "");
const extractDecimal = (value: string) => value.replace(/[^0-9.]/g, "");

interface InquiryManageHeaderProps {
  onAddInquiry?: () => void;
  searchKeyword?: string;
  onSearchKeywordChange?: (keyword: string) => void;
  // 가격 필터
  selectedPriceType?: string;
  onSelectPriceType?: (priceType: string) => void;
  priceMin?: string;
  onPriceMinChange?: (value: string) => void;
  priceMax?: string;
  onPriceMaxChange?: (value: string) => void;
  // 면적 필터
  areaMin?: string;
  onAreaMinChange?: (value: string) => void;
  areaMax?: string;
  onAreaMaxChange?: (value: string) => void;
  // 면적 단위 변환
  isSqmOrPyeong?: "sqm" | "pyeong";
  onSqmOrPyeongChange?: () => void;
}

export function InquiryManageHeader({
  onAddInquiry,
  searchKeyword = "",
  onSearchKeywordChange,
  selectedPriceType = "SALE",
  onSelectPriceType,
  priceMin = "",
  onPriceMinChange,
  priceMax = "",
  onPriceMaxChange,
  areaMin = "",
  onAreaMinChange,
  areaMax = "",
  onAreaMaxChange,
  isSqmOrPyeong = "sqm",
  onSqmOrPyeongChange,
}: InquiryManageHeaderProps) {
  return (
    <PageHeader
      title="문의 관리"
      description="현재 등록된 고객들의 문의 목록입니다"
    >
      <div className="flex w-full flex-col gap-3 mt-4">
        {/* 첫 번째 줄: 문의 추가 버튼 + 검색 */}
        <div className="flex flex-row gap-3 items-center">
          <Button className="bg-[#1C2882]" onClick={onAddInquiry}>
            <span className="text-white font-semibold">문의 추가</span>
            <img src={PlusIcon} alt="plus" />
          </Button>

          <InputGroup className="w-[355px]">
            <InputGroupInput
              placeholder="문의 제목, 문의자, 연락처 검색"
              value={searchKeyword}
              onChange={(e) => onSearchKeywordChange?.(e.target.value)}
              className="text-black"
            />
            <InputGroupAddon>
              <Search />
            </InputGroupAddon>
          </InputGroup>
        </div>

        {/* 두 번째 줄: 필터들 */}
        <div className="flex flex-row gap-3 items-center">
          {/* 가격 필터 섹션 */}
          <div className="flex flex-row items-center gap-3">
            {/* 가격 라벨 박스 */}
            <div className="flex items-center justify-center h-12 px-6 rounded-lg bg-white border border-[#B1B6C766] shadow-sm">
              <span className="text-lg whitespace-nowrap font-semibold text-[#1B1B1B]">
                가격
              </span>
            </div>

            {/* 가격 종류 선택 */}
            <DropdownMenu
              className="w-[124px] font-semibold"
              options={priceTypeOptions}
              value={selectedPriceType}
              onChange={(value) => onSelectPriceType?.(value)}
            />

            {/* 가격 범위 입력 */}
            <div className="flex flex-row items-center gap-2.5">
              <InputGroup className="w-[150px]">
                <InputGroupInput
                  placeholder=""
                  value={priceMin}
                  onChange={(e) =>
                    onPriceMinChange?.(extractNumbers(e.target.value))
                  }
                  className="text-black text-right"
                  inputMode="numeric"
                />
                <InputGroupAddon align="inline-end">
                  <span className="text-[#989898] font-semibold">만원</span>
                </InputGroupAddon>
              </InputGroup>

              <span className="text-lg font-semibold text-[#1B1B1B]">~</span>

              <InputGroup className="w-[150px]">
                <InputGroupInput
                  placeholder=""
                  value={priceMax}
                  onChange={(e) =>
                    onPriceMaxChange?.(extractNumbers(e.target.value))
                  }
                  className="text-black text-right"
                  inputMode="numeric"
                />
                <InputGroupAddon align="inline-end">
                  <span className="text-[#989898] font-semibold">만원</span>
                </InputGroupAddon>
              </InputGroup>
            </div>
          </div>

          {/* 구분선 */}
          <div className="w-px h-6 bg-[#B1B6C766]" />

          {/* 면적 필터 섹션 */}
          <div className="flex flex-row items-center gap-3">
            {/* 면적 라벨 박스 */}
            <div className="flex items-center justify-center h-12 px-6 gap-2 rounded-lg bg-white border border-[#B1B6C766] shadow-sm">
              <button
                type="button"
                onClick={onSqmOrPyeongChange}
                className="flex flex-row items-center gap-2 hover:opacity-70 transition-opacity"
              >
                <span className="text-lg whitespace-nowrap font-semibold text-[#1B1B1B]">
                  면적
                </span>
                <img src={RefreshIcon} alt="단위 변환" className="w-4 h-4" />
              </button>
            </div>

            {/* 면적 범위 입력 */}
            <div className="flex flex-row items-center gap-2.5">
              <InputGroup className="w-[150px]">
                <InputGroupInput
                  placeholder=""
                  value={areaMin}
                  onChange={(e) =>
                    onAreaMinChange?.(extractDecimal(e.target.value))
                  }
                  className="text-black text-right"
                  inputMode="decimal"
                />
                <InputGroupAddon align="inline-end">
                  <span className="text-[#989898] font-semibold">
                    {isSqmOrPyeong === "sqm" ? "m²" : "평"}
                  </span>
                </InputGroupAddon>
              </InputGroup>

              <span className="text-lg font-semibold text-[#1B1B1B]">~</span>

              <InputGroup className="w-[150px]">
                <InputGroupInput
                  placeholder=""
                  value={areaMax}
                  onChange={(e) =>
                    onAreaMaxChange?.(extractDecimal(e.target.value))
                  }
                  className="text-black text-right"
                  inputMode="decimal"
                />
                <InputGroupAddon align="inline-end">
                  <span className="text-[#989898] font-semibold">
                    {isSqmOrPyeong === "sqm" ? "m²" : "평"}
                  </span>
                </InputGroupAddon>
              </InputGroup>
            </div>
          </div>
        </div>
      </div>
    </PageHeader>
  );
}
