import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";

import { cn } from "@/shared/utils";

export interface DropdownOption {
  label: string;
  value: string;
}

export interface DropdownMenuProps {
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

export function DropdownMenu({
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
}: DropdownMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

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
          "flex w-full items-center justify-between rounded-md border border-grayscale-400 whitespace-nowrap bg-rgba(255, 255, 255, 1) px-4 py-3.5 text-left text-grayscale-black text-body-1 focus:outline-none focus:ring-2 focus:ring-brand-500 disabled:cursor-not-allowed disabled:opacity-60",
          buttonClassName
        )}
      >
        <span className={selectedOption ? "" : "text-grayscale-black"}>
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
            "absolute z-10 mt-1 max-h-48 w-full overflow-y-auto rounded-md border border-grayscale-300 bg-grayscale-white shadow-md",
            listClassName
          )}
        >
          {options.map((option) => (
            <li key={option.value}>
              <button
                type="button"
                onClick={() => {
                  onChange?.(option.value);
                  setIsOpen(false);
                }}
                className={cn(
                  "flex w-full items-center justify-between px-4 py-2 text-left hover:bg-brand-50 hover:text-brand-500",
                  value === option.value
                    ? "bg-brand-50 text-brand-500"
                    : "text-grayscale-black",
                  optionClassName
                )}
              >
                <span>{option.label}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

DropdownMenu.displayName = "DropdownMenu";
