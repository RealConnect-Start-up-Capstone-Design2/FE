import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ContractTypeToggle } from "../ContractTypeToggle";
import { RentalContractForm } from "../RentalContractForm";
import { SaleContractForm } from "../SaleContractForm";
import type { ApartmentWithProperty } from "../../stores/propertyStore";
import type { ContractInfo, ContractType } from "../../stores/contractStore";
import { getContract, saveContract } from "../../stores/contractStore";

interface PropertyContractBlockProps {
  apartment?: ApartmentWithProperty;
}

/**
 * 매물 계약 정보 블록
 * 임대차 계약 / 매매 계약에 따라 다른 폼을 표시
 */
export function PropertyContractBlock({
  apartment,
}: PropertyContractBlockProps) {
  const queryClient = useQueryClient();

  // 계약 정보 초기화
  const initialContract = apartment?.apartmentId
    ? getContract(apartment.apartmentId)
    : null;

  const [contractType, setContractType] = useState<ContractType>(
    initialContract?.contractType || "LEASE"
  );
  const [formData, setFormData] = useState<Partial<ContractInfo>>({});
  const [isSaved, setIsSaved] = useState(false);

  // apartment가 변경되면 폼 데이터 초기화
  useEffect(() => {
    if (apartment?.apartmentId) {
      const contract = getContract(apartment.apartmentId);
      if (contract) {
        setContractType(contract.contractType);
        setFormData(contract);
      } else {
        setContractType("LEASE");
        setFormData({});
      }
    } else {
      setContractType("LEASE");
      setFormData({});
    }
    setIsSaved(false);
  }, [apartment?.apartmentId]);

  // 계약 정보 저장 mutation
  const contractMutation = useMutation({
    mutationFn: async ({
      apartmentId,
      updates,
    }: {
      apartmentId: number;
      updates: Partial<ContractInfo>;
    }) => {
      // contractStore를 사용하여 저장
      saveContract(apartmentId, updates);
      return { apartmentId, updates };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contracts"] });
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 3000);
    },
    onError: (error) => {
      console.error("계약 정보 저장 실패:", error);
      alert("계약 정보 저장에 실패했습니다.");
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
    setFormData((prev) => ({ ...prev, contractType: type }));
    setIsSaved(false);
  };

  const handleSave = () => {
    if (apartment && contractType) {
      const updates = {
        ...formData,
        contractType,
      };
      contractMutation.mutate({ apartmentId: apartment.apartmentId, updates });
    }
  };

  const hasChanges = () => {
    if (!apartment?.apartmentId) return false;
    const currentContract = getContract(apartment.apartmentId);
    if (!currentContract) return Object.keys(formData).length > 0;
    return (
      JSON.stringify({ ...currentContract, ...formData }) !==
      JSON.stringify(currentContract)
    );
  };

  const isChanged = hasChanges() && !isSaved;

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

  return (
    <section className="space-y-[18px]">
      <Label className="block text-[20px] font-semibold text-black">
        계약 정보
      </Label>

      {/* 계약 타입 선택 */}
      <ContractTypeToggle
        value={contractType}
        onChange={handleContractTypeChange}
        disabled={contractMutation.isPending}
      />

      {/* 계약 타입에 따라 다른 폼 표시 */}
      {contractType === "LEASE" && (
        <RentalContractForm
          contract={
            apartment.apartmentId ? getContract(apartment.apartmentId) : null
          }
          onChange={handleFieldChange}
          disabled={contractMutation.isPending}
        />
      )}

      {contractType === "SALE" && (
        <SaleContractForm
          contract={
            apartment.apartmentId ? getContract(apartment.apartmentId) : null
          }
          onChange={handleFieldChange}
          disabled={contractMutation.isPending}
        />
      )}

      {/* 저장 버튼 */}
      {contractType && (
        <Button
          onClick={handleSave}
          disabled={!isChanged || contractMutation.isPending}
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
