import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Upload,
} from "lucide-react";
import { Input, Textarea, DropdownMenu, Button } from "@/shared/ui";
import { cn } from "@/shared/utils";
import type { DropdownOption } from "@/shared/ui/dropdown-menu";
import type { ChangeEvent, ComponentProps, ReactNode } from "react";
import { useEffect, useMemo, useRef, useState } from "react";

const notifySidebarDirty = () => {
  window.dispatchEvent(new CustomEvent("property-sidebar-dirty"));
};

interface EmptyBlockStateProps {
  message?: string;
}

export function EmptyBlockState({
  message = "아파트를 선택해주세요.",
}: EmptyBlockStateProps) {
  return (
    <div className="flex min-h-[200px] items-center justify-center rounded-md border border-gray-200 bg-gray-50">
      <p className="text-[13px] font-medium tracking-[-0.025em] text-gray-400">
        {message}
      </p>
    </div>
  );
}

interface FieldProps {
  label: string;
  children: ReactNode;
  suffix?: string;
  className?: string;
}

export function Field({ label, children, suffix, className }: FieldProps) {
  return (
    <label className={cn("flex min-w-0 flex-col gap-[5px]", className)}>
      <span className="text-[13px] font-medium tracking-[-0.025em] text-[#8D8D8D]">
        {label}
      </span>
      <span className="flex min-w-0 items-center gap-[6px]">
        <span className="min-w-0 flex-1">{children}</span>
        {suffix && (
          <span className="shrink-0 text-[13px] font-normal tracking-[-0.025em] text-[#8D8D8D]">
            {suffix}
          </span>
        )}
      </span>
    </label>
  );
}

interface FieldRowProps {
  children: ReactNode;
  className?: string;
}

export function FieldRow({ children, className }: FieldRowProps) {
  return (
    <div className={cn("grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)] gap-4", className)}>
      {children}
    </div>
  );
}

export const sidebarInputClassName =
  "h-[34px] rounded-md border-[rgba(177,182,199,0.4)] bg-white px-2 text-[15px] font-medium tracking-[-0.025em] text-[#8D8D8D] shadow-none placeholder:text-[#B1B6C7] focus-visible:ring-1 focus-visible:ring-[#1C2882]";

export const sidebarActiveInputClassName =
  sidebarInputClassName;

export function SidebarInput(props: ComponentProps<typeof Input>) {
  return <Input {...props} className={cn(sidebarInputClassName, props.className)} />;
}

export function SidebarActiveInput(props: ComponentProps<typeof Input>) {
  return (
    <Input {...props} className={cn(sidebarActiveInputClassName, props.className)} />
  );
}

interface SidebarSelectProps {
  placeholder?: string;
  value?: string;
  options: DropdownOption[];
  className?: string;
  buttonClassName?: string;
  onChange?: (value: string) => void;
}

export function SidebarSelect({
  placeholder = "선택",
  value,
  options,
  className,
  buttonClassName,
  onChange,
}: SidebarSelectProps) {
  const [selectedValue, setSelectedValue] = useState(value);

  useEffect(() => {
    setSelectedValue(value);
  }, [value]);

  return (
    <DropdownMenu
      value={selectedValue}
      placeholder={placeholder}
      options={options}
      onChange={(nextValue) => {
        setSelectedValue(nextValue);
        notifySidebarDirty();
        onChange?.(nextValue);
      }}
      className={cn("w-full", className)}
      buttonClassName={cn(
        "h-[34px] rounded-md border border-[rgba(177,182,199,0.4)] bg-white px-2 py-0 text-[15px] font-medium tracking-[-0.025em] text-[#8D8D8D] shadow-none focus:ring-1 focus:ring-[#1C2882] [&_svg]:h-[18px] [&_svg]:w-[18px] [&_svg]:text-[#8D8D8D]",
        buttonClassName,
      )}
      listClassName="border-[rgba(177,182,199,0.4)] bg-white text-[13px]"
      optionClassName="text-[#8D8D8D] hover:bg-[#EEF6FF] hover:text-[#1C2882]"
      selectedTextColor="text-[#8D8D8D]"
      placeholderTextColor="text-[#8D8D8D]"
    />
  );
}

interface DateInputProps {
  value?: string;
  defaultValue?: string;
  className?: string;
  disabled?: boolean;
  popoverPlacement?: "top" | "bottom";
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
}

const parseSidebarDate = (
  value?: string | number | readonly string[],
): Date | undefined => {
  if (typeof value !== "string") {
    return undefined;
  }

  const match = value.match(/(\d{4})[.\-/\s]+(\d{1,2})[.\-/\s]+(\d{1,2})/);

  if (!match) {
    return undefined;
  }

  const [, year, month, day] = match;
  const parsedDate = new Date(Number(year), Number(month) - 1, Number(day));

  if (
    parsedDate.getFullYear() !== Number(year) ||
    parsedDate.getMonth() !== Number(month) - 1 ||
    parsedDate.getDate() !== Number(day)
  ) {
    return undefined;
  }

  return parsedDate;
};

