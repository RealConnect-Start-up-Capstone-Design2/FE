import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { SidebarBlock } from "@/shared/components/detail-sidebar";
import type { ApartmentWithProperty } from "../../../types";
import {
  EmptyBlockState,
  Field,
  FieldRow,
  SidebarActionButton,
  SidebarInput,
  SidebarSelect,
  SidebarTextarea,
} from "./SidebarFormControls";
import {
  createPropertyConsultationLogAPI,
  fetchPropertyConsultation,
  type ConsultationCustomerType,
  type PropertyConsultationInfo,
  type PropertyConsultationUpdatePayload,
} from "../../../services/propertyService";

interface CustomerConsultationBlockProps {
  apartment?: ApartmentWithProperty;
  isOpen: boolean;
  consultation?: PropertyConsultationUpdatePayload;
  onConsultationChange?: (consultation: PropertyConsultationUpdatePayload) => void;
}

const customerTypeOptions: Array<{
  value: ConsultationCustomerType;
  label: string;
}> = [
  { value: "OWNER", label: "소유자" },
  { value: "TENENT", label: "임차인" },
  { value: "ETC", label: "기타" },
];

const customerTypeLabelMap: Record<ConsultationCustomerType, string> = {
  OWNER: "소유자",
  TENENT: "임차인",
  ETC: "기타",
};

const formatConsultationTime = (value: string) => {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return `${String(date.getFullYear()).slice(2)}-${String(
    date.getMonth() + 1,
  ).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
};

const getConsultationPayload = (
  consultation?: PropertyConsultationUpdatePayload,
  fetchedConsultation?: PropertyConsultationInfo,
  apartment?: ApartmentWithProperty,
): PropertyConsultationUpdatePayload => ({
  ownerName:
    consultation?.ownerName ??
    fetchedConsultation?.ownerName ??
    apartment?.property?.ownerName ??
    "",
  ownerPhone:
    consultation?.ownerPhone ??
    fetchedConsultation?.ownerPhone ??
    apartment?.property?.ownerPhone ??
    "",
  tenantName: consultation?.tenantName ?? fetchedConsultation?.tenantName ?? "",
  tenantPhone: consultation?.tenantPhone ?? fetchedConsultation?.tenantPhone ?? "",
  etcName: consultation?.etcName ?? fetchedConsultation?.etcName ?? "",
  etcPhone: consultation?.etcPhone ?? fetchedConsultation?.etcPhone ?? "",
});

/**
 * 고객 상담 내역 블록
 */
export function CustomerConsultationBlock({
  apartment,
  consultation,
  onConsultationChange,
}: CustomerConsultationBlockProps) {
  const queryClient = useQueryClient();
  const [customerType, setCustomerType] =
    useState<ConsultationCustomerType>("OWNER");
  const [content, setContent] = useState("");

  const { data: fetchedConsultation } = useQuery({
    queryKey: ["property-consultation", apartment?.apartmentId],
    queryFn: () => fetchPropertyConsultation(apartment!.apartmentId),
    enabled: Boolean(apartment?.apartmentId),
  });

  const createLogMutation = useMutation({
    mutationFn: ({
      apartmentId,
      customerType,
      content,
    }: {
      apartmentId: number;
      customerType: ConsultationCustomerType;
      content: string;
    }) =>
      createPropertyConsultationLogAPI(apartmentId, {
        customerType,
        content,
      }),
    onSuccess: () => {
      setContent("");
      void queryClient.invalidateQueries({
        queryKey: ["property-consultation", apartment?.apartmentId],
      });
    },
    onError: () => {
      alert("상담 내용 등록에 실패했습니다.");
    },
  });

  useEffect(() => {
    if (fetchedConsultation) {
      onConsultationChange?.(getConsultationPayload(undefined, fetchedConsultation));
    }
  }, [fetchedConsultation, onConsultationChange]);

  if (!apartment) {
    return (
      <SidebarBlock title="고객 상담 내역">
        <EmptyBlockState />
      </SidebarBlock>
    );
  }

  const consultationPayload = getConsultationPayload(
    consultation,
    fetchedConsultation,
    apartment,
  );
  const resetKey = `${apartment.apartmentId}-${fetchedConsultation ? "consultation" : "property"}`;
  const updateConsultation = (
    partialConsultation: Partial<PropertyConsultationUpdatePayload>,
  ) => {
    onConsultationChange?.({
      ...consultationPayload,
      ...partialConsultation,
    });
  };
  const handleCreateLog = () => {
    const trimmedContent = content.trim();

    if (!trimmedContent) {
      return;
    }

    createLogMutation.mutate({
      apartmentId: apartment.apartmentId,
      customerType,
      content: trimmedContent,
    });
  };

  return (
    <SidebarBlock title="고객 상담 내역">
      <div key={resetKey} className="flex flex-col gap-3">
        <FieldRow>
          <Field label="소유자">
            <SidebarInput
              defaultValue={consultationPayload.ownerName}
              onChange={(event) =>
                updateConsultation({ ownerName: event.target.value })
              }
            />
          </Field>
          <Field label="연락처">
            <SidebarInput
              defaultValue={consultationPayload.ownerPhone}
              onChange={(event) =>
                updateConsultation({ ownerPhone: event.target.value })
              }
            />
          </Field>
        </FieldRow>

        <FieldRow>
          <Field label="임차인">
            <SidebarInput
              defaultValue={consultationPayload.tenantName}
              onChange={(event) =>
                updateConsultation({ tenantName: event.target.value })
              }
            />
          </Field>
          <Field label="연락처">
            <SidebarInput
              defaultValue={consultationPayload.tenantPhone}
              placeholder="010-0000-0000"
              onChange={(event) =>
                updateConsultation({ tenantPhone: event.target.value })
              }
            />
          </Field>
        </FieldRow>

        <FieldRow>
          <Field label="기타">
            <SidebarInput
              defaultValue={consultationPayload.etcName}
              onChange={(event) =>
                updateConsultation({ etcName: event.target.value })
              }
            />
          </Field>
          <Field label="연락처">
            <SidebarInput
              defaultValue={consultationPayload.etcPhone}
              placeholder="010-0000-0000"
              onChange={(event) =>
                updateConsultation({ etcPhone: event.target.value })
              }
            />
          </Field>
        </FieldRow>

        <SidebarTextarea
          readOnly
          value={
            fetchedConsultation?.logs
              .map(
                (log) =>
                  `${log.writerName} ${formatConsultationTime(log.createdAt)} [${customerTypeLabelMap[log.customerType]}]\n${log.content}`,
              )
              .join("\n\n") ?? ""
          }
          placeholder="등록된 상담 내용이 없습니다."
        />

        <div className="mt-1 flex flex-col gap-[5px]">
          <span className="text-[13px] font-medium tracking-[-0.025em] text-[#8D8D8D]">
            상담 내용 추가
          </span>
          <div className="grid grid-cols-[96px_1fr_54px] gap-2">
            <SidebarSelect
              value={customerType}
              options={customerTypeOptions}
              onChange={(value) =>
                setCustomerType(value as ConsultationCustomerType)
              }
            />
            <SidebarInput
              value={content}
              placeholder="로얄층이라 시세 이상 받고 싶다고 함."
              onChange={(event) => setContent(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  handleCreateLog();
                }
              }}
            />
            <SidebarActionButton
              type="button"
              disabled={createLogMutation.isPending}
              onClick={handleCreateLog}
            >
              등록
            </SidebarActionButton>
          </div>
        </div>
      </div>
    </SidebarBlock>
  );
}
