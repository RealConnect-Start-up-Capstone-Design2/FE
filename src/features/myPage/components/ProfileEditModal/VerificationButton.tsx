import { Button } from "@/components/ui/button";

interface VerificationButtonProps {
  onClick: () => void;
  className?: string;
}

export function VerificationButton({
  onClick,
  className = "w-[94px] h-[38px]",
}: VerificationButtonProps) {
  return (
    <Button
      onClick={onClick}
      className={`${className} rounded-md bg-[#1B1B1B] text-white text-[15px] font-semibold hover:bg-[#1B1B1B]`}
    >
      인증하기
    </Button>
  );
}

