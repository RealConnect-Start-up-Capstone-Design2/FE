import React from "react";
import Table from "../../common/table/table";
import { Badge } from "@realconnect/shared-ui";
// import styles from "./inquiriesTable.module.css";
import tableStyles from "../../../styles/table.module.css";
import FilledStarIcon from "../../../assets/icons/filledStar.svg";
import BlackStarIcon from "../../../assets/icons/blankStar.svg";
import { useTableSelection } from "../../../../../../packages/shared-utils";

const InquiriesTable = ({ inquiries, onInquirySelect, onFavoriteToggle }) => {
  const { toggleSelectAll, toggleSelect, isAllSelected, isSelected } =
    useTableSelection(inquiries || []);

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
      header: <span className={tableStyles.favoriteColumn}>즐겨찾기</span>,
      render: (row) => (
        <button
          className={tableStyles.favoriteButton}
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
    return <div className={tableStyles.empty}>표시할 문의가 없습니다.</div>;
  }

  return (
    <div className={tableStyles.container}>
      <Table
        columns={columns}
        data={inquiries}
        loading={false}
        emptyMessage="표시할 문의가 없습니다."
        onRowClick={onInquirySelect}
        rowClassName={tableStyles.row}
      />
    </div>
  );
};

export default InquiriesTable;
