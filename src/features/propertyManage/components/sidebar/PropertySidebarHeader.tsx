import { FileText, X } from "lucide-react";
import { Button } from "@/shared/ui";
import type { ApartmentWithProperty } from "../../types";

interface PropertySidebarHeaderProps {
  apartment: ApartmentWithProperty;
  onClose?: () => void;
}

/**
 * 매물장 사이드바 헤더
 * - "매물" 탭 버튼
 * - 닫기 버튼
 * - 매물 제목 및 상세 정보
 */
export function PropertySidebarHeader({
  apartment,
  onClose,
}: PropertySidebarHeaderProps) {
  const { apartmentName, dong, ho, area, type } = apartment;
  const dongHo = [dong, ho].filter(Boolean).join("-");
  const displayTitle = [apartmentName, dongHo].filter(Boolean).join(" ");
  const exclusiveArea =
    typeof area === "number" && Number.isFinite(area)
      ? `${area.toFixed(2).replace(/\.?0+$/, "")}m²`
      : "";
  const supplyArea =
    typeof area === "number" && Number.isFinite(area)
      ? `${Math.round(area * 0.91)}m²`
      : "";

  return (
    <header className="bg-white px-[30px] pb-[22px] pt-5">
      <div className="mb-3 flex items-center justify-between gap-3">
        <div className="flex h-[30px] items-center gap-1.5 rounded-lg border border-[#9747FF] bg-white px-2 text-[15px] font-semibold tracking-[-0.025em] text-[#9747FF]">
          <FileText className="h-[17px] w-[17px]" />
          <span>매물</span>
        </div>
        {onClose && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-8 w-8 rounded-lg text-[#8D8D8D] hover:bg-[#F8F8F8] hover:text-[#1B1B1B]"
            aria-label="사이드바 닫기"
          >
            <X className="h-5 w-5" />
          </Button>
        )}
      </div>

      <h2 className="mb-2 text-[22px] font-semibold leading-normal tracking-[-0.025em] text-[#1B1B1B]">
        {displayTitle}
      </h2>

      <div className="flex flex-wrap items-center gap-2 text-[15px] tracking-[-0.025em] text-[#1B1B1B]">
        {type && <span className="font-semibold">{type}</span>}
        {type && exclusiveArea && <span className="h-3 border-l border-[#B1B6C7]" />}
        {exclusiveArea && (
          <span className="flex items-center gap-2">
            <span className="font-medium">전용면적</span>
            <span className="font-semibold">{exclusiveArea}</span>
          </span>
        )}
        {exclusiveArea && supplyArea && (
          <span className="h-3 border-l border-[#B1B6C7]" />
        )}
        {supplyArea && (
          <span className="flex items-center gap-2">
            <span className="font-medium">공급면적</span>
            <span className="font-semibold">{supplyArea}</span>
          </span>
        )}
      </div>
    </header>
  );
}
