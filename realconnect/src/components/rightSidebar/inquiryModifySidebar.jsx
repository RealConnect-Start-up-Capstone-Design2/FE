import React, { useState } from "react";
import "./inquiryModifySidebar.css";
import InquirySelectButton from "../selectButtons/InquirySelectButton";
import StatusSelectButton from "../selectButtons/StatusSelectButton";



const InquiryModifySidebar = ({ inquiry, onClose, onSave }) => {
  const [formData, setFormData] = useState({ ...inquiry });

  const handleChange = (field) => (e) => {
    setFormData({ ...formData, [field]: e.target.value });
  };

  return (
    <div className="inquiry-modify-sidebar">
        <div className="inquiry-modify-header">
            <input name= "inquiry-modify-title" value={formData.complex} onChange={handleChange("complex")} />
            <button className="inquiry-close-button" onClick={onClose}>
            ×
            </button>

        </div>
       
        <div className="inquiry-propeerty-addresses">
          <div className="inquiry-property-address">
            <div className="inquiry-address-icon">🏠</div>
            <div>
              <div> 관련 매물 1</div>
              <div>파크리오 101-3301 34 C</div>
            </div>
          </div>
          <div className="inquiry-property-address">
            <div className="inquiry-address-icon">🏠</div>
            <div>
              <div> 관련 매물 1</div>
              <div>파크리오 101-3301 34 C</div>
            </div>
          </div>
          <div className="inquiry-change-button">변경하기</div>
        </div>

        <div className= "inquiry-price-info">
            <div className="inquiry-price">
                <label>희망 가격</label>
            </div>
            <div className="inquiry-desired-price">
                <label>매매</label>
                <input name="sellPrice"  value={formData.sellPrice} onChange={handleChange("sellPrice")} />
            </div>
            <div className="inquiry-desired-price">
                <label>전세</label>
                <input name="deposit" value= {formData.deposit} onChange={handleChange("deposit")} />
            </div>
            <div className="inquiry-desired-price">
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

        <div className="inquiry-contact-info">
            <div className="inquiry-info-row">
                <div className="inquiry-info-box">
                    <label>문의자</label>
                    <input
                    type="text"
                    value={formData.name}
                    onChange={handleChange("name")}
                    />
                </div>

                <div className="inquiry-info-box">
                    <label>문의자연락처 </label>
                    <input
                    type="text"
                    value={formData.phone}
                    onChange={handleChange("phone")}
                    />
                </div>
            </div>

            <div className="inquiry-info-row">
                <div className="inquiry-info-box">
                    <label>문의 유형</label>
                    <InquirySelectButton
                        value={formData.transactionType}
                        onChange={(value) =>
                            setFormData({ ...formData, transactionType: value })
                        }
                        />
                </div>

                <div className="inquiry-info-box">
                    <label>진행 상태</label>
                    <StatusSelectButton
                        value={formData.status}
                        onChange={(value) =>
                            setFormData({ ...formData, status: value })}
                    />
                </div>
            </div>

            <div className="inquiry-info-row">
                <div className="inquiry-info-box">
                    <label>면적</label>
                    <input
                    type="text"
                    value={formData.area}
                    onChange={handleChange("area")}
                    />
                </div>

                <div className="inquiry-info-box">
                    <label>등록일</label>
                    <input
                    type="text"
                    value={formData.date}
                    onChange={handleChange("date")}
                    />
                </div>

            </div>
        </div>
        
        <div className="inquiry-note-section">
            <label>문의 내용</label>
            <textarea
                name="note"
                value={formData.note}
                onChange={handleChange("note")}
                placeholder={'집주인 재계약 원하지 않음\n\n 화장실 하자 수리 완료된 집'}
                />
        </div>

        <button className="inquiry-save-button"
            onClick={() => onSave(formData)}
            style={{ cursor: "pointer" }} // 수정: 기본 비활성화 제거
        >
            저장하기
        </button>

    
        
    </div>
  );
};

export default InquiryModifySidebar;
