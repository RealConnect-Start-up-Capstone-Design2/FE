import React, { useState } from "react";
import "./PropertyTable.css";

const PropertyTable = ({ properties, onPropertySelect }) => {
  const [selectedItems, setSelectedItems] = useState([]);

  const toggleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedItems(properties.map((property) => property.id));
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

  const handleRowClick = (property) => {
    onPropertySelect(property);
  };

  // 가격 포맷팅 함수
  const formatPrice = (price) => {
    if (!price || price === "-") return "-";

    // 문자열이면서 쉼표가 포함된 경우 처리
    let numericValue;
    if (typeof price === "string") {
      // 쉼표 제거
      const cleanPrice = price.replace(/,/g, "");
      numericValue = Number(cleanPrice);

      // 변환 실패시 기본값 반환
      if (isNaN(numericValue)) return "-";
    } else {
      numericValue = Number(price);
    }

    // 0원이면 "-" 표시
    if (numericValue === 0) return "-";

    // 1억 이상인 경우
    if (numericValue >= 100000000) {
      // 억 단위로 변환 (반올림 없이 소수점 첫째자리까지)
      const billions = Math.floor(numericValue / 10000000) / 10;
      return billions.toFixed(1) + "억";
    }
    // 1억 미만인 경우
    else {
      // 만원 단위로 표시
      const tenThousands = Math.floor(numericValue / 10000);
      return tenThousands.toLocaleString() + "만원";
    }
  };

  if (!properties || properties.length === 0) {
    return (
      <div className="property-table-empty">
        <p>표시할 매물이 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="property-table-container">
      <table className="property-table">
        <thead>
          <tr>
            <th className="checkbox-column">
              <input
                type="checkbox"
                onChange={toggleSelectAll}
                checked={
                  selectedItems.length === properties.length &&
                  properties.length > 0
                }
              />
            </th>
            <th>단지</th>
            <th>동</th>
            <th>호수</th>
            <th>면적</th>
            <th>매매</th>
            <th>전세</th>
            <th>보증금/월세</th>
            <th>거래 유형</th>
            <th>소유자</th>
            <th>연락처</th>
            <th className="status-column">거래 상태</th>
          </tr>
        </thead>
        <tbody>
          {properties.map((property, index) => (
            <tr
              key={`${property.id}-${index}`}
              onClick={() => handleRowClick(property)}
              className="property-row"
            >
              <td
                className="checkbox-column"
                onClick={(e) => e.stopPropagation()}
              >
                <input
                  type="checkbox"
                  checked={selectedItems.includes(property.id)}
                  onChange={(e) => toggleSelect(e, property.id)}
                />
              </td>
              <td>{property.apartmentName}</td>
              <td>{property.building}</td>
              <td>{property.unit}</td>
              <td>{property.area}</td>
              <td>{formatPrice(property.salePrice)}</td>
              <td>{formatPrice(property.jeonsePrice)}</td>
              <td>
                {property.deposit}/{property.monthPrice}
              </td>
              <td>
                <span
                  className={`transaction-type ${property.transactionType === "매매" ? "sale" : "rent"}`}
                >
                  {property.transactionType}
                </span>
              </td>
              <td>{property.ownerName}</td>
              <td>{property.contact}</td>
              <td className="status-column">
                <div
                  className={`status-button ${property.status.replace(/\s+/g, "")}`}
                >
                  {property.status}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PropertyTable;
