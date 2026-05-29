import { useRef, useEffect, useState } from "react";
import { Button } from "@/shared/ui";
import type { ApartmentWithProperty } from "../../types";
import { PropertySidebarHeader } from "./PropertySidebarHeader";
import {
  PropertySidebarMenu,
  type PropertySidebarMenuItem,
} from "./PropertySidebarMenu";
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

const sidebarMenuItems: PropertySidebarMenuItem[] = [
  { id: "detail", label: "매물 상세" },
  { id: "consultation", label: "고객 상담" },
  { id: "contract", label: "계약 내역" },
  { id: "inquiry", label: "의뢰 정보" },
];

export function PropertySidebar({
  apartment,
  onClose,
  isOpen,
  onSave,
  onCancel,
}: PropertySidebarProps) {
  const [activeSection, setActiveSection] = useState<string>("detail");

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
      observerOptions,
    );

    const sections = [
      detailRef.current,
      consultationRef.current,
      contractRef.current,
      inquiryRef.current,
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
    <div className="flex h-full w-full flex-col border-l border-gray-200 bg-white shadow-xl">
      {apartment && (
        <PropertySidebarHeader apartment={apartment} onClose={onClose} />
      )}

      <PropertySidebarMenu
        items={sidebarMenuItems}
        activeSection={activeSection}
        onSectionClick={handleSectionClick}
      />

      <div
        ref={contentRef}
        className="flex flex-1 flex-col gap-3 overflow-y-auto p-3"
      >
        <div id="detail" ref={detailRef}>
          <PropertyDetailBlock apartment={apartment} isOpen={isOpen} />
        </div>

        <div id="consultation" ref={consultationRef}>
          <CustomerConsultationBlock apartment={apartment} isOpen={isOpen} />
        </div>

        <div id="contract" ref={contractRef}>
          <ContractInfoBlock apartment={apartment} isOpen={isOpen} />
        </div>

        <div id="inquiry" ref={inquiryRef}>
          <InquiryInfoBlock apartment={apartment} isOpen={isOpen} />
        </div>
      </div>

      <div className="flex-shrink-0 bg-[#F8F8F8] px-3 py-[14px] shadow-[0px_0px_10px_0px_rgba(31,43,87,0.15)]">
        <div className="flex gap-4">
          <Button
            type="button"
            onClick={() => {
              if (window.confirm("수정 내용을 취소하시겠습니까?")) {
                onCancel?.();
              }
            }}
            className="h-[42px] flex-1 rounded-lg bg-[#1B1B1B] text-[15px] font-semibold tracking-[-0.025em] text-white shadow-none hover:bg-[#2A2A2A]"
          >
            취소
          </Button>
          <div className="relative flex-1">
            <Button
              type="button"
              onClick={onSave}
              className="h-[42px] w-full rounded-lg bg-[#1C2882] text-[15px] font-semibold tracking-[-0.025em] text-white shadow-none hover:bg-[#17216E]"
            >
              저장하기
            </Button>
            <span className="absolute -right-1 -top-2 flex h-[18px] w-[18px] items-center justify-center rounded-full bg-[#EA3B3B] text-[12px] font-semibold tracking-[-0.025em] text-white">
              2
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