const formatSidebarDate = (date: Date) =>
  `${date.getFullYear()}. ${date.getMonth() + 1}. ${date.getDate()}`;

const getCalendarDates = (viewDate: Date) => {
  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const dates: Array<Date | null> = [];

  for (let index = 0; index < firstDay.getDay(); index += 1) {
    dates.push(null);
  }

  for (let day = 1; day <= lastDay.getDate(); day += 1) {
    dates.push(new Date(year, month, day));
  }

  return dates;
};

export function DateInput({
  className,
  defaultValue,
  value,
  disabled,
  popoverPlacement = "bottom",
  onChange,
}: DateInputProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const initialDate = parseSidebarDate(value ?? defaultValue) ?? new Date();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(initialDate);
  const [viewDate, setViewDate] = useState<Date>(initialDate ?? new Date());
  const [isOpen, setIsOpen] = useState(false);
  const calendarDates = useMemo(() => getCalendarDates(viewDate), [viewDate]);

  useEffect(() => {
    const nextDate = parseSidebarDate(value ?? defaultValue) ?? new Date();

    setSelectedDate(nextDate);
    setViewDate(nextDate ?? new Date());
  }, [value, defaultValue]);

  useEffect(() => {
    const handlePointerDown = (event: MouseEvent) => {
      if (!wrapperRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
    };
  }, []);

  const handleSelectDate = (date: Date) => {
    setSelectedDate(date);
    setViewDate(date);
    setIsOpen(false);
    notifySidebarDirty();
    onChange?.({
      target: { value: formatSidebarDate(date) },
    } as ChangeEvent<HTMLInputElement>);
  };

  const shiftMonth = (amount: number) => {
    setViewDate(
      (currentDate) =>
        new Date(currentDate.getFullYear(), currentDate.getMonth() + amount, 1),
    );
  };

  return (
    <div ref={wrapperRef} className="relative">
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen((nextOpen) => !nextOpen)}
        className={cn(
          sidebarInputClassName,
          "flex w-full items-center justify-between pr-2 text-left",
          !selectedDate && "text-[#B1B6C7]",
          disabled && "cursor-not-allowed opacity-50",
          className,
        )}
      >
        <span className="min-w-0 truncate">
          {selectedDate ? formatSidebarDate(selectedDate) : "날짜 선택"}
        </span>
        <CalendarIcon className="h-[18px] w-[18px] shrink-0 text-[#8D8D8D]" />
      </button>

      {isOpen && (
        <div
          className={cn(
            "absolute left-0 z-50 w-[232px] rounded-md border border-[rgba(177,182,199,0.4)] bg-white p-3 shadow-[0px_8px_24px_-12px_rgba(31,43,87,0.35)]",
            popoverPlacement === "top"
              ? "bottom-[calc(100%+6px)]"
              : "top-[calc(100%+6px)]",
          )}
        >
          <div className="mb-3 flex items-center justify-between">
            <button
              type="button"
              onClick={() => shiftMonth(-1)}
              className="flex h-7 w-7 items-center justify-center rounded-md text-[#8D8D8D] hover:bg-[#EEF6FF] hover:text-[#1C2882]"
              aria-label="Previous month"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <div className="text-[13px] font-semibold tracking-[-0.025em] text-[#1B1B1B]">
              {viewDate.getFullYear()}년 {viewDate.getMonth() + 1}월
            </div>
            <button
              type="button"
              onClick={() => shiftMonth(1)}
              className="flex h-7 w-7 items-center justify-center rounded-md text-[#8D8D8D] hover:bg-[#EEF6FF] hover:text-[#1C2882]"
              aria-label="Next month"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          <div className="mb-1 grid grid-cols-7 text-center text-[11px] font-medium text-[#8D8D8D]">
            {["일", "월", "화", "수", "목", "금", "토"].map((weekday) => (
              <span key={weekday} className="h-6 leading-6">
                {weekday}
              </span>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {calendarDates.map((date, index) => {
              const isSelected =
                selectedDate &&
                date &&
                selectedDate.getFullYear() === date.getFullYear() &&
                selectedDate.getMonth() === date.getMonth() &&
                selectedDate.getDate() === date.getDate();

              return date ? (
                <button
                  key={date.toISOString()}
                  type="button"
                  onClick={() => handleSelectDate(date)}
                  className={cn(
                    "h-7 rounded-md text-[12px] font-medium text-[#1B1B1B] hover:bg-[#EEF6FF] hover:text-[#1C2882]",
                    isSelected && "bg-[#1C2882] text-white hover:bg-[#1C2882] hover:text-white",
                  )}
                >
                  {date.getDate()}
                </button>
              ) : (
                <span key={`empty-${index}`} className="h-7" />
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

interface SegmentedControlProps {
  options: Array<{ label: string; value: string; disabled?: boolean }>;
  value?: string;
  className?: string;
  onChange?: (value: string) => void;
}

export function SegmentedControl({
  options,
  value,
  className,
  onChange,
}: SegmentedControlProps) {
  const [selectedValue, setSelectedValue] = useState(value);

  useEffect(() => {
    setSelectedValue(value);
  }, [value]);

  return (
    <div
      className={cn(
        "flex h-[34px] w-[223px] max-w-full items-center gap-[3px] rounded-full bg-[#DDE2F2] p-1",
        className,
      )}
    >
      {options.map((option) => {
        const isActive = option.value === selectedValue;

        return (
          <button
            key={option.value}
            type="button"
            disabled={option.disabled}
            onClick={() => {
              if (option.value !== selectedValue) {
                notifySidebarDirty();
              }
              setSelectedValue(option.value);
              onChange?.(option.value);
            }}
            style={{ flexGrow: Math.max(1, option.label.length / 2.8) }}
            className={cn(
              "h-[26px] min-w-0 flex-1 whitespace-nowrap rounded-full px-1 text-[12px] font-medium leading-[26px] tracking-[-0.025em] transition-colors",
              isActive ? "bg-white text-[#1B1B1B]" : "text-[#1B1B1B]",
              option.disabled && "text-[#B1B6C7]",
            )}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}

interface ToggleGroupProps {
  options: string[];
  value?: string;
  className?: string;
  onChange?: (value: string) => void;
}

export function ToggleGroup({
  options,
  value,
  className,
  onChange,
}: ToggleGroupProps) {
  const [selectedValue, setSelectedValue] = useState(value);

  useEffect(() => {
    setSelectedValue(value);
  }, [value]);

  return (
    <div className={cn("grid gap-0.5", className)}>
      {options.map((option) => (
        <button
          key={option}
          type="button"
          onClick={() => {
            if (option !== selectedValue) {
              notifySidebarDirty();
            }
            setSelectedValue(option);
            onChange?.(option);
          }}
          className={cn(
            "h-[34px] min-w-0 whitespace-nowrap rounded-md border border-[rgba(177,182,199,0.4)] bg-white px-1 text-[12px] font-medium leading-[1.1] tracking-[-0.025em] text-[#8D8D8D]",
            option === selectedValue &&
              "border-[#1C2882] bg-[#EEF6FF] text-[#1C2882] shadow-[0px_0px_4px_0px_#1C2882]",
          )}
        >
          {option}
        </button>
      ))}
    </div>
  );
}

export function UploadDropzone() {
  return (
    <div className="flex h-[90px] flex-col items-center justify-center rounded-md border border-dashed border-[#B1B6C7] bg-[#EBEBEB] px-4 text-center">
      <Upload className="mb-2 h-6 w-6 text-[#8D8D8D]" />
      <p className="text-[13px] font-medium tracking-[-0.025em] text-[#8D8D8D]">
        클릭하여 파일 업로드 <span className="font-normal">또는</span> 드래그 앤 드롭
      </p>
      <p className="mt-1 text-[10px] font-normal tracking-[-0.025em] text-[#8D8D8D]">
        JPG, JPEG, PNG, GIF 등 (가로 400px 이상 / 용량 최대 512KB)
      </p>
    </div>
  );
}

export function PhotoStrip() {
  return (
    <div className="grid grid-cols-4 gap-2">
      {Array.from({ length: 4 }).map((_, index) => (
        <div key={index} className="h-[77px] rounded-lg bg-[#D9D9D9]" />
      ))}
    </div>
  );
}

export function SidebarTextarea(props: ComponentProps<typeof Textarea>) {
  return (
    <Textarea
      {...props}
      className={cn(
        "min-h-[86px] resize-none rounded-md border-[rgba(177,182,199,0.4)] bg-white px-2 py-2 text-[12px] font-normal tracking-[-0.025em] text-[#8D8D8D] shadow-none focus-visible:ring-1 focus-visible:ring-[#1C2882]",
        props.className,
      )}
    />
  );
}

export function SidebarActionButton(props: ComponentProps<typeof Button>) {
  return (
    <Button
      {...props}
      className={cn(
        "h-[34px] rounded-md bg-[#1C2882] px-4 text-[13px] font-semibold text-white shadow-none hover:bg-[#17216E]",
        props.className,
      )}
    />
  );
}
