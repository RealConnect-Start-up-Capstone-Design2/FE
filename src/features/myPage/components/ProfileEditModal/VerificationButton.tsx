import { Button } from "@/components/ui/button";

interface VerificationButtonProps {
  onClick: () => void;
  className?: string;
  disabled?: boolean;
  isCodeSent?: boolean;
  countdown?: string;
}

export function VerificationButton({
  onClick,
  className = "w-[94px] h-[38px]",
  disabled = false,
  isCodeSent = false,
  countdown,
}: VerificationButtonProps) {
  return (
    <Button
      onClick={onClick}
      disabled={disabled || isCodeSent}
      className={`${className} rounded-md text-[15px] font-semibold disabled:opacity-100 disabled:cursor-not-allowed ${
        isCodeSent
          ? "bg-[#EDEDED] text-[#8D8D8D] hover:bg-[#EDEDED]"
          : "bg-[#1B1B1B] text-white hover:bg-[#1B1B1B]"
      } ${disabled && !isCodeSent ? "opacity-50" : ""}`}
    >
      {disabled && !isCodeSent
        ? "발송 중..."
        : isCodeSent
        ? countdown || "01:00"
        : "인증하기"}
    </Button>
  );
}

