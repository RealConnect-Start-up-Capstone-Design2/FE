import React, { useState } from "react";
import "./addContract.css";
import plus from "../../assets/icons/plus.svg";
import CreateContractModal from "../../pages/modal/createContractModal.jsx";

const AddContract = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSubmitContract = (contractData) => {
    console.log("계약 데이터:", contractData);
    // 여기에서 계약 데이터를 처리합니다
    setIsModalOpen(false);
  };

  return (
    <>
      <div className="add-contract" onClick={handleOpenModal}>
        <img src={plus} alt="plus" className="add-contract-img" />
        <span className="add-contract-text">계약 작성</span>
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
