import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";

import { cn } from "@/shared/utils";

export interface DropdownOption {
  label: string;
  value: string;
  icon?: string;
}

interface DropdownFooterAction {
  label: string;
  onClick: () => void;
  icon?: string;
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
  selectedTextColor?: string; // 선택된 값의 텍스트 색상
  placeholderTextColor?: string; // placeholder 텍스트 색상
  iconPosition?: "left" | "right";
  footerAction?: DropdownFooterAction;
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
  selectedTextColor = "text-primary-foreground",
  placeholderTextColor = "text-primary-foreground",
  iconPosition = "left",
  footerAction,
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
          "flex w-full items-center justify-between rounded-md border border-grayscale-400 whitespace-nowrap bg-primary px-4 py-3 gap-1 text-left text-primary-foreground text-body-1 focus:outline-none focus:ring-2 focus:ring-brand-500 disabled:cursor-not-allowed disabled:opacity-60",
          buttonClassName
        )}
      >
        <span
          className={cn(
            "flex items-center gap-2",
            selectedOption ? selectedTextColor : placeholderTextColor
          )}
        >
          {iconPosition === "left" && selectedOption?.icon && (
            <img src={selectedOption.icon} alt="" className="h-4 w-4" />
          )}
          <span>{selectedOption?.label ?? placeholder}</span>
          {iconPosition === "right" && selectedOption?.icon && (
            <img src={selectedOption.icon} alt="" className="h-4 w-4" />
          )}
        </span>
        <ChevronDown
          className={cn(
            "h-6 w-6 text-primary-foreground transition-transform duration-150",
            isOpen && "rotate-180"
          )}
        />
      </button>
      {isOpen && !disabled && (
        <ul
          className={cn(
            "absolute z-[101] mt-1 max-h-48 w-full overflow-y-auto rounded-md border border-grayscale-300 bg-primary shadow-md",
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
                  "flex w-full items-center justify-between gap-2 px-4 py-2 text-left",
                  value === option.value
                    ? "bg-primary text-primary-foreground"
                    : "text-primary-foreground",
                  optionClassName
                )}
              >
                {iconPosition === "left" && option.icon && (
                  <img src={option.icon} alt="" className="h-4 w-4" />
                )}
                <span className="flex-1">{option.label}</span>
                {iconPosition === "right" && option.icon && (
                  <img src={option.icon} alt="" className="h-4 w-4" />
                )}
              </button>
            </li>
          ))}
          {footerAction && (
            <li
              className={cn(
                options.length > 0 && "border-t border-grayscale-300"
              )}
            >
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  footerAction.onClick();
                }}
                className={cn(
                  "flex w-full items-center justify-between gap-2 px-4 py-2 text-left text-primary-foreground",
                  optionClassName
                )}
              >
                {iconPosition === "left" && footerAction.icon && (
                  <img src={footerAction.icon} alt="" className="h-4 w-4" />
                )}
                <span className="flex-1">{footerAction.label}</span>
                {iconPosition === "right" && footerAction.icon && (
                  <img src={footerAction.icon} alt="" className="h-4 w-4" />
                )}
              </button>
            </li>
          )}
        </ul>
      )}
    </div>
  );
}

DropdownMenu.displayName = "DropdownMenu";
