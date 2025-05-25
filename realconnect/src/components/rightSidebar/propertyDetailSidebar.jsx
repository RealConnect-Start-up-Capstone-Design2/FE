import React from "react";
import "./propertyDetailSidebar.css";

const PropertyDetailSidebar = ({ property, onClose, isClosing , onEdit }) => {
  if (!property) return null;

  return (
    <div className={`property-detail-sidebar ${isClosing ? "closing" : ""}`}>
      <div className="sidebar-header">
        <div className="sidebar-header-title">
          {property.complex} {property.building} {property.unit}
        </div>
        <button className="close-button" onClick={onClose}>
          ×
        </button>
      </div>
      <div className="property-image-placeholder">
        <div className="floor-plan-placeholder"></div>
        <div className="image-control-buttons">
          <button className="control-button active">평면도</button>
          <button className="control-button">전망</button>
        </div>
      </div>
      {/* 특징, 거래 상태 */}
      <div className="property-features">
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
            <p>매매 {property.sellPrice}</p>
          </div>
          <div className="price-item">
            <p>전세 {property.deposit}</p>
          </div>
          <div className="price-item">
            <p>
              보증금/월세 {property.rentDeposit}/{property.monthlyRent}
            </p>
          </div>
        </div>

        <div className="contact-info">
          <div className="info-row">
            <div className="info-box">
              <h4>소유주</h4>
              <p>{property.owner}</p>
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
              <p>2025. 3. 18</p>
            </div>
            <div className="info-box">
              <h4>등록일</h4>
              <p>2025. 3. 2.</p>
            </div>
          </div>
        </div>

        <div className="note-section custom">
          <p className="note-section-title">상담 내용</p>
          <div className="note-content">
            <p>집주인 재계약 원하지 않음</p>
            <p>최장실 하자 수리 완료한 집</p>
          </div>
        </div>

        <div className="action-buttons">
          <button className="primary-button" onClick={onEdit}>수정하기</button>
          <button className="secondary-button">계약 작성</button>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetailSidebar;
