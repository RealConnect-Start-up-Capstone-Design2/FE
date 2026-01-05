import { useState } from "react";
import { TermsItem } from "@/features/auth/components/TermsItem";
import { type AgreementState } from "@/features/auth/types";

interface TermsAgreementStepProps {
  onAgree: (agreements: AgreementState) => void;
}

export function TermsAgreementStep({ onAgree }: TermsAgreementStepProps) {
  const [agreements, setAgreements] = useState<AgreementState>({
    all: false,
    termsOfService: false,
    privacyPolicy: false,
    marketingConsent: false,
  });

  const handleAllCheck = () => {
    const newValue = !agreements.all;
    setAgreements({
      all: newValue,
      termsOfService: newValue,
      privacyPolicy: newValue,
      marketingConsent: newValue,
    });
  };

  const handleIndividualCheck = (key: keyof Omit<AgreementState, "all">) => {
    const newAgreements = { ...agreements, [key]: !agreements[key] };
    // 모든 항목이 체크되면 전체 동의도 체크
    newAgreements.all =
      newAgreements.termsOfService &&
      newAgreements.privacyPolicy &&
      newAgreements.marketingConsent;
    setAgreements(newAgreements);
  };

  const canProceed = agreements.termsOfService && agreements.privacyPolicy;

  return (
    <div className="mx-auto w-full max-w-[586px] rounded-xl border border-[#DDE2F2] bg-white p-10 shadow-[0_0_25px_-10px_#B1B6C7]">
      <h2 className="mb-2 text-left text-[28px] font-bold text-[#222A3A]">
        중개사 서비스 이용을 위해
        <br />
        동의가 필요해요
      </h2>
      <p className="mb-10 text-left text-xl text-[#8D8D8D]">
        아래 약관에 동의해주세요
      </p>

      {/* 전체 동의 */}
      <div className="border-b-2 border-gray-300 py-4">
        <label className="flex cursor-pointer items-center gap-3">
          <input
            type="checkbox"
            checked={agreements.all}
            onChange={handleAllCheck}
            className="h-6 w-6 cursor-pointer rounded border-gray-300 text-brand focus:ring-brand"
          />
          <span className="text-lg font-semibold text-[#222A3A]">
            전체 동의
          </span>
        </label>
      </div>

      {/* 개별 약관 */}
      <div className="divide-y divide-gray-200">
        <TermsItem
          type="service"
          title="APT NOTE 중개사 회원 이용 약관 동의"
          checked={agreements.termsOfService}
          onCheck={() => handleIndividualCheck("termsOfService")}
          required
        />
        <TermsItem
          type="privacy"
          title="APT NOTE 중개사 회원 개인정보처리방침"
          checked={agreements.privacyPolicy}
          onCheck={() => handleIndividualCheck("privacyPolicy")}
          required
        />
        {/* TODO: 마케팅 정보 수신 동의 체크했을 경우 서버에 전달하는 로직 추가해야 함 */}
        <TermsItem
          type="marketing"
          title="마케팅 정보 수신 동의"
          checked={agreements.marketingConsent}
          onCheck={() => handleIndividualCheck("marketingConsent")}
        />
      </div>

      {/* 동의 후 가입하기 버튼 */}
      <button
        onClick={() => onAgree(agreements)}
        disabled={!canProceed}
        className="mt-8 h-[42px] w-full rounded-md bg-brand text-lg font-semibold text-white transition-colors hover:bg-[#151F65] disabled:cursor-not-allowed disabled:opacity-50"
      >
        동의 후 가입하기
      </button>
    </div>
  );
}
