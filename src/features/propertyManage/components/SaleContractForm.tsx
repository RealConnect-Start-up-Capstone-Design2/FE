import { ContractField } from "./ContractField";
import { ContractSection } from "./ContractSection";
import { PaymentFieldGroup } from "./PaymentFieldGroup";
import type { ContractInfo } from "../types";

interface SaleContractFormProps {
  contract: ContractInfo | null;
  onChange: (
    field: keyof Omit<ContractInfo, "apartmentId">,
    value: string | number
  ) => void;
  disabled?: boolean;
}

/**
 * 매매 계약 폼 컴포넌트
 * 소유자(매도인), 매수인, 계약일, 보증금, 계약금, 중도금, 월세, 잔금 등 입력
 */
export function SaleContractForm({
  contract,
  onChange,
  disabled = false,
}: SaleContractFormProps) {
  return (
    <div className="flex flex-col gap-2">
      {/* 갑(매도인) 정보 */}
      <ContractSection className="items-center">
        <ContractField
          label="소유자(매도인)"
          value={contract?.gapName || ""}
          onChange={(value) => onChange("gapName", value)}
          disabled={disabled}
          className="flex-1"
        />
        <ContractField
          label="소유자(매도인) 연락처"
          value={contract?.gapPhone || ""}
          onChange={(value) => onChange("gapPhone", value)}
          disabled={disabled}
          className="flex-1"
        />
      </ContractSection>

      {/* 을(매수인) 정보 */}
      <ContractSection className="items-center">
        <ContractField
          label="매수인"
          value={contract?.eulName || ""}
          onChange={(value) => onChange("eulName", value)}
          disabled={disabled}
          className="flex-1"
        />
        <ContractField
          label="매수인 연락처"
          value={contract?.eulPhone || ""}
          onChange={(value) => onChange("eulPhone", value)}
          disabled={disabled}
          className="flex-1"
        />
      </ContractSection>

      {/* 계약일, 입주일 */}
      <ContractSection>
        <ContractField
          label="계약일"
          type="date"
          value={contract?.contractDate || ""}
          onChange={(value) => onChange("contractDate", value)}
          disabled={disabled}
          className="w-[181px]"
        />
        <ContractField
          label="입주일"
          type="date"
          value={contract?.moveInDate || ""}
          onChange={(value) => onChange("moveInDate", value)}
          disabled={disabled}
          className="flex-1"
        />
      </ContractSection>

      {/* 매매대금, 계약금, 중도금, 잔금 */}
      <ContractSection className="flex-col p-4">
        <ContractField
          label="매매대금"
          type="number"
          value={contract?.salePrice ?? ""}
          onChange={(value) => onChange("salePrice", Number(value))}
          disabled={disabled}
          className="w-[181px]"
        />

        {/* 계약금 + 계약금 지급일 */}
        <PaymentFieldGroup
          amountLabel="계약금"
          amountField="downPayment"
          amountValue={contract?.downPayment || ""}
          dateLabel="계약금 지급일"
          dateField="downPaymentDueDate"
          dateValue={contract?.downPaymentDueDate || ""}
          onChange={onChange}
          disabled={disabled}
        />

        {/* 중도금 + 중도금 지급일 */}
        <PaymentFieldGroup
          amountLabel="중도금"
          amountField="interimPayment"
          amountValue={contract?.interimPayment || ""}
          dateLabel="중도금 지급일"
          dateField="interimPaymentDueDate"
          dateValue={contract?.interimPaymentDueDate || ""}
          onChange={onChange}
          disabled={disabled}
        />

        {/* 잔금 + 잔금 지급일 */}
        <PaymentFieldGroup
          amountLabel="잔금"
          amountField="balance"
          amountValue={contract?.balance || ""}
          dateLabel="잔금 지급일"
          dateField="balanceDueDate"
          dateValue={contract?.balanceDueDate || ""}
          onChange={onChange}
          disabled={disabled}
        />
      </ContractSection>
    </div>
  );
}
