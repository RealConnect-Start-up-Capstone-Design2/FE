import { ContractField } from "./ContractField";
import { ContractSection } from "./ContractSection";
import { PaymentFieldGroup } from "./PaymentFieldGroup";
import type { PropertyInfo } from "../stores/propertyStore";

interface RentalContractFormProps {
  property: PropertyInfo | null;
  onChange: (field: keyof PropertyInfo, value: string | number) => void;
  disabled?: boolean;
}

/**
 * 임대차 계약 폼 컴포넌트
 * 소유자, 임차인, 계약일, 보증금, 계약금, 중도금, 월세, 잔금 등 입력
 */
export function RentalContractForm({
  property,
  onChange,
  disabled = false,
}: RentalContractFormProps) {
  return (
    <div className="flex flex-col gap-2">
      {/* 소유자(임대인) 정보 */}
      <ContractSection className="items-center">
        <ContractField
          label="소유자(임대인)"
          value={property?.ownerName || ""}
          onChange={(value) => onChange("ownerName", value)}
          disabled={disabled}
          className="flex-1"
        />
        <ContractField
          label="소유주(임대인) 연락처"
          value={property?.ownerPhone || ""}
          onChange={(value) => onChange("ownerPhone", value)}
          disabled={disabled}
          className="flex-1"
        />
      </ContractSection>

      {/* 임차인 정보 */}
      <ContractSection className="items-center">
        <ContractField
          label="임차인"
          value={property?.tenantName || ""}
          onChange={(value) => onChange("tenantName", value)}
          disabled={disabled}
          className="flex-1"
        />
        <ContractField
          label="임차인 연락처"
          value={property?.tenantPhone || ""}
          onChange={(value) => onChange("tenantPhone", value)}
          disabled={disabled}
          className="flex-1"
        />
      </ContractSection>

      {/* 계약일 / 만기일 */}
      <ContractSection className="items-center">
        <ContractField
          label="계약일"
          type="date"
          value={property?.startDate || ""}
          onChange={(value) => onChange("startDate", value)}
          disabled={disabled}
          className="flex-1"
        />
        <ContractField
          label="만기일"
          type="date"
          value={property?.endDate || ""}
          onChange={(value) => onChange("endDate", value)}
          disabled={disabled}
          className="flex-1"
        />
      </ContractSection>

      {/* 보증금, 계약금, 중도금, 월세, 잔금 */}
      <ContractSection className="flex-col p-4">
        {/* 보증금 */}
        <div className="w-[181px]">
          <ContractField
            label="보증금"
            type="number"
            value={property?.deposit || ""}
            onChange={(value) => onChange("deposit", Number(value))}
            disabled={disabled}
            placeholder="0"
          />
        </div>

        {/* 계약금 + 계약금 지급일 */}
        <PaymentFieldGroup
          amountLabel="계약금"
          amountField="downPayment"
          amountValue={property?.downPayment || ""}
          dateLabel="계약금 지급일"
          dateField="downPaymentDate"
          dateValue={property?.downPaymentDate || ""}
          onChange={onChange}
          disabled={disabled}
        />

        {/* 중도금 + 중도금 지급일 */}
        <PaymentFieldGroup
          amountLabel="중도금"
          amountField="interimPayment"
          amountValue={property?.interimPayment || ""}
          dateLabel="중도금 지급일"
          dateField="interimPaymentDate"
          dateValue={property?.interimPaymentDate || ""}
          onChange={onChange}
          disabled={disabled}
        />

        {/* 월세 + 월세 지급일 */}
        <PaymentFieldGroup
          amountLabel="월세"
          amountField="monthPrice"
          amountValue={property?.monthPrice || ""}
          dateLabel="월세 지급일"
          dateField="monthlyPaymentDay"
          dateValue={property?.monthlyPaymentDay || ""}
          dateType="text"
          datePlaceholder="매월 25일"
          onChange={onChange}
          disabled={disabled}
        />

        {/* 잔금 + 잔금 지급일 */}
        <PaymentFieldGroup
          amountLabel="잔금"
          amountField="balance"
          amountValue={property?.balance || ""}
          dateLabel="잔금 지급일"
          dateField="balanceDate"
          dateValue={property?.balanceDate || ""}
          onChange={onChange}
          disabled={disabled}
        />
      </ContractSection>
    </div>
  );
}
