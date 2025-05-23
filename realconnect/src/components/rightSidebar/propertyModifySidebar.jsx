import React, { useState } from "react";
import "./propertyModifySidebar.css";
import ContractStatus from '../sortButtons/contractStatus';
import ContractTagButton from "../tagButtons/ContractTagButton";
import DirectionTagButton from "../tagButtons/DirectionTagButton";
import ExpansionTagButton from "../tagButtons/ExpansionTagButton";
import WardrobeTagButton from "../tagButtons/WardrobeTagButton";

const PropertyModifySidebar = ({ property, onClose }) => {
  if (!property) return null;

  const [formData, setFormData] = useState({
  expansion: property.expansion || "확장",
  wardrobe: property.wardrobe || "붙박이장",
  direction: property.direction || "남향",
  ...property
  });
  


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };
  
  return (
    <div className="property-modify-sidebar">
      <div className="modify-sidebar-header">
        <div className="modify-sidebar-header-title">
          {property.complex} {property.building} {property.unit}
        </div>
        <button className="modify-close-button" onClick={onClose}>×</button>
      </div>

      <div className="modify-property-image-placeholder">
        <div className="modify-floor-plan-placeholder"></div>
        <div className="modify-image-control-buttons">
          <button className="modify-control-button active">평면도</button>
          <button className="modify-control-button">전망</button>
        </div>
      </div>

      <div className="modify-property-tags">
        <DirectionTagButton
          className="tag-direction-button"
          value={formData.direction}
          onChange={(val) => setFormData((prev) => ({ ...prev, direction: val }))}
        />
        <ExpansionTagButton
          className="tag-expansion-button"
          value={formData.expansion}
          onChange={(val) => setFormData((prev) => ({ ...prev, expansion: val }))}
        />
        <WardrobeTagButton
          className="tag-wardrobe-button"
          value={formData.wardrobe}
          onChange={(val) => setFormData((prev) => ({ ...prev, wardrobe: val }))}
        />
        <ContractTagButton
          className="tag-contract-button"
          value={formData.status}
          onChange={(value) =>
            setFormData((prev) => ({ ...prev, status: value }))
          }
        />

      </div>


      

      <div className="modify-form">
        <div className="modify-form-item">
          <label>매매</label>
          <input name="sellPrice"  value={formData.sellPrice} onChange={handleChange} />
        </div>
        
        <div className="modify-form-item">
          <label>전세</label>
          <input name="deposit" value={formData.deposit} onChange={handleChange} />
        </div>
      
        <div className="modify-form-item">
          <label>보증금/월세</label>
          <input
            name="rentDeposit"
            value={`${formData.rentDeposit}/${formData.monthlyRent}`}
            onChange={(e) => {
              const [rent, month] = e.target.value.split("/");
              setFormData(prev => ({
                ...prev,
                rentDeposit: rent || "",
                monthlyRent: month || ""
              }));
            }}
        />

        </div>
      </div>    
        <div className="modify-info-row">
          <div className="modify-info-row-box">
            <div className="modify-info-box">
              <label>소유주</label>
              <input name="owner" value={formData.owner} onChange={handleChange} />
            </div>
            <div className="modify-info-box">
              <label>소유주 연락처</label>
              <input name="contact" value={formData.contact} onChange={handleChange} />
            </div>
          </div>
        

       
            <div className="modify-info-row-box">
              <div className="modify-info-box"> 
                <label>임차인</label>
                <input name="tenant" value={formData.tenant} onChange={handleChange} />
              </div>
              <div className="modify-info-box">
                <label>임차인 연락처</label>
                <input name="tenantContact" value={formData.tenantContact} onChange={handleChange} />
              </div>
            </div>
        
            
            <div className="modify-info-row-box">
              <div className="modify-info-box">
              <label>만기일</label>
              <input name="expiryDate" placeholder="2025.3.18" value={formData.expiryDate} onChange={handleChange} />
              </div>
              <div className="modify-info-box">
                <label>등록일</label>
                <input name="registeredDate"placeholder="2025.3.2" value={formData.registeredDate} onChange={handleChange} />
              </div>
            </div>
        </div>

        <div className="modify-note-section">
          <label>상담 내용</label>
          <textarea
            name="note1"
            value={formData.note1}
            onChange={handleChange}
            placeholder={'집주인 재계약 원하지 않음\n\n 화장실 하자 수리 완료된 집'}
          />
          
        </div>

        <button className="modify-save-button" onClick={onClose}>
          저장하기
        </button>
      </div>
    
  );
};

export default PropertyModifySidebar;
