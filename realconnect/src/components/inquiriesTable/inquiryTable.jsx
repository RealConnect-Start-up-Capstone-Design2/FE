import React, { useState, useEffect } from "react";
import "./inquiryTable.css";
import FilledStarIcon from "../../assets/icons/filledStar.svg";
import BlackStarIcon from "../../assets/icons/blankStar.svg";

const InquiryTable = ({ inquiries, onInquirySelect, onFavoriteToggle }) => {
  const [selectedItems, setSelectedItems] = useState([]);
  // 내부 상태로 즐겨찾기 상태 관리
  const [inquiriesList, setInquiriesList] = useState([]);

  // 외부에서 받은 inquiries 데이터가 변경되면 내부 상태 업데이트
  useEffect(() => {
    setInquiriesList([...inquiries]);
  }, [inquiries]);

  const toggleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedItems(inquiriesList.map((inquiry) => inquiry.id));
    } else {
      setSelectedItems([]);
    }
  };

  const toggleSelect = (e, id) => {
    e.stopPropagation();

    // 기존 선택된 항목들을 모두 제거하고 현재 항목만 선택
    if (e.target.checked) {
      setSelectedItems([id]);
    } else {
      setSelectedItems([]);
    }
  };

  const handleRowClick = (inquiry) => {
    onInquirySelect(inquiry);
  };

  const toggleFavorite = (e, inquiry) => {
    e.stopPropagation();

    // 내부 상태를 업데이트하여 리렌더링 유도
    const updatedList = inquiriesList.map((item) => {
      if (item.id === inquiry.id) {
        return { ...item, favorite: !item.favorite };
      }
      return item;
    });

    setInquiriesList(updatedList);

    // 부모 컴포넌트에서 onFavoriteToggle 함수를 전달받았다면 사용
    if (onFavoriteToggle) {
      onFavoriteToggle(inquiry.id);
    }
  };

  const formatCell = (value) => {
    if (!value || value === "") return "-";
    return value;
  };

  if (!inquiriesList || inquiriesList.length === 0) {
    return (
      <div className="inquiry-table-empty">
        <p>표시할 문의가 없습니다.</p>
      </div>
    );
  }
  return (
    <div className="inquiry-table-container">
      <table className="inquiry-table">
        <thead>
          <tr>
            <th className="checkbox-column">
              <input
                type="checkbox"
                onChange={toggleSelectAll}
                checked={
                  selectedItems.length === inquiriesList.length &&
                  inquiriesList.length > 0
                }
              />
            </th>
            <th>단지</th>
            <th>문의 내용</th>
            <th>면적</th>
            <th>문의 유형</th>
            <th>매매</th>
            <th>전세</th>
            <th>보증금/월세</th>
            <th>문의자</th>
            <th>연락처</th>
            <th>등록일</th>
            <th>진행 상태</th>
            <th className="favorite-column">즐겨찾기</th>
          </tr>
        </thead>
        <tbody>
          {inquiriesList.map((inquiry) => (
            <tr
              key={inquiry.id}
              onClick={() => handleRowClick(inquiry)}
              className="inquiry-row"
            >
              <td
                className="checkbox-column"
                onClick={(e) => e.stopPropagation()}
              >
                <input
                  type="checkbox"
                  checked={selectedItems.includes(inquiry.id)}
                  onChange={(e) => toggleSelect(e, inquiry.id)}
                />
              </td>
              <td>{formatCell(inquiry.complex)}</td>
              <td>{formatCell(inquiry.content)}</td>
              <td>{formatCell(inquiry.area)}</td>
              <td>
                <div className="transaction-type">
                  {formatCell(inquiry.transactionType)}
                </div>
              </td>
              <td>{formatCell(inquiry.sellPrice)}</td>
              <td>{formatCell(inquiry.rentPrice)}</td>
              <td>
                {inquiry.deposit || inquiry.monthlyRent
                  ? `${formatCell(inquiry.deposit)}/${formatCell(inquiry.monthlyRent)}`
                  : "-"}
              </td>
              <td>{formatCell(inquiry.name)}</td>
              <td>{formatCell(inquiry.phone)}</td>
              <td>{formatCell(inquiry.date)}</td>
              <td className="status-column">
                <div
                  className={`status-button ${inquiry.status.replace(/\s+/g, "")}`}
                >
                  {inquiry.status}
                </div>
              </td>
              <td
                className="favorite-column"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  className="favorite-button"
                  onClick={(e) => toggleFavorite(e, inquiry)}
                >
                  <img
                    src={inquiry.favorite ? FilledStarIcon : BlackStarIcon}
                    alt={inquiry.favorite ? "즐겨찾기 됨" : "즐겨찾기"}
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

export default InquiryTable;
