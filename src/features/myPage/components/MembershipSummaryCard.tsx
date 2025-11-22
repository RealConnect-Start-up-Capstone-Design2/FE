import { Label } from "@/components/ui/label";
import { cn } from "@/shared/utils";
import RepeatIcon from "@/assets/Repeat.svg";
import CancelIcon from "@/assets/Cancel.svg";
import NaverIcon from "@/assets/icons/naver.svg";
import DabangIcon from "@/assets/icons/dabang.svg";
import YoutubeIcon from "@/assets/icons/youtube.svg";

interface MembershipSummaryCardProps {
  className?: string;
}

export function MembershipSummaryCard({
  className,
}: MembershipSummaryCardProps) {
  const handleComingSoon = () => {
    alert("추후 추가 예정입니다.");
  };

  return (
    <div
      className={cn(
        "w-full rounded-lg border border-[#DDE2F2] bg-white shadow-[0_12px_24px_-12px_rgba(15,23,42,0.25)]",
        className
      )}
    >
      <div className="flex flex-col p-[30px]">
        <div className="flex items-center gap-2">
          <p className="text-[24px] font-semibold text-[#1B1B1B]">내 멤버십</p>
          <Label className="flex h-5 w-[46px] items-center justify-center rounded-full bg-[#EDEDED] text-[12px] font-medium text-[#989898]">
            Basic
          </Label>
        </div>

        <div className="mt-[30px] flex flex-row gap-4">
          <div className="flex flex-1 basis-[38.1%] min-w-[220px] flex-col rounded-lg bg-[#1B1B1B] py-[28px] px-[30px]">
            <p className="font-semibold text-[15px] text-[#FFFFFF]">
              사용중인 멤버십
            </p>
            <div className="mt-5 flex items-center justify-between">
              <p className="font-bold text-[24px]">
                <span className="text-[#8D8D8D]">Basic</span>{" "}
                <span className="text-[#FFFFFF]">멤버</span>
              </p>
              <p className="text-[24px] text-[#FFFFFF]">
                <span className="font-bold">1,500</span>{" "}
                <span className="font-semibold text-[15px]">원/월</span>
              </p>
            </div>
          </div>
          <div className="flex flex-1 basis-[20.1%] min-w-[160px] flex-col rounded-lg bg-[#1C2882] py-[28px] px-[24px]">
            <button
              type="button"
              onClick={handleComingSoon}
              className="flex w-full items-center justify-between"
            >
              <img src={RepeatIcon} alt="반복" className="h-[19px] w-[19px]" />
              <span className="font-semibold text-[15px] text-[#FFFFFF]">
                멤버십 변경하기
              </span>
            </button>
            <button
              type="button"
              onClick={handleComingSoon}
              className="mt-[28px] flex w-full items-center justify-between"
            >
              <img src={CancelIcon} alt="취소" className="h-6 w-6" />
              <span className="font-semibold text-[15px] text-[#FFFFFF]">
                멤버십 취소하기
              </span>
            </button>
          </div>
          <div className="flex flex-1 basis-[41.8%] min-w-[220px] flex-col rounded-lg border-2 border-[#1B1B1B] bg-[#FFFFFF] py-[28px] px-[30px]">
            <p className="font-semibold text-[15px] text-[#1B1B1B]">
              내 노출 채널
            </p>
            <div className="mt-[19px] flex flex-row items-center justify-between flex-wrap">
              <div className="flex items-center gap-3 flex-shrink-0">
                <img
                  src={NaverIcon}
                  alt="네이버"
                  className="h-[30px] w-[30px]"
                />
                <span className="whitespace-nowrap font-bold text-[20px] text-[#03C75A]">
                  네이버
                </span>
              </div>
              <div className="flex items-center gap-3 flex-shrink-0">
                <img
                  src={DabangIcon}
                  alt="다방"
                  className="h-[30px] w-[30px]"
                />
                <span className="whitespace-nowrap font-bold text-[20px] text-[#326CF9]">
                  다방
                </span>
              </div>
              <div className="flex items-center gap-3 flex-shrink-0">
                <img
                  src={YoutubeIcon}
                  alt="유튜브"
                  className="h-[30px] w-[30px]"
                />
                <span className="whitespace-nowrap font-bold text-[20px] text-[#8D8D8D]">
                  유튜브
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
