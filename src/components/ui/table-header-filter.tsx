import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/shared/utils";
import type { DropdownOption } from "./dropdown-menu";

export interface TableHeaderFilterProps {
  /** 헤더에 표시될 제목 */
  title: string;
  /** 드롭다운 옵션 목록 */
  options: DropdownOption[];
  /** 현재 선택된 값 */
  value?: string;
  /** 값 변경 핸들러 */
  onChange?: (value: string) => void;
  /** 추가 className */
  className?: string;
}

export function TableHeaderFilter({
  title,
  options,
  value,
  onChange,
  className,
}: TableHeaderFilterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // 외부 클릭 시 드롭다운 닫기
  useEffect(() => {
    if (!isOpen) return;

    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  // 26.01.05 : 각 필터 옵션의 값을 표시하면 컬럼이 길어지는 이슈가 있어 우선 주석처리
  // const selectedOption = options.find((option) => option.value === value);
  // "전체(ALL)"가 아닌 다른 값이 선택되었는지 확인
  const hasActiveFilter = value !== undefined && value !== "ALL";

  return (
    <th
      className={cn(
        "h-12 px-1 text-center align-middle font-medium text-muted-foreground",
        className
      )}
    >
      <div ref={containerRef} className="relative inline-block">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setIsOpen((prev) => !prev);
          }}
          className={cn(
            "flex items-center justify-center gap-1 px-2 py-1 rounded transition-colors",
            hasActiveFilter && "text-blue-600 font-semibold"
          )}
        >
          <span>{title}</span>
          {/* 26.01.05 : 각 필터 옵션의 값을 표시하면 컬럼이 길어지는 이슈가 있어 우선 주석처리 */}
          {/* {hasActiveFilter && selectedOption && (
            <span className="text-xs">({selectedOption.label})</span>
          )} */}
          <ChevronDown
            className={cn(
              "h-4 w-4 transition-transform duration-150",
              isOpen && "rotate-180"
            )}
          />
        </button>

        {isOpen && (
          <ul
            className={cn(
              "absolute left-1/2 -translate-x-1/2 z-[101] mt-1",
              "flex flex-col max-h-48 overflow-y-auto",
              "rounded-md border border-grayscale-300 bg-white shadow-lg"
            )}
          >
            {options.map((option) => (
              <li key={option.value}>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onChange?.(option.value);
                    setIsOpen(false);
                  }}
                  className={cn(
                    "flex w-full items-center justify-center gap-2 px-4 py-2 text-left text-sm",
                    "hover:bg-gray-100 transition-colors",
                    value === option.value
                      ? "bg-blue-50 text-blue-600 font-medium"
                      : "text-gray-700"
                  )}
                >
                  {option.icon && (
                    <img src={option.icon} alt="" className="h-4 w-4" />
                  )}
                  <span>{option.label}</span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </th>
  );
}

TableHeaderFilter.displayName = "TableHeaderFilter";
