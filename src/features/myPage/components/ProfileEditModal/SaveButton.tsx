import { Button } from "@/components/ui/button";

interface SaveButtonProps {
  onClick: () => void;
  disabled?: boolean;
  isLoading?: boolean;
}

export function SaveButton({
  onClick,
  disabled = false,
  isLoading = false,
}: SaveButtonProps) {
  return (
    <div className="flex justify-end mt-[30px]">
      <Button
        onClick={onClick}
        disabled={disabled || isLoading}
        className="w-[122px] h-[41px] rounded-lg bg-[#1C2882] text-white text-[18px] font-semibold hover:bg-[#1C2882] disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? "저장 중..." : "저장"}
      </Button>
    </div>
  );
}

