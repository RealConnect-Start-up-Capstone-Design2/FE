import { useParams, useNavigate } from "react-router-dom";
import termsOfService from "@/features/auth/terms/terms-of-service.md?raw";
import privacyPolicy from "@/features/auth/terms/privacy-policy.md?raw";
import marketingConsent from "@/features/auth/terms/marketing-consent.md?raw";
import { MarkdownRenderer } from "@/shared/components/MarkdownRenderer";

export function TermsDetailPage() {
  const { type } = useParams<{ type: "service" | "privacy" | "marketing" }>();
  const navigate = useNavigate();

  const termsContent = {
    service: {
      title: "서비스 이용약관",
      content: termsOfService,
    },
    privacy: {
      title: "개인정보처리방침",
      content: privacyPolicy,
    },
    marketing: {
      title: "마케팅 정보 수신 동의",
      content: marketingConsent,
    },
  };

  const currentTerms = type ? termsContent[type] : null;

  if (!currentTerms) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>약관을 찾을 수 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <header className="sticky top-0 z-10 border-b border-gray-200 bg-white shadow-sm">
        <div className="mx-auto flex max-w-4xl items-center px-6 py-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-600 transition-colors hover:text-gray-900"
          >
            <span className="text-xl">←</span>
            <span className="font-medium">뒤로</span>
          </button>
          <h1 className="ml-6 text-lg font-bold text-[#222A3A]">
            {currentTerms.title}
          </h1>
        </div>
      </header>

      {/* 약관 내용 */}
      <main className="mx-auto max-w-4xl p-6">
        <div className="rounded-lg bg-white p-8 shadow-sm">
          <MarkdownRenderer content={currentTerms.content} />
        </div>
      </main>
    </div>
  );
}
