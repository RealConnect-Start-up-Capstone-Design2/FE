import { Plus, RefreshCw, RotateCcw, Search } from "lucide-react";

import { PageHeader } from "@/shared/components/PageHeader";
import { Button } from "@/shared/ui/button";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/shared/ui/input-group";

const onlyNumbers = (value: string) => value.replace(/[^0-9]/g, "");
const onlyDecimal = (value: string) => {
  const [integer = "", ...fractionParts] = value
    .replace(/[^0-9.]/g, "")
    .split(".");
  if (fractionParts.length === 0) return integer;
  return `${integer}.${fractionParts.join("").slice(0, 2)}`;
};

interface InquiryManageHeaderProps {
  onAddInquiry?: () => void;
  searchKeyword?: string;
  onSearchKeywordChange?: (keyword: string) => void;
  priceMin?: string;
  onPriceMinChange?: (value: string) => void;
  priceMax?: string;
  onPriceMaxChange?: (value: string) => void;
  areaMin?: string;
  onAreaMinChange?: (value: string) => void;
  areaMax?: string;
  onAreaMaxChange?: (value: string) => void;
  isSqmOrPyeong?: "sqm" | "pyeong";
  onSqmOrPyeongChange?: () => void;
  hasActiveFilters?: boolean;
  onResetFilters?: () => void;
}

export function InquiryManageHeader({
  onAddInquiry,
  searchKeyword = "",
  onSearchKeywordChange,
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
  hasActiveFilters = false,
  onResetFilters,
}: InquiryManageHeaderProps) {
  const areaUnit = isSqmOrPyeong === "sqm" ? "㎡" : "평";

  return (
    <PageHeader
      title="문의 관리"
      description="고객의 희망 조건을 기록하고 적합한 보유 매물을 바로 찾아보세요."
    >
      <div className="mt-5 flex flex-wrap items-center gap-3">
        <Button
          type="button"
          className="h-11 rounded-lg bg-[#1C2882] px-5 font-semibold text-white hover:bg-[#151F65]"
          onClick={onAddInquiry}
        >
          <Plus aria-hidden="true" className="h-4 w-4" />
          문의 등록
        </Button>

        <InputGroup className="h-11 min-w-[250px] flex-1 md:max-w-[410px]">
          <InputGroupInput
            aria-label="문의 검색"
            placeholder="제목, 고객명, 연락처 검색"
            value={searchKeyword}
            onChange={(event) => onSearchKeywordChange?.(event.target.value)}
            className="text-black"
          />
          <InputGroupAddon>
            <Search aria-hidden="true" className="h-4 w-4" />
          </InputGroupAddon>
        </InputGroup>

        {hasActiveFilters ? (
          <Button
            type="button"
            variant="outline"
            className="h-11 border-[#D5DAEA] bg-white text-[#5F687C]"
            onClick={onResetFilters}
          >
            <RotateCcw aria-hidden="true" className="h-4 w-4" />
            필터 초기화
          </Button>
        ) : null}
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-3 rounded-xl border border-[#E1E5F0] bg-white p-3 shadow-sm">
        <span className="px-2 text-sm font-semibold text-[#4B5368]">예산</span>
        <RangeInput
          label="최소 예산"
          value={priceMin}
          onChange={(value) => onPriceMinChange?.(onlyNumbers(value))}
          suffix="만원"
        />
        <span aria-hidden="true" className="text-[#A1A7B5]">
          –
        </span>
        <RangeInput
          label="최대 예산"
          value={priceMax}
          onChange={(value) => onPriceMaxChange?.(onlyNumbers(value))}
          suffix="만원"
        />

        <span aria-hidden="true" className="mx-1 h-6 w-px bg-[#E1E5F0]" />

        <button
          type="button"
          onClick={onSqmOrPyeongChange}
          aria-label={
            isSqmOrPyeong === "sqm"
              ? "면적 입력을 평으로 변환"
              : "면적 입력을 제곱미터로 변환"
          }
          className="inline-flex items-center gap-2 rounded-lg px-2 py-2 text-sm font-semibold text-[#4B5368] transition-colors hover:bg-[#F3F5FB] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1C2882]"
        >
          면적
          <RefreshCw aria-hidden="true" className="h-3.5 w-3.5" />
          <span className="text-[#1C2882]">{areaUnit}</span>
        </button>
        <RangeInput
          label="최소 면적"
          value={areaMin}
          onChange={(value) => onAreaMinChange?.(onlyDecimal(value))}
          suffix={areaUnit}
        />
        <span aria-hidden="true" className="text-[#A1A7B5]">
          –
        </span>
        <RangeInput
          label="최대 면적"
          value={areaMax}
          onChange={(value) => onAreaMaxChange?.(onlyDecimal(value))}
          suffix={areaUnit}
        />
      </div>
    </PageHeader>
  );
}

function RangeInput({
  label,
  value,
  suffix,
  onChange,
}: {
  label: string;
  value: string;
  suffix: string;
  onChange: (value: string) => void;
}) {
  return (
    <InputGroup className="h-10 w-[145px]">
      <InputGroupInput
        aria-label={label}
        inputMode="decimal"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="text-right text-black"
      />
      <InputGroupAddon align="inline-end">
        <span className="text-xs font-semibold text-[#8D94A6]">{suffix}</span>
      </InputGroupAddon>
    </InputGroup>
  );
}
