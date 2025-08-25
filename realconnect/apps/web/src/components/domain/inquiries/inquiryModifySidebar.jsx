import React, { useState, useEffect } from "react";
import "./inquiryModifySidebar.css";
import { SortButton } from "@realconnect/shared-ui";
import BaseSidebar from "@/components/common/rightSidebar/BaseSidebar";
import { FormInput } from "@/components/common/form";
import {
  toDisplayStatus,
  toApiStatus,
  toDisplayInquiryType,
  toApiInquiryType,
  getInquiryTypeOptions,
  getStatusOptions,
} from "../../../../../../packages/shared-utils/src/labelMaps.js";
import { formatDate } from "../../../../../../packages/shared-utils/src/formatters.js";

const InquiryModifySidebar = ({ inquiry, onClose, onSave, isClosing }) => {
  const getStatusDisplayValue = (apiStatus) => {
    return toDisplayStatus(apiStatus);
  };

  // "10.0억" 형태를 "1,000,000,000" 형태로 변환하는 함수
  const convertDisplayToNumber = (displayValue) => {
    if (!displayValue || displayValue === "-" || displayValue === 0) return "";

    // 이미 숫자 형태인 경우 그대로 반환
    if (typeof displayValue === "number") {
      return displayValue.toLocaleString();
    }

    // 문자열인 경우 변환
    if (typeof displayValue === "string") {
      if (displayValue.includes("억")) {
        const number = parseFloat(displayValue.replace("억", ""));
        return (number * 100000000).toLocaleString();
      }

      if (displayValue.includes("천만")) {
        const number = parseFloat(displayValue.replace("천만", ""));
        return (number * 10000000).toLocaleString();
      }

      // 숫자만 있는 경우 쉼표 추가
      if (/^\d+$/.test(displayValue)) {
        return parseInt(displayValue).toLocaleString();
      }

      return displayValue;
    }

    return "";
  };

  // 초기 데이터 설정 (inquiryType은 영어 값 그대로 사용)
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    apartmentName: "",
    area: "",
    inquiryType: "BUY",
    statusDisplay: "진행 중",
    status: "IN_PROGRESS",
    salePrice: "",
    jeonsePrice: "",
    deposit: "",
    monthPrice: "",
    memo: "",
    favorite: false,
    createdAt: "",
  });

  // inquiry prop이 변경될 때마다 폼 데이터 업데이트
  useEffect(() => {
    if (inquiry) {
      const newFormData = {
        name: inquiry.name || "",
        phone: inquiry.phone || "",
        apartmentName: inquiry.apartmentName || "",
        area:
          inquiry.area && inquiry.area !== "-"
            ? inquiry.area.replace(/[^0-9.]/g, "")
            : "",
        inquiryType: inquiry.inquiryType || "BUY",
        statusDisplay: getStatusDisplayValue(inquiry.status),
        status: inquiry.status || "IN_PROGRESS",
        salePrice: convertDisplayToNumber(inquiry.salePrice),
        jeonsePrice: convertDisplayToNumber(inquiry.jeonsePrice),
        deposit: convertDisplayToNumber(inquiry.deposit),
        monthPrice: convertDisplayToNumber(inquiry.monthPrice),
        memo: inquiry.memo || "",
        favorite: inquiry.favorite || false,
        createdAt: formatDate(inquiry.createdAt),
      };

      setFormData(newFormData);
    }
  }, [inquiry]);

  // 통합된 onChange 핸들러
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSave = async () => {
    const isEditMode = inquiry?.id; // id가 있으면 수정 모드

    try {
      // 가격 변환 함수
      const parsePrice = (value) => {
        if (!value || value === "-" || value === "") return null;
        const parsed = parseInt(value.replace(/[^0-9]/g, ""));
        return isNaN(parsed) ? null : parsed;
      };

      // 공통 필드
      const baseData = {
        name: formData.name || "",
        phone: formData.phone || "",
        apartmentName: formData.apartmentName || "",
        area: formData.area
          ? String(formData.area).replace(/[^0-9.]/g, "") || null
          : null,
        salePrice: parsePrice(formData.salePrice),
        jeonsePrice: parsePrice(formData.jeonsePrice),
        deposit:
          formData.deposit &&
          formData.deposit !== "-" &&
          formData.deposit !== ""
            ? parseInt(formData.deposit.replace(/[^0-9]/g, ""))
            : null,
        monthPrice:
          formData.monthPrice &&
          formData.monthPrice !== "-" &&
          formData.monthPrice !== ""
            ? parseInt(formData.monthPrice.replace(/[^0-9]/g, ""))
            : null,
        memo: formData.memo || "",
      };

      let apiData;
      if (isEditMode) {
        // 수정 모드
        apiData = {
          id: inquiry.id,
          ...baseData,
          type: toApiInquiryType(formData.inquiryType),
          status: toApiStatus(formData.status),
          favorite: Boolean(formData.favorite),
        };
      } else {
        // 생성 모드
        apiData = {
          ...baseData,
          inquiryType: toApiInquiryType(formData.inquiryType),
        };
      }

      // onSave 콜백을 통해 상위 컴포넌트에서 처리하도록 함
      if (onSave) {
        onSave(apiData);
      }
    } catch (error) {
      console.error(isEditMode ? "문의 수정 실패:" : "문의 추가 실패:", error);
      alert(
        isEditMode
          ? "문의 수정에 실패했습니다. 모든 필드를 확인해주세요."
          : "문의 추가에 실패했습니다. 모든 필드를 확인해주세요."
      );

      // 실패 시 콜백 호출
      if (onSave) {
        onSave(false);
      }
    }
  };

  // inquiryType 변환 (한글 → 영어)
  const handleInquiryTypeChange = (displayValue) => {
    const apiValue = toApiInquiryType(displayValue);

    setFormData({
      ...formData,
      inquiryType: apiValue,
    });
  };

  // status 변환 (UI 표시 형식 → API 요청 형식)
  const handleStatusChange = (displayValue) => {
    const apiValue = toApiStatus(displayValue);

    setFormData({
      ...formData,
      statusDisplay: displayValue,
      status: apiValue,
    });
  };

  // SortButton용 옵션 변환
  const inquiryTypeOptions = getInquiryTypeOptions().map((option) => ({
    value: option.label,
    label: option.label,
  }));

  const statusOptions = getStatusOptions().map((option) => ({
    value: option.label,
    label: option.label,
  }));

  // 푸터 컨텐츠 준비
  const footerContent = (
    <button
      className="inquiry-save-button"
      onClick={handleSave}
      style={{ cursor: "pointer" }}
    >
      저장하기
    </button>
  );

  return (
    <div className="inquiry-modify-wrapper">
      {/* 커스텀 헤더 */}
      <div className="inquiry-modify-custom-header">
        <input
          name="apartmentName"
          value={formData.apartmentName}
          onChange={handleChange}
          placeholder="단지명을 입력하세요"
          className="inquiry-title-input"
        />
        <button className="inquiry-close-button" onClick={onClose}>
          ×
        </button>
      </div>

      <BaseSidebar
        title="" // 커스텀 헤더를 사용하므로 빈 제목
        onClose={() => {}} // 커스텀 헤더에서 처리하므로 빈 함수
        isClosing={isClosing}
        footerContent={footerContent}
        className="inquiry-modify-sidebar"
      >
        <div className="inquiry-property-addresses">
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
            <FormInput
              type="price"
              label="매매"
              name="salePrice"
              value={formData.salePrice}
              onChange={handleChange}
              placeholder="예: 1,000,000,000"
            />
          </div>
          <div className="inquiry-desired-price">
            <FormInput
              type="price"
              label="전세"
              name="jeonsePrice"
              value={formData.jeonsePrice}
              onChange={handleChange}
              placeholder="예: 500,000,000"
            />
          </div>
          <div className="inquiry-desired-price">
            <FormInput
              type="price"
              label="보증금"
              name="deposit"
              value={formData.deposit || ""}
              onChange={handleChange}
              placeholder="예: 10,000,000"
            />
          </div>
          <div className="inquiry-desired-price">
            <FormInput
              type="price"
              label="월세"
              name="monthPrice"
              value={formData.monthPrice || ""}
              onChange={handleChange}
              placeholder="예: 500,000"
            />
          </div>
        </div>

        <div className="inquiry-contact-info">
          <div className="inquiry-info-row">
            <FormInput
              type="text"
              label="문의자"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="이름"
            />

            <FormInput
              type="phone"
              label="문의자 연락처"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="010-0000-0000"
            />
          </div>

          <div className="inquiry-info-row">
            <div className="inquiry-info-box">
              <label>문의 유형</label>
              <SortButton
                options={inquiryTypeOptions}
                value={toDisplayInquiryType(formData.inquiryType)}
                onChange={handleInquiryTypeChange}
              />
            </div>

            <div className="inquiry-info-box">
              <label>진행 상태</label>
              <SortButton
                options={statusOptions}
                value={formData.statusDisplay}
                onChange={handleStatusChange}
              />
            </div>
          </div>

          <div className="inquiry-info-row">
            <FormInput
              type="number"
              label="면적"
              name="area"
              value={formData.area}
              onChange={handleChange}
              placeholder="00.0"
            />

            <FormInput
              type="text"
              label="등록일"
              name="createdAt"
              value={formData.createdAt || ""}
              onChange={handleChange}
              placeholder="자동 생성됩니다"
              disabled
            />
          </div>
        </div>

        <div className="inquiry-note-section">
          <FormInput
            type="textarea"
            label="문의 내용"
            name="memo"
            value={formData.memo}
            onChange={handleChange}
            placeholder="문의 내용을 입력하세요"
            rows={8}
          />
        </div>
      </BaseSidebar>
    </div>
  );
};

export default InquiryModifySidebar;
