import React from "react";
import "./contractTable.css";
import BlackStarIcon from "../../assets/icons/blankStar.svg";
import FilledStarIcon from "../../assets/icons/filledStar.svg";

const ContractTable = ({ contracts, onContractSelect }) => {
  if (!contracts || contracts.length === 0) {
    return <div className="contract-table-empty">등록된 계약이 없습니다.</div>;
  }

  return (
    <div className="contract-table-container">
      <table className="contract-table">
        <thead>
          <tr>
            <th className="checkbox-column">
              <input type="checkbox" />
            </th>
            <th>단지</th>
            <th>동</th>
            <th>호수</th>
            <th>면적</th>
            <th>소유주(매도인)</th>
            <th>입주인(매수인)</th>
            <th>거래 유형</th>
            <th>거래 가격</th>
            <th>계약 일시</th>
            <th>만기일</th>
            <th>계약서</th>
            <th>계약 상태</th>
            <th className="favorite-column">즐겨찾기</th>
          </tr>
        </thead>
        <tbody>
          {contracts.map((contract) => (
            <tr
              key={contract.id}
              onClick={() => onContractSelect(contract)}
              className="contract-row"
            >
              <td
                className="checkbox-column"
                onClick={(e) => e.stopPropagation()}
              >
                <input type="checkbox" />
              </td>
              <td>{contract.complex}</td>
              <td>{contract.building}동</td>
              <td>{contract.unit}호</td>
              <td>{contract.area}m²</td>
              <td>{contract.owner}</td>
              <td>{contract.tenant}</td>
              <td>{contract.transactionType}</td>
              <td>{contract.sellPrice}</td>
              <td>{contract.startDate}</td>
              <td>{contract.endDate}</td>
              <td className="contract-file">
                {contract.contractFile ? (
                  <button
                    className="view-contract-button"
                    onClick={(e) => e.stopPropagation()}
                  >
                    계약서 보기
                  </button>
                ) : (
                  <span>-</span>
                )}
              </td>
              <td>
                <span
                  className={`contract-status ${contract.status.replace(/\s+/g, "-")}`}
                >
                  {contract.status}
                </span>
              </td>
              <td
                className="favorite-column"
                onClick={(e) => e.stopPropagation()}
              >
                <button className="favorite-button">
                  <img
                    src={contract.isFavorite ? FilledStarIcon : BlackStarIcon}
                    alt={contract.isFavorite ? "즐겨찾기 됨" : "즐겨찾기"}
                  />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ContractTable;
