import React, { useState } from "react";
import "./addContract.css";
import plus from "../../assets/icons/plus.svg";
import CreateContractModal from "../../pages/modal/createContractModal";

const AddContract = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSubmitContract = (contractData) => {
    setIsSubmitting(true); // 제출 중 상태로 설정

    console.log("계약 데이터:", contractData);
    // 여기에서 계약 데이터를 처리합니다
    setIsModalOpen(false);

    // 계약 생성 성공 메시지 표시
    if (contractData) {
      alert("계약이 성공적으로 생성되었습니다.");
    }

    setIsSubmitting(false); // 제출 완료 상태로 설정
  };

  return (
    <>
      <div
        className="add-contract"
        onClick={!isSubmitting ? handleOpenModal : undefined}
        style={{
          opacity: isSubmitting ? 0.7 : 1,
          cursor: isSubmitting ? "default" : "pointer",
        }}
      >
        <img src={plus} alt="plus" className="add-contract-img" />
        <span className="add-contract-text">
          {isSubmitting ? "처리 중..." : "계약 작성"}
        </span>
      </div>

      <CreateContractModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmitContract}
      />
    </>
  );
};

export default AddContract;
