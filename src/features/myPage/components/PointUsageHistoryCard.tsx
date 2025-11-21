import { useState } from "react";
import { cn } from "@/shared/utils";
import NaverSquareIcon from "@/assets/NaverSquare.svg";

interface PointUsageHistoryCardProps {
  className?: string;
}

export function PointUsageHistoryCard({
  className,
}: PointUsageHistoryCardProps) {
  const [selectedPeriod, setSelectedPeriod] = useState("전체");

  const periods = ["전체", "1개월 전", "3개월 전", "6개월 전"];

  const tableData = Array(8).fill({
    date: "2025. 10. 31 06:12",
    item: "네이버 매물전송",
    amount: "-1,900원",
    remark: "노출채널 : 리얼커넥트 부동산",
  });

  return (
    <div
      className={cn(
        "w-full rounded-lg border border-[#DDE2F2] bg-white shadow-[0_12px_24px_-12px_rgba(15,23,42,0.25)]",
        className
      )}
    >
      <div className="flex flex-col p-[30px]">
        <p className="text-[24px] font-semibold text-[#1B1B1B]">
          포인트 사용 내역
        </p>

        <div className="mt-[30px] flex items-center gap-2">
          {periods.map((period) => (
            <button
              key={period}
              type="button"
              onClick={() => setSelectedPeriod(period)}
              className={cn(
                "rounded-md border px-[14px] py-[10px] text-[15px] font-medium",
                selectedPeriod === period
                  ? "border-[rgba(177,182,199,0.4)] bg-[#1C2882] text-white"
                  : "border-[rgba(177,182,199,0.4)] bg-transparent text-[#8D8D8D]"
              )}
            >
              {period}
            </button>
          ))}

          <div className="ml-auto flex items-center gap-2">
            <div className="relative flex items-center rounded-md border border-[rgba(177,182,199,0.4)] bg-white px-[14px] py-[10px]">
              <span className="text-[15px] font-medium text-[#8D8D8D]">
                2025. 10. 31
              </span>
              <svg
                className="ml-2 h-[18px] w-[18px] text-[#8D8D8D]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
            <span className="text-[15px] font-medium text-[#1B1B1B]">~</span>
            <div className="relative flex items-center rounded-md border border-[rgba(177,182,199,0.4)] bg-white px-[14px] py-[10px]">
              <span className="text-[15px] font-medium text-[#8D8D8D]">
                2026. 10. 31
              </span>
              <svg
                className="ml-2 h-[18px] w-[18px] text-[#8D8D8D]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
            <button
              type="button"
              className="rounded-md bg-[#EDEDED] px-[14px] py-[10px] text-[15px] font-medium text-[#8D8D8D]"
            >
              조회
            </button>
          </div>
        </div>

        <div className="mt-[30px]">
          <div className="rounded-lg bg-[#EDEDED]">
            <div className="grid grid-cols-4 gap-4 border-b border-[rgba(177,182,199,0.4)] px-[30px] py-[12px]">
              <div className="text-center text-[15px] font-medium text-[#8D8D8D]">
                거래일시
              </div>
              <div className="text-center text-[15px] font-medium text-[#8D8D8D]">
                거래항목
              </div>
              <div className="text-center text-[15px] font-medium text-[#8D8D8D]">
                거래금액
              </div>
              <div className="text-center text-[15px] font-medium text-[#8D8D8D]">
                비고
              </div>
            </div>

            {tableData.map((row, index) => (
              <div
                key={index}
                className="grid grid-cols-4 gap-4 border-b border-[rgba(177,182,199,0.4)] bg-[#FFFFFF] px-[30px] py-[22px] last:border-b-0"
              >
                <div className="text-center text-[13px] font-medium text-[#1B1B1B]">
                  {row.date}
                </div>
                <div className="flex items-center justify-center gap-2">
                  <div className="flex h-[22px] w-[22px] items-center justify-center rounded bg-[#03C75A]">
                    <img
                      src={NaverSquareIcon}
                      alt="네이버"
                      className="h-4 w-4"
                    />
                  </div>
                  <span className="text-[13px] font-medium text-[#1B1B1B]">
                    {row.item}
                  </span>
                </div>
                <div className="text-center text-[13px] font-medium text-[#1B1B1B]">
                  {row.amount}
                </div>
                <div className="text-center text-[13px] font-medium text-[#1B1B1B]">
                  {row.remark}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
