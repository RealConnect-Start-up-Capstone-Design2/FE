import LockIcon from "@/assets/Lock.svg";
import { VerificationButton } from "./VerificationButton";
import { INPUT_STYLE, SECTION_TITLE_STYLE } from "./constants";

export function PasswordChangeSection() {
  return (
    <div className="mt-[50px]">
      <h3 className={SECTION_TITLE_STYLE}>비밀번호 변경</h3>
      <div className="mt-[27px] flex justify-center">
        <img src={LockIcon} alt="자물쇠" />
      </div>
      <p className="mt-[32px] text-[20px] font-medium text-[#1C2882] text-center">
        휴대폰 인증이 필요합니다
      </p>
      <div className="mt-[22px] flex justify-center gap-[12px]">
        <input
          type="text"
          placeholder="010-1234-5678"
          className={`w-[199px] ${INPUT_STYLE}`}
        />
        <VerificationButton
          onClick={() => alert("추후 추가 예정입니다.")}
          className="w-[94px] h-[41px] rounded-lg"
        />
      </div>
    </div>
  );
}

