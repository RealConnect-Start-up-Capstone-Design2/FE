import React, { useState, useEffect } from "react";
import "./propertyDetailSidebar.css";
import useAuthStore from "../../store/authStore";
import axios from "axios";
import CreateContractModal from "../../pages/modal/createContractModal";

const PropertyDetailSidebar = ({ property, onClose, isClosing, onEdit }) => {
  const [imageUrl, setImageUrl] = useState(null);
  const accessToken = useAuthStore((state) => state.accessToken);
  const [isContractModalOpen, setIsContractModalOpen] = useState(false);
  const [isSubmittingContract, setIsSubmittingContract] = useState(false);

  // 가격 포맷팅 함수
  const formatPrice = (price) => {
    if (!price || price === "-") return "-";

    // 문자열이면서 쉼표가 포함된 경우 처리
    let numericValue;
    if (typeof price === "string") {
      // 쉼표 제거
      const cleanPrice = price.replace(/,/g, "");
      numericValue = Number(cleanPrice);

      // 변환 실패시 기본값 반환
      if (isNaN(numericValue)) return "-";
    } else {
      numericValue = Number(price);
    }

    // 0원이면 "-" 표시
    if (numericValue === 0) return "-";

    // 1억 이상인 경우
    if (numericValue >= 100000000) {
      // 억 단위로 변환 (반올림 없이 소수점 첫째자리까지)
      const billions = Math.floor(numericValue / 10000000) / 10;
      return billions.toFixed(1) + "억";
    }
    // 1억 미만인 경우
    else {
      // 만원 단위로 표시
      const tenThousands = Math.floor(numericValue / 10000);
      return tenThousands.toLocaleString() + "만원";
    }
  };

  useEffect(() => {
    console.log(property);
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

  const handleContractButtonClick = () => {
    setIsContractModalOpen(true);
  };

  const handleContractModalClose = () => {
    setIsContractModalOpen(false);
  };

  const handleContractSubmit = (contractData) => {
    setIsSubmittingContract(true);

    console.log("계약 데이터 저장:", contractData);

    // 성공 메시지 표시
    if (contractData) {
      alert("계약이 성공적으로 생성되었습니다.");
    }

    setIsSubmittingContract(false);
    setIsContractModalOpen(false);
  };

  if (!property) return null;
  return (
    <div className={`property-detail-sidebar ${isClosing ? "closing" : ""}`}>
      <div className="sidebar-header">
        <div className="sidebar-header-title">
          {property.apartmentName} {property.building} {property.unit}
        </div>
        <button className="close-button" onClick={onClose}>
          ×
        </button>
      </div>

      <div className="sidebar-content">
        <div className="property-image-placeholder">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={`${property.apartmentName} ${property.building} ${property.unit}`}
              style={{ objectFit: "contain" }} // 이미지 표시 모드 적용
            />
          ) : (
            <div className="image-loading">
              <p>이미지 로딩 중...</p>
            </div>
          )}
          <div className="floor-plan-placeholder"></div>
          <div className="image-control-buttons">
            <button className="control-button active">평면도</button>
            <button className="control-button">전망</button>
          </div>
        </div>
        {/* 특징, 거래 상태 */}
        <div className="property-features">
          <div className="property-tags">
            {property.direction && (
              <span className="property-tag">{property.direction}</span>
            )}
            {property.expansion && (
              <span className="property-tag">{property.expansion}</span>
            )}
            {property.wardrobe && (
              <span className="property-tag">{property.wardrobe}</span>
            )}
          </div>
          <div className="property-status">
            <p
              className={`property-status-text ${property.status.replace(/\s+/g, "")}`}
            >
              {property.status}
            </p>
          </div>
        </div>
        <div className="property-info">
          <div className="pricing-info">
            <div className="price-item">
              <p>매매 {formatPrice(property.salePrice)}</p>
            </div>
            <div className="price-item">
              <p>전세 {formatPrice(property.jeonsePrice)}</p>
            </div>
            <div className="price-item">
              <p>
                보증금/월세 {property.deposit}/{property.monthPrice}
              </p>
            </div>
          </div>

          <div className="contact-info">
            <div className="info-row">
              <div className="info-box">
                <h4>소유주</h4>
                <p>{property.ownerName}</p>
              </div>
              <div className="info-box">
                <h4>소유주 연락처</h4>
                <p>{property.contact}</p>
              </div>
            </div>

            <div className="info-row">
              <div className="info-box">
                <h4>입주인</h4>
                <p>{property.tenant}</p>
              </div>
              <div className="info-box">
                <h4>입주인 연락처</h4>
                <p>{property.tenantContact}</p>
              </div>
            </div>

            <div className="info-row">
              <div className="info-box">
                <h4>만기일</h4>
                <p>{property.endDate}</p>
              </div>
              <div className="info-box">
                <h4>등록일</h4>
                <p>{property.startDate}</p>
              </div>
            </div>
          </div>

          <div className="note-section custom">
            <p className="note-section-title">상담 내용</p>
            <div className="note-content">
              <p>{property.memo}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="sidebar-footer">
        <div className="action-buttons">
          <button
            className="property-primary-button"
            imageUrl={imageUrl}
            onClick={onEdit}
          >
            수정하기
          </button>
          <button
            className="secondary-button"
            onClick={handleContractButtonClick}
            disabled={isSubmittingContract}
          >
            {isSubmittingContract ? "처리 중..." : "계약 작성"}
          </button>
        </div>
      </div>

      {/* 계약 작성 모달 */}
      <CreateContractModal
        isOpen={isContractModalOpen}
        onClose={handleContractModalClose}
        onSubmit={handleContractSubmit}
        property={property}
      />
    </div>
  );
};

export default PropertyDetailSidebar;
