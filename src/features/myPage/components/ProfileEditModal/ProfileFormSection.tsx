import { FormField } from "./FormField";
import { VerificationButton } from "./VerificationButton";
import { INPUT_STYLE, LABEL_STYLE } from "./constants";

interface ProfileFormSectionProps {
  formData: {
    name: string;
    contact: string;
    email: string;
    blogLink: string;
    homepage: string;
  };
  onInputChange: (field: string, value: string) => void;
}

export function ProfileFormSection({
  formData,
  onInputChange,
}: ProfileFormSectionProps) {
  return (
    <div className="flex-1 flex flex-col gap-[30px]">
      <FormField
        label="이름"
        name="name"
        value={formData.name}
        onChange={onInputChange}
        className="w-full"
      />
      <div className="flex flex-col gap-[12px]">
        <label className={LABEL_STYLE}>연락처</label>
        <div className="flex gap-[12px]">
          <input
            type="text"
            value={formData.contact}
            onChange={(e) => {
              const value = e.target.value.replace(/[^0-9]/g, "");
              onInputChange("contact", value);
            }}
            placeholder="010-1234-5678"
            className={`flex-1 ${INPUT_STYLE}`}
          />
          <VerificationButton
            onClick={() => alert("추후 추가 예정입니다.")}
          />
        </div>
      </div>
      <FormField
        label="이메일"
        name="email"
        value={formData.email}
        onChange={onInputChange}
        type="email"
        className="w-full"
      />
      <FormField
        label="블로그 링크"
        name="blogLink"
        value={formData.blogLink}
        onChange={onInputChange}
        className="w-full"
      />
      <FormField
        label="중개사 홈페이지"
        name="homepage"
        value={formData.homepage}
        onChange={onInputChange}
        className="w-full"
      />
    </div>
  );
}

