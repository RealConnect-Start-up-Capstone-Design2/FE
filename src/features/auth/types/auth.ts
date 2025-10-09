export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  password: string;
  passwordVerify: string;
  email: string;
  name: string;
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
