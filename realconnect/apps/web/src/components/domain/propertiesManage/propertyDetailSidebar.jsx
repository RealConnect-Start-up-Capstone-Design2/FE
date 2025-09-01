import React, { useState, useEffect } from "react";
import "./propertyDetailSidebar.css";
import useAuthStore from "@/store/authStore";
import axios from "axios";
import CreateContractModal from "@/pages/modal/createContractModal";
import InfoRow from "@/components/common/info/InfoRow";
import InfoBox from "@/components/common/info/InfoBox";
import DetailSidebar from "@/components/common/rightSidebar/DetailSidebar";
import PropertyModifySidebar from "./propertyModifySidebar";
import {
  formatPrice,
  useImageLoader,
} from "../../../../../../packages/shared-utils";

const PropertyDetailSidebar = ({ property, onClose, isClosing, onEdit }) => {
  const [activeTab, setActiveTab] = useState("floor");
  const accessToken = useAuthStore((state) => state.accessToken);
  const [isContractModalOpen, setIsContractModalOpen] = useState(false);
  const [isSubmittingContract, setIsSubmittingContract] = useState(false);

  // 새로운 useImageLoader Hook 사용
  const {
    imageUrl: floorPlanImage,
    loading: floorPlanLoading,
    error: floorPlanError,
  } = useImageLoader(property?.img, accessToken, { enabled: !!property?.img });

  const {
    imageUrl: viewImage,
    loading: viewLoading,
    error: viewError,
  } = useImageLoader(property?.viewImg, accessToken, {
    enabled: !!property?.viewImg,
  });

  // 기존 복잡한 이미지 로딩 로직이 useImageLoader Hook으로 대체되었습니다

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

  // 액션 버튼 구성
  const actions = [
    {
      label: "수정하기",
      type: "edit",
      className: "property-primary-button",
    },
    {
      label: isSubmittingContract ? "처리 중..." : "계약 작성",
      onClick: handleContractButtonClick,
      className: "secondary-button",
      disabled: isSubmittingContract,
    },
  ];

  return (
    <>
      <DetailSidebar
        title={`${property.apartmentName} ${property.dong}동 ${property.ho}호`}
        onClose={onClose}
        isClosing={isClosing}
        actions={actions}
        editComponent={PropertyModifySidebar}
        data={property}
        onUpdate={onEdit}
        className="property-detail-sidebar"
      >
        <div className="property-image-placeholder">
          {(() => {
            // 전망 이미지가 없으면 평면도 이미지로 대체
            const currentImage =
              activeTab === "floor"
                ? floorPlanImage
                : viewImage || floorPlanImage;
            const altText = activeTab === "floor" ? "평면도" : "전망";

            if (currentImage) {
              return (
                <img
                  src={currentImage}
                  alt={`${property.apartmentName} ${property.dong} ${property.ho} ${altText}`}
                  style={{ objectFit: "contain" }}
                />
              );
            } else {
              return (
                <div className="image-loading">
                  <p>
                    {altText} 이미지{" "}
                    {activeTab === "view" && !viewImage
                      ? "(평면도로 대체)"
                      : ""}{" "}
                    로딩 중...
                  </p>
                </div>
              );
            }
          })()}
          <div className="floor-plan-placeholder"></div>
          <div className="image-control-buttons">
            <button
              className={`control-button ${activeTab === "floor" ? "active" : ""}`}
              onClick={() => setActiveTab("floor")}
            >
              평면도
            </button>
            <button
              className={`control-button ${activeTab === "view" ? "active" : ""}`}
              onClick={() => setActiveTab("view")}
            >
              전망
            </button>
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
            <InfoRow>
              <InfoBox title="소유주" value={property.ownerName} />
              <InfoBox title="소유주 연락처" value={property.ownerPhone} />
            </InfoRow>
            <InfoRow>
              <InfoBox title="입주인" value={property.tenantName} />
              <InfoBox title="입주인 연락처" value={property.tenantPhone} />
            </InfoRow>
            <InfoRow>
              <InfoBox title="만기일" value={property.endDate} />
              <InfoBox title="등록일" value={property.startDate} />
            </InfoRow>
          </div>

          <div className="note-section custom">
            <p className="note-section-title">상담 내용</p>
            <div className="note-content">
              <p>{property.memo}</p>
            </div>
          </div>
        </div>
      </DetailSidebar>

      {/* 계약 작성 모달 */}
      <CreateContractModal
        isOpen={isContractModalOpen}
        onClose={handleContractModalClose}
        onSubmit={handleContractSubmit}
        property={property}
      />
    </>
  );
};

export default PropertyDetailSidebar;
