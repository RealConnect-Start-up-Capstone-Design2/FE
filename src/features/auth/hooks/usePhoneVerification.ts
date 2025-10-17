import { useCallback, useEffect, useMemo, useState } from "react";
import { sendVerifyCode, verifyCode } from "../services";

const sanitizePhoneNumber = (phone: string) => phone.replace(/\D/g, "");

interface UsePhoneVerificationOptions {
  phone: string;
  onVerified?: () => void;
}

export interface UsePhoneVerificationResult {
  verificationCode: string;
  setVerificationCode: (value: string) => void;
  isCodeSent: boolean;
  isCodeVerified: boolean;
  sendCooldown: number;
  isSendingCode: boolean;
  isVerifyingCode: boolean;
  canSendCode: boolean;
  sendCode: () => Promise<void>;
  verifyCode: () => Promise<void>;
  resetVerification: () => void;
}

export const usePhoneVerification = ({
  phone,
  onVerified,
}: UsePhoneVerificationOptions): UsePhoneVerificationResult => {
  const [verificationCode, setVerificationCode] = useState("");
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [isCodeVerified, setIsCodeVerified] = useState(false);
  const [sendCooldown, setSendCooldown] = useState(0);
  const [isSendingCode, setIsSendingCode] = useState(false);
  const [isVerifyingCode, setIsVerifyingCode] = useState(false);

  const sanitizedPhone = useMemo(() => sanitizePhoneNumber(phone), [phone]);
  const canSendCode = sanitizedPhone.length >= 10;

  const resetVerification = useCallback(() => {
    setVerificationCode("");
    setIsCodeSent(false);
    setIsCodeVerified(false);
    setSendCooldown(0);
  }, []);

  useEffect(() => {
    resetVerification();
  }, [resetVerification, sanitizedPhone]);

  useEffect(() => {
    if (sendCooldown <= 0) return;

    const timerId = window.setInterval(() => {
      setSendCooldown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => window.clearInterval(timerId);
  }, [sendCooldown]);

  const sendCode = useCallback(async () => {
    if (!canSendCode) {
      throw new Error("유효한 휴대폰 번호를 입력해주세요.");
    }

    if (isSendingCode || sendCooldown > 0) {
      return;
    }

    setIsSendingCode(true);
    try {
      await sendVerifyCode(sanitizedPhone);
      setIsCodeSent(true);
      setIsCodeVerified(false);
      setVerificationCode("");
      setSendCooldown(60);
    } finally {
      setIsSendingCode(false);
    }
  }, [canSendCode, isSendingCode, sanitizedPhone, sendCooldown]);

  const verifyCodeAction = useCallback(async () => {
    if (!isCodeSent) {
      throw new Error("인증번호를 먼저 발송해주세요.");
    }

    const trimmedCode = verificationCode.trim();

    if (!trimmedCode) {
      throw new Error("인증번호를 입력해주세요.");
    }

    setIsVerifyingCode(true);
    try {
      await verifyCode(sanitizedPhone, trimmedCode);
      setIsCodeVerified(true);
      setSendCooldown(0);
      onVerified?.();
    } finally {
      setIsVerifyingCode(false);
    }
  }, [
    isCodeSent,
    onVerified,
    sanitizedPhone,
    verificationCode,
  ]);

  return {
    verificationCode,
    setVerificationCode,
    isCodeSent,
    isCodeVerified,
    sendCooldown,
    isSendingCode,
    isVerifyingCode,
    canSendCode,
    sendCode,
    verifyCode: verifyCodeAction,
    resetVerification,
  };
};
