import { useState, useEffect } from "react";
import { DropdownMenu } from "@/components/ui/dropdown-menu";
import { cn } from "@/shared/utils";
import type {
  ComplexData,
  MainComplexItem,
  MainComplexModalProps,
  RegionOption,
} from "@/shared/types/complex";

// 더미 데이터 - 실제 API로 대체해야 함
// TODO: API 엔드포인트에서 가져오도록 변경
const SIDO_OPTIONS: RegionOption[] = [
  { label: "서울", value: "서울" },
  { label: "경기", value: "경기" },
  { label: "인천", value: "인천" },
  { label: "부산", value: "부산" },
  { label: "대구", value: "대구" },
];

const SIGUNGU_OPTIONS: Record<string, RegionOption[]> = {
  서울: [
    { label: "강남구", value: "강남구" },
    { label: "강동구", value: "강동구" },
    { label: "강북구", value: "강북구" },
    { label: "송파구", value: "송파구" },
  ],
  경기: [
    { label: "수원시", value: "수원시" },
    { label: "성남시", value: "성남시" },
    { label: "고양시", value: "고양시" },
  ],
};

const EUPMYEONDONG_OPTIONS: Record<string, RegionOption[]> = {
  강남구: [
    { label: "역삼동", value: "역삼동" },
    { label: "삼성동", value: "삼성동" },
    { label: "대치동", value: "대치동" },
  ],
  송파구: [
    { label: "신천동", value: "신천동" },
    { label: "잠실동", value: "잠실동" },
    { label: "방이동", value: "방이동" },
  ],
};

const COMPLEX_OPTIONS: Record<string, RegionOption[]> = {
  신천동: [
    { label: "파크리오", value: "파크리오" },
    { label: "트리지움", value: "트리지움" },
    { label: "리센츠", value: "리센츠" },
  ],
  역삼동: [
    { label: "래미안", value: "래미안" },
    { label: "아크로", value: "아크로" },
  ],
};

