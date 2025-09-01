import React from "react";
import Table from "../../common/table/Table";
import styles from "./contracts.module.css";
import tableStyles from "../../../styles/table.module.css";
import BlackStarIcon from "@/assets/icons/blankStar.svg";
import FilledStarIcon from "@/assets/icons/filledStar.svg";
import { Badge } from "@realconnect/shared-ui";
import { useTableSelection } from "../../../../../../packages/shared-utils";

const ContractsTable = ({ contracts, onContractSelect, onContractUpdate }) => {
  const { toggleSelectAll, toggleSelect, isAllSelected, isSelected } =
    useTableSelection(contracts || []);

  const handleFavoriteToggle = (contract, e) => {
    e.stopPropagation();
    if (onContractUpdate) {
      onContractUpdate({ ...contract, isFavorite: !contract.isFavorite });
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
    { key: "apartment", header: "단지", render: (row) => row.apartmentText },
    { key: "dong", header: "동", render: (row) => row.dongText },
    { key: "ho", header: "호수", render: (row) => row.hoText },
    { key: "area", header: "면적", render: (row) => row.areaText },
    {
      key: "ownerName",
      header: "소유주(매도인)",
      render: (row) => row.ownerNameText,
    },
    {
      key: "tenantName",
      header: "입주인(매수인)",
      render: (row) => row.tenantNameText,
    },
    {
      key: "contractType",
      header: "거래 유형",
      render: (row) => (
        <Badge label={row.contractTypeText} variant={row.contractTypeText} />
      ),
    },
    {
      key: "contractPrice",
      header: "거래 가격",
      render: (row) => row.contractPriceText,
    },
    {
      key: "contractDate",
      header: "계약일시",
      render: (row) => row.contractDateText,
    },
    { key: "dueDate", header: "만기일", render: (row) => row.dueDateText },
    {
      key: "contractFile",
      header: "계약서",
      render: (row) =>
        row.contractFile ? (
          <button
            className={styles.viewContractButton}
            onClick={(e) => e.stopPropagation()}
          >
            계약서 보기
          </button>
        ) : (
          <span>-</span>
        ),
    },
    {
      key: "contractStatus",
      header: "계약 상태",
      render: (row) => (
        <Badge
          label={row.contractStatusText}
          variant={row.contractStatusText}
        />
      ),
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

  if (!contracts || contracts.length === 0) {
    return <div className={tableStyles.empty}>등록된 계약이 없습니다.</div>;
  }

  return (
    <div className={tableStyles.container}>
      <Table
        columns={columns}
        data={contracts}
        loading={false}
        emptyMessage="등록된 계약이 없습니다."
        onRowClick={onContractSelect}
        rowClassName={tableStyles.row}
      />
    </div>
  );
};

export default ContractsTable;
