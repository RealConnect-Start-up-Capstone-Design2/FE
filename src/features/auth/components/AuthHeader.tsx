import loginLogo from "@/assets/icons/loginLogo.svg";

export function AuthHeader() {
  return (
    <>
      {/* Logo */}
      <div className="mb-5 mt-8 flex items-center justify-center">
        <img src={loginLogo} alt="" aria-hidden="true" />
      </div>

      {/* Title */}
      <h1 className="mb-3 text-center text-[40px] font-bold text-[#222A3A]">
        RealConnect
      </h1>

      {/* Description */}
      <p className="mb-6 text-center text-2xl text-[#8D8D8D]">
        공인중개사 업무 CRM 포트폴리오
      </p>
    </>
  );
}
