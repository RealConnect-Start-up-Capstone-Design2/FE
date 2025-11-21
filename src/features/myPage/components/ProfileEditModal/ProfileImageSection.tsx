import CameraIcon from "@/assets/Camera.svg";

export function ProfileImageSection() {
  return (
    <div className="flex-shrink-0 flex items-start">
      <div className="relative">
        <div className="w-[220px] h-[220px] rounded-full bg-[#EDEDED]"></div>
        <button className="absolute bottom-0 right-0 w-[34px] h-[34px] rounded-full bg-[#B1B6C7] border-[3px] border-white flex items-center justify-center">
          <img src={CameraIcon} alt="카메라" className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}

