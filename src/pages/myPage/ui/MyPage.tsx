import { PageHeader } from "@/components/common/PageHeader";
import { PageDescription } from "@/components/common/PageDescription";
import { ProfileSummaryCard } from "@/features/myPage";

export function MyPage() {
  return (
    <div className="flex h-full flex-col gap-[46px]">
      <PageHeader title="마이페이지" titleClassName="pb-[7px]">
        <PageDescription title="구독중인 멤버십 정보, 내 프로필 등을 보여줍니다" />
      </PageHeader>

      <ProfileSummaryCard />
    </div>
  );
}
