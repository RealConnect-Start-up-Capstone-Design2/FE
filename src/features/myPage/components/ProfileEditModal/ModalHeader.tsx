import CancelIcon from "@/assets/Cancel.svg";

interface ModalHeaderProps {
  onClose: () => void;
}

export function ModalHeader({ onClose }: ModalHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-[48px]">
      <h2 className="text-[24px] font-semibold text-black">프로필 수정</h2>
      <button
        onClick={onClose}
        className="w-[33.92px] h-[33.92px] flex items-center justify-center flex-shrink-0"
      >
        <img
          src={CancelIcon}
          alt="닫기"
          className="w-6 h-6"
          style={{
            filter:
              "brightness(0) saturate(100%) invert(8%) sepia(0%) saturate(0%) hue-rotate(0deg) brightness(100%) contrast(100%)",
          }}
        />
      </button>
    </div>
  );
}

