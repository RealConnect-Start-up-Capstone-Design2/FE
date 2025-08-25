import React, { useState } from "react";
import "./contractDetailSidebar.css";
import { formatPrice } from "../../../../../../packages/shared-utils/src/formatters.js";
import BaseSidebar from "@/components/common/rightSidebar/BaseSidebar";

import FileIcon from "@/assets/icons/file-text.svg";
import DownloadIcon from "@/assets/icons/download.svg";
import HomeIcon from "@/assets/icons/home.svg";
import InfoRow from "@/components/common/info/InfoRow";
import InfoBox from "@/components/common/info/InfoBox";
import ContractModifySidebar from "./contractModifySidebar";

const ContractDetailSidebar = ({ contract, onClose, isClosing, onUpdate }) => {
  const [isEditMode, setIsEditMode] = useState(false);
  // 거래 유형 변환 함수
  const getTransactionTypeText = (contractType) => {
    const typeMap = { BUY: "매매", JEONSE: "전세", MONTH_RENT: "월세" };
    return typeMap[contractType] || contractType;
  };

  // 계약 상태를 한국어로 변환
  const getContractStatusText = (status) => {
    const statusMap = {
      ACTIVE: "계약 중",
      TERMINATED: "계약 파기",
      EXPIRED: "계약 만료",
    };
    return statusMap[status] || status;
  };

  if (!contract) return null;

  // 편집 모드일 때는 수정 사이드바 렌더링
  if (isEditMode) {
    return (
      <ContractModifySidebar
        contract={contract}
        onClose={() => setIsEditMode(false)}
        onSave={(updatedContract) => {
          if (onUpdate) onUpdate(updatedContract);
          setIsEditMode(false);
        }}
        isClosing={isClosing}
      />
    );
  }

  // 푸터 컨텐츠 준비
  const footerContent = (
    <div className="action-buttons">
      <button
        className="contract-primary-button"
        onClick={() => setIsEditMode(true)}
      >
        수정하기
      </button>
    </div>
  );

  return (
    <BaseSidebar
      title="계약 상세 정보"
      onClose={onClose}
      isClosing={isClosing}
      footerContent={footerContent}
      className="contract-detail-sidebar"
    >
      {/* 속성 요약 영역 */}
      <div className="property-summary">
        <div className="property-summary-item">
          <div
            style={{
              display: "flex",
              backgroundColor: "#DDE2F2",
              width: "5rem",
              height: "5rem",
              marginRight: "0.8rem",
              borderRadius: "0.5rem",
              justifyContent: "center",
              alignItems: "center",
            }}
          ></div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <div className="property-summary-item-icon">
              <img src={HomeIcon} alt="매물" />
              <p>{contract.apartment}</p>
            </div>
            <div className="property-summary-item-text">
              <p>
                {contract.apartment} {contract.dong}동 {contract.ho}호 (
                {contract.area}m²)
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 계약 정보 영역 */}
      <div className="contract-info">
        {/* 가격 및 유형 정보 */}
        <div className="pricing-info">
          <div className="price-item">
            <p>거래 가격 {formatPrice(contract.contractPrice)}</p>
            <p>거래 유형 {getTransactionTypeText(contract.contractType)}</p>
            <p>계약 상태 {getContractStatusText(contract.contractStatus)}</p>
          </div>
        </div>

        {/* 연락처 정보 */}
        <div className="contact-info">
          <InfoRow>
            <InfoBox title="소유주(매도인)" value={contract.ownerName} />
            <InfoBox title="소유주 연락처" value={contract.ownerPhone} />
          </InfoRow>
          <InfoRow>
            <InfoBox title="입주인(매수인)" value={contract.tenantName} />
            <InfoBox title="입주인 연락처" value={contract.tenantPhone} />
          </InfoRow>
          <InfoRow>
            <InfoBox title="계약 일시" value={contract.contractDate} />
            <InfoBox title="만기일" value={contract.dueDate} />
          </InfoRow>
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
      </div>
    </BaseSidebar>
  );
};

export default ContractDetailSidebar;
