import { Button } from "@/components/ui/button";
import { FormField } from "./FormField";
import { SaveButton } from "./SaveButton";
import { INPUT_STYLE, LABEL_STYLE, SECTION_TITLE_STYLE } from "./constants";

interface OfficeInfoSectionProps {
  formData: {
    officeName: string;
    officePhone: string;
    address1: string;
    address2: string;
    address3: string;
  };
  onInputChange: (field: string, value: string) => void;
  onSave: () => void;
}

export function OfficeInfoSection({
  formData,
  onInputChange,
  onSave,
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
            className="w-full"
          />
          <div className="mt-[21px]">
            <FormField
              label="대표 전화번호"
              name="officePhone"
              value={formData.officePhone}
              onChange={onInputChange}
              className="w-full"
            />
          </div>
        </div>

        <div className="flex flex-col gap-[12px] flex-1">
          <label className={LABEL_STYLE}>사업장 주소</label>
          <div className="flex gap-[12px]">
            <input
              type="text"
              value={formData.address1}
              readOnly
              onClick={() => alert("추후 추가 예정입니다.")}
              className={`flex-1 ${INPUT_STYLE} cursor-pointer`}
            />
            <Button
              onClick={() => alert("추후 추가 예정입니다.")}
              className="w-[94px] h-[38px] rounded-md bg-[#1B1B1B] text-white text-[15px] font-semibold hover:bg-[#1B1B1B]"
            >
              주소 검색
            </Button>
          </div>
          <input
            type="text"
            value={formData.address2}
            readOnly
            onClick={() => alert("추후 추가 예정입니다.")}
            className={`w-full ${INPUT_STYLE} cursor-pointer`}
          />
          <input
            type="text"
            value={formData.address3}
            readOnly
            onClick={() => alert("추후 추가 예정입니다.")}
            className={`w-full ${INPUT_STYLE} cursor-pointer`}
          />
        </div>
      </div>

      <SaveButton onClick={onSave} />
    </div>
  );
}

