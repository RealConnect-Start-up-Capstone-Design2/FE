import loginLogo from "@/assets/icons/loginLogo.svg";

export function AuthHeader() {
  return (
    <>
      {/* Logo */}
      <div className="mb-[1.875rem] mt-12 flex items-center justify-center">
        <img src={loginLogo} alt="로고" />
      </div>

      {/* Title */}
      <h1 className="mb-3 text-center text-[40px] font-bold text-[#222A3A]">
        RealConnect
      </h1>

      {/* Description */}
      <p className="mb-6 text-center text-2xl text-[#8D8D8D]">
        부동산 관리 시스템에 오신 것을 환영합니다
      </p>
    </>
  );
}
