import type { MainComplexModalProps } from "@/shared/types/complex";
import { ComplexItem } from "./ComplexItem";
import { useMainComplexModal } from "./useMainComplexModal";

export function MainComplexModal(props: MainComplexModalProps) {
  const { isOpen, onClose } = props;

  const {
    complexItems,
    sidoOptions,
    savingItemMap,
    isSaving,
    handleFieldChange,
    handleSaveItem,
    handleDeleteItem,
    handleFinalSave,
  } = useMainComplexModal(props);

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
                sidoOptions={sidoOptions}
                isSaving={Boolean(savingItemMap[item.id])}
              />
            ))}
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="px-[50px] py-8 flex justify-end gap-3">
          {/* 취소 버튼 없앰 */}
          {/* <button
            onClick={handleCancel}
            className="w-[97px] h-[41px] bg-black text-white rounded-lg text-lg font-semibold"
          >
            취소
          </button> */}
          <button
            onClick={handleFinalSave}
            disabled={isSaving}
            className="w-[97px] h-[41px] bg-[#1C2882] text-white rounded-lg text-lg font-semibold disabled:opacity-50"
          >
            {isSaving ? "저장중..." : "완료"}
          </button>
        </div>
      </div>
    </div>
  );
}
