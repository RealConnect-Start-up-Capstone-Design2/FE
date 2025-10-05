import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";

// 이미지 불러오기
import DropdownCheck from "@/assets/DropdownCheck.svg";

import { cn } from "@/shared/utils";

export interface DropdownOption {
  label: string;
  value: string;
}

export interface DropdownMenuCellProps {
  id?: string;
  placeholder?: string;
  options: DropdownOption[];
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
  buttonClassName?: string;
  listClassName?: string;
  optionClassName?: string;
  disabled?: boolean;
}

export function DropdownMenuCell({
  id,
  placeholder = "선택해 주세요",
  options,
  value,
  onChange,
  className,
  buttonClassName,
  listClassName,
  optionClassName,
  disabled = false,
}: DropdownMenuCellProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isListAbove, setIsListAbove] = useState(false);
  const [listPosition, setListPosition] = useState({ top: 0, left: 0 });
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    // Simple position calculation for fixed dropdown
    const updatePosition = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const spaceBelow = window.innerHeight - rect.bottom;
        const spaceAbove = rect.top;

        // Simple heuristic: if less space below than above, show above
        const shouldBeAbove = spaceBelow < spaceAbove && spaceAbove > 150;
        setIsListAbove(shouldBeAbove);

        // Simple fixed position calculation
        const top = shouldBeAbove ? rect.top - 200 : rect.bottom + 8;
        setListPosition({ top, left: rect.left });
      }
    };

    updatePosition();

    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const selectedOption = options.find((option) => option.value === value);

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      <button
        id={id}
        type="button"
        disabled={disabled}
        onClick={() => {
          if (!disabled) {
            setIsOpen((prev) => !prev);
          }
        }}
        className={cn(
          "relative flex w-15 items-center gap-2 rounded-full border border-grayscale-400 whitespace-nowrap bg-[#EDEDED] px-2 py-1 text-left text-[13px] font-medium text-[#1B1B1B] focus:outline-none focus:ring-2 focus:ring-brand-500 disabled:cursor-not-allowed disabled:opacity-60 z-10",
          buttonClassName
        )}
      >
        <span className={selectedOption ? "text-[#1B1B1B]" : "text-[#1B1B1B]"}>
          {selectedOption?.label ?? placeholder}
        </span>
        <ChevronDown
          className={cn(
            "h-4 w-4 text-grayscale-black transition-transform duration-150",
            isOpen && "rotate-180"
          )}
        />
      </button>
      {isOpen && !disabled && (
        <ul
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
            <li key={option.value} className="flex w-15">
              <button
                type="button"
                onClick={() => {
                  onChange?.(option.value);
                  setIsOpen(false);
                }}
                className={cn(
                  "mx-1 my-1 flex h-6 w-15 gap-2 items-center rounded-full bg-[#FFFFFF] px-2 text-center font-medium text-[#1B1B1B]",
                  optionClassName
                )}
              >
                <span className="flex-1">{option.label}</span>
                {value === option.value && (
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
