import { cn } from "@/shared/utils";

interface PropertySidebarMenuProps {
  activeSection: string;
  onSectionClick: (sectionId: string) => void;
}

const menuItems = [
  { id: "consultation", label: "고객 상담" },
  { id: "contract", label: "계약 내역" },
  { id: "inquiry", label: "의뢰 정보" },
  { id: "detail", label: "매물 상세" },
];

/**
 * 매물장 사이드바 앵커 메뉴
 * - 클릭 시 해당 섹션으로 스크롤
 * - 현재 보이는 섹션 하이라이트
 */
export function PropertySidebarMenu({
  activeSection,
  onSectionClick,
}: PropertySidebarMenuProps) {
  return (
    <nav className="border-b border-gray-200 px-3">
      <ul className="flex justify-between">
        {menuItems.map((item) => (
          <li key={item.id}>
            <button
              type="button"
              onClick={() => onSectionClick(item.id)}
              className={cn(
                "px-7 py-3 text-sm font-medium transition-colors relative",
                activeSection === item.id
                  ? "text-[#1C2882]"
                  : "text-gray-600 hover:text-gray-900"
              )}
            >
              {item.label}
              {activeSection === item.id && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#1C2882]" />
              )}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}
