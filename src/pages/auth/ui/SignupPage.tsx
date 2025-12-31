import { useState } from "react";
import { SignupForm } from "@/features/auth";
import { TermsAgreementStep } from "@/features/auth/components";
import { type AgreementState } from "@/features/auth/types";

export function SignupPage() {
  const [step, setStep] = useState<"terms" | "form">("terms");
  // TODO: 추후 마케팅 정보 수신 동의를 서버로 전송할 때 사용
  const [, setAgreedTerms] = useState<AgreementState>({
    all: false,
    termsOfService: false,
    privacyPolicy: false,
    marketingConsent: false,
  });

  return (
    <div className="flex min-h-screen items-center justify-center py-10">
      {step === "terms" && (
        <TermsAgreementStep
          onAgree={(agreements) => {
            setAgreedTerms(agreements);
            setStep("form");
          }}
        />
      )}
      {step === "form" && (
        <div className="relative w-full">
          <SignupForm />
        </div>
      )}
    </div>
  );
}
