export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  password: string;
  passwordVerify: string;
  name: string;
  phone: string;
  email: string;
  apartmentComplexId: number;
}

export interface AuthResponse {
  accessToken: string;
  username: string;
}

export interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  username: string | null;
  isLoading: boolean;
  setAuth: (auth: {
    accessToken: string;
    refreshToken?: string;
    username: string;
  }) => void;
  logout: () => void;
  setLoading: (isLoading: boolean) => void;
}

export interface SendVerifyCodeRequest {
  phone: string;
}

export interface VerifyCodeRequest {
  phone: string;
  authCode: string;
}
