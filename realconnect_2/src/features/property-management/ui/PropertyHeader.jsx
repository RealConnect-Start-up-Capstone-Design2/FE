import React from "react";
import { PageHeader } from "@shared/ui";

export const PropertyHeader = ({ activeView = "전체", onViewChange }) => {
  const viewOptions = [
    { value: "전체", label: "전체" },
    { value: "내 물건", label: "내 물건" },
  ];

  return (
    <PageHeader
      title="매물 관리"
      description="현재 등록된 또는 등록할 매물 목록입니다."
      viewOptions={viewOptions}
      activeView={activeView}
      onViewChange={onViewChange}
    />
  );
};
