import CancelIcon from "@/assets/Cancel.svg";

interface ModalHeaderProps {
  title: string;
  description?: string;
  onClose: () => void;
}

export function ModalHeader({ title, description, onClose }: ModalHeaderProps) {
  return (
    <div>
      <div className={`flex items-center justify-between ${description ? "mb-[7px]" : "mb-[48px]"}`}>
        <h2 className={`${description ? "text-[28px]" : "text-[24px]"} font-semibold text-black ${description ? "leading-[1.19] tracking-[-0.025em]" : ""}`}>
          {title}
        </h2>
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
      {description && (
        <p className="text-[20px] font-medium text-[#8D8D8D] leading-[1.19] tracking-[-0.025em] mb-[40px]">
          {description}
        </p>
      )}
    </div>
  );
}

