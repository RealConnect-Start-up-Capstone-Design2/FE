import React, { useState, useEffect } from "react";
import "./propertyModifySidebar.css";
import ContractStatus from "../sortButtons/contractStatus";
import ContractTagButton from "../tagButtons/ContractTagButton";
import DirectionTagButton from "../tagButtons/DirectionTagButton";
import ExpansionTagButton from "../tagButtons/ExpansionTagButton";
import WardrobeTagButton from "../tagButtons/WardrobeTagButton";
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

  // property 객체 존재 여부 확인
  const isNewProperty = property.status;

  useEffect(() => {
    if (!property) return;

    setFormData({
      expansion: property.expansion || "확장",
      wardrobe: property.wardrobe || "붙박이장",
      direction: property.direction || "남향",
      ...property,
    });

    // 이미지가 있으면 이미지 URL 생성
    if (property && property.img) {
      const loadImage = async () => {
        try {
          // 이미지를 Blob으로 가져오기
          const response = await axios.get(
            `${import.meta.env.VITE_API_URL}${property.img}`,
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
              responseType: "blob",
            }
          );

          // Blob URL 생성
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

  useEffect(() => {
    // console.log(property.id);
    console.log(property.rawData.property.id);
    // 숫자 외의 문자 제거 후 세 자리마다 쉼표 추가
    const formatWithCommas = (value) => {
      // value가 문자열일 때만 처리
      if (typeof value === "string" || typeof value === "number") {
        return value
          .toString() // 숫자라면 문자열로 변환
          .replace(/\B(?=(\d{3})+(?!\d))/g, ","); // 세 자리마다 쉼표 추가
      }
      return value;
    };
    setFormData((prev) => ({
      ...prev,
      salePrice: formatWithCommas(prev.salePrice),
      jeonsePrice: formatWithCommas(prev.jeonsePrice),
    }));
  }, [formData.salePrice, formData.jeonsePrice]);

  const handleChange = (e) => {
    const { name, value } = e.target;

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
      // 숫자만 추출
      const numbersOnly = value.replace(/[^0-9]/g, "");

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
    // 가격 필드 처리 (기존 로직)
    else {
      // 숫자 외의 문자 제거 후 세 자리마다 쉼표 추가
      let formattedValue = value.replace(/[^0-9]/g, ""); // 숫자 외의 문자 제거
      formattedValue = formattedValue.replace(/\B(?=(\d{3})+(?!\d))/g, ","); // 세 자리마다 쉼표 추가

      // 업데이트된 값만 저장
      setFormData((prev) => ({
        ...prev,
        [name]: formattedValue,
      }));
    }
  };

  const handleSave = async () => {
    // API 요청 시작
    setIsLoading(true);

    try {
      // API 요청 데이터 준비
      const apiData = {
        ...(isNewProperty === "미등록"
          ? {
              apartmentId: property.id, // 아파트 ID 사용
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
      alert(
        isNewProperty
          ? "매물 정보 추가에 실패했습니다."
          : "매물 정보 수정에 실패했습니다."
      );
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
              alt={`${property.apartmentName} ${property.building} ${property.unit}`}
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
              <p>이미지 로딩 중...</p>
            </div>
          )}
        </div>
        <div className="modify-image-control-buttons">
          <button className="modify-control-button active">평면도</button>
          <button className="modify-control-button">전망</button>
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
          />
        </div>

        <div className="modify-form-item">
          <label>전세</label>
          <input
            name="jeonsePrice"
            value={formData.jeonsePrice}
            onChange={handleChange}
          />
        </div>

        <div className="modify-form-item">
          <label>보증금/월세</label>
          <input
            name="deposit"
            value={`${formData.deposit}/${formData.monthPrice}`}
            onChange={(e) => {
              const [rent, month] = e.target.value.split("/");
              setFormData((prev) => ({
                ...prev,
                deposit: rent || "",
                monthPrice: month || "",
              }));
            }}
          />
        </div>
      </div>
      <div className="modify-info-row">
        <div className="modify-info-row-box">
          <div className="modify-info-box">
            <label>소유주</label>
            <input
              name="ownerName"
              value={formData.ownerName}
              onChange={handleChange}
            />
          </div>
          <div className="modify-info-box">
            <label>소유주 연락처</label>
            <input
              name="contact"
              value={formData.contact}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="modify-info-row-box">
          <div className="modify-info-box">
            <label>임차인</label>
            <input
              name="tenant"
              value={formData.tenant}
              onChange={handleChange}
            />
          </div>
          <div className="modify-info-box">
            <label>임차인 연락처</label>
            <input
              name="tenantContact"
              value={formData.tenantContact}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="modify-info-row-box">
          <div className="modify-info-box">
            <label>만기일</label>
            <input
              name="endDate"
              placeholder="yyyy-mm-dd"
              value={formData.endDate}
              onChange={handleChange}
            />
          </div>
          <div className="modify-info-box">
            <label>등록일</label>
            <input
              name="startDate"
              placeholder="yyyy-mm-dd"
              value={formData.startDate}
              onChange={handleChange}
            />
          </div>
        </div>
      </div>

      <div className="modify-note-section">
        <label>상담 내용</label>
        <textarea
          name="note1"
          value={formData.note1}
          onChange={handleChange}
          placeholder={property.memo}
        />
      </div>

      <button
        className="modify-save-button"
        onClick={handleSave}
        disabled={isLoading}
      >
        {isLoading
          ? "저장 중..."
          : isNewProperty
            ? "정보 추가하기"
            : "수정하기"}
      </button>
    </div>
  );
};

export default PropertyModifySidebar;
