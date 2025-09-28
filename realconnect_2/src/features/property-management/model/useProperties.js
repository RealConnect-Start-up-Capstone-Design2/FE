import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getProperties,
  updateProperty,
  deleteProperty,
} from "@entities/property";

// 쿼리 키 상수
export const PROPERTY_QUERY_KEYS = {
  PROPERTIES: "properties",
  PROPERTY_LIST: (filters) => ["properties", "list", filters],
};

/**
 * 매물 목록을 무한 스크롤로 조회하는 훅
 */
export const useProperties = (filters = {}) => {
  return useQuery({
    queryKey: PROPERTY_QUERY_KEYS.PROPERTY_LIST(filters),
    queryFn: async () => {
      const params = {
        page: 0,
        size: 100, // 한 번에 100개 요청
        ...filters,
      };
      return await getProperties(params);
    },
  });
};

/**
 * 매물 수정 뮤테이션 훅
 */
export const useUpdateProperty = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ propertyId, data }) => updateProperty(propertyId, data),
    onSuccess: () => {
      // 매물 목록 쿼리 무효화하여 새로고침
      queryClient.invalidateQueries({
        queryKey: [PROPERTY_QUERY_KEYS.PROPERTIES],
      });
    },
    onError: (error) => {
      console.error("매물 수정 중 오류 발생:", error);
    },
  });
};

/**
 * 매물 삭제 뮤테이션 훅
 */
export const useDeleteProperty = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (propertyId) => deleteProperty(propertyId),
    onSuccess: () => {
      // 매물 목록 쿼리 무효화하여 새로고침
      queryClient.invalidateQueries({
        queryKey: [PROPERTY_QUERY_KEYS.PROPERTIES],
      });
    },
    onError: (error) => {
      console.error("매물 삭제 중 오류 발생:", error);
    },
  });
};

/**
 * 여러 매물을 초기화(빈 값으로 설정)하는 뮤테이션 훅
 */
export const useClearProperties = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (propertyIds) => {
      // 빈 값으로 설정할 데이터
      const emptyPropertyData = {
        status: null,
        ownerName: "",
        ownerPhone: "",
        tenantName: "",
        tenantPhone: "",
        salePrice: 0,
        jeonsePrice: 0,
        deposit: 0,
        monthPrice: 0,
        memo: "",
        startDate: null,
        endDate: null,
      };

      // 각 매물에 대해 업데이트 수행
      const updatePromises = propertyIds.map((propertyId) =>
        updateProperty(propertyId, emptyPropertyData)
      );

      return Promise.all(updatePromises);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [PROPERTY_QUERY_KEYS.PROPERTIES],
      });
    },
    onError: (error) => {
      console.error("매물 정보 초기화 중 오류 발생:", error);
    },
  });
};
