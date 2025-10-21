import { useState, useEffect, useRef } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import type { ApartmentWithProperty } from "../../stores/propertyStore";
import {
  getMemoAPI,
  createMemoAPI,
  updateMemoAPI,
} from "../../services/propertyService";

interface PropertyMemoBlockProps {
  apartment?: ApartmentWithProperty;
  isOpen: boolean;
  autoSaveToken?: number;
}

/**
 * 매물 메모 블록
 * 부모로부터 apartment를 직접 받아 단순화
 */
export function PropertyMemoBlock({
  apartment,
  isOpen,
  autoSaveToken = 0,
}: PropertyMemoBlockProps) {
  const queryClient = useQueryClient();
  const [memo, setMemo] = useState("");
  const [isSaved, setIsSaved] = useState(false);
  const lastAutoSaveTokenRef = useRef<number>(0);

  // 메모 조회
  const { data: memoData, isLoading: isMemoLoading } = useQuery({
    queryKey: ["memo", apartment?.apartmentId],
    queryFn: () => getMemoAPI(apartment!.apartmentId),
    enabled: isOpen && !!apartment?.apartmentId,
    retry: (failureCount, error: unknown) => {
      // 404 에러(메모 없음)는 재시도 안함
      if (error && typeof error === "object" && "response" in error) {
        const response = (error as { response: { status: number } }).response;
        if (response?.status === 404) {
          return false;
        }
      }
      return failureCount < 3;
    },
  });
  useEffect(() => {
    if (memoData?.content) {
      setMemo(memoData.content);
    } else {
      setMemo("");
    }
    setIsSaved(false);
  }, [apartment?.apartmentId, memoData?.content]);

  // 메모 저장 mutation (생성 또는 수정)
  const memoMutation = useMutation({
    mutationFn: async ({
      apartmentId,
      content,
      isUpdate,
    }: {
      apartmentId: number;
      content: string;
      isUpdate: boolean;
    }) => {
      if (isUpdate) {
        return await updateMemoAPI(apartmentId, content);
      } else {
        return await createMemoAPI(apartmentId, content);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["memo", apartment?.apartmentId],
      });
      queryClient.invalidateQueries({ queryKey: ["apartments"] });
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 3000);
    },
    onError: (error: unknown) => {
      let errorMessage = "메모 저장에 실패했습니다.";

      if (error && typeof error === "object" && "response" in error) {
        const response = (error as { response: { data: { message?: string } } })
          .response;
        if (response?.data?.message) {
          errorMessage = response.data.message;
        }
      }

      alert(errorMessage);
    },
  });
  const { mutate: mutateMemo, isPending: isMemoSaving } = memoMutation;

  const handleSave = () => {
    if (!apartment) return;

    const savedMemo = memoData?.content || "";
    const isUpdate = !!memoData; // 기존 메모가 있으면 수정, 없으면 생성

    if (memo !== savedMemo) {
      mutateMemo({
        apartmentId: apartment.apartmentId,
        content: memo,
        isUpdate,
      });
    }
  };

  // 사이드바가 닫힐 때 자동 저장
  useEffect(() => {
    if (!apartment) {
      return;
    }

    if (autoSaveToken === 0) {
      lastAutoSaveTokenRef.current = 0;
      return;
    }

    if (lastAutoSaveTokenRef.current === autoSaveToken || isMemoSaving) {
      return;
    }

    const savedMemo = memoData?.content || "";

    lastAutoSaveTokenRef.current = autoSaveToken;

    if (memo === savedMemo) {
      return;
    }

    const isUpdate = !!memoData; // 기존 메모가 있으면 수정, 없으면 생성

    mutateMemo({
      apartmentId: apartment.apartmentId,
      content: memo,
      isUpdate,
    });
  }, [
    apartment,
    memo,
    memoData,
    mutateMemo,
    autoSaveToken,
    isMemoSaving,
  ]);

  const savedMemo = memoData?.content || "";
  const isChanged = memo !== savedMemo && !isSaved;

  // 아파트가 선택되지 않았을 때
  if (!apartment) {
    return (
      <section className="space-y-2">
        <Label className="block">메모장</Label>
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
      <Label className="block">메모장</Label>
      <div className="grid w-full gap-2">
        {isMemoLoading && isOpen ? (
          <div className="min-h-[200px] flex items-center justify-center bg-gray-50 rounded-md border border-gray-200">
            <p className="text-gray-400">메모를 불러오는 중...</p>
          </div>
        ) : (
          <Textarea
            placeholder="메모를 입력하세요"
            value={memo}
            onChange={(e) => {
              setMemo(e.target.value);
              setIsSaved(false);
            }}
            className="min-h-[200px]"
          />
        )}
        <Button
          onClick={handleSave}
          disabled={!isChanged || isMemoSaving || isMemoLoading}
          style={{
            backgroundColor: isSaved
              ? "#B1B6C7"
              : isChanged
              ? "#1C2882"
              : "#B1B6C7",
          }}
          className="w-full text-white hover:opacity-90"
        >
          {isMemoSaving
            ? "저장 중..."
            : isSaved
            ? "저장됨"
            : "저장하기"}
        </Button>
      </div>
    </section>
  );
}
