import React, { useState, useEffect } from "react";
import "./inquiryModifySidebar.css";
import InquirySelectButton from "../selectButtons/InquirySelectButton";
import StatusSelectButton from "../selectButtons/StatusSelectButton";

const InquiryModifySidebar = ({ inquiry, onClose, onSave }) => {
  const getStatusDisplayValue = (apiStatus) => {
    switch (apiStatus) {
      case "IN_PROGRESS":
        return "진행중";
      case "COMPLETED":
        return "완료";
      case "CANCEL":
        return "취소";
    }
  };

  // 초기 데이터 설정 (inquiryType은 영어 값 그대로 사용)
  const [formData, setFormData] = useState({
    name: inquiry.name || "",
    phone: inquiry.phone || "",
    apartmentName: inquiry.apartmentName || "",
    area:
      inquiry.area && inquiry.area !== "-"
        ? inquiry.area.replace(/[^0-9.]/g, "")
        : "",
    inquiryType: inquiry.inquiryType || "BUY", // 영어 값 그대로 사용
    statusDisplay: getStatusDisplayValue(inquiry.status),
    status: inquiry.status,
    salePrice: inquiry.salePrice || "",
    jeonsePrice: inquiry.jeonsePrice || "",
    deposit: inquiry.deposit || "",
    monthPrice: inquiry.monthPrice || "",
    memo: inquiry.memo || "",
    favorite: inquiry.favorite || false,
  });

  // 디버깅용: 컴포넌트 마운트 시 초기 데이터 로그
  useEffect(() => {
    console.log("InquiryModifySidebar 초기 데이터:", formData);
  }, []);

  const handleChange = (field) => (e) => {
    setFormData({ ...formData, [field]: e.target.value });
  };

  const handleSave = () => {
    // statusDisplay 필드만 제외하고 전달
    const apiData = {
      ...formData,
      statusDisplay: undefined,
    };

    console.log("저장할 데이터:", apiData);

    if (onSave) {
      onSave(apiData);
    }
  };

  // inquiryType 변환 (한글 → 영어)
  const handleInquiryTypeChange = (displayValue) => {
    let apiValue;

    switch (displayValue) {
      case "매매":
        apiValue = "BUY";
        break;
      case "전세":
        apiValue = "JEONSE";
        break;
      case "월세":
        apiValue = "MONTH_RENT";
        break;
      default:
        apiValue = "BUY";
    }

    console.log(`문의 유형 변경: ${displayValue} -> ${apiValue}`);

    setFormData({
      ...formData,
      inquiryType: apiValue,
    });
  };

  // status 변환 (UI 표시 형식 → API 요청 형식)
  const handleStatusChange = (displayValue) => {
    let apiValue;

    switch (displayValue) {
      case "진행중":
        apiValue = "IN_PROGRESS";
        break;
      case "완료":
        apiValue = "COMPLETED";
        break;
      case "취소":
        apiValue = "CANCEL";
        break;
    }

    setFormData({
      ...formData,
      statusDisplay: displayValue,
      status: apiValue,
    });
  };

  return (
    <div className="inquiry-modify-sidebar">
      <div className="inquiry-modify-header">
        <input
          name="apartmentName"
          value={formData.apartmentName}
          onChange={handleChange("apartmentName")}
          placeholder="단지명을 입력하세요"
        />
        <button className="inquiry-close-button" onClick={onClose}>
          ×
        </button>
      </div>

      <div className="inquiry-propeerty-addresses">
        <div className="inquiry-property-address">
          <div className="inquiry-address-icon">🏠</div>
          <div>
            <div>관련 매물을 등록하세요</div>
            <div>{formData.apartmentName || "단지명을 입력하세요"}</div>
          </div>
        </div>
        <div className="inquiry-change-button">변경하기</div>
      </div>

      <div className="inquiry-price-info">
        <div className="inquiry-price">
          <label>희망 가격</label>
        </div>
        <div className="inquiry-desired-price">
          <label>매매</label>
          <input
            name="salePrice"
            value={formData.salePrice}
            onChange={handleChange("salePrice")}
            placeholder="0.0억"
          />
        </div>
        <div className="inquiry-desired-price">
          <label>전세</label>
          <input
            name="jeonsePrice"
            value={formData.jeonsePrice}
            onChange={handleChange("jeonsePrice")}
            placeholder="0.0억"
          />
        </div>
        <div className="inquiry-desired-price">
          <label>보증금/월세</label>
          <input
            name="depositAndMonthPrice"
            value={`${formData.deposit || ""}/${formData.monthPrice || ""}`}
            onChange={(e) => {
              const [deposit, monthPrice] = e.target.value.split("/");
              setFormData((prev) => ({
                ...prev,
                deposit: deposit || "",
                monthPrice: monthPrice || "",
              }));
            }}
            placeholder="0/0"
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
              placeholder="이름"
            />
          </div>

          <div className="inquiry-info-box">
            <label>문의자연락처</label>
            <input
              type="text"
              value={formData.phone}
              onChange={handleChange("phone")}
              placeholder="010-0000-0000"
            />
          </div>
        </div>

        <div className="inquiry-info-row">
          <div className="inquiry-info-box">
            <label>문의 유형</label>
            <InquirySelectButton
              value={formData.inquiryType}
              onChange={handleInquiryTypeChange}
            />
          </div>

          <div className="inquiry-info-box">
            <label>진행 상태</label>
            <StatusSelectButton
              value={formData.statusDisplay}
              onChange={handleStatusChange}
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
              placeholder="00.0 m²"
            />
          </div>

          <div className="inquiry-info-box">
            <label>등록일</label>
            <input
              type="text"
              value={formData.createdAt || ""}
              onChange={handleChange("createdAt")}
              placeholder="자동 생성됩니다"
              disabled
            />
          </div>
        </div>
      </div>

      <div className="inquiry-note-section">
        <label>문의 내용</label>
        <textarea
          name="memo"
          value={formData.memo}
          onChange={handleChange("memo")}
          placeholder="문의 내용을 입력하세요"
        />
      </div>

      <button
        className="inquiry-save-button"
        onClick={handleSave}
        style={{ cursor: "pointer" }}
      >
        저장하기
      </button>
    </div>
  );
};

export default InquiryModifySidebar;
