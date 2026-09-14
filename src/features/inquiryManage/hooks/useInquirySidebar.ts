import { useCallback, useEffect, useState } from "react";

import type { Inquiry } from "../types/inquiry";

export function useInquirySidebar({ inquiries }: { inquiries: Inquiry[] }) {
  const [selectedInquiryId, setSelectedInquiryId] = useState<number>();
  const [lastViewedInquiryId, setLastViewedInquiryId] = useState<number>();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const selectInquiry = useCallback((inquiryId: number) => {
    setSelectedInquiryId(inquiryId);
    setLastViewedInquiryId(inquiryId);
    setIsSidebarOpen(true);
  }, []);

  const clearSelection = useCallback((resetLastViewed = false) => {
    setSelectedInquiryId(undefined);
    setIsSidebarOpen(false);
    if (resetLastViewed) setLastViewedInquiryId(undefined);
  }, []);

  const closeSidebar = useCallback((isManualClose = false) => {
    void isManualClose;
    setIsSidebarOpen(false);
  }, []);

  const handleInquiryClick = useCallback(
    (inquiryId: number) => {
      if (isSidebarOpen && selectedInquiryId === inquiryId) {
        setIsSidebarOpen(false);
        return;
      }
      selectInquiry(inquiryId);
    },
    [isSidebarOpen, selectInquiry, selectedInquiryId],
  );

  const handleToggleSidebar = useCallback(() => {
    if (isSidebarOpen) {
      setIsSidebarOpen(false);
      return;
    }
    const target =
      selectedInquiryId ??
      (inquiries.some((inquiry) => inquiry.inquiryId === lastViewedInquiryId)
        ? lastViewedInquiryId
        : inquiries[0]?.inquiryId);
    if (target !== undefined) selectInquiry(target);
  }, [
    inquiries,
    isSidebarOpen,
    lastViewedInquiryId,
    selectInquiry,
    selectedInquiryId,
  ]);

  const handleExternalClick = useCallback(() => {
    clearSelection();
  }, [clearSelection]);

  useEffect(() => {
    const exists = (id: number | undefined) =>
      id !== undefined && inquiries.some((inquiry) => inquiry.inquiryId === id);
    if (selectedInquiryId !== undefined && !exists(selectedInquiryId)) {
      setSelectedInquiryId(undefined);
      setIsSidebarOpen(false);
    }
    if (lastViewedInquiryId !== undefined && !exists(lastViewedInquiryId)) {
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
