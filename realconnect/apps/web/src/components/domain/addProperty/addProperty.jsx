import React from 'react';
import { Button } from '@realconnect/shared-ui';

const AddProperty = () => {
  return <Button label="매물 추가" onClick={() => console.log('Add Property Clicked')} variant="primary" />;
};

export default AddProperty;
