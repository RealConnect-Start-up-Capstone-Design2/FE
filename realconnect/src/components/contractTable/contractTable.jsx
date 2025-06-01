import React from "react";
import axios from "axios";
import useAuthStore from "../../store/authStore";
import "./contractTable.css";
import BlackStarIcon from "../../assets/icons/blankStar.svg";
import FilledStarIcon from "../../assets/icons/filledStar.svg";

const ContractTable = ({ contracts, onContractSelect, onContractUpdate }) => {
  const { accessToken } = useAuthStore();

  // 거래 유형을 한국어로 변환
  const getTransactionTypeText = (contractType) => {
    const typeMap = { BUY: "매매", JEONSE: "전세", MONTH_RENT: "월세" };
    return typeMap[contractType] || contractType;
  };

  // 거래 가격 포맷팅 (원 → 만원/억 단위)
  const formatPrice = (price) => {
    if (!price) return "-";
    const numPrice = parseInt(price, 10);

    if (numPrice >= 100000000) {
      // 1억 이상
      const eok = numPrice / 100000000;
      return `${eok.toFixed(1)}억`;
    } else {
      // 1억 미만
      const man = numPrice / 10000;
      return `${man.toLocaleString()}만원`;
    }
  };

  // 계약 상태를 한국어로 변환
  const getContractStatusText = (status) => {
    const statusMap = {
      ACTIVE: "계약 중",
      COMPLETED: "계약 완료",
      TERMINATED: "계약 파기",
      EXPIRED: "계약 만료",
    };
    return statusMap[status] || status;
  };

  // CSS 클래스명용 상태 텍스트 변환
  const getStatusClassName = (status) => {
    const statusText = getContractStatusText(status);
    // CSS 파일의 실제 클래스명과 매칭
    const classNameMap = {
      "계약 완료": "계약-완료",
      "계약 중": "계약-중",
      "계약 파기": "계약-파기",
      "계약 만료": "계약-만료",
    };
    return classNameMap[statusText] || statusText;
  };

  // 즐겨찾기 토글 함수
  const handleFavoriteToggle = async (contract, e) => {
    e.stopPropagation();

    // 즉시 UI 업데이트를 위해 부모 컴포넌트에 변경사항 전달
    if (onContractUpdate) {
      onContractUpdate(contract.id, { isFavorite: !contract.isFavorite });
    }

    try {
      const updateData = {
        apartment: contract.apartment,
        dong: contract.dong,
        ho: contract.ho,
        area: contract.area,
        ownerName: contract.ownerName,
        ownerPhone: contract.ownerPhone,
        tenantName: contract.tenantName,
        tenantPhone: contract.tenantPhone,
        contractType: contract.contractType,
        contractPrice: contract.contractPrice,
        contractDate: contract.contractDate,
        dueDate: contract.dueDate,
        contractStatus: contract.contractStatus,
        favorite: !contract.isFavorite, // 즐겨찾기 상태 반전
      };

      // API 호출
      await axios.put(
        `${import.meta.env.VITE_API_URL}/api/contract/update/${contract.id}`,
        updateData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("즐겨찾기 업데이트 성공");
    } catch (error) {
      console.error("즐겨찾기 업데이트 실패:", error);

      // API 호출 실패 시 원래 상태로 롤백
      if (onContractUpdate) {
        onContractUpdate(contract.id, { isFavorite: contract.isFavorite });
      }

      alert("즐겨찾기 설정에 실패했습니다.");
    }
  };

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
              <td>{contract.apartment}</td>
              <td>{contract.dong}동</td>
              <td>{contract.ho}호</td>
              <td>{contract.area}m²</td>
              <td>{contract.ownerName}</td>
              <td>{contract.tenantName}</td>
              <td>{getTransactionTypeText(contract.contractType)}</td>
              <td>{formatPrice(contract.contractPrice)}</td>
              <td>{contract.contractDate}</td>
              <td>{contract.dueDate}</td>
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
                  className={`contract-status ${getStatusClassName(contract.contractStatus)}`}
                >
                  {" " + getContractStatusText(contract.contractStatus)}
                </span>
              </td>
              <td
                className="favorite-column"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  className="favorite-button"
                  onClick={(e) => handleFavoriteToggle(contract, e)}
                >
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
