import { apiClient, AUTH_ENDPOINTS } from "@shared/api";

/**
 * 로그인을 요청하는 함수
 * @param {string} username - 사용자 아이디
 * @param {string} password - 사용자 비밀번호
 * @returns {Promise<object>} - { accessToken, username }
 */
export const login = async (username, password) => {
  const response = await apiClient.post(
    AUTH_ENDPOINTS.LOGIN,
    {
      username,
      password,
    },
    { withCredentials: true } // 쿠키(리프레시 토큰) 전송을 위함
  );

  // 액세스 토큰은 Authorization 헤더에서 추출
  const accessToken = response.headers["authorization"]?.replace("Bearer ", "");
  // 사용자 이름은 응답 데이터에서 추출
  const responseUsername = response.data.username;

  if (!accessToken) {
    throw new Error("액세스 토큰이 없습니다.");
  }

  // 성공 시 토큰과 사용자 정보를 반환
  return { accessToken, username: responseUsername };
};

/**
 * 액세스 토큰을 재발급받는 함수
 * @returns {Promise<string>} - 새로운 액세스 토큰
 */
export const refreshAccessToken = async () => {
  const response = await apiClient.get(AUTH_ENDPOINTS.REFRESH_TOKEN, {
    withCredentials: true, // 쿠키(리프레시 토큰) 전송을 위함
  });

  // 액세스 토큰은 Authorization 헤더에서 추출
  const accessToken = response.headers["authorization"]?.replace("Bearer ", "");

  if (!accessToken) {
    throw new Error("새로운 액세스 토큰이 없습니다.");
  }

  return accessToken;
};
