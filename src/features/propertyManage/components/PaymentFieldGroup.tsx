import { ContractField } from "./ContractField";
import type { ContractInfo } from "../types";

interface PaymentFieldGroupProps {
  amountLabel: string;
  amountField: keyof Omit<ContractInfo, "apartmentId">;
  amountValue: string | number;
  dateLabel: string;
  dateField: keyof Omit<ContractInfo, "apartmentId">;
  dateValue: string | number;
  dateType?: "date" | "text";
  datePlaceholder?: string;
  onChange: (
    field: keyof Omit<ContractInfo, "apartmentId">,
    value: string | number
  ) => void;
  disabled?: boolean;
}

/**
 * 금액 + 지급일 필드 그룹 컴포넌트
 * 계약금/중도금/잔금/월세 등에서 반복되는 패턴을 통일
 */
export function PaymentFieldGroup({
  amountLabel,
  amountField,
  amountValue,
  dateLabel,
  dateField,
  dateValue,
  dateType = "date",
  datePlaceholder,
  onChange,
  disabled = false,
}: PaymentFieldGroupProps) {
  return (
    <div className="flex w-full items-end gap-[23px]">
      <div className="w-[181px]">
        <ContractField
          label={amountLabel}
          type="number"
          value={amountValue || ""}
          onChange={(value) => onChange(amountField, Number(value))}
          disabled={disabled}
          placeholder="0"
        />
      </div>
      <div className="w-[181px]">
        <ContractField
          label={dateLabel}
          type={dateType}
          value={dateValue || ""}
          onChange={(value) => onChange(dateField, value)}
          disabled={disabled}
          placeholder={datePlaceholder}
        />
      </div>
    </div>
  );
}
