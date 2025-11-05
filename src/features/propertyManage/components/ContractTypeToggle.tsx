import { cn } from "@/shared/utils";
import type { ContractType } from "../stores/contractStore";

interface ContractTypeToggleProps {
  value: ContractType;
  onChange: (value: ContractType) => void;
  disabled?: boolean;
}

/**
 * 계약 타입 토글 컴포넌트
 * 임대차 계약 / 매매 계약 선택
 */
export function ContractTypeToggle({
  value,
  onChange,
  disabled = false,
}: ContractTypeToggleProps) {
  return (
    <div className="inline-flex items-center gap-1 rounded-full bg-[#E8EDFF] p-1">
      <button
        type="button"
        onClick={() => onChange("LEASE")}
        disabled={disabled}
        className={cn(
          "rounded-full px-4 py-[6px] text-[12px] font-medium transition-colors",
          value === "LEASE"
            ? "bg-white text-black"
            : "bg-transparent text-black hover:bg-white/50"
        )}
      >
        매매 계약
      </button>
      <button
        type="button"
        onClick={() => onChange("SALE")}
        disabled={disabled}
        className={cn(
          "rounded-full px-4 py-[6px] text-[12px] font-medium transition-colors",
          value === "SALE"
            ? "bg-white text-black"
            : "bg-transparent text-black hover:bg-white/50"
        )}
      >
        전세 계약
      </button>
      <button
        type="button"
        onClick={() => onChange("MONTHLY")}
        disabled={disabled}
        className={cn(
          "rounded-full px-4 py-[6px] text-[12px] font-medium transition-colors",
          value === "MONTHLY"
            ? "bg-white text-black"
            : "bg-transparent text-black hover:bg-white/50"
        )}
      >
        월세 계약
      </button>
    </div>
  );
}
