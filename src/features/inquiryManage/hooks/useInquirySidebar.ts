import { useCallback, useEffect, useState } from "react";
import type { Inquiry } from "../types/inquiry";

interface UseInquirySidebarParams {
  inquiries: Inquiry[];
}

export function useInquirySidebar({ inquiries }: UseInquirySidebarParams) {
  const [selectedInquiryId, setSelectedInquiryId] = useState<number>();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isManuallyClosedByButton, setIsManuallyClosedByButton] =
    useState(false);
  const [lastViewedInquiryId, setLastViewedInquiryId] = useState<number>();

  // 사이드바 닫기 (수동 닫기 여부 추적)
  const closeSidebar = useCallback((isManualClose = false) => {
    setIsSidebarOpen(false);
    if (isManualClose) setIsManuallyClosedByButton(true);
  }, []);

  // 선택 초기화 (lastViewedInquiryId 포함 여부로 구분)
  const clearSelection = useCallback((resetLastViewed = false) => {
    setSelectedInquiryId(undefined);
    setIsSidebarOpen(false);
    setIsManuallyClosedByButton(false);
    if (resetLastViewed) setLastViewedInquiryId(undefined);
  }, []);

  // 문의 선택 및 사이드바 열기
  const selectInquiry = useCallback((inquiryId: number) => {
    setSelectedInquiryId(inquiryId);
    setLastViewedInquiryId(inquiryId);
    setIsSidebarOpen(true);
    setIsManuallyClosedByButton(false);
  }, []);

  // 문의 클릭 핸들러
  const handleInquiryClick = useCallback(
    (inquiryId: number) => {
      // 같은 문의 클릭 시 선택 해제
      if (selectedInquiryId === inquiryId) {
        clearSelection();
        return;
      }

      // 수동으로 닫은 상태면 선택만, 아니면 사이드바도 열기
      if (isManuallyClosedByButton) {
        setSelectedInquiryId(inquiryId);
        setLastViewedInquiryId(inquiryId);
      } else {
        selectInquiry(inquiryId);
      }
    },
    [clearSelection, isManuallyClosedByButton, selectInquiry, selectedInquiryId]
  );

  // 사이드바 토글
  const handleToggleSidebar = useCallback(() => {
    if (isSidebarOpen) {
      closeSidebar(true);
      return;
    }

    setIsManuallyClosedByButton(false);
    const firstInquiryId = inquiries[0]?.inquiryId;
    const preferredTarget =
      selectedInquiryId ?? lastViewedInquiryId ?? firstInquiryId;
    const resolvedTarget = inquiries.some(
      (inq) => inq.inquiryId === preferredTarget
    )
      ? preferredTarget
      : firstInquiryId;

    if (resolvedTarget !== undefined) {
      setSelectedInquiryId(resolvedTarget);
      setLastViewedInquiryId(resolvedTarget);
    }
    setIsSidebarOpen(true);
  }, [
    inquiries,
    closeSidebar,
    isSidebarOpen,
    lastViewedInquiryId,
    selectedInquiryId,
  ]);

  // 외부 클릭 핸들러
  const handleExternalClick = useCallback(() => {
    clearSelection();
  }, [clearSelection]);

  // 삭제된 문의에 대한 선택 정리
  useEffect(() => {
    const inquiryExists = (id: number | undefined) =>
      id !== undefined && inquiries.some((inq) => inq.inquiryId === id);

    if (selectedInquiryId && !inquiryExists(selectedInquiryId)) {
      setSelectedInquiryId(undefined);
    }
    if (lastViewedInquiryId && !inquiryExists(lastViewedInquiryId)) {
      setLastViewedInquiryId(undefined);
    }
  }, [inquiries, lastViewedInquiryId, selectedInquiryId]);

  return {
    selectedInquiryId,
    displayedInquiryId: selectedInquiryId ?? lastViewedInquiryId,
    isSidebarOpen,
    selectInquiry,
    clearSelection,
    closeSidebar,
    handleInquiryClick,
    handleToggleSidebar,
    handleExternalClick,
  };
}
