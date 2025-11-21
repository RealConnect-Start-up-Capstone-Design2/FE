import { Button } from "@/components/ui/button";

interface ActionButtonsProps {
  onClose: () => void;
  onSubmit: () => void;
}

export function ActionButtons({ onClose, onSubmit }: ActionButtonsProps) {
  return (
    <div className="flex gap-[10px] mt-[40px]">
      <Button
        onClick={onClose}
        className="flex-1 h-[42px] rounded-lg bg-[#1B1B1B] text-white text-[18px] font-semibold hover:bg-[#1B1B1B]"
      >
        이전으로
      </Button>
      <Button
        onClick={onSubmit}
        className="flex-1 h-[42px] rounded-lg bg-[#1C2882] text-white text-[18px] font-semibold hover:bg-[#1C2882]"
      >
        제출하기
      </Button>
    </div>
  );
}

