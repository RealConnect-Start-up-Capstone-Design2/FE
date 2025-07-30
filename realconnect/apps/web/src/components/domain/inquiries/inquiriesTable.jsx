import React, { useState } from "react";
import Table from "../../common/table/Table";
import Badge from "../../common/badge/Badge";
import styles from "./inquiriesTable.module.css";
import FilledStarIcon from "../../../assets/icons/filledStar.svg";
import BlackStarIcon from "../../../assets/icons/blankStar.svg";

const InquiriesTable = ({ inquiries, onInquirySelect, onFavoriteToggle }) => {
  const [selectedItems, setSelectedItems] = useState([]);

  const toggleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedItems(inquiries.map((inq) => inq.id));
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

  const handleFavoriteToggle = (inquiry, e) => {
    e.stopPropagation();
    if (onFavoriteToggle) {
      onFavoriteToggle(inquiry);
    }
  };

  const columns = [
    {
      key: "checkbox",
      header: (
        <input
          type="checkbox"
          onChange={toggleSelectAll}
          checked={
            selectedItems.length === inquiries.length && inquiries.length > 0
          }
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
    { key: "memoText", header: "문의 내용" },
    { key: "areaText", header: "면적" },
    {
      key: "inquiryType",
      header: "문의 유형",
      render: (row) => (
        <Badge
          label={row.inquiryTypeText}
          variant={row.inquiryTypeText.replace(/\s+/g, "")}
        />
      ),
    },
    { key: "salePriceText", header: "매매" },
    { key: "jeonsePriceText", header: "전세" },
    { key: "depositText", header: "보증금" },
    { key: "monthPriceText", header: "월세" },
    { key: "name", header: "문의자" },
    { key: "phone", header: "연락처" },
    { key: "createdAtText", header: "등록일" },
    {
      key: "status",
      header: "진행 상태",
      render: (row) => <Badge label={row.statusText} variant={row.status} />,
    },
    {
      key: "favorite",
      header: <span className={styles.favoriteColumn}>즐겨찾기</span>,
      render: (row) => (
        <button
          className={styles.favoriteButton}
          onClick={(e) => handleFavoriteToggle(row, e)}
        >
          <img
            src={row.favorite ? FilledStarIcon : BlackStarIcon}
            alt={row.favorite ? "즐겨찾기 됨" : "즐겨찾기"}
          />
        </button>
      ),
    },
  ];

  if (!inquiries || inquiries.length === 0) {
    return <div className={styles.empty}>표시할 문의가 없습니다.</div>;
  }

  return (
    <div className={styles.container}>
      <Table
        columns={columns}
        data={inquiries}
        loading={false}
        emptyMessage="표시할 문의가 없습니다."
        onRowClick={onInquirySelect}
        rowClassName={styles.inquiryRow}
      />
    </div>
  );
};

export default InquiriesTable;
