import React, { useState } from 'react';
import { Button } from '@realconnect/shared-ui';
import CreateContractModal from '../../../pages/modal/createContractModal';

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
    setIsSubmitting(true);
    console.log('계약 데이터:', contractData);
    // 여기에서 계약 데이터를 처리합니다
    setIsModalOpen(false);

    if (contractData) {
      alert('계약이 성공적으로 생성되었습니다.');
    }

    setIsSubmitting(false);
  };

  return (
    <>
      <Button
        label={isSubmitting ? '처리 중...' : '계약 작성'}
        onClick={handleOpenModal}
        disabled={isSubmitting}
        variant="primary"
      />

      <CreateContractModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmitContract}
      />
    </>
  );
};

export default AddContract;
