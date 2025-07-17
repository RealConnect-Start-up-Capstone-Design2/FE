import React, { useState } from "react";
import {
  updateInquiry,
  createInquiry,
} from "@/services/inquiryService";
import "./inquiryModifySidebar.css";
import { Button } from "@realconnect/shared-ui";

const InquiryModifySidebar = ({ inquiry, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: inquiry?.name || "",
    phone: inquiry?.phone || "",
    type: inquiry?.inquiryType || "매매", // '매매', '전세', '월세'
    status: inquiry?.status || "상담", // '상담', '보류', '계약'
    memo: inquiry?.memo || "",
  });

  const handleSave = async () => {
    const inquiryData = {
      ...formData,
      inquiryType: formData.type,
    };

    // If it's not a new inquiry, we need to pass the id and other properties
    if (inquiry && inquiry.id) {
      inquiryData.id = inquiry.id;
      // Pass other non-editable fields from original inquiry object
    }

    try {
      if (inquiry && inquiry.id) {
        // Update existing inquiry
        await updateInquiry(inquiry.id, inquiryData);
      } else {
        // Create new inquiry
        await createInquiry(inquiryData);
      }
      onSave(inquiryData);
      onClose();
    } catch (error) {
      console.error("Failed to save inquiry", error);
    }
  };

  if (!inquiry) return null;

  return (
    <div className={`inquiry-modify-sidebar`}>
      <div className="inquiry-modify-sidebar-header">
        <h3>문의 수정</h3>
        <button onClick={onClose} className="inquiry-modify-close-button">
          ×
        </button>
      </div>
      <div className="inquiry-modify-sidebar-content">
        <div className="inquiry-modify-form-group">
          <label>고객명</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="inquiry-modify-input"
          />
        </div>
        <div className="inquiry-modify-form-group">
          <label>연락처</label>
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={(e) =>
              setFormData({ ...formData, phone: e.target.value })
            }
            className="inquiry-modify-input"
          />
        </div>
        <div className="inquiry-modify-form-group">
          <label>문의 유형</label>
          <div className="inquiry-modify-button-group">
            <Button
              options={["매매", "전세", "월세"]}
              value={formData.type}
              onChange={(value) => setFormData({ ...formData, type: value })}
            />
          </div>
        </div>
        <div className="inquiry-modify-form-group">
          <label>상태</label>
          <div className="inquiry-modify-button-group">
            <Button
              options={["상담", "보류", "계약"]}
              value={formData.status}
              onChange={(value) => setFormData({ ...formData, status: value })}
            />
          </div>
        </div>
        <div className="inquiry-modify-form-group">
          <label>메모</label>
          <textarea
            name="memo"
            value={formData.memo}
            onChange={(e) => setFormData({ ...formData, memo: e.target.value })}
            className="inquiry-modify-textarea"
          />
        </div>
      </div>
      <div className="inquiry-modify-sidebar-footer">
        <button onClick={onClose} className="inquiry-modify-cancel-button">
          취소
        </button>
        <button onClick={handleSave} className="inquiry-modify-save-button">
          저장
        </button>
      </div>
    </div>
  );
};

export default InquiryModifySidebar;