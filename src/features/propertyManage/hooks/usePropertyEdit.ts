import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  toggleFavoriteAPI,
  updatePropertyAPI,
  createPropertyAPI,
} from "../services/propertyService";
import type { ApartmentWithProperty } from "../stores/propertyStore";

/**
 * 매물 편집 관련 로직을 관리하는 커스텀 훅
 */
export function usePropertyEdit() {
  const queryClient = useQueryClient();

  // 즐겨찾기 토글 mutation
  const toggleFavoriteMutation = useMutation({
    mutationFn: async ({
      apartmentId,
      isFavorite,
    }: {
      apartmentId: number;
      isFavorite: boolean;
    }) => {
      return await toggleFavoriteAPI(apartmentId, isFavorite);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["apartments"] });
    },
  });

  // 매물 정보 업데이트/생성 mutation
  const updatePropertyMutation = useMutation({
    mutationFn: async ({
      apartmentId,
      updates,
      isNewProperty = false,
    }: {
      apartmentId: number;
      updates: {
        ownerName?: string;
        ownerPhone?: string;
        salePrice?: number;
        jeonsePrice?: number;
        deposit?: number;
        monthPrice?: number;
      };
      isNewProperty?: boolean;
    }) => {
      // 전체 매물 정보 구성 (백엔드 스펙에 맞게)
      const requestData = {
        apartmentId,
        ownerName: updates.ownerName || "",
        ownerPhone: updates.ownerPhone || "",
        salePrice: updates.salePrice || 0,
        jeonsePrice: updates.jeonsePrice || 0,
        deposit: updates.deposit || 0,
        monthPrice: updates.monthPrice || 0,
      };

      // 매물이 없으면 POST로 생성, 있으면 PUT으로 업데이트
      if (isNewProperty) {
        return await createPropertyAPI(requestData);
      } else {
        return await updatePropertyAPI(apartmentId, requestData);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["apartments"] });
    },
    onError: (error: unknown) => {
      const errorMessage =
        (error &&
          typeof error === "object" &&
          "response" in error &&
          (error as { response?: { data?: { message?: string } } }).response
            ?.data?.message) ||
        "매물 정보 업데이트에 실패했습니다.";
      alert(errorMessage);
    },
  });

  // 즐겨찾기 토글
  const handleToggleFavorite = (
    apartmentId: number,
    currentFavorite: boolean
  ) => {
    toggleFavoriteMutation.mutate({
      apartmentId,
      isFavorite: !currentFavorite,
    });
  };

  // 매물 정보 업데이트 (Input blur 시 호출)
  const handlePropertyUpdate = (
    apartmentId: number,
    field: string,
    value: string | number
  ) => {
    if (value === undefined || value === "") return;

    // 현재 캐시에서 아파트 데이터 가져오기 (무한 스크롤 구조)
    const infiniteData = queryClient.getQueryData<{
      pages: Array<{
        content: ApartmentWithProperty[];
        nextCursor: number | null;
        hasNext: boolean;
      }>;
      pageParams: unknown[];
    }>(["apartments", 1]); // apartmentComplexId가 1이라고 가정

    // 모든 페이지에서 해당 아파트 찾기
    let currentApartment: ApartmentWithProperty | undefined;
    if (infiniteData?.pages) {
      for (const page of infiniteData.pages) {
        currentApartment = page.content.find(
          (apt) => apt.apartmentId === apartmentId
        );
        if (currentApartment) break;
      }
    }

    const currentProperty = currentApartment?.property;

    // 매물이 존재하는지 확인
    const isNewProperty = !currentProperty;

    // 업데이트할 필드 구성
    const updates = {
      ownerName: currentProperty?.ownerName || "",
      ownerPhone: currentProperty?.ownerPhone || "",
      salePrice: currentProperty?.salePrice || 0,
      jeonsePrice: currentProperty?.jeonsePrice || 0,
      deposit: currentProperty?.deposit || 0,
      monthPrice: currentProperty?.monthPrice || 0,
      [field]: value,
    };

    updatePropertyMutation.mutate({ apartmentId, updates, isNewProperty });
  };

  return {
    handleToggleFavorite,
    handlePropertyUpdate,
    isUpdating: updatePropertyMutation.isPending,
  };
}
