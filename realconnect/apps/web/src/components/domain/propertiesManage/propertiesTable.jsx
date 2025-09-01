import React from "react";
import Table from "../../common/table/Table";
import { Badge } from "@realconnect/shared-ui";
// import styles from "./propertiesTable.module.css";
import tableStyles from "../../../styles/table.module.css";
import { useTableSelection } from "../../../../../../packages/shared-utils";

// formatPrice 함수 제거 - 이제 ViewModel에서 포맷팅된 데이터를 받음

const PropertiesTable = ({
  properties,
  onPropertySelect,
  isLoading,
  isFetchingNextPage,
  observerRef,
}) => {
  const { toggleSelectAll, toggleSelect, isAllSelected, isSelected } =
    useTableSelection(properties || []);

  const columns = [
    {
      key: "checkbox",
      header: (
        <input
          type="checkbox"
          onChange={toggleSelectAll}
          checked={isAllSelected}
        />
      ),
      render: (row) => (
        <input
          type="checkbox"
          checked={isSelected(row.id)}
          onChange={(e) => toggleSelect(e, row.id)}
          className={tableStyles.checkbox}
        />
      ),
    },
    {
      key: "apartmentNameText",
      header: "단지",
      render: (row) => row.apartmentNameText,
    },
    {
      key: "dongText",
      header: "동",
      render: (row) => row.dongText,
    },
    {
      key: "hoText",
      header: "호수",
      render: (row) => row.hoText,
    },
    {
      key: "areaText",
      header: "면적",
      render: (row) => row.areaText,
    },
    {
      key: "salePriceText",
      header: "매매",
      render: (row) => row.salePriceText,
    },
    {
      key: "jeonsePriceText",
      header: "전세",
      render: (row) => row.jeonsePriceText,
    },
    {
      key: "monthlyRentText",
      header: "보증금/월세",
      render: (row) => row.monthlyRentText,
    },
    {
      key: "transactionType",
      header: "거래 유형",
      render: (row) => (
        <Badge label={row.transactionType} variant={row.transactionType} />
      ),
    },
    {
      key: "ownerNameText",
      header: "소유자",
      render: (row) => row.ownerNameText,
    },
    {
      key: "ownerPhoneText",
      header: "연락처",
      render: (row) => row.ownerPhoneText,
    },
    {
      key: "statusText",
      header: "거래 상태",
      render: (row) => (
        <Badge
          label={row.statusText}
          variant={
            row.statusText ? row.statusText.replace(/\s+/g, "") : "default"
          }
        />
      ),
    },
  ];

  return (
    <>
      <Table
        columns={columns}
        data={properties}
        loading={isLoading}
        emptyMessage="표시할 매물이 없습니다."
        onRowClick={onPropertySelect}
        rowClassName={tableStyles.row}
        observerRef={observerRef}
      />
      {isFetchingNextPage && (
        <div style={{ textAlign: "center", padding: "20px" }}>
          더 많은 매물을 불러오는 중...
        </div>
      )}
    </>
  );
};

export default PropertiesTable;
