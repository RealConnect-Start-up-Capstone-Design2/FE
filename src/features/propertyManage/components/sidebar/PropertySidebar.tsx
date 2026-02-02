import { useRef, useEffect, useState } from "react";
import type { ApartmentWithProperty } from "../../types";
import { PropertySidebarHeader } from "./PropertySidebarHeader";
import { PropertySidebarMenu } from "./PropertySidebarMenu";
import {
  CustomerConsultationBlock,
  ContractInfoBlock,
  InquiryInfoBlock,
  PropertyDetailBlock,
} from "./blocks";

interface PropertySidebarProps {
  apartment?: ApartmentWithProperty;
  onClose?: () => void;
  isOpen: boolean;
  onSave?: () => void;
  onCancel?: () => void;
}

export function PropertySidebar({
  apartment,
  onClose,
  isOpen,
  onSave,
  onCancel,
}: PropertySidebarProps) {
  const [activeSection, setActiveSection] = useState<string>("consultation");

  const consultationRef = useRef<HTMLDivElement>(null);
  const contractRef = useRef<HTMLDivElement>(null);
  const inquiryRef = useRef<HTMLDivElement>(null);
  const detailRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const handleSectionClick = (sectionId: string) => {
    const refs = {
      consultation: consultationRef,
      contract: contractRef,
      inquiry: inquiryRef,
      detail: detailRef,
    };

    const targetRef = refs[sectionId as keyof typeof refs];
    if (targetRef.current) {
      targetRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  useEffect(() => {
    const observerOptions = {
      root: contentRef.current,
      rootMargin: "-20% 0px -70% 0px",
      threshold: 0,
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(
      observerCallback,
      observerOptions
    );

    const sections = [
      consultationRef.current,
      contractRef.current,
      inquiryRef.current,
      detailRef.current,
    ];

    sections.forEach((section) => {
      if (section) observer.observe(section);
    });

    return () => {
      sections.forEach((section) => {
        if (section) observer.unobserve(section);
      });
    };
  }, []);

  return (
    <div className="flex h-full w-full flex-col bg-white shadow-xl border-l border-gray-200">
      {apartment && (
        <PropertySidebarHeader apartment={apartment} onClose={onClose} />
      )}

      <PropertySidebarMenu
        activeSection={activeSection}
        onSectionClick={handleSectionClick}
      />

      <div
        ref={contentRef}
        className="flex-1 overflow-y-auto flex flex-col gap-3"
      >
        <div id="consultation" ref={consultationRef}>
          <CustomerConsultationBlock apartment={apartment} isOpen={isOpen} />
        </div>

        <div id="contract" ref={contractRef}>
          <ContractInfoBlock apartment={apartment} isOpen={isOpen} />
        </div>

        <div id="inquiry" ref={inquiryRef}>
          <InquiryInfoBlock apartment={apartment} isOpen={isOpen} />
        </div>

        <div id="detail" ref={detailRef}>
          <PropertyDetailBlock apartment={apartment} isOpen={isOpen} />
        </div>
      </div>

      {/* 하단 푸터 - 취소/저장 버튼 */}
      <div className="flex-shrink-0 bg-[#F8F8F8] shadow-[0px_0px_10px_0px_rgba(31,43,87,0.15)] px-3 py-[14px]">
        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => {
              if (window.confirm("수정 내용을 취소하시겠습니까?")) {
                onCancel?.();
              }
            }}
            className="flex-1 h-[42px] rounded-lg bg-[#1B1B1B] text-white text-[15px] font-semibold tracking-[-0.025em] transition-opacity hover:opacity-90"
          >
            취소
          </button>
          <button
            type="button"
            onClick={onSave}
            className="flex-1 h-[42px] rounded-lg bg-[#1C2882] text-white text-[15px] font-semibold tracking-[-0.025em] transition-opacity hover:opacity-90"
          >
            저장하기
          </button>
        </div>
      </div>
    </div>
  );
}
