import { FileText, Star, ChevronDown } from "lucide-react";
import type { ApartmentWithProperty } from "../../types";

interface PropertySidebarHeaderProps {
  apartment: ApartmentWithProperty;
  onClose?: () => void;
}

/**
 * 매물장 사이드바 헤더
 * - "매물" 탭 버튼
 * - 즐겨찾기 버튼
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
  const areaStr =
    typeof area === "number" && Number.isFinite(area)
      ? `${area.toFixed(2).replace(/\.?0+$/, "")}m²`
      : "";

  return (
    <div className="border-b border-gray-200 px-6 py-6">
      {/* 첫 번째 줄: 탭과 액션 버튼들 */}
      <div className="flex items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 px-2 py-1.5 rounded-lg border-2 border-purple-500 bg-white text-purple-500 font-medium text-sm transition-colors">
            <FileText className="h-4 w-4" />
            매물
          </div>
          {/* TODO: 즐겨찾기 버튼 로직 추가 */}
          <button
            type="button"
            className="flex items-center gap-1 px-2 py-1.5 rounded-lg border border-gray-300 bg-white text-gray-700 transition-colors hover:bg-gray-50"
            aria-label="즐겨찾기"
          >
            <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
            <ChevronDown className="h-4 w-4" />
          </button>
        </div>
        <div className="flex items-center gap-2">
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700"
              aria-label="사이드바 닫기"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* 두 번째 줄: 매물 제목 */}
      <h2 className="text-2xl font-bold text-gray-900 mb-2">{displayTitle}</h2>

      {/* 세 번째 줄: 상세 정보 */}
      <div className="flex items-center gap-2 text-base text-gray-600">
        {type && <span>{type}</span>}
        {type && areaStr && <span className="text-gray-400">|</span>}
        {areaStr && <span>전용면적 {areaStr}</span>}
      </div>
    </div>
  );
}
