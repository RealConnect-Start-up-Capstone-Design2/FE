import React, { useState } from "react";
import "./PropertyTable.css";

const PropertyTable = ({ properties }) => {
  const [selectedItems, setSelectedItems] = useState([]);

  // Toggle selection of all items
  const toggleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedItems(properties.map((property) => property.id));
    } else {
      setSelectedItems([]);
    }
  };

  // Toggle selection of a single item
  const toggleSelect = (id) => {
    setSelectedItems((prevSelected) => {
      if (prevSelected.includes(id)) {
        return prevSelected.filter((item) => item !== id);
      } else {
        return [...prevSelected, id];
      }
    });
  };

  // If there are no properties, display an empty state
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
            <th className="image-column">이미지</th>
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
            <th>거래 상태</th>
          </tr>
        </thead>
        <tbody>
          {properties.map((property) => (
            <tr key={property.id}>
              <td className="checkbox-column">
                <input
                  type="checkbox"
                  checked={selectedItems.includes(property.id)}
                  onChange={() => toggleSelect(property.id)}
                />
              </td>
              <td className="image-column">
                <div className="property-image">
                  {property.image ? (
                    <img src={property.image} alt={property.complex} />
                  ) : (
                    <div className="no-image"></div>
                  )}
                </div>
              </td>
              <td>{property.complex}</td>
              <td>{property.building}</td>
              <td>{property.unit}</td>
              <td>{property.area}</td>
              <td>{property.sellPrice}</td>
              <td>{property.deposit}</td>
              <td>
                {property.rentDeposit}/{property.monthlyRent}
              </td>
              <td>
                <span
                  className={`transaction-type ${property.transactionType === "매매" ? "sale" : "rent"}`}
                >
                  {property.transactionType}
                </span>
              </td>
              <td>{property.owner}</td>
              <td>{property.contact}</td>
              <td>
                <button className={`status-button ${property.status}`}>
                  {property.status}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PropertyTable;
