import { Button } from "@/components/ui/button";

interface SaveButtonProps {
  onClick: () => void;
}

export function SaveButton({ onClick }: SaveButtonProps) {
  return (
    <div className="flex justify-end mt-[30px]">
      <Button
        onClick={onClick}
        className="w-[122px] h-[41px] rounded-lg bg-[#1C2882] text-white text-[18px] font-semibold hover:bg-[#1C2882]"
      >
        저장
      </Button>
    </div>
  );
}

