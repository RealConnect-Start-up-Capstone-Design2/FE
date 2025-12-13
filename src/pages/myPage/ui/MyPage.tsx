import { PageHeader } from "@/components/common/PageHeader";
import {
  MembershipSummaryCard,
  PaymentManageCard,
  PointUsageHistoryCard,
  ProfileSummaryCard,
} from "@/features/myPage";

export function MyPage() {
  return (
    <div className="flex h-full flex-col gap-[46px]">
      <PageHeader
        title="마이페이지"
        description="구독중인 멤버십 정보, 내 프로필 등을 보여줍니다"
        titleClassName="pb-[7px] text-[#1C2882]"
      />

      <div className="flex flex-1 flex-row items-stretch gap-[30px]">
        <div className="flex flex-col pb-[46px] min-w-0">
          <ProfileSummaryCard className="h-full" />
        </div>
        <div className="flex flex-1 flex-col pb-[46px] min-w-0">
          <MembershipSummaryCard />
          <PaymentManageCard className="mt-[30px]" />
          <PointUsageHistoryCard className="mt-[30px]" />
        </div>
      </div>
    </div>
  );
}
