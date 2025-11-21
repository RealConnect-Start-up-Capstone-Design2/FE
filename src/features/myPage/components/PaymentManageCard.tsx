import { cn } from "@/shared/utils";
import PlusIcon from "@/assets/Plus.svg";
import DollarIcon from "@/assets/Dollar.svg";
import NaverWhiteIcon from "@/assets/NaverWhite.svg";
import DatabaseIcon from "@/assets/Database.svg";
import CirclePlusIcon from "@/assets/CirclePlus.svg";

interface PaymentManageCardProps {
  className?: string;
}

export function PaymentManageCard({ className }: PaymentManageCardProps) {
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
        <p className="text-[24px] font-semibold text-[#1B1B1B]">결제 관리</p>

        <div className="mt-[30px] flex flex-row gap-4">
          <div className="flex flex-1 basis-[38.1%] min-w-[220px] flex-col rounded-lg border-2 border-[#1C2882] bg-[#FFFFFF] py-[28px] px-[30px]">
            <p className="font-semibold text-[15px] text-[#1B1B1B]">
              포인트 잔액
            </p>
            <div className="mt-5 flex items-center justify-between">
              <p className="text-[24px] text-[#1B1B1B]">
                <span className="font-bold text-[#1C2882]">123,100</span>{" "}
                <span className="font-semibold text-[15px]">원</span>
              </p>
              <p className="font-medium text-[15px] text-[#8D8D8D]">
                (자동 충전 미사용)
              </p>
            </div>
          </div>
          <div className="flex flex-1 basis-[20.1%] min-w-[160px] flex-col rounded-lg bg-[#1C2882] py-[28px] px-[24px]">
            <button
              type="button"
              onClick={handleComingSoon}
              className="flex w-full items-center justify-between"
            >
              <img src={PlusIcon} alt="더하기" className="h-4 w-4" />
              <span className="font-semibold text-[15px] text-[#FFFFFF]">
                포인트 충전하기
              </span>
            </button>
            <button
              type="button"
              onClick={handleComingSoon}
              className="mt-[28px] flex w-full items-center justify-between"
            >
              <img src={DollarIcon} alt="달러" className="h-[19px] w-[19px]" />
              <span className="font-semibold text-[15px] text-[#FFFFFF]">
                자동 충전 등록하기
              </span>
            </button>
          </div>
          <div className="flex flex-1 basis-[41.8%] min-w-[220px] flex-row gap-[15px]">
            <div className="flex flex-1 flex-col rounded-lg bg-[#03C75A] py-[28px] px-[24px]">
              <div className="flex items-center">
                <p className="font-semibold text-[15px] text-[#FFFFFF]">
                  네이버 광고 전송
                </p>
                <img
                  src={NaverWhiteIcon}
                  alt="네이버"
                  className="ml-[10px] h-[30px] w-[30px]"
                />
              </div>
              <p className="mt-5 text-[24px] text-[#FFFFFF]">
                <span className="font-bold">123</span>{" "}
                <span className="font-semibold text-[15px]">건</span>
              </p>
            </div>
            <div className="flex flex-1 flex-col rounded-lg bg-[#1499FF] py-[28px] px-[24px]">
              <div className="flex items-center">
                <p className="font-semibold text-[15px] text-[#FFFFFF]">
                  주거래 단지 수
                </p>
                <img
                  src={DatabaseIcon}
                  alt="데이터베이스"
                  className="ml-[10px] h-[30px] w-[30px]"
                />
              </div>
              <div className="mt-5 flex items-center">
                <p className="text-[24px] text-[#FFFFFF]">
                  <span className="font-bold">10</span>{" "}
                  <span className="font-semibold text-[15px]">개</span>
                </p>
                <img
                  src={CirclePlusIcon}
                  alt="원형 플러스"
                  className="ml-[10px] h-[30px] w-[30px]"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
