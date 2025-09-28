import React from "react";
import { Table } from "@shared/ui";
import { PropertyStatus, PropertyStatusLabels } from "@entities/property";
import { formatPrice, formatArea } from "@shared/lib";
import styles from "./PropertyTable.module.css";

export const PropertyTable = ({
  data,
  isLoading,
  error,
  onPropertySelect,
  selectedPropertyId,
  onSelectionChange,
  selectedPropertyIds = [],
}) => {
  // 테이블 컬럼 정의
  const propertyColumns = React.useMemo(
    () => [
      {
        key: "apartmentName",
        title: "아파트명",
        width: "150px",
        cellClassName: styles.apartmentIdCell,
      },
      { key: "dong", title: "동", width: "60px" },
      { key: "ho", title: "호", width: "60px" },
      { key: "area", title: "면적", width: "80px" },
      { key: "transactionType", title: "거래유형", width: "80px" },
      { key: "deposit", title: "보증금/매매가", width: "120px" },
      { key: "monthPrice", title: "월세", width: "80px" },
      { key: "status", title: "상태", width: "80px" },
      { key: "ownerName", title: "소유자명", width: "100px" },
      { key: "ownerPhone", title: "연락처", width: "120px" },
    ],
    []
  );
  const handleRowClick = (property) => {
    if (onPropertySelect) {
      onPropertySelect(property);
    }
  };

  const handleRowSelect = (row, checked) => {
    if (onSelectionChange) {
      if (row.apartmentId === null || row.apartmentId === undefined) {
        return;
      }
      onSelectionChange(row.apartmentId, checked);
    }
  };

  const getRowKey = (row) =>
    // apartmentId가 있으면 사용하고, 없으면 동-호 조합으로 고유 키 생성
    row.apartmentId != null
      ? String(row.apartmentId)
      : `temp-${row.dong}-${row.ho}`;

  // 커스텀 셀 렌더링 (실제 API 응답 구조에 맞춤)
  const renderCell = (row, column) => {
    switch (column.key) {
      case "apartmentName":
        return row.apartmentName;

      case "dong":
        return `${row.dong}동`;

      case "ho":
        return `${row.ho}호`;

      case "area":
        return formatArea(row.area);

      case "transactionType":
        // 거래 유형 추론 로직 (매매가, 전세가, 월세 기준)
        if (row.property?.salePrice > 0) return "매매";
        if (row.property?.jeonsePrice > 0) return "전세";
        if (row.property?.monthPrice > 0) return "월세";
        return "-";

      case "deposit":
        // 매매가가 있으면 매매가, 없으면 보증금
        const price =
          row.property?.salePrice > 0
            ? row.property.salePrice
            : row.property?.deposit;
        return formatPrice(price);

      case "monthPrice":
        return formatPrice(row.property?.monthPrice);

      case "status":
        return row.status || "-";

      case "ownerName":
        return row.property?.ownerName || "-";

      case "ownerPhone":
        return row.property?.ownerPhone || "-";

      default:
        return row.property?.[column.key] || row[column.key] || "-";
    }
  };

  const tableData = data?.content || [];

  if (error) {
    return <div>매물을 불러오는 데 실패했습니다: {error.message}</div>;
  }

  return (
    <div>
      <Table
        columns={propertyColumns}
        data={tableData}
        rowKey={getRowKey}
        selectedRowId={selectedPropertyId}
        onRowClick={handleRowClick}
        onRowSelect={handleRowSelect}
        selectedRows={selectedPropertyIds}
        renderCell={renderCell}
        isLoading={isLoading}
        emptyMessage="매물이 없습니다."
      />
    </div>
  );
};
