import { FormField } from "@/components/ui/form-field";
import { SECTION_TITLE_STYLE } from "./constants";
import { formatPhoneNumber } from "@/shared/utils";

interface OfficeInfoSectionProps {
  formData: {
    officeName: string;
    officePhone: string;
    address: string;
  };
  onInputChange: (field: string, value: string) => void;
}

export function OfficeInfoSection({
  formData,
  onInputChange,
}: OfficeInfoSectionProps) {
  return (
    <div className="mt-[50px]">
      <h3 className={SECTION_TITLE_STYLE}>사무실 정보</h3>

      <div className="flex flex-row gap-[40px] mt-[30px]">
        <div className="flex flex-col flex-1">
          <FormField
            label="상호명"
            name="officeName"
            value={formData.officeName}
            onChange={onInputChange}
            disabled={true}
            className="w-full"
          />
          <div className="mt-[21px]">
            <FormField
              label="대표 전화번호"
              name="officePhone"
              value={formatPhoneNumber(formData.officePhone) || ""}
              onChange={onInputChange}
              disabled={true}
              className="w-full"
            />
          </div>
        </div>

        <div className="flex flex-col flex-1">
          <FormField
            label="사업장 주소"
            name="address"
            value={formData.address}
            onChange={onInputChange}
            disabled={true}
            className="w-full"
          />
        </div>
      </div>
    </div>
  );
}

