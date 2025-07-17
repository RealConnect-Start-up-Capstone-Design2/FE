import React, { useState, useEffect } from "react";
import "./propertyModifySidebar.css";
import ContractStatus from "../sortButtons/contractStatus";
import ContractTagButton from "../tagbuttons/ContractTagButton";
import DirectionTagButton from "../tagbuttons/DirectionTagButton";
import ExpansionTagButton from "../tagbuttons/ExpansionTagButton";
import WardrobeTagButton from "../tagbuttons/WardrobeTagButton";
import axios from "axios";
import useAuthStore from "../../store/authStore";

const PropertyModifySidebar = ({ property, onClose, onSave }) => {
  const [imageUrl, setImageUrl] = useState(null);
  const accessToken = useAuthStore((state) => state.accessToken);
  const [formData, setFormData] = useState({
    expansion: "",
    wardrobe: "",
    direction: "",
    salePrice: "",
    jeonsePrice: "",
    deposit: "",
    monthPrice: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // property 객체 존재 여부 확인
  const isNewProperty = property.status;

  // 유효성 검사 함수
  const validateForm = () => {
    const newErrors = {};
    
    // 필수 필드 검사
    if (!formData.startDate) {
      newErrors.startDate = "등록일을 입력해주세요.";
    }
    
    if (!formData.endDate) {
      newErrors.endDate = "만기일을 입력해주세요.";
    }
    
    // 날짜 유효성 검사
    if (formData.startDate && formData.endDate) {
      const startDate = new Date(formData.startDate);
      const endDate = new Date(formData.endDate);
      
      if (startDate >= endDate) {
        newErrors.endDate = "만기일은 등록일보다 늦은 날짜여야 합니다.";
      }
    }
    
    // 가격 중 하나는 반드시 입력해야 함
    const hasSalePrice = formData.salePrice && formData.salePrice.replace(/,/g, "") !== "";
    const hasJeonsePrice = formData.jeonsePrice && formData.jeonsePrice.replace(/,/g, "") !== "";
    const hasMonthlyPrice = (formData.deposit && formData.deposit !== "") || (formData.monthPrice && formData.monthPrice !== "");
    
    if (!hasSalePrice && !hasJeonsePrice && !hasMonthlyPrice) {
      newErrors.price = "매매, 전세, 월세 중 하나는 반드시 입력해주세요.";
    }
    
    // 소유주 정보 검사
    if (!formData.ownerName) {
      newErrors.ownerName = "소유주 이름을 입력해주세요.";
    }
    
    if (!formData.contact) {
      newErrors.contact = "연락처를 입력해주세요(숫자만 입력)";
    } else if (!/^\d{3}-\d{4}-\d{4}$/.test(formData.contact)) {
      newErrors.contact = "올바른 연락처 형식으로 입력해주세요.";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 에러 메시지 클리어 함수
  const clearFieldError = (fieldName) => {
    if (errors[fieldName]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[fieldName];
        return newErrors;
      });
    }
  };

  useEffect(() => {
    if (!property) return;

    // "-" 값을 빈 문자열로 변환하는 함수
    const convertDashToEmpty = (value) => {
      return value === "-" ? "" : value || "";
    };

    // 숫자에 콤마 포맷팅을 적용하는 함수
    const formatNumberWithCommas = (value) => {
      if (!value || value === "-") return "";
      const numValue = value.toString().replace(/[^0-9]/g, "");
      return numValue ? numValue.replace(/\B(?=(\d{3})+(?!\d))/g, ",") : "";
    };

    setFormData({
      expansion: property.expansion || "확장",
      wardrobe: property.wardrobe || "붙박이장",
      direction: property.direction || "남향",
      ...property,
      // 가격 관련 필드들의 "-" 값을 빈 문자열로 처리하고 콤마 포맷팅 적용
      salePrice: formatNumberWithCommas(property.salePrice),
      jeonsePrice: formatNumberWithCommas(property.jeonsePrice),
      deposit: formatNumberWithCommas(property.deposit),
      monthPrice: formatNumberWithCommas(property.monthPrice),
      // 기타 필드들의 "-" 값을 빈 문자열로 처리
      ownerName: convertDashToEmpty(property.ownerName),
      contact: convertDashToEmpty(property.contact),
      tenant: convertDashToEmpty(property.tenant),
      tenantContact: convertDashToEmpty(property.tenantContact),
      note1: convertDashToEmpty(property.note1),
      startDate: convertDashToEmpty(property.startDate),
      endDate: convertDashToEmpty(property.endDate),
    });
  }, [property, accessToken]);

  // 이미지 로딩 useEffect
  useEffect(() => {
    if (property && property.img) {
      const loadImage = async () => {
        try {
          const response = await axios.get(
            `${import.meta.env.VITE_API_URL}${property.img}`,
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
              responseType: "blob",
            }
          );
          const url = URL.createObjectURL(response.data);
          setImageUrl(url);
        } catch (error) {
          console.error("이미지 로드 실패:", error);
          setImageUrl(null);
        }
      };

      loadImage();

      // 컴포넌트 언마운트 시 Blob URL 해제
      return () => {
        if (imageUrl) {
          URL.revokeObjectURL(imageUrl);
        }
      };
    }
  }, [property, accessToken]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // 필드 변경 시 해당 필드의 에러 메시지 클리어
    clearFieldError(name);
    clearFieldError('price'); // 가격 관련 필드 변경 시 가격 에러도 클리어

    // 필드 유형에 따라 다른 처리
    if (
      name === "ownerName" ||
      name === "tenant" ||
      name === "note1" ||
      name === "startDate" ||
      name === "endDate"
    ) {
      // 문자열 필드는 그대로 저장
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
    // 전화번호 필드 처리
    else if (name === "contact" || name === "tenantContact") {
      // 빈 값이면 그대로 저장
      if (value === "") {
        setFormData((prev) => ({
          ...prev,
          [name]: "",
        }));
        return;
      }
      
      // 숫자만 추출
      const numbersOnly = value.replace(/[^0-9]/g, "");
      
      // 숫자가 없으면 빈 문자열로 저장
      if (numbersOnly === "") {
        setFormData((prev) => ({
          ...prev,
          [name]: "",
        }));
        return;
      }

      // 전화번호 포맷팅 (xxx-xxxx-xxxx)
      let formattedPhone = "";
      if (numbersOnly.length <= 3) {
        formattedPhone = numbersOnly;
      } else if (numbersOnly.length <= 7) {
        formattedPhone = `${numbersOnly.slice(0, 3)}-${numbersOnly.slice(3)}`;
      } else {
        formattedPhone = `${numbersOnly.slice(0, 3)}-${numbersOnly.slice(3, 7)}-${numbersOnly.slice(7, 11)}`;
      }

      setFormData((prev) => ({
        ...prev,
        [name]: formattedPhone,
      }));
    }
    // 가격 필드 처리 (매매, 전세)
    else if (name === "salePrice" || name === "jeonsePrice") {
      // 빈 값이면 그대로 저장
      if (value === "") {
        setFormData((prev) => ({
          ...prev,
          [name]: "",
        }));
        return;
      }
      
      // 숫자 외의 문자 제거
      let numbersOnly = value.replace(/[^0-9]/g, "");
      
      // 숫자가 없으면 빈 문자열로 저장
      if (numbersOnly === "") {
        setFormData((prev) => ({
          ...prev,
          [name]: "",
        }));
        return;
      }
      
      // 세 자리마다 쉼표 추가
      let formattedValue = numbersOnly.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      
      setFormData((prev) => ({
        ...prev,
        [name]: formattedValue,
      }));
    }
  };

  const handleSave = async () => {
    // 유효성 검사
    if (!validateForm()) {
      return;
    }

    // API 요청 시작
    setIsLoading(true);

    try {
      // API 요청 데이터 준비
      const apiData = {
        ...(isNewProperty === "미등록"
          ? {
              apartmentId: formData.id, // 아파트 ID 사용
            }
          : {}),
        ownerName: formData.ownerName || "",
        ownerPhone: formData.contact || "",
        tenantName: formData.tenant || "",
        tenantPhone: formData.tenantContact || "",
        salePrice: formData.salePrice
          ? parseInt(formData.salePrice.replace(/,/g, "")) // 쉼표 제거 후 정수로 변환
          : 0,
        jeonsePrice: formData.jeonsePrice
          ? parseInt(formData.jeonsePrice.replace(/,/g, "")) // 쉼표 제거 후 정수로 변환
          : 0,
        deposit: formData.deposit
          ? parseInt(formData.deposit) // 쉼표 제거 후 정수로 변환
          : 0,
        monthPrice: formData.monthPrice
          ? parseInt(formData.monthPrice) // 쉼표 제거 후 정수로 변환
          : 0,
        status:
          formData.status === "계약 전"
            ? "WAITING"
            : formData.status === "계약 중"
              ? "RESERVED"
              : formData.status === "계약 완료"
                ? "CONTRACTED"
                : "WAITING",
        memo: formData.note1 || "",
        startDate: formData.startDate || "",
        endDate: formData.endDate || "",
        // 추가 필드: 태그 정보
        direction: formData.direction || "",
        expansion: formData.expansion || "",
        wardrobe: formData.wardrobe || "",
      };

      let response;

      // property 객체가 없는 경우 POST 요청
      if (isNewProperty === "미등록") {
        // POST 요청 보내기 (새로운 매물 생성)
        response = await axios.post(
          `${import.meta.env.VITE_API_URL}/api/properties`,
          apiData,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "Content-Type": "application/json",
            },
          }
        );
        console.log("새 매물 정보 생성 성공:", response.data);
      } else {
        // PUT 요청 보내기 (기존 매물 수정) - property.id는 propertiesManage.jsx에서 apartmentId로 설정됨
        response = await axios.put(
          `${import.meta.env.VITE_API_URL}/api/properties/${property.rawData.property.id}`,
          apiData,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "Content-Type": "application/json",
            },
          }
        );
        console.log("매물 정보 업데이트 성공:", response.data);
      }

      // 성공 시 부모 컴포넌트에 알림
      if (onSave) {
        onSave(property); // 간단히 기존 property 객체만 전달
      }
    } catch (error) {
      console.error("매물 정보 저장 실패:", error);
      
      // 서버 에러 응답에 따른 구체적인 에러 메시지
      let errorMessage = "";
      if (error.response) {
        switch (error.response.status) {
          case 400:
            errorMessage = "입력한 정보에 오류가 있습니다. 다시 확인해주세요.";
            break;
          case 401:
            errorMessage = "로그인이 필요합니다. 다시 로그인해주세요.";
            break;
          case 403:
            errorMessage = "권한이 없습니다.";
            break;
          case 404:
            errorMessage = "해당 매물을 찾을 수 없습니다.";
            break;
          case 500:
            errorMessage = "서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.";
            break;
          default:
            errorMessage = isNewProperty === "미등록"
              ? "매물 정보 추가에 실패했습니다."
              : "매물 정보 수정에 실패했습니다.";
        }
      } else {
        errorMessage = "네트워크 오류가 발생했습니다. 인터넷 연결을 확인해주세요.";
      }
      
      alert(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="property-modify-sidebar">
      <div className="modify-sidebar-header">
        <div className="modify-sidebar-header-title">
          {property.apartmentName} {property.building} {property.unit}
        </div>
        <button className="modify-close-button" onClick={onClose}>
          ×
        </button>
      </div>

      <div className="modify-property-image-placeholder">
        <div className="modify-floor-plan-placeholder">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={`${property.apartmentName} ${property.building} ${property.unit} 평면도`}
              style={{
                objectFit: "contain",
                width: "100%",
                height: "100%",
                maxWidth: "100%",
                maxHeight: "100%",
              }}
            />
          ) : (
            <div className="image-loading">
              <p>평면도 이미지 로딩 중...</p>
            </div>
          )}
        </div>
      </div>

      <div className="modify-property-tags">
        <DirectionTagButton
          className="tag-direction-button"
          value={formData.direction}
          onChange={(val) =>
            setFormData((prev) => ({ ...prev, direction: val }))
          }
        />
        <ExpansionTagButton
          className="tag-expansion-button"
          value={formData.expansion}
          onChange={(val) =>
            setFormData((prev) => ({ ...prev, expansion: val }))
          }
        />
        <WardrobeTagButton
          className="tag-wardrobe-button"
          value={formData.wardrobe}
          onChange={(val) =>
            setFormData((prev) => ({ ...prev, wardrobe: val }))
          }
        />
        <ContractTagButton
          className="tag-contract-button"
          value={formData.status}
          onChange={(value) =>
            setFormData((prev) => ({ ...prev, status: value }))
          }
        />
      </div>

      <div className="modify-form">
        <div className="modify-form-item">
          <label>매매</label>
          <input
            name="salePrice"
            value={formData.salePrice}
            onChange={handleChange}
            placeholder="매매 금액을 입력해주세요"
            className={errors.price ? "error" : ""}
          />
        </div>

        <div className="modify-form-item">
          <label>전세</label>
          <input
            name="jeonsePrice"
            value={formData.jeonsePrice}
            onChange={handleChange}
            placeholder="전세 보증금을 입력해주세요"
            className={errors.price ? "error" : ""}
          />
        </div>

        <div className="modify-form-item">
          <label>보증금/월세</label>
          <input
            name="deposit"
            value={`${formData.deposit || ""}/${formData.monthPrice || ""}`}
            onChange={(e) => {
              const value = e.target.value;
              
              // 빈 값이면 둘 다 빈 문자열로 설정
              if (value === "") {
                setFormData((prev) => ({
                  ...prev,
                  deposit: "",
                  monthPrice: "",
                }));
                clearFieldError('price');
                return;
              }
              
              const [rent, month] = value.split("/");
              
              // 숫자만 추출하고 포맷팅
              const rentNumbers = rent ? rent.replace(/[^0-9]/g, "") : "";
              const monthNumbers = month ? month.replace(/[^0-9]/g, "") : "";
              
              // 숫자가 있으면 쉼표 추가
              const formattedRent = rentNumbers ? rentNumbers.replace(/\B(?=(\d{3})+(?!\d))/g, ",") : "";
              const formattedMonth = monthNumbers ? monthNumbers.replace(/\B(?=(\d{3})+(?!\d))/g, ",") : "";
              
              setFormData((prev) => ({
                ...prev,
                deposit: formattedRent,
                monthPrice: formattedMonth,
              }));
              clearFieldError('price');
            }}
            placeholder="보증금/월세를 입력해주세요"
            className={errors.price ? "error" : ""}
          />
        </div>
        {errors.price && (
          <div className="error-message">{errors.price}</div>
        )}
      </div>
      
      <div className="modify-info-row">
        <div className="modify-info-row-box">
          <div className="modify-info-box">
            <label>소유주 <span className="required">*</span></label>
            <input
              name="ownerName"
              value={formData.ownerName}
              onChange={handleChange}
              placeholder="소유주 이름을 입력해주세요"
              className={errors.ownerName ? "error" : ""}
            />
            {errors.ownerName && (
              <div className="error-message">{errors.ownerName}</div>
            )}
          </div>
          <div className="modify-info-box">
            <label>소유주 연락처 <span className="required">*</span></label>
            <input
              name="contact"
              value={formData.contact}
              onChange={handleChange}
              placeholder="소유주 연락처를 입력해주세요"
              className={errors.contact ? "error" : ""}
            />
            {errors.contact && (
              <div className="error-message">{errors.contact}</div>
            )}
          </div>
        </div>

        <div className="modify-info-row-box">
          <div className="modify-info-box">
            <label>임차인</label>
            <input
              name="tenant"
              value={formData.tenant}
              onChange={handleChange}
              placeholder="임차인 이름을 입력해주세요"
            />
          </div>
          <div className="modify-info-box">
            <label>임차인 연락처</label>
            <input
              name="tenantContact"
              value={formData.tenantContact}
              onChange={handleChange}
              placeholder="임차인 연락처를 입력해주세요"
            />
          </div>
        </div>

        <div className="modify-info-row-box">
          <div className="modify-info-box">
            <label>만기일 <span className="required">*</span></label>
            <input
              type="date"
              name="endDate"
              placeholder="yyyy-mm-dd"
              value={formData.endDate}
              onChange={handleChange}
              className={errors.endDate ? "error" : ""}
            />
            {errors.endDate && (
              <div className="error-message">{errors.endDate}</div>
            )}
          </div>
          <div className="modify-info-box">
            <label>등록일 <span className="required">*</span></label>
            <input
              type="date"
              name="startDate"
              placeholder="yyyy-mm-dd"
              value={formData.startDate}
              onChange={handleChange}
              className={errors.startDate ? "error" : ""}
            />
            {errors.startDate && (
              <div className="error-message">{errors.startDate}</div>
            )}
          </div>
        </div>
      </div>

      <div className="modify-note-section">
        <label>상담 내용</label>
        <textarea
          name="note1"
          value={formData.note1}
          onChange={handleChange}
          placeholder="상담 내용을 입력해주세요"
        />
      </div>

      <button
        className="modify-save-button"
        onClick={handleSave}
        disabled={isLoading}
      >
        {isLoading
          ? "저장 중..."
          : isNewProperty === "미등록"
            ? "정보 추가하기"
            : "수정하기"}
      </button>
    </div>
  );
};

export default PropertyModifySidebar;
