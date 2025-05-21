import React, { useState } from "react";
import "./addInquiry.css";
import plus from "../../assets/icons/plus.svg";
import ShareInquiryModal from "../../pages/modal/shareInquiryModal.jsx";

const AddInquiry = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleSubmit = (data) => {
    console.log("문의 공유하기 제출:", data);
    // 여기서 API 호출 등의 로직 구현
    closeModal();
  };

  return (
    <>
      <div className="add-inquiry" onClick={openModal}>
        <img src={plus} alt="plus" className="add-inquiry-img" />
        <span className="add-inquiry-text">문의 추가</span>
      </div>

      <ShareInquiryModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSubmit={handleSubmit}
      />
    </>
  );
};

export default AddInquiry;
