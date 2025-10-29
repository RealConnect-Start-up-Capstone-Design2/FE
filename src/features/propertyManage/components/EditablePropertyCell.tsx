import { useState, useEffect } from "react";
import { TableCell } from "@/components/ui";
import { Input } from "@/components/ui/input";
import {
  parsePrice,
  formatPriceInput,
  parseMonthPrice,
  formatMonthPrice,
  formatMonthPriceInput,
  formatPrice,
  cn,
} from "@/shared/utils";

interface EditablePropertyCellProps {
  apartmentId: number;
  field: string;
  value?: string | number;
  isSelected: boolean;
  type?: "text" | "number" | "tel";
  placeholder?: string;
  displayValue?: string;
  inputClassName?: string;
  onUpdate: (
    apartmentId: number,
    field: string,
    value: string | number
  ) => void;
}

/**
 * 편집 가능한 Property Cell 컴포넌트
 * 선택된 상태에서는 Input으로, 그렇지 않으면 값만 표시
 */
export function EditablePropertyCell({
  apartmentId,
  field,
  value,
  isSelected,
  type = "text",
  placeholder = "",
  displayValue,
  inputClassName,
  onUpdate,
}: EditablePropertyCellProps) {
  const [localValue, setLocalValue] = useState<string>(() =>
    type === "number" ? formatPriceInput(value as number) : String(value || "")
  );

  // value가 변경되면 로컬 상태 동기화
  useEffect(() => {
    if (type === "number") {
      setLocalValue(formatPriceInput(value as number));
    } else {
      setLocalValue(String(value || ""));
    }
  }, [value, type]);

  const handleBlur = () => {
    if (localValue === "") {
      return;
    }

    if (type === "number") {
      const parsedValue = parsePrice(localValue);
      if (parsedValue === undefined) {
        // 잘못된 입력이면 이전 값으로 되돌림
        setLocalValue(formatPriceInput(value as number));
        return;
      }

      // 값이 변경되지 않았으면 무시
      if (parsedValue === value) {
        setLocalValue(formatPriceInput(parsedValue));
        return;
      }

      onUpdate(apartmentId, field, parsedValue);
      setLocalValue(formatPriceInput(parsedValue));
      return;
    }

    // 텍스트나 전화번호는 그대로 전달
    if (localValue !== value) {
      onUpdate(apartmentId, field, localValue);
    }
  };

  return (
    <TableCell onClick={(e) => isSelected && e.stopPropagation()}>
      {isSelected ? (
        <Input
          type={type}
          value={localValue}
          onChange={(e) => setLocalValue(e.target.value)}
          onBlur={handleBlur}
          step={type === "number" ? 0.01 : undefined}
          inputMode={type === "number" ? "decimal" : undefined}
          className={cn("h-8 text-sm", inputClassName)}
          placeholder={placeholder}
        />
      ) : displayValue ? (
        displayValue
      ) : (
        "-"
      )}
    </TableCell>
  );
}

interface EditableDepositMonthCellProps {
  apartmentId: number;
  depositValue?: number;
  monthValue?: number;
  isSelected: boolean;
  onUpdate: (apartmentId: number, field: string, value: number) => void;
}

/**
 * 보증금/월세 편집 Cell (두 개의 Input)
 * 보증금: 억 단위 입력/표시
 * 월세: 만원 단위 입력/표시
 */
export function EditableDepositMonthCell({
  apartmentId,
  depositValue,
  monthValue,
  isSelected,
  onUpdate,
}: EditableDepositMonthCellProps) {
  // 입력 필드용 로컬 상태 (억/만원 단위)
  const [localDeposit, setLocalDeposit] = useState<string>(() =>
    formatPriceInput(depositValue)
  );
  const [localMonth, setLocalMonth] = useState<string>(() =>
    formatMonthPriceInput(monthValue)
  );

  // 서버에서 값이 변경되면 로컬 상태 동기화
  useEffect(() => {
    setLocalDeposit(formatPriceInput(depositValue));
  }, [depositValue]);

  useEffect(() => {
    setLocalMonth(formatMonthPriceInput(monthValue));
  }, [monthValue]);

  const handleDepositBlur = () => {
    if (localDeposit === "") {
      return;
    }

    const parsedValue = parsePrice(localDeposit);
    if (parsedValue === undefined) {
      // 잘못된 입력이면 이전 값으로 되돌림
      setLocalDeposit(formatPriceInput(depositValue));
      return;
    }

    // 값이 변경되지 않았으면 무시
    if (parsedValue === depositValue) {
      setLocalDeposit(formatPriceInput(parsedValue));
      return;
    }

    onUpdate(apartmentId, "deposit", parsedValue);
    setLocalDeposit(formatPriceInput(parsedValue));
  };

  const handleMonthBlur = () => {
    if (localMonth === "") {
      return;
    }

    const parsedValue = parseMonthPrice(localMonth);
    if (parsedValue === undefined) {
      // 잘못된 입력이면 이전 값으로 되돌림
      setLocalMonth(formatMonthPriceInput(monthValue));
      return;
    }

    // 값이 변경되지 않았으면 무시
    if (parsedValue === monthValue) {
      setLocalMonth(formatMonthPriceInput(parsedValue));
      return;
    }

    onUpdate(apartmentId, "monthPrice", parsedValue);
    setLocalMonth(formatMonthPriceInput(parsedValue));
  };

  // 표시용 값 (보증금: "17.94억", 월세: "500만")
  const displayValue =
    depositValue || monthValue
      ? `${formatPrice(depositValue) || "0.00억"}/${
          formatMonthPrice(monthValue) || "0만"
        }`
      : "-";

  return (
    <TableCell onClick={(e) => isSelected && e.stopPropagation()}>
      {isSelected ? (
        <div className="flex gap-1 items-center">
          <Input
            type="number"
            value={localDeposit}
            onChange={(e) => setLocalDeposit(e.target.value)}
            onBlur={handleDepositBlur}
            step={0.01}
            inputMode="decimal"
            className="h-8 text-sm w-20"
            placeholder="예: 1.5 -> 1.5억"
          />
          <span className="text-gray-400">/</span>
          <Input
            type="number"
            value={localMonth}
            onChange={(e) => setLocalMonth(e.target.value)}
            onBlur={handleMonthBlur}
            className="h-8 text-sm w-20"
            placeholder="예: 80 -> 80만"
          />
        </div>
      ) : (
        displayValue
      )}
    </TableCell>
  );
}
