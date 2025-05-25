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
  });
  const [isLoading, setIsLoading] = useState(false);

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

  if (!property) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    // API 요청 시작
    setIsLoading(true);

    try {
      // API 요청 데이터 준비
      const apiData = {
        ownerName: formData.owner || "",
        ownerPhone: formData.contact || "",
        tenantName: formData.tenant || "",
        tenantPhone: formData.tenantContact || "",
        salePrice: formData.sellPrice
          ? parseFloat(formData.sellPrice) * 100000000
          : 0,
        jeonsePrice: formData.deposit
          ? parseFloat(formData.deposit) * 100000000
          : 0,
        deposit: formData.rentDeposit
          ? parseFloat(formData.rentDeposit) * 100000000
          : 0,
        monthPrice: formData.monthlyRent ? parseInt(formData.monthlyRent) : 0,
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

      // API 요청 보내기
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/properties/${property.id}`,
        apiData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("매물 정보 업데이트 성공:", response.data);

      // 성공 시 부모 컴포넌트에 알림
      if (onSave) {
        // API 응답 데이터와 기존 formData를 합쳐서 전달
        const updatedProperty = {
          ...property,
          ...formData,
          // API 응답 데이터가 있으면 추가
          ...(response.data && { apiResponse: response.data }),
        };
        onSave(updatedProperty);
      }
    } catch (error) {
      console.error("매물 정보 업데이트 실패:", error);
      alert("매물 정보 업데이트에 실패했습니다. 다시 시도해주세요.");
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
            name="sellPrice"
            value={formData.sellPrice}
            onChange={handleChange}
          />
        </div>

        <div className="modify-form-item">
          <label>전세</label>
          <input
            name="deposit"
            value={formData.deposit}
            onChange={handleChange}
          />
        </div>

        <div className="modify-form-item">
          <label>보증금/월세</label>
          <input
            name="rentDeposit"
            value={`${formData.rentDeposit}/${formData.monthlyRent}`}
            onChange={(e) => {
              const [rent, month] = e.target.value.split("/");
              setFormData((prev) => ({
                ...prev,
                rentDeposit: rent || "",
                monthlyRent: month || "",
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
              name="owner"
              value={formData.owner}
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
              placeholder={formData.endDate}
              value={formData.endDate}
              onChange={handleChange}
            />
          </div>
          <div className="modify-info-box">
            <label>등록일</label>
            <input
              name="startDate"
              placeholder={formData.startDate}
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
        {isLoading ? "저장 중..." : "저장하기"}
      </button>
    </div>
  );
};

export default PropertyModifySidebar;
