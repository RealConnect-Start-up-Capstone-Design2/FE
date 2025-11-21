import CancelIcon from "@/assets/Cancel.svg";

interface ModalHeaderProps {
  onClose: () => void;
}

export function ModalHeader({ onClose }: ModalHeaderProps) {
  return (
    <div>
      <div className="flex items-center justify-between mb-[7px]">
        <h2 className="text-[28px] font-semibold text-black leading-[1.19] tracking-[-0.025em]">
          중개사 회원 인증
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
      <p className="text-[20px] font-medium text-[#8D8D8D] leading-[1.19] tracking-[-0.025em] mb-[40px]">
        사업자 정보를 통해 중개사 회원 자격을 인증하세요
      </p>
    </div>
  );
}

