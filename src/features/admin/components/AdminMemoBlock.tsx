import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

interface AdminMemoBlockProps {
  memberId?: string;
}

export function AdminMemoBlock({ memberId }: AdminMemoBlockProps) {
  const [memo, setMemo] = useState("");

  const handleSave = () => {
    if (!memberId) return;
    // TODO: API 연동
    console.log("메모 저장:", { memberId, content: memo });
    alert("메모가 저장되었습니다.");
  };

  return (
    <section className="space-y-3">
      <Label className="block text-[20px] font-medium leading-[1.193] tracking-[-0.025em] text-[#1B1B1B]">
        메모장
      </Label>
      <div className="space-y-3">
        <Textarea
          placeholder="메모를 입력하세요"
          value={memo}
          onChange={(e) => setMemo(e.target.value)}
          className="min-h-[320px] border-[#B1B6C7] text-[15px] font-medium leading-[1.193] tracking-[-0.025em] text-[#1B1B1B] placeholder:text-[#989898] resize-none"
        />
        <Button
          onClick={handleSave}
          disabled={!memo.trim()}
          className="w-[122px] h-[41px] bg-[#1C2882] hover:bg-[#1C2882]/90 disabled:bg-[#B1B6C7] text-white text-[18px] font-semibold leading-[1.193] tracking-[-0.025em] ml-auto block rounded-lg"
        >
          저장
        </Button>
      </div>
    </section>
  );
}
