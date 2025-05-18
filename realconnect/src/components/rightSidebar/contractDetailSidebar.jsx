import React from "react";
import "./contractDetailSidebar.css";

import FileIcon from "../../assets/icons/file-text.svg";
import DownloadIcon from "../../assets/icons/download.svg";

const ContractDetailSidebar = ({ contract, onClose, isClosing }) => {
  if (!contract) return null;

  return (
    <div className={`contract-detail-sidebar ${isClosing ? "closing" : ""}`}>
      <div className="sidebar-header">
        <div className="sidebar-header-title">계약 상세 정보</div>
        <button className="close-button" onClick={onClose}>
          ×
        </button>
      </div>

      {/* 속성 요약 영역 */}
      <div className="property-summary">
        <div className="property-summary-item">
          <p>{contract.complex}</p>
          <p>
            {contract.complex} {contract.building}-{contract.unit} (
            {contract.area}m²)
          </p>
        </div>
      </div>

      {/* 계약 정보 영역 */}
      <div className="contract-info">
        <div className="pricing-info">
          <div className="price-item">
            <p>거래 가격 {contract.price}</p>
            <p>거래 유형 {contract.transactionType}</p>
            <p>계약 상태 {contract.status}</p>
          </div>
        </div>

        <div className="contact-info">
          <div className="info-row">
            <div className="info-box">
              <h4>소유주(매도인)</h4>
              <p>{contract.owner}</p>
            </div>
            <div className="info-box">
              <h4>소유주 연락처</h4>
              <p>{contract.ownerContact}</p>
            </div>
          </div>

          <div className="info-row">
            <div className="info-box">
              <h4>입주인(매수인)</h4>
              <p>{contract.tenant}</p>
            </div>
            <div className="info-box">
              <h4>입주인 연락처</h4>
              <p>{contract.tenantContact}</p>
            </div>
          </div>

          <div className="info-row">
            <div className="info-box">
              <h4>계약 일시</h4>
              <p>{contract.startDate}</p>
            </div>
            <div className="info-box">
              <h4>만기일</h4>
              <p>{contract.endDate}</p>
            </div>
          </div>
        </div>

        {/* 계약서 파일 정보 */}
        <div className="contract-file-section">
          <h3>계약서</h3>
          {contract.contractFile ? (
            <div className="contract-file-info">
              <div className="file-icon">
                <img
                  style={{ width: "2.1rem", height: "2.1rem" }}
                  src={FileIcon}
                  alt="계약서"
                />
              </div>
              <div className="file-details">
                <p className="file-name">{contract.contractFile}</p>
                <p className="file-meta">
                  {contract.fileSize} · {contract.fileDate}
                </p>
              </div>
              <button className="download-button">
                <img
                  style={{ width: "1.6rem", height: "1.6rem" }}
                  src={DownloadIcon}
                  alt="다운로드"
                />
              </button>
            </div>
          ) : (
            <div className="no-file-message">등록된 계약서가 없습니다.</div>
          )}
        </div>

        <div className="action-buttons">
          <button className="primary-button">수정하기</button>
        </div>
      </div>
    </div>
  );
};

export default ContractDetailSidebar;
