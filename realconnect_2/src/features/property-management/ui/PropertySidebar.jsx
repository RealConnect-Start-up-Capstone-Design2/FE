import React from "react";
import styles from "./PropertySidebar.module.css";
import { formatPrice, formatArea } from "@shared/lib";

export const PropertySidebar = ({
  property,
  isEditMode,
  isClosing,
  onClose,
  onEdit,
}) => {
  return (
    <>
      {/* 오버레이 */}
      <div
        className={`${styles.overlay} ${isClosing ? styles.closing : ""}`}
        onClick={onClose}
      />

      {/* 사이드바 */}
      <div className={`${styles.sidebar} ${isClosing ? styles.closing : ""}`}>
        {/* 헤더 */}
        <div className={styles.header}>
          <h3 className={styles.title}>
            {isEditMode ? "매물 정보 수정" : "매물 상세 정보"}
          </h3>
          <button
            className={styles.closeButton}
            onClick={onClose}
            aria-label="닫기"
          >
            ×
          </button>
        </div>

        {/* 컨텐츠 */}
        <div className={styles.content}>
          {isEditMode ? (
            <PropertyEditForm property={property} onSave={onClose} />
          ) : (
            <PropertyDetails property={property} onEdit={onEdit} />
          )}
        </div>
      </div>
    </>
  );
};

const PropertyDetails = ({ property, onEdit }) => {
  // 거래 유형 추론
  const getTransactionType = (prop) => {
    if (prop?.salePrice > 0) return "매매";
    if (prop?.jeonsePrice > 0) return "전세";
    if (prop?.monthPrice > 0) return "월세";
    return "정보 없음";
  };

  const transactionType = getTransactionType(property.property);

  return (
    <div className="property-details">
      {/* 매물 기본 정보 */}
      <h3>매물 기본 정보</h3>
      <p>아파트명: {property.apartmentName}</p>
      <p>동/호수: {`${property.dong}동 ${property.ho}호`}</p>
      <p>면적: {formatArea(property.area)}</p>
      <p>상태: {property.status || "정보 없음"}</p>

      <br />

      {/* 거래 정보 */}
      <h3>거래 정보</h3>
      <p>거래 유형: {transactionType}</p>
      <p>매매가: {formatPrice(property.property?.salePrice)}</p>
      <p>전세가: {formatPrice(property.property?.jeonsePrice)}</p>
      <p>보증금: {formatPrice(property.property?.deposit)}</p>
      <p>월세: {formatPrice(property.property?.monthPrice)}</p>

      <br />

      {/* 소유자 정보 */}
      <h3>소유자 정보</h3>
      <p>소유자명: {property.property?.ownerName || "정보 없음"}</p>
      <p>연락처: {property.property?.ownerPhone || "정보 없음"}</p>

      <button
        onClick={onEdit}
        style={{ marginTop: "1rem", padding: "8px 16px" }}
      >
        수정하기
      </button>
    </div>
  );
};

const PropertyEditForm = ({ property, onSave }) => (
  <div className="property-edit">
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSave();
      }}
    >
      <div className="form-group">
        <label>아파트명</label>
        <input type="text" defaultValue={property.apartmentName} />
      </div>

      <div className="form-group">
        <label>보증금 (만원)</label>
        <input type="number" defaultValue={property.deposit} />
      </div>

      <div className="form-group">
        <label>월세 (만원)</label>
        <input type="number" defaultValue={property.monthPrice} />
      </div>

      <div className="form-group">
        <label>소유자명</label>
        <input type="text" defaultValue={property.ownerName} />
      </div>

      <div className="form-group">
        <label>연락처</label>
        <input type="text" defaultValue={property.ownerPhone} />
      </div>

      <button type="submit" style={{ marginTop: "1rem", padding: "8px 16px" }}>
        저장하기
      </button>
    </form>
  </div>
);
