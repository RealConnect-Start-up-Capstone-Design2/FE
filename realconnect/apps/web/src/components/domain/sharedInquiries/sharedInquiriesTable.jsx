import React from "react";
import Table from "../../common/table/Table";
import { Badge } from "@realconnect/shared-ui";
import styles from "./sharedInquiriesTable.module.css";
import tableStyles from "../../../styles/table.module.css";
import FilledStar from "../../../assets/icons/filledStar.svg";
import BlankStar from "../../../assets/icons/blankStar.svg";
import {
  formatPrice,
  formatArea,
  formatMonthlyRent,
  getTransactionTypeText,
  getInquiryStatusText,
  formatDate,
  useTableSelection,
} from "../../../../../../packages/shared-utils";

const SharedInquiriesTable = ({ sharedInquiries, onSharedInquirySelect }) => {
  const { toggleSelectAll, toggleSelect, isAllSelected, isSelected } =
    useTableSelection(sharedInquiries || []);

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
    { key: "l2", header: "구" },
    { key: "l3", header: "동" },
    {
      key: "apartmentName",
      header: "단지",
      render: (row) => (
        <div className={styles.apartmentNameText}>{row.apartmentName}</div>
      ),
    },
    { key: "area", header: "면적", render: (row) => formatArea(row.area) },
    {
      key: "salePrice",
      header: "매매",
      render: (row) => formatPrice(row.salePrice),
    },
    {
      key: "jeonsePrice",
      header: "전세",
      render: (row) => formatPrice(row.jeonsePrice),
    },
    {
      key: "depositMonth",
      header: "보증금/월세",
      render: (row) => formatMonthlyRent(row.deposit, row.monthPrice),
    },
    {
      key: "type",
      header: "문의 유형",
      render: (row) => (
        <Badge
          label={getTransactionTypeText(row.type)}
          variant={getTransactionTypeText(row.type)}
        />
      ),
    },
    {
      key: "title",
      header: "문의 제목",
      render: (row) => (
        <span className={styles.inquiryTitleText}>{row.title}</span>
      ),
    },
    { key: "agentName", header: "업소명" },
    {
      key: "createdAt",
      header: "등록일",
      render: (row) => formatDate(row.createdAt),
    },
    {
      key: "status",
      header: "진행 상태",
      render: (row) => (
        <Badge
          label={getInquiryStatusText(row.status)}
          variant={getInquiryStatusText(row.status)}
        />
      ),
    },
    {
      key: "favorite",
      header: <span className={tableStyles.favoriteColumn}>즐겨찾기</span>,
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
    return <div className={tableStyles.empty}>표시할 문의가 없습니다.</div>;
  }

  return (
    <div className={tableStyles.container}>
      <Table
        columns={columns}
        data={sharedInquiries}
        loading={false}
        emptyMessage="표시할 문의가 없습니다."
        onRowClick={onSharedInquirySelect}
        rowClassName={tableStyles.row}
      />
    </div>
  );
};

export default SharedInquiriesTable;
