import { BellOff, Clock3 } from "lucide-react";

import type { UnsupportedFeatureStatus } from "../model/types";
import { DashboardCard } from "./DashboardPrimitives";

interface ShareAlertCardProps {
  feature: UnsupportedFeatureStatus;
}

export function ShareAlertCard({ feature }: ShareAlertCardProps) {
  return (
    <DashboardCard
      title={feature.title}
      action={<BellOff className="h-6 w-6 text-[#8D8D8D]" />}
      className="h-full"
      contentClassName="flex items-stretch"
    >
      <div className="flex min-h-0 flex-1 flex-col justify-between rounded-lg border border-dashed border-[#C8D2FF] bg-[#F8FAFF] p-6">
        <div>
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white">
            <Clock3 className="h-6 w-6 text-[#1C2882]" />
          </div>
          <p className="mt-5 text-[15px] font-semibold tracking-[-0.025em] text-[#1C2882]">
            {feature.eyebrow}
          </p>
          <p className="mt-2 text-[24px] font-bold leading-tight tracking-[-0.025em] text-[#1B1B1B]">
            {feature.description}
          </p>
          <p className="mt-4 text-[15px] font-medium leading-6 tracking-[-0.025em] text-[#8D8D8D]">
            {feature.detail}
          </p>
        </div>
      </div>
    </DashboardCard>
  );
}
