import React from "react";
import {
  Button,
  SearchInput,
  SortButton,
  TableHeaderControls,
} from "@shared/ui";

import plusIcon from "@shared/assets/icons/plus.svg";
import trashIcon from "@shared/assets/icons/trash.svg";

export const PropertyControls = ({
  onSearch,
  sortStandard = "DONG_HO",
  onSortStandardChange,
  transactionType = "ALL",
  onTransactionTypeChange,
  onAddProperty,
  onDeleteProperties,
  selectedCount = 0,
}) => {
  const sortOptions = [
    { value: "DONG_HO", label: "동호수 기준" },
    { value: "END_DATE", label: "만기일 기준" },
    { value: "CREATED_AT", label: "등록일 기준" },
  ];

  const transactionOptions = [
    { value: "ALL", label: "전체" },
    { value: "BUY", label: "매매" },
    { value: "JEONSE", label: "전세" },
    { value: "MONTH_RENT", label: "월세" },
  ];

  return (
    <TableHeaderControls
      search={<SearchInput placeholder="매물 검색..." onSearch={onSearch} />}
      rightChildren={
        <>
          <SortButton
            options={sortOptions}
            value={sortStandard}
            onChange={onSortStandardChange}
            placeholder="정렬 기준"
          />
          <SortButton
            options={transactionOptions}
            value={transactionType}
            onChange={onTransactionTypeChange}
            placeholder="거래 유형"
          />
          <Button
            onClick={onAddProperty}
            icon={<img src={plusIcon} alt="추가" />}
          >
            매물 추가
          </Button>
          <Button
            variant="secondary"
            onClick={onDeleteProperties}
            icon={<img src={trashIcon} alt="삭제" />}
            disabled={selectedCount === 0}
          >
            매물 삭제
          </Button>
        </>
      }
    />
  );
};
