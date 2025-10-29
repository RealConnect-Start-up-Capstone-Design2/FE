import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";

// 이미지 불러오기
import DropdownCheck from "@/assets/DropdownCheck.svg";

import { cn } from "@/shared/utils";

export interface DropdownOption {
  label: string;
  value: string;
  icon?: string; // 아이콘 이미지 경로 (optional)
}

export interface DropdownMenuCellProps {
  id?: string;
  placeholder?: string;
  options: DropdownOption[];
  value?: string;
  onChange?: (value: string) => void;
  onBlur?: () => void;
  className?: string;
  buttonClassName?: string;
  listClassName?: string;
  optionClassName?: string;
  disabled?: boolean;
  hideLabel?: boolean; // 버튼에서 텍스트 숨기기
  showCheckmark?: boolean; // 선택된 항목에 체크 표시 (기본: true)
  iconPosition?: "left" | "right"; // 드롭다운 리스트에서 아이콘 위치 (기본: left)
  showValue?: boolean; // label과 함께 value도 표시 (기본: false)
}

export function DropdownMenuCell({
  id,
  placeholder = "선택해 주세요",
  options,
  value,
  onChange,
  onBlur,
  className,
  buttonClassName,
  listClassName,
  optionClassName,
  disabled = false,
  hideLabel = false,
  showCheckmark = true,
  iconPosition = "left",
  showValue = false,
}: DropdownMenuCellProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [listPosition, setListPosition] = useState({ top: 0, left: 0 });
  const containerRef = useRef<HTMLDivElement | null>(null);
  const listRef = useRef<HTMLUListElement | null>(null);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    // 가장 가까운 스크롤 가능한 부모 요소를 찾는 함수
    const findScrollableParent = (
      element: HTMLElement | null
    ): HTMLElement | null => {
      if (!element || element === document.body) {
        return null;
      }

      const { overflow, overflowY } = window.getComputedStyle(element);
      const isScrollable = /(auto|scroll)/.test(overflow + overflowY);

      if (isScrollable && element.scrollHeight > element.clientHeight) {
        return element;
      }

      return findScrollableParent(element.parentElement);
    };

    // Simple position calculation for fixed dropdown
    const updatePosition = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();

        // 스크롤 가능한 부모 찾기 (테이블 컨테이너 등)
        const scrollableParent = findScrollableParent(
          containerRef.current.parentElement
        );

        let spaceBelow: number;
        let spaceAbove: number;

        if (scrollableParent) {
          // 테이블/스크롤 컨테이너의 경계 사용
          const parentRect = scrollableParent.getBoundingClientRect();
          spaceBelow = parentRect.bottom - rect.bottom;
          spaceAbove = rect.top - parentRect.top;
        } else {
          // 스크롤 컨테이너가 없으면 viewport 사용
          spaceBelow = window.innerHeight - rect.bottom;
          spaceAbove = rect.top;
        }

        // 실제 리스트 높이 계산 (DOM 측정 우선, 없으면 추정치 사용)
        const itemHeight = 32; // h-6 + my-1 기반 추정치
        const maxDropdownHeight = 192;
        const measuredHeight =
          listRef.current?.getBoundingClientRect().height ?? 0;
        const estimatedHeight = Math.min(
          options.length * itemHeight,
          maxDropdownHeight
        );
        const dropdownHeight = measuredHeight || estimatedHeight;

        // 아래 공간이 부족하면 위로 펼치기
        const requiredGap = 4;
        const shouldBeAbove =
          spaceBelow < dropdownHeight + requiredGap &&
          spaceAbove > dropdownHeight + requiredGap;

        // 위로 펼칠 때는 실제 높이만큼 빼고, 아래로 펼칠 때는 여백 추가
        const top = shouldBeAbove
          ? rect.top - dropdownHeight - requiredGap
          : rect.bottom + requiredGap;
        setListPosition({ top, left: rect.left });
      }
    };

    updatePosition();
    const rafId = requestAnimationFrame(updatePosition);

    // 스크롤 시 위치 재계산
    const scrollableParent = findScrollableParent(
      containerRef.current?.parentElement || null
    );
    if (scrollableParent) {
      scrollableParent.addEventListener("scroll", updatePosition);
    }

    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        onBlur?.(); // 드롭다운이 닫힐 때 onBlur 호출
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      cancelAnimationFrame(rafId);
      document.removeEventListener("mousedown", handleClickOutside);
      if (scrollableParent) {
        scrollableParent.removeEventListener("scroll", updatePosition);
      }
    };
  }, [isOpen, onBlur, options.length]);

  const selectedOption = options.find((option) => option.value === value);

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      <button
        id={id}
        type="button"
        disabled={disabled}
        onClick={(e) => {
          e.stopPropagation(); // Row 클릭 이벤트 전파 방지
          if (!disabled) {
            setIsOpen((prev) => !prev);
          }
        }}
        className={cn(
          "relative flex min-w-15 items-center justify-between gap-2 rounded-full border border-grayscale-400 whitespace-nowrap bg-[#EDEDED] px-2 py-1 text-left text-[13px] font-medium text-[#1B1B1B] focus:outline-none focus:ring-2 focus:ring-brand-500 disabled:cursor-not-allowed disabled:opacity-60 z-10",
          buttonClassName
        )}
      >
        <div className="flex items-center gap-2">
          {selectedOption?.icon && (
            <img src={selectedOption.icon} alt="" className="h-4 w-4" />
          )}
          {!hideLabel && (
            <span
              className={selectedOption ? "text-[#1B1B1B]" : "text-[#1B1B1B]"}
            >
              {selectedOption
                ? showValue
                  ? `${selectedOption.label} (${selectedOption.value})`
                  : selectedOption.label
                : placeholder}
            </span>
          )}
        </div>
        <ChevronDown
          className={cn(
            "h-4 w-4 text-grayscale-black transition-transform duration-150 flex-shrink-0",
            isOpen && "rotate-180"
          )}
        />
      </button>
      {isOpen && !disabled && (
        <ul
          ref={listRef}
          className={cn(
            "fixed z-[90] max-h-48 overflow-y-auto rounded-xl bg-[#FFFFFF] shadow-[0px_0px_25px_-10px_rgba(177,182,199,1)]",
            listClassName
          )}
          style={{
            top: `${listPosition.top}px`,
            left: `${listPosition.left}px`,
          }}
        >
          {options.map((option) => (
            <li key={option.value} className="flex">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation(); // Row 클릭 이벤트 전파 방지
                  onChange?.(option.value);
                  setIsOpen(false);
                  onBlur?.(); // 옵션 선택 시에도 onBlur 호출
                }}
                className={cn(
                  "mx-1 flex h-6 min-w-15 w-full gap-2 items-center rounded-full bg-[#FFFFFF] px-2 text-center font-medium text-[#1B1B1B]",
                  optionClassName
                )}
              >
                {iconPosition === "left" && option.icon && (
                  <img src={option.icon} alt="" className="h-4 w-4" />
                )}
                <span className="text-left">{option.label}</span>
                {iconPosition === "right" && option.icon && (
                  <img src={option.icon} alt="" className="h-4 w-4" />
                )}
                {showCheckmark && value === option.value && (
                  <img src={DropdownCheck} alt="selected" className="h-3 w-3" />
                )}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

DropdownMenuCell.displayName = "DropdownMenuCell";
