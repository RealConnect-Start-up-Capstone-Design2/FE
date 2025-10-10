interface SidebarToggleButtonProps {
  isOpen: boolean;
  onClick: () => void;
}

/**
 * 사이드바 토글 버튼 (책갈피 스타일)
 * Figma 디자인: 28px × 127px
 */
export function SidebarToggleButton({
  isOpen,
  onClick,
}: SidebarToggleButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group fixed z-50 transition-all duration-300 ease-in-out"
      style={{
        width: "28px",
        height: "127px",
        top: "160px", // Layout padding(52px) + PageHeader(72px) + gap(12px) + 1.5rem(24px)
        right: isOpen ? "480px" : "0", // 사이드바 너비만큼
        transform: isOpen ? "translateX(28px)" : "translateX(0)", // 책갈피처럼 왼쪽으로 튀어나옴
      }}
      aria-label={isOpen ? "카드 닫기" : "카드 열기"}
    >
      <div
        className="relative h-full w-full"
        style={{
          backgroundColor: "#1C2882",
          borderRadius: "0px 6px 100px 0px",
        }}
      >
        {/* 화살표 아이콘 */}
        <div className="absolute left-1/2 top-[15px] -translate-x-1/2">
          <svg
            width="16"
            height="10"
            viewBox="0 0 16 10"
            fill="none"
            className="transition-transform duration-200"
            style={{
              transform: isOpen ? "rotate(-90deg)" : "rotate(90deg)",
            }}
          >
            <path
              d="M1 1L8 8L15 1"
              stroke="white"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        {/* 텍스트 (세로) */}
        <div
          className="absolute left-1/2 top-[35px] -translate-x-1/2 select-none"
          style={{
            fontFamily: "Pretendard",
            fontWeight: 600,
            fontSize: "15px",
            lineHeight: "1em",
            letterSpacing: "-0.025em",
            color: "white",
            writingMode: "vertical-rl",
            textOrientation: "upright",
          }}
        >
          {isOpen ? "카드닫기" : "카드열기"}
        </div>
      </div>
    </button>
  );
}
