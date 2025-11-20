import { PageHeader } from "@/components/common/PageHeader";
import { PageDescription } from "@/components/common/PageDescription";
import { MembershipSummaryCard, ProfileSummaryCard } from "@/features/myPage";

export function MyPage() {
  return (
    <div className="flex h-full flex-col gap-[46px]">
      <PageHeader title="마이페이지" titleClassName="pb-[7px]">
        <PageDescription title="구독중인 멤버십 정보, 내 프로필 등을 보여줍니다" />
      </PageHeader>

      <div className="flex flex-1 flex-row items-start">
        <div className="flex flex-col pb-[46px]">
          <ProfileSummaryCard />
        </div>
        <MembershipSummaryCard className="ml-[30px] flex-1" />
      </div>
    </div>
  );
}
