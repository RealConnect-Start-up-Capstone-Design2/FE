import React from 'react';
import { Button } from '@realconnect/shared-ui';

const AddInquiry = ({ onAddInquiry, adding }) => {
  const handleClick = () => {
    if (onAddInquiry) {
      const emptyInquiry = {
        name: '',
        phone: '',
        apartmentName: '',
        area: '',
        salePrice: '',
        jeonsePrice: '',
        deposit: '',
        monthPrice: '',
        memo: '',
        inquiryType: '',
        status: '',
      };

      onAddInquiry(emptyInquiry);
    }
  };

  return <Button label="문의 추가" onClick={handleClick} disabled={adding} variant="primary" />;
};

export default AddInquiry;
