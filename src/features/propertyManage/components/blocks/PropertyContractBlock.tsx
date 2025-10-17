import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ContractTypeToggle } from "../ContractTypeToggle";
import { RentalContractForm } from "../RentalContractForm";
import { SaleContractForm } from "../SaleContractForm";
import type { ApartmentWithProperty } from "../../stores/propertyStore";
import type {
  ContractInfo,
  ContractInfoInput,
  ContractType,
} from "../../stores/contractStore";
import {
  createContractAPI,
  getContractAPI,
  saveContractAPI,
} from "../../services/contractService";

interface PropertyContractBlockProps {
  apartment?: ApartmentWithProperty;
  isOpen: boolean;
}

/**
 * 매물 계약 정보 블록
 * 임대차 계약 / 매매 계약에 따라 다른 폼을 표시
 */
export function PropertyContractBlock({
  apartment,
  isOpen,
}: PropertyContractBlockProps) {
  const queryClient = useQueryClient();
  const apartmentId = apartment?.apartmentId;

  const [contractType, setContractType] = useState<ContractType>("LEASE");
  const [formData, setFormData] = useState<Partial<ContractInfo>>({});
  const [isSaved, setIsSaved] = useState(false);

  const {
    data: fetchedContract,
    isLoading: isContractLoading,
    isFetching: isContractFetching,
    error: contractError,
  } = useQuery({
    queryKey: ["contract", apartmentId],
    queryFn: () => getContractAPI(apartmentId!),
    enabled: isOpen && !!apartmentId,
    refetchOnWindowFocus: false,
  });

  const resolvedContract = fetchedContract ?? null;

  // 아파트가 변경되면 기본 상태로 초기화
  useEffect(() => {
    setFormData({});
    setIsSaved(false);
    setContractType("LEASE");
  }, [apartmentId]);

  // 계약 정보를 불러오면 폼 상태를 최신 값으로 동기화
  useEffect(() => {
    if (apartmentId && resolvedContract) {
      setContractType(resolvedContract.contractType);
      setFormData({});
    }
  }, [resolvedContract, apartmentId]);

  const currentContract = useMemo<ContractInfo | null>(() => {
    if (!apartmentId) {
      return null;
    }
    const base = resolvedContract ? { ...resolvedContract } : {};
    return {
      apartmentId,
      ...base,
      ...formData,
      contractType,
    } as ContractInfo;
  }, [apartmentId, resolvedContract, formData, contractType]);

  const hasUnsavedChanges = useMemo(() => {
    if (!apartmentId) {
      return false;
    }

    if (resolvedContract) {
      const merged = {
        ...resolvedContract,
        ...formData,
        contractType,
      };
      return JSON.stringify(resolvedContract) !== JSON.stringify(merged);
    }

    if (contractType !== "LEASE") {
      return true;
    }

    return Object.entries(formData).some(([, value]) => {
      if (value === undefined || value === null) {
        return false;
      }
      if (typeof value === "string") {
        return value.trim() !== "";
      }
      return true;
    });
  }, [apartmentId, resolvedContract, formData, contractType]);

  // 계약 정보 저장 mutation
  const contractMutation = useMutation({
    mutationFn: async ({
      apartmentId,
      payload,
      isUpdate,
    }: {
      apartmentId: number;
      payload: Partial<ContractInfoInput>;
      isUpdate: boolean;
    }) => {
      if (isUpdate) {
        return await saveContractAPI(apartmentId, payload);
      }
      return await createContractAPI(apartmentId, payload);
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["contract", variables.apartmentId],
      });
      setFormData({});
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 3000);
    },
    onError: (error) => {
      let errorMessage = "계약 정보 저장에 실패했습니다.";
      if (error && typeof error === "object" && "response" in error) {
        const serverMessage = (
          error as { response?: { data?: { message?: string } } }
        ).response?.data?.message;
        if (typeof serverMessage === "string" && serverMessage.trim() !== "") {
          errorMessage = serverMessage;
        }
      }
      alert(errorMessage);
    },
  });

  const handleFieldChange = (
    field: keyof Omit<ContractInfo, "apartmentId">,
    value: string | number
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setIsSaved(false);
  };

  const handleContractTypeChange = (type: ContractType) => {
    setContractType(type);
    setIsSaved(false);
  };

  const handleSave = () => {
    if (!apartmentId || !currentContract || contractMutation.isPending) {
      return;
    }

    const {
      apartmentId: _omitApartmentId,
      ...contractWithoutId
    } = currentContract;
    void _omitApartmentId;

    const sanitizedPayload = Object.fromEntries(
      Object.entries(contractWithoutId).filter(
        ([, value]) => value !== undefined
      )
    ) as Partial<ContractInfoInput>;

    contractMutation.mutate({
      apartmentId,
      payload: sanitizedPayload,
      isUpdate: !!resolvedContract,
    });
  };

  const isChanged = hasUnsavedChanges && !isSaved;
  const isFormDisabled =
    contractMutation.isPending || isContractLoading || isContractFetching;
  const isLoadingWithoutData = isContractLoading && !resolvedContract;

  // 아파트가 선택되지 않았을 때
  if (!apartment) {
    return (
      <section className="space-y-[18px]">
        <Label className="block text-[20px] font-semibold text-black">
          계약 정보
        </Label>
        <div className="flex min-h-[200px] w-full items-center justify-center rounded-md border border-gray-200 bg-gray-50">
          <p className="text-gray-400">아파트를 선택해주세요.</p>
        </div>
      </section>
    );
  }

  const contractErrorMessage = contractError
    ? "계약 정보를 불러오는데 실패했습니다."
    : null;

  return (
    <section className="space-y-[18px]">
      <Label className="block text-[20px] font-semibold text-black">
        계약 정보
      </Label>

      {isLoadingWithoutData && (
        <div className="flex min-h-[80px] items-center justify-center rounded-md border border-gray-200 bg-gray-50 px-3 py-4 text-sm text-gray-500">
          계약 정보를 불러오는 중입니다...
        </div>
      )}

      {contractErrorMessage && (
        <div className="rounded-md border border-red-100 bg-red-50 px-3 py-2 text-sm text-red-600">
          {contractErrorMessage}
        </div>
      )}

      {/* 계약 타입 선택 */}
      <ContractTypeToggle
        value={contractType}
        onChange={handleContractTypeChange}
        disabled={isFormDisabled}
      />

      {/* 계약 타입에 따라 다른 폼 표시 */}
      {contractType === "LEASE" && (
        <RentalContractForm
          contract={currentContract}
          onChange={handleFieldChange}
          disabled={isFormDisabled}
        />
      )}

      {contractType === "SALE" && (
        <SaleContractForm
          contract={currentContract}
          onChange={handleFieldChange}
          disabled={isFormDisabled}
        />
      )}

      {/* 저장 버튼 */}
      {contractType && (
        <Button
          onClick={handleSave}
          disabled={
            !isChanged ||
            contractMutation.isPending ||
            isContractLoading ||
            isContractFetching
          }
          style={{
            backgroundColor: isSaved
              ? "#B1B6C7"
              : isChanged
              ? "#1C2882"
              : "#B1B6C7",
          }}
          className="w-full text-white hover:opacity-90"
        >
          {isSaved ? "저장됨" : "저장하기"}
        </Button>
      )}
    </section>
  );
}
