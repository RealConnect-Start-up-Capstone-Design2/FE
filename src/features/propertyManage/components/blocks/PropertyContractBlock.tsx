import { useEffect, useMemo, useRef, useState } from "react";
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
  autoSaveToken?: number;
}

/**
 * 매물 계약 정보 블록
 * 임대차 계약 / 매매 계약에 따라 다른 폼을 표시
 */
export function PropertyContractBlock({
  apartment,
  isOpen,
  autoSaveToken = 0,
}: PropertyContractBlockProps) {
  const queryClient = useQueryClient();
  const apartmentId = apartment?.apartmentId;

  const [contractType, setContractType] = useState<ContractType>("LEASE");
  const [formData, setFormData] = useState<Partial<ContractInfo>>({});
  const [isSaved, setIsSaved] = useState(false);
  const lastAutoSaveTokenRef = useRef<number>(0);
  const prevApartmentIdRef = useRef<number | undefined>(undefined);
  const prevFormDataRef = useRef<Partial<ContractInfo>>({});
  const prevContractTypeRef = useRef<ContractType>("LEASE");
  const prevResolvedContractRef = useRef<ContractInfo | null>(null);

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

    // 현재 값을 ref에 저장
    prevResolvedContractRef.current = resolvedContract;
  }, [resolvedContract, apartmentId]);

  const currentContract = useMemo<ContractInfo | null>(() => {
    if (!apartmentId) {
      return null;
    }

    // 계약 정보가 없으면 매물 정보의 값을 디폴트로 사용
    const base = resolvedContract
      ? { ...resolvedContract }
      : {
          // 매물 테이블의 값을 초기값으로
          gapPhone: apartment?.property?.ownerPhone || "",
          deposit: apartment?.property?.deposit || 0,
          monthlyRent: apartment?.property?.monthPrice || 0,
          gapName: apartment?.property?.ownerName || "",
          contractDate: apartment?.contractDate || "",
          // 나머지는 빈 값
          eulPhone: "",
          eulName: "",
          downPayment: 0,
          downPaymentDueDate: "",
          interimPayment: 0,
          interimPaymentDueDate: "",
          balance: 0,
          balanceDueDate: "",
          monthlyRentDueDate: "",
        };

    return {
      apartmentId,
      ...base,
      ...formData,
      contractType,
    } as ContractInfo;
  }, [apartmentId, resolvedContract, formData, contractType, apartment]);

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
    onSuccess: async (_data, variables) => {
      // 계약 정보 쿼리 무효화
      queryClient.invalidateQueries({
        queryKey: ["contract", variables.apartmentId],
      });

      // 매물 정보도 함께 동기화 (계약 정보에서 수정한 값을 매물에 반영)
      const { payload } = variables;
      if (
        payload.gapName ||
        payload.gapPhone ||
        payload.deposit !== undefined ||
        payload.monthlyRent !== undefined
      ) {
        try {
          const { updatePropertyAPI, createPropertyAPI } = await import(
            "../../services/propertyService"
          );

          // 현재 매물 정보 가져오기
          const currentProperty = apartment?.property;

          // 매물 정보 업데이트 (동기화할 필드만 업데이트)
          const propertyUpdateData = {
            apartmentId: variables.apartmentId,
            ownerName:
              payload.gapName !== undefined
                ? String(payload.gapName)
                : currentProperty?.ownerName || "",
            ownerPhone:
              payload.gapPhone !== undefined
                ? String(payload.gapPhone)
                : currentProperty?.ownerPhone || "",
            salePrice: currentProperty?.salePrice || 0,
            jeonsePrice: currentProperty?.jeonsePrice || 0,
            deposit:
              payload.deposit !== undefined
                ? Number(payload.deposit)
                : currentProperty?.deposit || 0,
            monthPrice:
              payload.monthlyRent !== undefined
                ? Number(payload.monthlyRent)
                : currentProperty?.monthPrice || 0,
          };

          // 매물이 없으면 POST로 생성, 있으면 PUT으로 업데이트
          if (!currentProperty) {
            await createPropertyAPI(propertyUpdateData);
          } else {
            await updatePropertyAPI(variables.apartmentId, propertyUpdateData);
          }
        } catch (error) {
          console.error("매물 정보 동기화 실패:", error);
          // 매물 동기화 실패해도 계약 저장은 성공했으므로 에러 무시
        }
      }

      // 매물 목록도 무효화하여 최신 데이터 반영
      queryClient.invalidateQueries({ queryKey: ["apartments"] });

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

    const { apartmentId: _omitApartmentId, ...contractWithoutId } =
      currentContract;
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

  // 매물이 변경될 때 이전 매물의 계약 정보 자동 저장
  useEffect(() => {
    const currentApartmentId = apartmentId;
    const prevApartmentId = prevApartmentIdRef.current;

    // 매물이 변경되었는지 확인
    if (
      prevApartmentId !== undefined &&
      currentApartmentId !== prevApartmentId
    ) {
      // 이전 매물의 계약 정보 변경사항 확인
      const prevResolvedContract = prevResolvedContractRef.current;
      const prevFormData = prevFormDataRef.current;
      const prevContractType = prevContractTypeRef.current;

      // 변경사항이 있는지 확인
      let hasPrevChanges = false;

      if (prevResolvedContract) {
        const merged = {
          ...prevResolvedContract,
          ...prevFormData,
          contractType: prevContractType,
        };
        hasPrevChanges =
          JSON.stringify(prevResolvedContract) !== JSON.stringify(merged);
      } else {
        if (prevContractType !== "LEASE") {
          hasPrevChanges = true;
        } else {
          hasPrevChanges = Object.entries(prevFormData).some(([, value]) => {
            if (value === undefined || value === null) {
              return false;
            }
            if (typeof value === "string") {
              return value.trim() !== "";
            }
            return true;
          });
        }
      }

      // 변경사항이 있으면 저장
      if (hasPrevChanges && !contractMutation.isPending) {
        const prevContract = prevResolvedContract
          ? { ...prevResolvedContract }
          : {
              gapPhone: "",
              deposit: 0,
              monthlyRent: 0,
              gapName: "",
              contractDate: "",
              eulPhone: "",
              eulName: "",
              downPayment: 0,
              downPaymentDueDate: "",
              interimPayment: 0,
              interimPaymentDueDate: "",
              balance: 0,
              balanceDueDate: "",
              monthlyRentDueDate: "",
            };

        const prevCurrentContract = {
          apartmentId: prevApartmentId,
          ...prevContract,
          ...prevFormData,
          contractType: prevContractType,
        } as ContractInfo;

        const { apartmentId: _omitApartmentId, ...contractWithoutId } =
          prevCurrentContract;
        void _omitApartmentId;

        const sanitizedPayload = Object.fromEntries(
          Object.entries(contractWithoutId).filter(
            ([, value]) => value !== undefined
          )
        ) as Partial<ContractInfoInput>;

        contractMutation.mutate({
          apartmentId: prevApartmentId,
          payload: sanitizedPayload,
          isUpdate: !!prevResolvedContract,
        });
      }
    }

    // 현재 값을 ref에 저장
    prevApartmentIdRef.current = currentApartmentId;
  }, [apartmentId, contractMutation]);

  // formData와 contractType이 변경될 때마다 ref 업데이트
  useEffect(() => {
    prevFormDataRef.current = formData;
  }, [formData]);

  useEffect(() => {
    prevContractTypeRef.current = contractType;
  }, [contractType]);

  // 사이드바가 닫히거나 다른 매물로 전환될 때 자동 저장
  useEffect(() => {
    if (!apartment || !apartmentId) {
      return;
    }

    if (autoSaveToken === 0) {
      lastAutoSaveTokenRef.current = 0;
      return;
    }

    if (
      lastAutoSaveTokenRef.current === autoSaveToken ||
      contractMutation.isPending
    ) {
      return;
    }

    lastAutoSaveTokenRef.current = autoSaveToken;

    if (!hasUnsavedChanges) {
      return;
    }

    if (!currentContract) {
      return;
    }

    const { apartmentId: _omitApartmentId, ...contractWithoutId } =
      currentContract;
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
  }, [
    apartment,
    apartmentId,
    autoSaveToken,
    hasUnsavedChanges,
    currentContract,
    contractMutation,
    resolvedContract,
  ]);

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