export function MainComplexModal({
  isOpen,
  onClose,
  onSave,
  initialData,
}: MainComplexModalProps) {
  const [complexItems, setComplexItems] = useState<MainComplexItem[]>([]);
  const [originalData, setOriginalData] = useState<MainComplexItem[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  // 초기 데이터 설정
  useEffect(() => {
    if (isOpen) {
      const items: MainComplexItem[] = Array.from({ length: 5 }, (_, i) => ({
        id: i + 1,
        sido: initialData?.[i]?.sido || "",
        sigungu: initialData?.[i]?.sigungu || "",
        eupmyeondong: initialData?.[i]?.eupmyeondong || "",
        complex: initialData?.[i]?.complex || "",
        isDirty: false,
      }));
      setComplexItems(items);
      setOriginalData(JSON.parse(JSON.stringify(items)));
    }
  }, [isOpen, initialData]);

  const handleFieldChange = (
    id: number,
    field: keyof ComplexData,
    value: string
  ) => {
    setComplexItems((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;

        const updated = { ...item, [field]: value, isDirty: true };

        // 상위 필드가 변경되면 하위 필드 초기화
        if (field === "sido") {
          updated.sigungu = "";
          updated.eupmyeondong = "";
          updated.complex = "";
        } else if (field === "sigungu") {
          updated.eupmyeondong = "";
          updated.complex = "";
        } else if (field === "eupmyeondong") {
          updated.complex = "";
        }

        return updated;
      })
    );
  };

  const handleSaveItem = async (id: number) => {
    const item = complexItems.find((c) => c.id === id);
    if (!item) return;

    // 모든 필드가 채워져 있는지 확인
    if (!item.sido || !item.sigungu || !item.eupmyeondong || !item.complex) {
      alert("모든 항목을 선택해주세요.");
      return;
    }

    // 개별 저장 로직 (실제 API 호출)
    try {
      // TODO: 실제 API 호출
      console.log("Saving item:", item);

      // 저장 완료 후 isDirty 초기화
      setComplexItems((prev) =>
        prev.map((c) => (c.id === id ? { ...c, isDirty: false } : c))
      );

      // originalData도 업데이트
      setOriginalData((prev) =>
        prev.map((c) => (c.id === id ? { ...item, isDirty: false } : c))
      );

      alert(`주거래 단지 ${id}이(가) 저장되었습니다.`);
    } catch (error) {
      console.error("Failed to save item:", error);
      alert("저장에 실패했습니다.");
    }
  };

  const handleDeleteItem = (id: number) => {
    // 원래 데이터로 되돌리기
    const original = originalData.find((item) => item.id === id);
    if (original) {
      setComplexItems((prev) =>
        prev.map((item) => (item.id === id ? { ...original } : item))
      );
    }
  };

  const handleFinalSave = async () => {
    setIsSaving(true);
    try {
      // 빈 항목이 아닌 것만 필터링
      const validComplexes = complexItems
        .filter(
          (item) =>
            item.sido && item.sigungu && item.eupmyeondong && item.complex
        )
        .map(({ sido, sigungu, eupmyeondong, complex }) => ({
          sido,
          sigungu,
          eupmyeondong,
          complex,
        }));

      await onSave(validComplexes);
      onClose();
    } catch (error) {
      console.error("Failed to save:", error);
      alert("저장에 실패했습니다.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" onClick={handleCancel} />

      {/* Modal Content */}
      <div className="relative z-[101] w-[750px] h-[720px] bg-white rounded-lg shadow-[0px_4px_25px_1px_rgba(0,0,0,0.25)] flex flex-col">
        {/* Header */}
        <div className="px-[50px] pt-[50px] pb-6">
          <h2 className="text-2xl font-semibold text-black">단지 추가</h2>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 px-[50px] overflow-y-auto">
          <div className="flex flex-col gap-[30px] pb-[30px]">
            {complexItems.map((item) => (
              <ComplexItem
                key={item.id}
                item={item}
                onFieldChange={handleFieldChange}
                onSave={handleSaveItem}
                onDelete={handleDeleteItem}
              />
            ))}
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="px-[50px] py-8 flex justify-end gap-3">
          <button
            onClick={handleCancel}
            className="w-[97px] h-[41px] bg-black text-white rounded-lg text-lg font-semibold"
          >
            취소
          </button>
          <button
            onClick={handleFinalSave}
            disabled={isSaving}
            className="w-[97px] h-[41px] bg-[#1C2882] text-white rounded-lg text-lg font-semibold disabled:opacity-50"
          >
            {isSaving ? "저장중..." : "저장하기"}
          </button>
        </div>
      </div>
    </div>
  );
}

interface ComplexItemProps {
  item: MainComplexItem;
  onFieldChange: (id: number, field: keyof ComplexData, value: string) => void;
  onSave: (id: number) => void;
  onDelete: (id: number) => void;
}

function ComplexItem({
  item,
  onFieldChange,
  onSave,
  onDelete,
}: ComplexItemProps) {
  const isFilled =
    item.sido && item.sigungu && item.eupmyeondong && item.complex;
  const canSave = isFilled && item.isDirty;

  const sigunguOptions = item.sido ? SIGUNGU_OPTIONS[item.sido] || [] : [];
  const eupmyeondongOptions = item.sigungu
    ? EUPMYEONDONG_OPTIONS[item.sigungu] || []
    : [];
  const complexOptions = item.eupmyeondong
    ? COMPLEX_OPTIONS[item.eupmyeondong] || []
    : [];

  return (
    <div className="w-full h-[122px]">
      {/* Title */}
      <div className="mb-3">
        <h3
          className={cn(
            "text-xl font-medium",
            isFilled ? "text-[#1C2882]" : "text-[#1C2882]"
          )}
        >
          주거래 단지 {item.id}
        </h3>
      </div>

      {/* Dropdowns and Buttons Container */}
      <div className="flex gap-3">
        {/* Left: Dropdowns Column */}
        <div className="flex flex-col gap-[10px]">
          {/* Dropdowns Row 1 */}
          <div className="flex gap-3">
            <DropdownMenu
              placeholder="시/도"
              options={SIDO_OPTIONS}
              value={item.sido}
              onChange={(value) => onFieldChange(item.id, "sido", value)}
              buttonClassName="w-[165px] h-[38px] rounded-md border border-[#B1B6C7] bg-white px-3 text-[15px] font-medium"
              className="w-[165px]"
              selectedTextColor="text-[#1B1B1B]"
              placeholderTextColor="text-[#989898]"
            />
            <DropdownMenu
              placeholder="시/군/구"
              options={sigunguOptions}
              value={item.sigungu}
              onChange={(value) => onFieldChange(item.id, "sigungu", value)}
              disabled={!item.sido}
              buttonClassName="w-[165px] h-[38px] rounded-md border border-[#B1B6C7] bg-white px-3 text-[15px] font-medium"
              className="w-[165px]"
              selectedTextColor="text-[#1B1B1B]"
              placeholderTextColor="text-[#989898]"
            />
            <DropdownMenu
              placeholder="읍/면/동"
              options={eupmyeondongOptions}
              value={item.eupmyeondong}
              onChange={(value) =>
                onFieldChange(item.id, "eupmyeondong", value)
              }
              disabled={!item.sigungu}
              buttonClassName="w-[165px] h-[38px] rounded-md border border-[#B1B6C7] bg-white px-3 text-[15px] font-medium"
              className="w-[165px]"
              selectedTextColor="text-[#1B1B1B]"
              placeholderTextColor="text-[#989898]"
            />
          </div>

          {/* Dropdowns Row 2 */}
          <div>
            <DropdownMenu
              placeholder="단지"
              options={complexOptions}
              value={item.complex}
              onChange={(value) => onFieldChange(item.id, "complex", value)}
              disabled={!item.eupmyeondong}
              buttonClassName="w-[519px] h-[38px] rounded-md border border-[#B1B6C7] bg-white px-3 text-[15px] font-medium"
              className="w-[519px]"
              selectedTextColor="text-[#1B1B1B]"
              placeholderTextColor="text-[#989898]"
            />
          </div>
        </div>

        {/* Right: Buttons Column - 세로 배치 */}
        <div className="flex flex-col gap-[10px] pl-[10px]">
          <button
            onClick={() => onSave(item.id)}
            disabled={!canSave}
            className={cn(
              "w-[94px] h-[38px] rounded-md text-[15px] font-medium",
              canSave
                ? "bg-[#1B1B1B] text-white"
                : "bg-[#EDEDED] text-[#8D8D8D]"
            )}
          >
            저장
          </button>
          <button
            onClick={() => onDelete(item.id)}
            className="w-[94px] h-[38px] rounded-md border border-[#D9D9D9] bg-white text-[#8D8D8D] text-[15px] font-medium"
          >
            삭제
          </button>
        </div>
      </div>
    </div>
  );
}
