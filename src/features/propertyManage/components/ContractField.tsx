import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/shared/utils";

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
  return (
    <div className={cn("flex flex-col gap-[5px]", className)}>
      <Label className="text-[13px] font-medium text-[#8D8D8D]">{label}</Label>
      <Input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className="h-[34px] rounded-[6px] border border-[rgba(177,182,199,0.4)] bg-white px-2 text-[15px] font-medium text-[#8D8D8D]"
      />
    </div>
  );
}
