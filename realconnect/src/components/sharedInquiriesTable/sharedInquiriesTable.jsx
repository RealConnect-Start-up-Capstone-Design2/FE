import React, { useState } from "react";
import FilledStar from "../../assets/icons/filledStar.svg";
import BlankStar from "../../assets/icons/blankStar.svg";
import "./sharedInquiriesTable.css";

const SharedInquiriesTable = ({ sharedInquiries, onSharedInquirySelect }) => {
  const [selectedItems, setSelectedItems] = useState([]);

  const toggleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedItems(
        sharedInquiries.map((sharedInquiry) => sharedInquiry.id)
      );
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

  const handleRowClick = (sharedInquiry) => {
    onSharedInquirySelect(sharedInquiry);
  };

  // 금액을 억 단위로 포맷팅하는 함수
  const formatPrice = (price) => {
    if (!price || price === 0) return "-";
    return (price / 100000000).toFixed(1) + "억";
  };

  // 보증금/월세 포맷팅 함수
  const formatDepositMonthly = (deposit, monthly) => {
    const depositFormatted =
      deposit && deposit !== 0 ? formatPrice(deposit) : "-";
    const monthlyFormatted = monthly && monthly !== 0 ? monthly + "만원" : "-";
    return `${depositFormatted}/${monthlyFormatted}`;
  };

  if (!sharedInquiries || sharedInquiries.length === 0) {
    return (
      <div className="shared-inquiries-table-empty">
        <p>표시할 문의가 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="shared-inquiries-table-container">
      <table className="shared-inquiries-table">
        <thead>
          <tr>
            <th className="checkbox-column">
              <input
                type="checkbox"
                onChange={toggleSelectAll}
                checked={selectedItems.length === sharedInquiries.length}
              />
            </th>
            <th>구</th>
            <th>동</th>
            <th>단지</th>
            <th>면적</th>
            <th>매매</th>
            <th>전세</th>
            <th>보증금/월세</th>
            <th>문의 유형</th>
            <th>문의 제목</th>
            <th>업소명</th>
            <th>등록일</th>
            <th>진행 상태</th>
            <th>즐겨찾기</th>
          </tr>
        </thead>
        <tbody>
          {sharedInquiries.map((inquiry) => (
            <tr key={inquiry.id} onClick={() => handleRowClick(inquiry)}>
              <td className="checkbox-column">
                <input
                  type="checkbox"
                  checked={selectedItems.includes(inquiry.id)}
                  onChange={(e) => toggleSelect(e, inquiry.id)}
                />
              </td>
              <td>{inquiry.l2}</td>
              <td>{inquiry.l3}</td>
              <td>{inquiry.apartmentName}</td>
              <td>{inquiry.area} m²</td>
              <td>{formatPrice(inquiry.salePrice)}</td>
              <td>{formatPrice(inquiry.jeonsePrice)}</td>
              <td>
                {formatDepositMonthly(inquiry.deposit, inquiry.monthPrice)}
              </td>
              <td>
                <div className="inquiry-type-text">
                  {inquiry.type === "BUY"
                    ? "매매"
                    : inquiry.type === "JEONSE"
                      ? "전세"
                      : inquiry.type === "MONTH_RENT"
                        ? "월세"
                        : "미등록"}
                </div>
              </td>
              <td>
                <span className="inquiry-title-text">{inquiry.title}</span>
              </td>
              <td>{inquiry.agentName}</td>
              <td>{inquiry.createdAt ? inquiry.createdAt : "-"}</td>
              <td>
                <div className="inquiry-status-text">
                  {inquiry.status === "BUY"
                    ? "매매"
                    : inquiry.status === "JEONSE"
                      ? "전세"
                      : inquiry.status === "MONTH_RENT"
                        ? "월세"
                        : "미등록"}
                </div>
              </td>
              <td>
                {inquiry.favorite ? (
                  <img src={FilledStar} alt="즐겨찾기" />
                ) : (
                  <img src={BlankStar} alt="즐겨찾기" />
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SharedInquiriesTable;
