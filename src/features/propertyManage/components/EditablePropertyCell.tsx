import { useState, useEffect } from "react";
import { TableCell } from "@/components/ui";
import { Input } from "@/components/ui/input";

interface EditablePropertyCellProps {
  apartmentId: number;
  field: string;
  value?: string | number;
  isSelected: boolean;
  type?: "text" | "number" | "tel";
  placeholder?: string;
  displayValue?: string;
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
  onUpdate,
}: EditablePropertyCellProps) {
  // value가 0이거나 undefined일 때는 빈 문자열로 초기화
  const initialValue =
    value === 0 || value === undefined || value === "" ? "" : value;
  const [localValue, setLocalValue] = useState<string | number>(initialValue);

  // value가 변경되면 로컬 상태 동기화
  useEffect(() => {
    const newValue =
      value === 0 || value === undefined || value === "" ? "" : value;
    setLocalValue(newValue);
  }, [value]);

  const handleBlur = () => {
    // 값이 변경되었고 비어있지 않을 때만 업데이트
    if (localValue !== "" && localValue !== value) {
      const finalValue = type === "number" ? Number(localValue) : localValue;
      onUpdate(apartmentId, field, finalValue);
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
          className="h-8 text-sm"
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
 * 각 필드가 독립적으로 로컬 상태 관리
 */
export function EditableDepositMonthCell({
  apartmentId,
  depositValue,
  monthValue,
  isSelected,
  onUpdate,
}: EditableDepositMonthCellProps) {
  // 0이거나 undefined일 때는 빈 문자열로 표시
  const initialDeposit =
    depositValue === 0 || depositValue === undefined ? "" : depositValue;
  const initialMonth =
    monthValue === 0 || monthValue === undefined ? "" : monthValue;

  const [localDeposit, setLocalDeposit] = useState<string | number>(
    initialDeposit
  );
  const [localMonth, setLocalMonth] = useState<string | number>(initialMonth);

  useEffect(() => {
    const newDeposit =
      depositValue === 0 || depositValue === undefined ? "" : depositValue;
    setLocalDeposit(newDeposit);
  }, [depositValue]);

  useEffect(() => {
    const newMonth =
      monthValue === 0 || monthValue === undefined ? "" : monthValue;
    setLocalMonth(newMonth);
  }, [monthValue]);

  const handleDepositBlur = () => {
    if (localDeposit !== "" && localDeposit !== depositValue) {
      onUpdate(apartmentId, "deposit", Number(localDeposit));
    }
  };

  const handleMonthBlur = () => {
    if (localMonth !== "" && localMonth !== monthValue) {
      onUpdate(apartmentId, "monthPrice", Number(localMonth));
    }
  };

  const displayValue =
    depositValue || monthValue
      ? `${(depositValue || 0).toLocaleString()}/${(
          monthValue || 0
        ).toLocaleString()}`
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
            className="h-8 text-sm w-20"
            placeholder="보증금"
          />
          <span className="text-gray-400">/</span>
          <Input
            type="number"
            value={localMonth}
            onChange={(e) => setLocalMonth(e.target.value)}
            onBlur={handleMonthBlur}
            className="h-8 text-sm w-20"
            placeholder="월세"
          />
        </div>
      ) : (
        displayValue
      )}
    </TableCell>
  );
}
