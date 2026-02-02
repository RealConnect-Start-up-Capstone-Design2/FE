import { ContractField } from "./ContractField";
import { ContractSection } from "./ContractSection";
import { PaymentFieldGroup } from "./PaymentFieldGroup";
import type { ContractInfo } from "../types";

interface RentalContractFormProps {
  contract: ContractInfo | null;
  defaultOwnerName?: string;
  defaultOwnerPhone?: string;
  defaultJeonsePayment?: number;
  onChange: (
    field: keyof Omit<ContractInfo, "apartmentId">,
    value: string | number
  ) => void;
  disabled?: boolean;
}

/**
 * 전세 계약 입력 폼
 */
export function RentalContractForm({
  contract,
  defaultOwnerName,
  defaultOwnerPhone,
  defaultJeonsePayment,
  onChange,
  disabled = false,
}: RentalContractFormProps) {
  const ownerNameValue = contract?.gapName || defaultOwnerName || "";
  const ownerPhoneValue = contract?.gapPhone || defaultOwnerPhone || "";
  const jeonsePaymentValue =
    contract?.jeonsePayment ??
    (defaultJeonsePayment !== undefined ? defaultJeonsePayment : "");

  return (
    <div className="flex flex-col gap-2">
      <ContractSection className="items-center">
        <ContractField
          label="소유자(임대인)"
          value={ownerNameValue}
          onChange={(value) => onChange("gapName", value)}
          disabled={disabled}
          className="flex-1"
        />
        <ContractField
          label="소유자(임대인) 연락처"
          value={ownerPhoneValue}
          onChange={(value) => onChange("gapPhone", value)}
          disabled={disabled}
          className="flex-1"
        />
      </ContractSection>

      <ContractSection className="items-center">
        <ContractField
          label="임차인"
          value={contract?.eulName || ""}
          onChange={(value) => onChange("eulName", value)}
          disabled={disabled}
          className="flex-1"
        />
        <ContractField
          label="임차인 연락처"
          value={contract?.eulPhone || ""}
          onChange={(value) => onChange("eulPhone", value)}
          disabled={disabled}
          className="flex-1"
        />
      </ContractSection>

      <ContractSection className="items-center">
        <ContractField
          label="계약일"
          type="date"
          value={contract?.contractDate || ""}
          onChange={(value) => onChange("contractDate", value)}
          disabled={disabled}
          className="flex-1"
        />
        <ContractField
          label="만기일"
          type="date"
          value={contract?.expireDate || ""}
          onChange={(value) => onChange("expireDate", value)}
          disabled={disabled}
          className="flex-1"
        />
      </ContractSection>

      <ContractSection className="flex-col gap-4 p-4">
        <PaymentFieldGroup
          amountLabel="전세금"
          amountField="jeonsePayment"
          amountValue={jeonsePaymentValue}
          dateLabel="전세금 지급일"
          dateField="jeonsePaymentDueDate"
          dateValue={contract?.jeonsePaymentDueDate || ""}
          onChange={onChange}
          disabled={disabled}
        />

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
