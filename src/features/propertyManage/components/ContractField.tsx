import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  cn,
  formatNumberWithComma,
  parseNumberWithComma,
} from "@/shared/utils";

interface ContractFieldProps {
  label: string;
  value: string | number;
  onChange: (value: string) => void;
  type?: "text" | "number" | "date";
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

/**
 * 계약 정보 입력 필드 컴포넌트
 * 라벨 + Input으로 구성된 재사용 가능한 필드
 * number 타입일 때는 쉼표로 자릿수 구분
 */
export function ContractField({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  disabled = false,
  className,
}: ContractFieldProps) {
  // number 타입일 때만 로컬 상태로 포맷팅 처리
  const [localValue, setLocalValue] = useState<string>(() =>
    type === "number" ? formatNumberWithComma(value) : String(value || "")
  );

  // 외부에서 value가 변경되면 로컬 상태 동기화
  useEffect(() => {
    if (type === "number") {
      setLocalValue(formatNumberWithComma(value));
    } else {
      setLocalValue(String(value || ""));
    }
  }, [value, type]);

  const handleChange = (inputValue: string) => {
    if (type === "number") {
      // 숫자와 쉼표만 허용
      const sanitized = inputValue.replace(/[^\d,]/g, "");
      setLocalValue(sanitized);

      // 실제 숫자 값으로 변환하여 onChange 호출
      const parsed = parseNumberWithComma(sanitized);
      if (parsed !== undefined) {
        onChange(String(parsed));
      } else if (sanitized === "") {
        onChange("");
      }
    } else {
      setLocalValue(inputValue);
      onChange(inputValue);
    }
  };

  const handleBlur = () => {
    if (type === "number") {
      // blur 시 포맷팅 재적용
      setLocalValue(formatNumberWithComma(value));
    }
  };

  return (
    <div className={cn("flex flex-col gap-[5px]", className)}>
      <Label className="text-[13px] font-medium text-[#8D8D8D]">{label}</Label>
      <Input
        type={type === "number" ? "text" : type}
        value={localValue}
        onChange={(e) => handleChange(e.target.value)}
        onBlur={handleBlur}
        placeholder={placeholder}
        disabled={disabled}
        inputMode={type === "number" ? "numeric" : undefined}
        className="h-[34px] rounded-[6px] border border-[rgba(177,182,199,0.4)] bg-white px-2 text-[15px] font-medium text-[#8D8D8D]"
      />
    </div>
  );
}
