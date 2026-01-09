import { Button } from "@/components/ui/button";
import { LABEL_STYLE } from "../ProfileEditModal/constants";
import { openNaverAddressSearch } from "@/shared/utils/naverAddressSearch";

interface CertificationFormSectionProps {
  formData: {
    representativeName: string;
    address1: string;
    address2: string;
    address3: string;
    officeName: string;
    officePhone: string;
    businessNumber: string;
    registrationNumber: string;
    sigunguCode: string;
    roadNameAddressCode: string;
  };
  onInputChange: (field: string, value: string) => void;
}

export function CertificationFormSection({
  formData,
  onInputChange,
}: CertificationFormSectionProps) {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-[12px]">
        <label className={`${LABEL_STYLE} text-black`}>대표자 성명</label>
        <input
          type="text"
          value={formData.representativeName}
          readOnly
          placeholder="대표자 성명"
          className={`w-full h-[48px] px-[15px] rounded-lg bg-[#EDEDED] border-0 text-[15px] font-medium text-[#8D8D8D] focus:outline-none`}
        />
      </div>

      <div className="flex flex-col gap-[12px]">
        <label className={`${LABEL_STYLE} text-black`}>
          중개사무소 주소
        </label>
        <div className="flex flex-col gap-[10px]">
          <div className="flex gap-[10px]">
            <input
              type="text"
              value={formData.address1}
              readOnly
              onClick={() => {
                openNaverAddressSearch((data) => {
                  onInputChange("address1", data.roadAddress);
                  onInputChange("address2", data.jibunAddress);
                  onInputChange("sigunguCode", data.sigunguCode || "");
                  onInputChange("roadNameAddressCode", data.roadNameAddressCode || data.roadAddress || "");
                });
              }}
              placeholder="도로명주소"
              className={`flex-1 h-[48px] px-[15px] rounded-lg border border-[rgba(177,182,199,0.4)] bg-white text-[15px] font-medium text-[#8D8D8D] focus:outline-none cursor-pointer`}
            />
            <Button
              onClick={() => {
                openNaverAddressSearch((data) => {
                  onInputChange("address1", data.roadAddress);
                  onInputChange("address2", data.jibunAddress);
                  onInputChange("sigunguCode", data.sigunguCode || "");
                  onInputChange("roadNameAddressCode", data.roadNameAddressCode || data.roadAddress || "");
                });
              }}
              className="w-[138px] h-[48px] rounded-lg bg-[#1B1B1B] text-white text-[15px] font-semibold hover:bg-[#1B1B1B]"
            >
              주소 검색
            </Button>
          </div>
          <input
            type="text"
            value={formData.address2}
            readOnly
            onClick={() => {
              openNaverAddressSearch((data) => {
                onInputChange("address1", data.roadAddress);
                onInputChange("address2", data.jibunAddress);
                onInputChange("sigunguCode", data.sigunguCode || "");
                onInputChange("roadNameAddressCode", data.roadNameAddressCode || "");
              });
            }}
            placeholder="지번주소"
            className={`w-full h-[48px] px-[15px] rounded-lg border border-[rgba(177,182,199,0.4)] bg-white text-[15px] font-medium text-[#8D8D8D] focus:outline-none cursor-pointer`}
          />
          <input
            type="text"
            value={formData.address3}
            onChange={(e) => onInputChange("address3", e.target.value)}
            placeholder="상세 주소 입력"
            className={`w-full h-[48px] px-[15px] rounded-lg border border-[rgba(177,182,199,0.4)] bg-white text-[15px] font-medium text-[#8D8D8D] focus:outline-none focus:ring-2 focus:ring-[#1C2882]`}
          />
        </div>
      </div>

      <div className="flex flex-col gap-[12px]">
        <label className={`${LABEL_STYLE} text-black`}>상호명</label>
        <input
          type="text"
          value={formData.officeName}
          onChange={(e) => onInputChange("officeName", e.target.value)}
          placeholder="상호명 입력"
          className={`w-full h-[48px] px-[15px] rounded-lg border border-[rgba(177,182,199,0.4)] bg-white text-[15px] font-medium text-[#8D8D8D] focus:outline-none focus:ring-2 focus:ring-[#1C2882]`}
        />
      </div>

      <div className="flex flex-col gap-[12px]">
        <label className={`${LABEL_STYLE} text-black`}>사업장 대표 전화번호</label>
        <input
          type="text"
          value={formData.officePhone}
          onChange={(e) => {
            const value = e.target.value.replace(/[^0-9]/g, "");
            onInputChange("officePhone", value);
          }}
          placeholder="'-'없이 숫자만 입력"
          className={`w-full h-[48px] px-[15px] rounded-lg border border-[rgba(177,182,199,0.4)] bg-white text-[15px] font-medium text-[#8D8D8D] focus:outline-none focus:ring-2 focus:ring-[#1C2882]`}
        />
      </div>

      <div className="flex flex-col gap-[12px]">
        <label className={`${LABEL_STYLE} text-black`}>사업자 등록번호</label>
        <input
          type="text"
          value={formData.businessNumber}
          onChange={(e) => onInputChange("businessNumber", e.target.value)}
          placeholder="사업자 등록번호 입력"
          className={`w-full h-[48px] px-[15px] rounded-lg border border-[rgba(177,182,199,0.4)] bg-white text-[15px] font-medium text-[#8D8D8D] focus:outline-none focus:ring-2 focus:ring-[#1C2882]`}
        />
      </div>

      <div className="flex flex-col gap-[12px]">
        <label className={`${LABEL_STYLE} text-black`}>중개사무소 개설 등록번호</label>
        <input
          type="text"
          value={formData.registrationNumber}
          onChange={(e) => onInputChange("registrationNumber", e.target.value)}
          placeholder="중개사무소 등록번호 입력"
          className={`w-full h-[48px] px-[15px] rounded-lg border border-[rgba(177,182,199,0.4)] bg-white text-[15px] font-medium text-[#8D8D8D] focus:outline-none focus:ring-2 focus:ring-[#1C2882]`}
        />
      </div>
    </div>
  );
}

