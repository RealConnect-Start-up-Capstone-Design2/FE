interface AddressData {
  roadAddress: string;
  jibunAddress: string;
  zonecode: string;
  bname?: string;
  buildingName?: string;
  sigunguCode?: string;
  roadNameAddressCode?: string;
  sido?: string;
  sigungu?: string;
}

declare global {
  interface Window {
    daum?: {
      Postcode: new (options: {
        oncomplete: (data: AddressData) => void;
        width?: string | number;
        height?: string | number;
        popupName?: string;
        popupKey?: string;
      }) => {
        open: () => void;
        embed: (element: HTMLElement) => void;
      };
    };
  }
}

export const openNaverAddressSearch = (
  onComplete: (data: {
    roadAddress: string;
    jibunAddress: string;
    zonecode: string;
    bname?: string;
    buildingName?: string;
    sigunguCode?: string;
    roadNameAddressCode?: string;
    sido?: string;
    sigungu?: string;
  }) => void
) => {
  // 모달을 먼저 생성하여 화면 중앙에 즉시 표시
  const modal = document.createElement("div");
  modal.id = "daum-address-search-modal";
  modal.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    z-index: 10000;
    display: flex;
    align-items: center;
    justify-content: center;
  `;

  const popupContainer = document.createElement("div");
  popupContainer.style.cssText = `
    width: 500px;
    height: 565px;
    background: white;
    border-radius: 8px;
    box-shadow: 0 4px 25px rgba(0, 0, 0, 0.25);
    overflow: hidden;
    position: relative;
  `;

  const embedDiv = document.createElement("div");
  embedDiv.id = "daum-postcode-embed";
  embedDiv.style.cssText = `
    width: 100%;
    height: 100%;
  `;

  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      document.body.removeChild(modal);
    }
  });

  popupContainer.appendChild(embedDiv);
  modal.appendChild(popupContainer);
  document.body.appendChild(modal);
  const script = document.createElement("script");
  script.src =
    "https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js";
  script.async = true;

  const loadPostcode = () => {
    if (window.daum?.Postcode) {
      new window.daum.Postcode({
        oncomplete: (data: AddressData) => {
          const fullData = data as unknown as Record<string, unknown>;

          const roadCode =
            (fullData.roadnameCode as string | undefined) ||
            (fullData.roadNameAddressCode as string | undefined) ||
            (fullData.roadCode as string | undefined) ||
            "";

          const bcode = fullData.bcode as string | undefined;
          const sigunguCode =
            (fullData.sigunguCode as string | undefined) ||
            (bcode ? bcode.substring(0, 5) : "") ||
            "";

          const finalRoadCode = roadCode || data.roadAddress || "";

          onComplete({
            roadAddress: data.roadAddress || "",
            jibunAddress: data.jibunAddress || "",
            zonecode: data.zonecode || "",
            bname: data.bname,
            buildingName: data.buildingName,
            sigunguCode: sigunguCode,
            roadNameAddressCode: finalRoadCode,
            sido: (fullData.sido as string | undefined) || "",
            sigungu: (fullData.sigungu as string | undefined) || "",
          });
          document.body.removeChild(modal);
        },
        width: "100%",
        height: "100%",
        popupName: "daumPostcode",
        popupKey: "daumPostcode",
      }).embed(embedDiv);
    }
  };

  script.onload = loadPostcode;

  const existingScript = document.querySelector('script[src*="postcode"]');
  if (existingScript) {
    if (window.daum?.Postcode) {
      loadPostcode();
    } else {
      loadPostcode();
    }
  } else {
    document.head.appendChild(script);
  }
};
