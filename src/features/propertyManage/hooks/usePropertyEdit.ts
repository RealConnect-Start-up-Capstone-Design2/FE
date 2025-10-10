import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  toggleFavorite as toggleFavoriteLocal,
  updateProperty,
} from "../stores/propertyStore";

/**
 * 매물 편집 관련 로직을 관리하는 커스텀 훅
 * API 연동 시 mutationFn만 실제 API 호출로 변경하면 됨
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
      // TODO: API 연동 시 아래로 교체
      // return await toggleFavoriteAPI(apartmentId, isFavorite);

      toggleFavoriteLocal(apartmentId, isFavorite);
      return { apartmentId, isFavorite };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["apartments"] });
    },
    // API 연동 시 optimistic update 추가 가능
    // onMutate: async ({ apartmentId, isFavorite }) => { ... },
    // onError: (_err, _variables, context) => { ... },
  });

  // 매물 정보 업데이트 mutation
  const updatePropertyMutation = useMutation({
    mutationFn: async ({
      apartmentId,
      field,
      value,
    }: {
      apartmentId: number;
      field: string;
      value: string | number;
    }) => {
      // TODO: API 연동 시 아래로 교체
      // return await updatePropertyAPI(apartmentId, { [field]: value });

      updateProperty(apartmentId, field, value);
      return { apartmentId, field, value };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["apartments"] });
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
    if (value !== undefined && value !== "") {
      updatePropertyMutation.mutate({ apartmentId, field, value });
    }
  };

  return {
    handleToggleFavorite,
    handlePropertyUpdate,
    isUpdating: updatePropertyMutation.isPending,
  };
}
