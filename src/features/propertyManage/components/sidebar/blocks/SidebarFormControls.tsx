import { Calendar, Upload } from "lucide-react";
import { Input, Textarea, DropdownMenu, Button } from "@/shared/ui";
import { cn } from "@/shared/utils";
import type { DropdownOption } from "@/shared/ui/dropdown-menu";
import type { ComponentProps, ReactNode } from "react";
import { useEffect, useState } from "react";

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
  "h-[34px] rounded-md border-[#1C2882] bg-[#EEF6FF] px-2 text-[15px] font-medium tracking-[-0.025em] text-[#1C2882] shadow-[0px_0px_4px_0px_#1C2882] placeholder:text-[#1C2882] focus-visible:ring-1 focus-visible:ring-[#1C2882]";

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
  onChange?: (value: string) => void;
}

export function SidebarSelect({
  placeholder = "선택",
  value,
  options,
  className,
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
        onChange?.(nextValue);
      }}
      className={cn("w-full", className)}
      buttonClassName="h-[34px] rounded-md border border-[rgba(177,182,199,0.4)] bg-white px-2 py-0 text-[15px] font-medium tracking-[-0.025em] text-[#8D8D8D] shadow-none focus:ring-1 focus:ring-[#1C2882] [&_svg]:h-[18px] [&_svg]:w-[18px] [&_svg]:text-[#8D8D8D]"
      listClassName="border-[rgba(177,182,199,0.4)] bg-white text-[13px]"
      optionClassName="text-[#8D8D8D] hover:bg-[#EEF6FF] hover:text-[#1C2882]"
      selectedTextColor="text-[#8D8D8D]"
      placeholderTextColor="text-[#8D8D8D]"
    />
  );
}

interface DateInputProps extends ComponentProps<typeof Input> {
  value?: string;
}

export function DateInput({ className, ...props }: DateInputProps) {
  return (
    <div className="relative">
      <Input
        type="text"
        {...props}
        className={cn(sidebarInputClassName, "pr-8", className)}
      />
      <Calendar className="pointer-events-none absolute right-2 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-[#8D8D8D]" />
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
        "flex w-full items-center gap-[5px] rounded-full bg-[#DDE2F2] p-1",
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
              setSelectedValue(option.value);
              onChange?.(option.value);
            }}
            className={cn(
              "min-w-0 flex-1 whitespace-nowrap rounded-full px-2 text-[12px] font-medium leading-[26px] tracking-[-0.025em] transition-colors",
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
