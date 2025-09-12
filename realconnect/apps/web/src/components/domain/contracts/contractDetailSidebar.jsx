import React from "react";
import "./contractDetailSidebar.css";
import { formatPrice } from "../../../../../../packages/shared-utils/src/formatters.js";
import { toContractViewRow } from "../../../../../../packages/web-viewmodel/contractViewModel";
import DetailSidebar from "@/components/common/rightSidebar/DetailSidebar";

import FileIcon from "@/assets/icons/file-text.svg";
import DownloadIcon from "@/assets/icons/download.svg";
import HomeIcon from "@/assets/icons/home.svg";
import InfoRow from "@/components/common/info/InfoRow";
import InfoBox from "@/components/common/info/InfoBox";
import ContractModifySidebar from "./contractModifySidebar";

const ContractDetailSidebar = ({ contract, onClose, isClosing, onUpdate }) => {
  // ViewModel을 통해 포맷팅된 데이터 생성
  const contractView = toContractViewRow(contract);

  if (!contract) return null;

  // 액션 버튼 설정
  const actions = [
    {
      label: "수정하기",
      type: "edit",
      className: "contract-primary-button",
    },
  ];

  return (
    <DetailSidebar
      title="계약 상세 정보"
      onClose={onClose}
      isClosing={isClosing}
      actions={actions}
      editComponent={ContractModifySidebar}
      editPropName="contract"
      onUpdate={onUpdate}
      data={contract}
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
            <p>거래 유형 {contractView.contractTypeText}</p>
            <p>계약 상태 {contractView.contractStatusText}</p>
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
    </DetailSidebar>
  );
};

export default ContractDetailSidebar;
