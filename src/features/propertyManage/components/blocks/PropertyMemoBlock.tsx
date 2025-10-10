import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import type { ApartmentWithProperty } from "../../stores/propertyStore";
import { updatePropertyMemo } from "../../stores/propertyStore";

interface PropertyMemoBlockProps {
  apartment?: ApartmentWithProperty;
}

/**
 * 매물 메모 블록
 * 부모로부터 apartment를 직접 받아 단순화
 */
export function PropertyMemoBlock({ apartment }: PropertyMemoBlockProps) {
  const queryClient = useQueryClient();
  const savedMemo = apartment?.property?.memo || "";
  const [memo, setMemo] = useState(savedMemo);
  const [isSaved, setIsSaved] = useState(false);

  // apartment가 변경되면 메모 초기화
  useEffect(() => {
    setMemo(savedMemo);
    setIsSaved(false);
  }, [apartment?.apartmentId, savedMemo]);

  // 메모 저장 mutation
  const memoMutation = useMutation({
    mutationFn: async ({
      apartmentId,
      memo,
    }: {
      apartmentId: number;
      memo: string;
    }) => {
      // TODO: API 연동 시 아래로 교체
      // return await updatePropertyMemoAPI(apartmentId, memo);

      updatePropertyMemo(apartmentId, memo);
      return { apartmentId, memo };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["apartments"] });
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 3000);
    },
    onError: (error) => {
      console.error("메모 저장 실패:", error);
      alert("메모 저장에 실패했습니다.");
    },
  });

  const handleSave = () => {
    if (apartment && memo !== savedMemo) {
      memoMutation.mutate({ apartmentId: apartment.apartmentId, memo });
    }
  };

  const isChanged = memo !== savedMemo && !isSaved;

  // 아파트가 선택되지 않았을 때
  if (!apartment) {
    return (
      <section className="space-y-2">
        <Label>메모장</Label>
        <div className="grid w-full gap-2">
          <div className="min-h-[200px] flex items-center justify-center bg-gray-50 rounded-md border border-gray-200">
            <p className="text-gray-400">아파트를 선택해주세요.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="space-y-2">
      <Label>메모장</Label>
      <div className="grid w-full gap-2">
        <Textarea
          placeholder="메모를 입력하세요"
          value={memo}
          onChange={(e) => {
            setMemo(e.target.value);
            setIsSaved(false);
          }}
          className="min-h-[200px]"
        />
        <Button
          onClick={handleSave}
          disabled={!isChanged || memoMutation.isPending}
          style={{
            backgroundColor: isSaved
              ? "#B1B6C7"
              : isChanged
              ? "#1C2882"
              : "#B1B6C7",
          }}
          className="text-white hover:opacity-90"
        >
          {isSaved ? "저장됨" : "저장하기"}
        </Button>
      </div>
    </section>
  );
}
