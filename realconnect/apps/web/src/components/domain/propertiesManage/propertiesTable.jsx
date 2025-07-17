import React, { useState } from "react";
import Table from "../../common/table/Table";
import Badge from "../../common/badge/Badge";
import styles from "./propertiesTable.module.css";

const formatPrice = (price) => {
  if (!price || price === "-") return "-";
  let numericValue;
  if (typeof price === "string") {
    const cleanPrice = price.replace(/,/g, "");
    numericValue = Number(cleanPrice);
    if (isNaN(numericValue)) return "-";
  } else {
    numericValue = Number(price);
  }
  if (numericValue === 0) return "-";
  if (numericValue >= 100000000) {
    const billions = Math.floor(numericValue / 10000000) / 10;
    return billions.toFixed(1) + "억";
  } else {
    const tenThousands = Math.floor(numericValue / 10000);
    return tenThousands.toLocaleString() + "만원";
  }
};

const PropertiesTable = ({ properties, onPropertySelect }) => {
  const [selectedItems, setSelectedItems] = useState([]);

  const toggleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedItems(properties.map((property) => property.id));
    } else {
      setSelectedItems([]);
    }
  };

  const toggleSelect = (e, id) => {
    e.stopPropagation();
    setSelectedItems((prevSelected) => {
      if (prevSelected.includes(id)) {
        return prevSelected.filter((item) => item !== id);
      } else {
        return [...prevSelected, id];
      }
    });
  };

  const columns = [
    {
      key: "checkbox",
      header: (
        <input
          type="checkbox"
          onChange={toggleSelectAll}
          checked={selectedItems.length === properties.length && properties.length > 0}
        />
      ),
      render: (row) => (
        <input
          type="checkbox"
          checked={selectedItems.includes(row.id)}
          onChange={(e) => toggleSelect(e, row.id)}
          className={styles.checkbox}
        />
      ),
    },
    { key: "apartmentName", header: "단지" },
    { key: "building", header: "동" },
    { key: "unit", header: "호수" },
    { key: "area", header: "면적" },
    { key: "salePrice", header: "매매", render: (row) => formatPrice(row.salePrice) },
    { key: "jeonsePrice", header: "전세", render: (row) => formatPrice(row.jeonsePrice) },
    {
      key: "depositMonth",
      header: "보증금/월세",
      render: (row) => `${row.deposit}/${row.monthPrice}`,
    },
    {
      key: "transactionType",
      header: "거래 유형",
      render: (row) => <Badge label={row.transactionType} variant={row.transactionType} />,
    },
    { key: "ownerName", header: "소유자" },
    { key: "contact", header: "연락처" },
    {
      key: "status",
      header: "거래 상태",
      render: (row) => <Badge label={row.status} variant={row.status.replace(/\s+/g, "")} />,
    },
  ];

  return (
    <Table
      columns={columns}
      data={properties}
      loading={false}
      emptyMessage="표시할 매물이 없습니다."
      onRowClick={onPropertySelect}
      rowClassName={styles.propertyRow}
    />
  );
};

export default PropertiesTable; 