import { Button } from "@/shared/ui/button";

interface ActionButtonsProps {
  onClose: () => void;
  onSubmit: () => void;
  isSubmitting?: boolean;
}

export function ActionButtons({ onClose, onSubmit, isSubmitting = false }: ActionButtonsProps) {
  return (
    <div className="flex gap-[10px] mt-[40px]">
      <Button
        onClick={onClose}
        disabled={isSubmitting}
        className="flex-1 h-[42px] rounded-lg bg-[#1B1B1B] text-white text-[18px] font-semibold hover:bg-[#1B1B1B] disabled:opacity-50 disabled:cursor-not-allowed"
      >
        이전으로
      </Button>
      <Button
        onClick={onSubmit}
        disabled={isSubmitting}
        className="flex-1 h-[42px] rounded-lg bg-[#1C2882] text-white text-[18px] font-semibold hover:bg-[#1C2882] disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? "제출 중..." : "제출하기"}
      </Button>
    </div>
  );
}

