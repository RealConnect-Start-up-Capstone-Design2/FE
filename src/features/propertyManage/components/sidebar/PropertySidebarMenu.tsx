import { cn } from "@/shared/utils";

export interface PropertySidebarMenuItem {
  id: string;
  label: string;
}

interface PropertySidebarMenuProps {
  activeSection: string;
  onSectionClick: (sectionId: string) => void;
  items: PropertySidebarMenuItem[];
}

/**
 * 매물장 사이드바 앵커 메뉴
 * - 클릭 시 해당 섹션으로 스크롤
 * - 현재 보이는 섹션 하이라이트
 */
export function PropertySidebarMenu({
  activeSection,
  onSectionClick,
  items,
}: PropertySidebarMenuProps) {
  return (
    <nav className="bg-[#F8F8F8] px-3 shadow-[0px_0px_10px_0px_rgba(31,43,87,0.15)]">
      <ul className="grid h-[42px] grid-cols-4 gap-2">
        {items.map((item) => (
          <li key={item.id} className="min-w-0">
            <button
              type="button"
              onClick={() => onSectionClick(item.id)}
              className={cn(
                "relative h-full w-full px-2 text-center text-[13px] font-medium tracking-[-0.025em] transition-colors",
                activeSection === item.id
                  ? "text-[#1C2882]"
                  : "text-[#8D8D8D] hover:text-[#1B1B1B]",
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
