import React, { useEffect } from "react";
import "./sharedInquiryDetailSidebar.css";
import InfoRow from "@/components/common/info/InfoRow";
import InfoBox from "@/components/common/info/InfoBox";
import DetailSidebar from "@/components/common/rightSidebar/DetailSidebar";
import {
  getTransactionTypeText,
  formatPrice,
} from "../../../../../../packages/shared-utils";

const SharedInquiryDetailSidebar = ({
  inquiry,
  onClose,
  isClosing,
  onEdit,
}) => {
  // customerName과 customerPhone이 null이 아닌 경우가 내가 쓴 글
  const isActuallyMyInquiry =
    inquiry.customerName !== null && inquiry.customerPhone !== null;

  // 액션 버튼 구성 (내가 쓴 글인 경우에만 수정 가능)
  const actions = isActuallyMyInquiry
    ? [
        {
          label: "수정하기",
          onClick: onEdit,
          className: "shared-inquiry-primary-button",
        },
      ]
    : [];

  useEffect(() => {
    console.log(inquiry);
  }, [inquiry]);

  return (
    <DetailSidebar
      title={inquiry.title}
      onClose={onClose}
      isClosing={isClosing}
      actions={actions}
      className="shared-inquiry-detail-sidebar"
    >
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
        {inquiry.salePrice !== undefined && (
          <div className="price-label">
            매매 {formatPrice(inquiry.salePrice)}
          </div>
        )}
        {inquiry.jeonsePrice !== undefined && (
          <div className="price-label">
            전세 {formatPrice(inquiry.jeonsePrice)}
          </div>
        )}
        <div className="price-label">
          보증금/월세{" "}
          {!inquiry.deposit ||
          inquiry.deposit === 0 ||
          !inquiry.monthPrice ||
          inquiry.monthPrice === 0
            ? "정보 없음"
            : `${formatPrice(inquiry.deposit)}/${inquiry.monthPrice}만원`}
        </div>
      </div>

      {/* 문의자 정보 - 자신의 문의일 경우에만 표시 */}
      <div className="contact-info">
        <InfoRow>
          <InfoBox
            title="문의자"
            value={inquiry.customerName || "등록 부동산에 문의"}
          />
          <InfoBox
            title="문의자 연락처"
            value={inquiry.customerPhone || "등록 부동산에 문의"}
          />
        </InfoRow>
      </div>

      <div className="inquiry-info">
        <InfoRow>
          <InfoBox
            title="문의 유형"
            value={getTransactionTypeText(inquiry.type)}
          />
          <InfoBox title="진행 상태">
            <p className={inquiry.status?.replace(/\s+/g, "")}>
              {inquiry.status || "미등록"}
            </p>
          </InfoBox>
        </InfoRow>
      </div>

      <div className="property-details">
        <InfoRow>
          <InfoBox title="면적" value={`${inquiry.area} m²`} />
          <InfoBox title="등록일" value={inquiry.createdAt || "-"} />
        </InfoRow>
      </div>

      <div className="property-details">
        <InfoRow>
          <InfoBox title="연락처" value={inquiry.agentPhone} />
          <InfoBox title="시/구/동">
            <p>
              {inquiry.l1}/{inquiry.l2}/{inquiry.l3}
            </p>
          </InfoBox>
        </InfoRow>
      </div>

      <div className="inquiry-content">
        <h3>문의 내용</h3>
        <p>{inquiry.memo}</p>
      </div>
    </DetailSidebar>
  );
};

export default SharedInquiryDetailSidebar;
