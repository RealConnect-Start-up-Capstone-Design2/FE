import apiClient from "./client";

export type CertificationStatus =
  | "BEFORE"
  | "PENDING"
  | "REJECTED"
  | "APPROVED";

export interface ProfileData {
  name: string;
  contact?: string;
  phone?: string;
  email: string;
  blogLink?: string;
  blogUrl?: string;
  homepage?: string;
  homepageUrl?: string;
  officeName?: string;
  officeAddress?: string;
  officePhone?: string;
  employeeCount?: number;
  membershipType?: string;
  certificationStatus?: CertificationStatus;
}

export const fetchProfile = async (): Promise<ProfileData> => {
  const response = await apiClient.get<ProfileData>("/api/mypage/profile");
  const data = response.data;
  if (data.phone && !data.contact) {
    data.contact = data.phone;
  }
  if (data.blogUrl && !data.blogLink) {
    data.blogLink = data.blogUrl;
  }
  if (data.homepageUrl && !data.homepage) {
    data.homepage = data.homepageUrl;
  }
  return data;
};

export interface UpdateOwnerProfileRequest {
  phone?: string;
  email?: string;
  blogUrl?: string;
  homepageUrl?: string;
}

export const updateOwnerProfile = async (
  data: UpdateOwnerProfileRequest
): Promise<ProfileData> => {
  const response = await apiClient.patch<ProfileData>(
    "/api/mypage/profile/owner",
    data,
    { withCredentials: true }
  );
  return response.data;
};

export const sendPhoneVerificationCode = async (
  phone: string
): Promise<{ success: boolean; message: string }> => {
  const response = await apiClient.post<{ success: boolean; message: string }>(
    "/api/verify/sendCode/changePhone",
    { phone },
    { withCredentials: true }
  );
  return response.data;
};

export const verifyPhoneCode = async (
  phone: string,
  authCode: string
): Promise<void> => {
  await apiClient.post(
    "/api/verify/verifyCode/changePhone",
    {
      phone,
      authCode,
    },
    { withCredentials: true }
  );
};

export const sendPasswordChangeVerificationCode = async (
  phone: string
): Promise<{ success: boolean; message: string }> => {
  const response = await apiClient.post<{ success: boolean; message: string }>(
    "/api/verify/sendCode/changePassword",
    { phone },
    { withCredentials: true }
  );
  return response.data;
};

export const verifyPasswordChangeCode = async (
  phone: string,
  authCode: string
): Promise<void> => {
  await apiClient.post(
    "/api/verify/verifyCode/changePassword",
    {
      phone,
      authCode,
    },
    { withCredentials: true }
  );
};

export const changePassword = async (
  oldPassword: string,
  newPassword: string,
  confirmPassword: string
): Promise<void> => {
  await apiClient.patch(
    "/api/mypage/changePassword",
    {
      oldPassword,
      newPassword,
      confirmPassword,
    },
    { withCredentials: true }
  );
};

export const sendStaffVerificationCode = async (
  phone: string
): Promise<{ success: boolean; message: string }> => {
  const response = await apiClient.post<{ success: boolean; message: string }>(
    "/api/verify/sendCode/staff",
    { phone },
    { withCredentials: true }
  );
  return response.data;
};

export const verifyStaffCode = async (
  phone: string,
  authCode: string
): Promise<void> => {
  await apiClient.post(
    "/api/verify/verifyCode/staff",
    {
      phone,
      authCode,
    },
    { withCredentials: true }
  );
};

export const addStaff = async (
  username: string,
  password: string,
  passwordVerify: string,
  name: string,
  phone: string
): Promise<void> => {
  await apiClient.post(
    "/api/mypage/staff-manage",
    {
      username,
      password,
      passwordVerify,
      name,
      phone,
    },
    { withCredentials: true }
  );
};

export interface SubmitOfficeFormRequest {
  businessName: string;
  businessNo: string;
  officeNo: string;
  officePhone: string;
  sigunguCode: string;
  roadNameAddress: string;
  roadNameAddressCode: string;
  jibunAddress: string;
  addressDetail: string;
}

export const submitOfficeForm = async (
  data: SubmitOfficeFormRequest
): Promise<void> => {
  await apiClient.post("/api/mypage/submitOfficeForm", data, {
    withCredentials: true,
  });
};

export const getOfficeStatus = async (): Promise<CertificationStatus> => {
  const response = await apiClient.get<
    CertificationStatus | { status: CertificationStatus }
  >("/api/mypage/officeStatus", { withCredentials: true });

  if (typeof response.data === "string") {
    return response.data as CertificationStatus;
  } else if (
    response.data &&
    typeof response.data === "object" &&
    "status" in response.data
  ) {
    return response.data.status;
  }

  return "BEFORE";
};
