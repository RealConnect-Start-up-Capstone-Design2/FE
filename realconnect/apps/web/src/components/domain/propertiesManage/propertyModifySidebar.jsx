import React, { useState } from "react";
import "./propertyModifySidebar.css";
import { Button } from "@realconnect/shared-ui";
import { updateProperty } from "@/services/propertyService";

const PropertyModifySidebar = ({ property, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    ...property,
    status: property.status || "계약 전",
    direction: property.direction || "남향",
    expansion: property.expansion || "확장",
    wardrobe: property.wardrobe || "붙박이장",
  });
  
  const directionOptions = [
    { value: "남향", label: "남향" }, { value: "북향", label: "북향" },
    { value: "동향", label: "동향" }, { value: "서향", label: "서향" },
    { value: "남서향", label: "남서향" }, { value: "북서향", label: "북서향" },
    { value: "남동향", label: "남동향" }, { value: "북동향", label: "북동향" },
  ];

  const expansionOptions = [
    { value: "확장", label: "확장" }, { value: "해당 없음", label: "해당 없음" },
  ];

  const wardrobeOptions = [
    { value: "붙박이장", label: "붙박이장" }, { value: "해당 없음", label: "해당 없음" },
  ];

  const contractStatusOptions = [
      { value: "계약 전", label: "계약 전" },
      { value: "계약 중", label: "계약 중" },
      { value: "계약 완료", label: "계약 완료" },
  ]

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  
  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    const apiData = { ...formData }; // 전송할 데이터 준비
    try {
      const res = await updateProperty(property.id, apiData);
      onSave(res);
    } catch (error) {
      console.error("매물 정보 업데이트 실패:", error);
    }
  };

  return (
    <div className="property-modify-sidebar">
      <div className="property-modify-header">
        <h2>매물 정보 수정</h2>
        <button onClick={onClose} className="property-modify-close-button">
          ×
        </button>
      </div>
      <div className="property-modify-content">
        {/* 각 필드를 테이블 형태로 표시 */}
        <table className="property-modify-table">
          <tbody>
            <tr>
              <td>매물명</td>
              <td><input type="text" name="apartmentName" value={formData.apartmentName} onChange={handleInputChange} /></td>
            </tr>
            <tr>
              <td>동/호</td>
              <td>
                <input type="text" name="building" value={formData.building} onChange={handleInputChange} />
                <input type="text" name="unit" value={formData.unit} onChange={handleInputChange} />
              </td>
            </tr>
            {/* ... 기타 input 필드들 ... */}
            <tr>
              <td>방향</td>
              <td>
                <Button
                    options={directionOptions}
                    value={formData.direction}
                    onChange={(value) => handleSelectChange('direction', value)}
                />
              </td>
            </tr>
            <tr>
              <td>확장</td>
              <td>
                <Button
                    options={expansionOptions}
                    value={formData.expansion}
                    onChange={(value) => handleSelectChange('expansion', value)}
                />
              </td>
            </tr>
            <tr>
              <td>붙박이장</td>
              <td>
                <Button
                    options={wardrobeOptions}
                    value={formData.wardrobe}
                    onChange={(value) => handleSelectChange('wardrobe', value)}
                />
              </td>
            </tr>
            <tr>
                <td>계약 상태</td>
                <td>
                    <Button
                        options={contractStatusOptions}
                        value={formData.status}
                        onChange={(value) => handleSelectChange('status', value)}
                    />
                </td>
            </tr>
            {/* ... */}
          </tbody>
        </table>
      </div>
      <div className="property-modify-footer">
        <button onClick={handleSave} className="property-modify-save-button">
          저장
        </button>
      </div>
    </div>
  );
};

export default PropertyModifySidebar;