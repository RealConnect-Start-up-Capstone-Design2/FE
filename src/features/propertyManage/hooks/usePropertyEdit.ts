import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  toggleFavoriteAPI,
  updatePropertyAPI,
  createPropertyAPI,
  type PropertyMutationPayload,
} from "../services/propertyService";

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
      requestData,
      isNewProperty = false,
    }: {
      requestData: PropertyMutationPayload;
      isNewProperty?: boolean;
    }) => {
      // 매물이 없으면 POST로 생성, 있으면 PUT으로 업데이트
      if (isNewProperty) {
        return await createPropertyAPI(requestData);
      } else {
        return await updatePropertyAPI(requestData);
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

  // 매물 정보 일괄 업데이트 (새로운 방식)
  const handlePropertyBatchUpdate = async (
    requestData: PropertyMutationPayload,
    isNewProperty: boolean
  ) => {
    return new Promise((resolve, reject) => {
      updatePropertyMutation.mutate(
        {
          requestData,
          isNewProperty,
        },
        {
          onSuccess: (data) => {
            resolve(data);
          },
          onError: (error) => {
            reject(error);
          },
        }
      );
    });
  };

  return {
    handleToggleFavorite,
    handlePropertyBatchUpdate,
    isUpdating: updatePropertyMutation.isPending,
  };
}
