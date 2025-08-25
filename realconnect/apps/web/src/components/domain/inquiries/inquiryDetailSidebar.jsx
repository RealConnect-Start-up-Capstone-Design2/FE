import React, { useState } from "react";
import "./inquiryDetailSidebar.css";
import ShareInquiryModal from "@/pages/modal/shareInquiryModal";
import CreateContractModal from "@/pages/modal/createContractModal";
import BaseSidebar from "@/components/common/rightSidebar/BaseSidebar";
import axios from "axios";
import useAuthStore from "@/store/authStore";
import InfoRow from "@/components/common/info/InfoRow";
import InfoBox from "@/components/common/info/InfoBox";
import {
  toDisplayInquiryType,
  toDisplayStatus,
} from "../../../../../../packages/shared-utils/src/labelMaps.js";
import { formatDate } from "../../../../../../packages/shared-utils/src/formatters.js";

const InquiryDetailSidebar = ({ inquiry, onClose, isClosing, onModify }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isContractModalOpen, setIsContractModalOpen] = useState(false);
  const accessToken = useAuthStore((state) => state.accessToken);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const openContractModal = () => {
    setIsContractModalOpen(true);
  };

  const closeContractModal = () => {
    setIsContractModalOpen(false);
  };

  const handleSubmit = async (data) => {
    console.log("문의 공유하기 제출:", data);
    // 여기서 API 호출 등의 로직 구현
    const response = await axios.post(
      `${import.meta.env.VITE_API_URL}/api/shares`,
      data,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    console.log(response);
    closeModal();
  };

  const handleContractSubmit = (contractData) => {
    console.log("계약 작성 완료:", contractData);
    // 계약 작성 성공 후 처리 로직
    closeContractModal();
  };

  // 푸터 컨텐츠 준비
  const footerContent = (
    <div className="action-buttons">
      <button className="inquiry-primary-button" onClick={onModify}>
        수정하기
      </button>
      <div className="button-group">
        <button className="secondary-button" onClick={openContractModal}>
          계약 작성
        </button>
        <button className="secondary-button" onClick={openModal}>
          공유하기
        </button>
      </div>
    </div>
  );

  return (
    <>
      <BaseSidebar
        title={inquiry.apartmentName}
        onClose={onClose}
        isClosing={isClosing}
        footerContent={footerContent}
        className="inquiry-detail-sidebar"
      >
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
          <div className="price-label">매매 {inquiry.salePrice}</div>
          <div className="price-label">전세 {inquiry.jeonsePrice}</div>
          <div className="price-label">
            보증금/월세 {inquiry.deposit}/{inquiry.monthPrice}
          </div>
        </div>

        <div className="contact-info">
          <InfoRow>
            <InfoBox title="문의자" value={inquiry?.name || "김규식"} />
            <InfoBox title="연락처" value={inquiry?.phone || "010-1234-2334"} />
          </InfoRow>
        </div>

        <div className="inquiry-info">
          <InfoRow>
            <InfoBox
              title="문의 유형"
              value={toDisplayInquiryType(inquiry.inquiryType)}
            />
            <InfoBox title="진행 상태">
              <p
                className={
                  inquiry.status ? inquiry.status.replace(/\s+/g, "") : ""
                }
              >
                {toDisplayStatus(inquiry.status) || "-"}
              </p>
            </InfoBox>
          </InfoRow>
        </div>

        <div className="property-details">
          <InfoRow>
            <InfoBox title="면적" value={`${inquiry.area} m²`} />
            <InfoBox title="등록일" value={formatDate(inquiry.createdAt)} />
          </InfoRow>
        </div>

        <div className="inquiry-content">
          <h3>문의 내용</h3>
          <p>{inquiry.memo}</p>
        </div>
      </BaseSidebar>

      <ShareInquiryModal
        isOpen={isModalOpen}
        inquiry={inquiry}
        onClose={closeModal}
        onSubmit={handleSubmit}
      />

      <CreateContractModal
        isOpen={isContractModalOpen}
        onClose={closeContractModal}
        onSubmit={handleContractSubmit}
        property={inquiry}
      />
    </>
  );
};

export default InquiryDetailSidebar;
