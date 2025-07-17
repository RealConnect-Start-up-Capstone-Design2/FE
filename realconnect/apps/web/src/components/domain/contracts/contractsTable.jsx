import React, { useState } from "react";
import Table from "../../common/table/Table";
import styles from "./contracts.module.css";
import BlackStarIcon from "@/assets/icons/blankStar.svg";
import FilledStarIcon from "@/assets/icons/filledStar.svg";
import Badge from "../../common/badge/Badge";

const getTransactionTypeText = (contractType) => {
  const typeMap = { BUY: "매매", JEONSE: "전세", MONTH_RENT: "월세" };
  return typeMap[contractType] || contractType;
};

const formatPrice = (price) => {
  if (!price) return "-";
  const numPrice = parseInt(price, 10);
  if (numPrice >= 100000000) {
    const eok = numPrice / 100000000;
    return `${eok.toFixed(1)}억`;
  } else {
    const man = numPrice / 10000;
    return `${man.toLocaleString()}만원`;
  }
};

const getContractStatusText = (status) => {
  const statusMap = {
    ACTIVE: "계약중",
    COMPLETED: "계약완료",
    TERMINATED: "계약파기",
    EXPIRED: "계약만료",
  };
  return statusMap[status] || status;
};

const ContractsTable = ({ contracts, onContractSelect, onContractUpdate }) => {
  const [selectedItems, setSelectedItems] = useState([]);

  const toggleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedItems(contracts.map((c) => c.id));
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
          checked={selectedItems.length === contracts.length && contracts.length > 0}
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
    { key: "apartment", header: "단지" },
    { key: "dong", header: "동", render: (row) => `${row.dong}동` },
    { key: "ho", header: "호수", render: (row) => `${row.ho}호` },
    { key: "area", header: "면적", render: (row) => `${row.area}m²` },
    { key: "ownerName", header: "소유주(매도인)" },
    { key: "tenantName", header: "입주인(매수인)" },
    {
      key: "contractType",
      header: "거래 유형",
      render: (row) => (
        <Badge label={getTransactionTypeText(row.contractType)} variant={getTransactionTypeText(row.contractType)} />
      ),
    },
    { key: "contractPrice", header: "거래 가격", render: (row) => formatPrice(row.contractPrice) },
    { key: "contractDate", header: "계약일시" },
    { key: "dueDate", header: "만기일" },
    {
      key: "contractFile",
      header: "계약서",
      render: (row) =>
        row.contractFile ? (
          <button className={styles.viewContractButton} onClick={(e) => e.stopPropagation()}>
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
        <Badge label={getContractStatusText(row.contractStatus)} variant={getContractStatusText(row.contractStatus)} />
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
            src={row.isFavorite ? FilledStarIcon : BlackStarIcon}
            alt={row.isFavorite ? "즐겨찾기 됨" : "즐겨찾기"}
          />
        </button>
      ),
    },
  ];

  if (!contracts || contracts.length === 0) {
    return <div className={styles.empty}>등록된 계약이 없습니다.</div>;
  }

  return (
    <div className={styles.container}>
      <Table
        columns={columns}
        data={contracts}
        loading={false}
        emptyMessage="등록된 계약이 없습니다."
        onRowClick={onContractSelect}
        rowClassName={styles.contractRow}
      />
    </div>
  );
};

export default ContractsTable; 