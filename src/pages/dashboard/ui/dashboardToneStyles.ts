export const toneStyles = {
  primary: {
    text: "text-[#1C2882]",
    bg: "bg-[#E8EDFF]",
    border: "border-[#C8D2FF]",
    solid: "bg-[#1C2882]",
  },
  danger: {
    text: "text-[#EA3B3B]",
    bg: "bg-[#FFEAEA]",
    border: "border-[#FFD0D0]",
    solid: "bg-[#EA3B3B]",
  },
  warning: {
    text: "text-[#A36A00]",
    bg: "bg-[#FFF4D6]",
    border: "border-[#FFE2A8]",
    solid: "bg-[#F5A623]",
  },
  success: {
    text: "text-[#197B50]",
    bg: "bg-[#E7F8EF]",
    border: "border-[#C2EBD4]",
    solid: "bg-[#2DA66F]",
  },
} as const;

export type DashboardTone = keyof typeof toneStyles;
