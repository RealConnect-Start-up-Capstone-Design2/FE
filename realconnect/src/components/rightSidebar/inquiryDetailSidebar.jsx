import React from "react";
import "./inquiryDetailSidebar.css";

const InquiryDetailSidebar = ({ inquiry, onClose, isClosing ,onEdit}) => {

  return (
    <div className={`inquiry-detail-sidebar ${isClosing ? "closing" : ""}`}>
      <div className="sidebar-header">
        <div className="sidebar-header-title">{inquiry.complex}</div>
        <button className="close-button" onClick={onClose}>
          ×
        </button>
      </div>

      <div className="property-addresses">
        <div className="property-address">
          <div className="address-icon">🏠</div>
          <div className="address-text">
            <div>관련 매물 1</div>
            <div>파크리오 101-3301 34 C</div>
          </div>
        </div>
        <div className="property-address">
          <div className="address-icon">🏠</div>
          <div className="address-text">
            <div>관련 매물 1</div>
            <div>파크리오 101-3301 34 C</div>
          </div>
        </div>
        <div className="more-button">더보기</div>
      </div>

      <div className="price-info">
        <div className="price-label">매매 {inquiry.sellPrice}</div>
        <div className="price-label">전세 {inquiry.deposit}</div>
        <div className="price-label">
          보증금/월세 {inquiry.rentDeposit}/{inquiry.monthlyRent}
        </div>
      </div>

      <div className="contact-info">
        <div className="info-row">
          <div className="info-box">
            <h4>문의자</h4>
            <p>{inquiry?.name || "김규식"}</p>
          </div>
          <div className="info-box">
            <h4>연락처</h4>
            <p>{inquiry?.phone || "010-1234-2334"}</p>
          </div>
        </div>
      </div>

      <div className="inquiry-info">
        <div className="info-row">
          <div className="info-box">
            <h4>문의 유형</h4>
            <p>{inquiry.transactionType}</p>
          </div>
          <div className="info-box">
            <h4>진행 상태</h4>
            <p className={inquiry.status.replace(/\s+/g, "")}>
              {inquiry.status}
            </p>
          </div>
        </div>
      </div>

      <div className="property-details">
        <div className="info-row">
          <div className="info-box">
            <h4>면적</h4>
            <p>{inquiry.area} m²</p>
          </div>
          <div className="info-box">
            <h4>등록일</h4>
            <p>{inquiry.date}</p>
          </div>
        </div>
      </div>

      <div className="inquiry-content">
        <h3>문의 내용</h3>
        <p>집주인 재계약 원하지 않음</p>
        <p>확실한 6주 안에 완료될 집</p>
      </div>

      <div className="action-buttons">
        <button className="primary-button" onClick={onEdit}>수정하기</button>
        <div className="button-group">
          <button className="secondary-button">계약 작성</button>
          <button className="secondary-button">공유하기</button>
        </div>
      </div>
    </div>
  );
};

export default InquiryDetailSidebar;
