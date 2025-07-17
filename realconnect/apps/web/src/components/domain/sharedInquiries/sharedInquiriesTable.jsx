import React, { useState } from "react";
import Table from "../../common/table/Table";
import Badge from "../../common/badge/Badge";
import styles from "./sharedInquiriesTable.module.css";
import FilledStar from "../../../assets/icons/filledStar.svg";
import BlankStar from "../../../assets/icons/blankStar.svg";

const formatPrice = (price) => {
  if (!price || price === 0) return "-";
  return (price / 100000000).toFixed(1) + "억";
};

const formatDepositMonthly = (deposit, monthly) => {
  const depositFormatted = deposit && deposit !== 0 ? formatPrice(deposit) : "-";
  const monthlyFormatted = monthly && monthly !== 0 ? monthly + "만원" : "-";
  return `${depositFormatted}/${monthlyFormatted}`;
};

const getTypeText = (type) => {
  if (type === "BUY") return "매매";
  if (type === "JEONSE") return "전세";
  if (type === "MONTH_RENT") return "월세";
  return "미등록";
};

const SharedInquiriesTable = ({ sharedInquiries, onSharedInquirySelect }) => {
  const [selectedItems, setSelectedItems] = useState([]);

  const toggleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedItems(sharedInquiries.map((inq) => inq.id));
    } else {
      setSelectedItems([]);
    }
  };

  const toggleSelect = (e, id) => {
    e.stopPropagation();
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const columns = [
    {
      key: "checkbox",
      header: (
        <input
          type="checkbox"
          onChange={toggleSelectAll}
          checked={selectedItems.length === sharedInquiries.length && sharedInquiries.length > 0}
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
    { key: "l2", header: "구" },
    { key: "l3", header: "동" },
    { key: "apartmentName", header: "단지", render: (row) => <div className={styles.apartmentNameText}>{row.apartmentName}</div> },
    { key: "area", header: "면적", render: (row) => `${row.area} m²` },
    { key: "salePrice", header: "매매", render: (row) => formatPrice(row.salePrice) },
    { key: "jeonsePrice", header: "전세", render: (row) => formatPrice(row.jeonsePrice) },
    {
      key: "depositMonth",
      header: "보증금/월세",
      render: (row) => formatDepositMonthly(row.deposit, row.monthPrice),
    },
    {
      key: "type",
      header: "문의 유형",
      render: (row) => <Badge label={getTypeText(row.type)} variant={getTypeText(row.type)} />,
    },
    { key: "title", header: "문의 제목", render: (row) => <span className={styles.inquiryTitleText}>{row.title}</span> },
    { key: "agentName", header: "업소명" },
    { key: "createdAt", header: "등록일", render: (row) => row.createdAt || "-" },
    {
      key: "status",
      header: "진행 상태",
      render: (row) => <Badge label={getTypeText(row.status)} variant={getTypeText(row.status)} />,
    },
    {
      key: "favorite",
      header: <span className={styles.favoriteColumn}>즐겨찾기</span>,
      render: (row) => (
        <img
          src={row.favorite ? FilledStar : BlankStar}
          alt="즐겨찾기"
          className={styles.favoriteIcon}
        />
      ),
    },
  ];

  if (!sharedInquiries || sharedInquiries.length === 0) {
    return <div className={styles.empty}>표시할 문의가 없습니다.</div>;
  }

  return (
    <div className={styles.container}>
      <Table
        columns={columns}
        data={sharedInquiries}
        loading={false}
        emptyMessage="표시할 문의가 없습니다."
        onRowClick={onSharedInquirySelect}
        rowClassName={styles.sharedInquiryRow}
      />
    </div>
  );
};

export default SharedInquiriesTable; 