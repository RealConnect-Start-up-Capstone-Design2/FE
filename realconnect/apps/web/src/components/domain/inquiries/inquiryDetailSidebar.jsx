import React, { useState } from "react";
import "./inquiryDetailSidebar.css";
import ShareInquiryModal from "@/pages/modal/shareInquiryModal";
import CreateContractModal from "@/pages/modal/createContractModal";
import DetailSidebar from "@/components/common/rightSidebar/DetailSidebar";
import InquiryModifySidebar from "./inquiryModifySidebar";
import axios from "axios";
import useAuthStore from "@/store/authStore";
import InfoRow from "@/components/common/info/InfoRow";
import InfoBox from "@/components/common/info/InfoBox";
import { createContract } from "@/services/contractService";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getTransactionTypeText,
  getInquiryStatusText,
  formatDate,
} from "../../../../../../packages/shared-utils";

const InquiryDetailSidebar = ({ inquiry, onClose, isClosing, onModify }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isContractModalOpen, setIsContractModalOpen] = useState(false);
  const [isSubmittingContract, setIsSubmittingContract] = useState(false);
  const accessToken = useAuthStore((state) => state.accessToken);
  const queryClient = useQueryClient();

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
    setIsSubmittingContract(false);
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

  // 계약 생성 mutation
  const createContractMutation = useMutation({
    mutationFn: createContract,
    onSuccess: () => {
      queryClient.invalidateQueries(["contracts"]);
      alert("계약이 성공적으로 생성되었습니다.");
      closeContractModal();
    },
    onError: (error) => {
      console.error("계약 생성 실패:", error);
      alert("계약 생성에 실패했습니다. 다시 시도해주세요.");
      setIsSubmittingContract(false);
    },
  });

  const handleContractSubmit = (contractData) => {
    setIsSubmittingContract(true);
    console.log("계약 작성 완료:", contractData);
    createContractMutation.mutate(contractData);
  };

  // 액션 버튼 구성
  const actions = [
    {
      label: "수정하기",
      type: "edit",
      className: "inquiry-primary-button",
    },
    {
      label: isSubmittingContract ? "처리 중..." : "계약 작성",
      onClick: openContractModal,
      className: "secondary-button",
      group: "secondary",
      disabled: isSubmittingContract,
    },
    {
      label: "공유하기",
      onClick: openModal,
      className: "secondary-button",
      group: "secondary",
    },
  ];

  return (
    <>
      <DetailSidebar
        title={inquiry.apartmentName}
        onClose={onClose}
        isClosing={isClosing}
        actions={actions}
        editComponent={InquiryModifySidebar}
        data={inquiry}
        onUpdate={onModify}
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
              value={getTransactionTypeText(inquiry.inquiryType)}
            />
            <InfoBox title="진행 상태">
              <p
                className={
                  inquiry.status ? inquiry.status.replace(/\s+/g, "") : ""
                }
              >
                {getInquiryStatusText(inquiry.status) || "-"}
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
      </DetailSidebar>

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
        isSubmitting={isSubmittingContract}
      />
    </>
  );
};

export default InquiryDetailSidebar;
