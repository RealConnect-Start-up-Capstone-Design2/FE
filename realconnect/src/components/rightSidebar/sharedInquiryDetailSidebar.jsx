import React from "react";
import "./sharedInquiryDetailSidebar.css";

const SharedInquiryDetailSidebar = ({
  inquiry,
  onClose,
  isClosing,
  onEdit,
  isMyInquiry,
}) => {
  // 문의 유형에 따른 표시 텍스트 변환 함수
  const formatInquiryType = (type) => {
    switch (type) {
      case "BUY":
        return "매매";
      case "JEONSE":
        return "전세";
      case "MONTHLY_RENT":
        return "월세";
      default:
        return type;
    }
  };

  return (
    <div
      className={`shared-inquiry-detail-sidebar ${isClosing ? "closing" : ""}`}
    >
      <div className="sidebar-header">
        <div className="sidebar-header-title">{inquiry.title}</div>
        <button className="close-button" onClick={onClose}>
          ×
        </button>
      </div>

      <div className="property-addresses">
        <div className="property-address">
          <div className="address-icon">🏠</div>
          <div className="address-text">
            <div>
              {inquiry.l1} {inquiry.l2} {inquiry.l3}
            </div>
            <div>
              {inquiry.apartmentName} {inquiry.dong} {inquiry.ho}
            </div>
          </div>
        </div>
      </div>

      <div className="price-info">
        {inquiry.salePrice && (
          <div className="price-label">매매 {inquiry.salePrice}</div>
        )}
        {inquiry.jeonsePrice && (
          <div className="price-label">
            전세
            {inquiry.jeonsePrice === "0" ? "정보 없음" : inquiry.jeonsePrice}
          </div>
        )}
        {inquiry.deposit && inquiry.monthPrice === 0 ? (
          <div className="price-label">보증금/월세 정보 없음</div>
        ) : (
          <div className="price-label">
            보증금/월세{" "}
            {inquiry.deposit === 0
              ? "정보 없음"
              : inquiry.deposit + "/" + inquiry.monthPrice}
          </div>
        )}
      </div>

      {/* 문의자 정보 - 자신의 문의일 경우에만 표시 */}
      {isMyInquiry && (
        <div className="contact-info">
          <div className="info-row">
            <div className="info-box">
              <h4>문의자</h4>
              <p>{inquiry.customerName || "등록 부동산에 문의"}</p>
            </div>
            <div className="info-box">
              <h4>연락처</h4>
              <p>{inquiry.customerPhone || "등록 부동산에 문의"}</p>
            </div>
          </div>
        </div>
      )}

      <div className="inquiry-info">
        <div className="info-row">
          <div className="info-box">
            <h4>문의 유형</h4>
            <p>{formatInquiryType(inquiry.type)}</p>
          </div>
          <div className="info-box">
            <h4>진행 상태</h4>
            <p className={inquiry.status?.replace(/\s+/g, "")}>
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
            <p>{inquiry.createdAt}</p>
          </div>
        </div>
      </div>

      <div className="inquiry-content">
        <h3>문의 내용</h3>
        <p>{inquiry.memo}</p>
      </div>

      <div className="action-buttons">
        <button
          className="primary-button"
          onClick={onEdit}
          disabled={!isMyInquiry}
          style={{
            opacity: isMyInquiry ? 1 : 0.5,
            cursor: isMyInquiry ? "pointer" : "not-allowed",
          }}
        >
          수정하기
        </button>
      </div>
    </div>
  );
};

export default SharedInquiryDetailSidebar;
