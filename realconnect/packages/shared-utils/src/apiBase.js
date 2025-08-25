/**
 * 공통 에러 핸들링 함수
 */
const handleApiError = (error, serviceName, operation) => {
  console.error(`${serviceName} - ${operation}에 실패했습니다.`, error);

  // 구체적인 에러 정보 로깅
  if (error.response) {
    console.error("에러 상세:", {
      status: error.response.status,
      statusText: error.response.statusText,
      data: error.response.data,
    });
  }

  throw error;
};

/**
 * 파라미터 정리 함수
 */
const cleanParams = (params) => {
  if (!params) return {};
  return Object.fromEntries(
    Object.entries(params).filter(([, value]) => value !== undefined)
  );
};

/**
 * API 서비스 팩토리 함수
 * 각 서비스별로 공통 API 호출 함수들을 생성
 */
export const createApiService = (api, serviceName) => {
  const withErrorHandling =
    (operation, fn) =>
    async (...args) => {
      try {
        return await fn(...args);
      } catch (error) {
        handleApiError(error, serviceName, operation);
      }
    };

  return {
    get: withErrorHandling("GET 요청", async (url, params = {}) => {
      const response = await api.get(url, { params: cleanParams(params) });
      return response.data;
    }),

    post: withErrorHandling("POST 요청", async (url, data) => {
      const response = await api.post(url, data);
      return response.data;
    }),

    put: withErrorHandling("PUT 요청", async (url, data) => {
      const response = await api.put(url, data);
      return response.data;
    }),

    delete: withErrorHandling("DELETE 요청", async (url) => {
      const response = await api.delete(url);
      return response.data;
    }),
  };
};
