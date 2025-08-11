import React, { useState, useEffect } from "react";
import "./inquiryModifySidebar.css";
import { SortButton } from "@realconnect/shared-ui";
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
    if (!displayValue || displayValue === "-") return "";

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
        deposit: inquiry.deposit ? inquiry.deposit.toString() : "",
        monthPrice: inquiry.monthPrice ? inquiry.monthPrice.toString() : "",
        memo: inquiry.memo || "",
        favorite: inquiry.favorite || false,
        createdAt: formatDate(inquiry.createdAt),
      };

      setFormData(newFormData);
    }
  }, [inquiry]);

  const handleChange = (field) => (e) => {
    setFormData({ ...formData, [field]: e.target.value });
  };

  // 쉼표 자동 입력을 위한 핸들러 (매매, 전세 가격용)
  const handlePriceChange = (field) => (e) => {
    const value = e.target.value.replace(/[^0-9]/g, ""); // 숫자만 추출
    const formattedValue = value ? parseInt(value).toLocaleString() : "";

    setFormData({ ...formData, [field]: formattedValue });
  };

  const handleSave = async () => {
    const isEditMode = inquiry?.id; // id가 있으면 수정 모드

    try {
      if (isEditMode) {
        // 수정 모드: PUT 요청 데이터 준비
        const apiData = {
          id: inquiry.id, // id 포함
          name: formData.name || "",
          phone: formData.phone || "",
          apartmentName: formData.apartmentName || "",
          area: String(formData.area || "").replace(/[^0-9.]/g, "") || null,
          type: toApiInquiryType(formData.inquiryType),
          status: toApiStatus(formData.status),
          salePrice:
            formData.salePrice &&
            formData.salePrice !== "-" &&
            formData.salePrice !== ""
              ? parseInt(formData.salePrice.replace(/[^0-9]/g, ""))
              : null,
          jeonsePrice:
            formData.jeonsePrice &&
            formData.jeonsePrice !== "-" &&
            formData.jeonsePrice !== ""
              ? parseInt(formData.jeonsePrice.replace(/[^0-9]/g, ""))
              : null,
          deposit:
            formData.deposit &&
            formData.deposit !== "-" &&
            formData.deposit !== ""
              ? (() => {
                  const cleanedValue = formData.deposit.replace(/[^0-9]/g, "");
                  const parsedValue = parseInt(cleanedValue);

                  return parsedValue;
                })()
              : null,
          monthPrice:
            formData.monthPrice &&
            formData.monthPrice !== "-" &&
            formData.monthPrice !== ""
              ? parseInt(formData.monthPrice.replace(/[^0-9]/g, ""))
              : null,
          memo: formData.memo || "",
          favorite: formData.favorite || false,
        };

        // onSave 콜백을 통해 상위 컴포넌트에서 처리하도록 함
        if (onSave) {
          onSave(apiData);
        }
      } else {
        // 추가 모드: POST 요청 데이터 준비
        const apiData = {
          name: formData.name || "",
          phone: formData.phone || "",
          apartmentName: formData.apartmentName || "",
          area: String(formData.area || "").replace(/[^0-9.]/g, "") || null, // 숫자 형태의 문자열로 변환
          // 문의 등록 시에는 inquiryType으로 요청해야 합니다.
          inquiryType: toApiInquiryType(formData.inquiryType),
          salePrice:
            formData.salePrice &&
            formData.salePrice !== "-" &&
            formData.salePrice !== ""
              ? parseInt(formData.salePrice.replace(/[^0-9]/g, ""))
              : null,
          jeonsePrice:
            formData.jeonsePrice &&
            formData.jeonsePrice !== "-" &&
            formData.jeonsePrice !== ""
              ? parseInt(formData.jeonsePrice.replace(/[^0-9]/g, ""))
              : null,
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
          // status, favorite 제외
        };

        // onSave 콜백을 통해 상위 컴포넌트에서 처리하도록 함
        if (onSave) {
          onSave(apiData);
        }
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

  return (
    <div className={`inquiry-modify-sidebar ${isClosing ? "closing" : ""}`}>
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
          <label>매매</label>
          <input
            name="salePrice"
            value={formData.salePrice}
            onChange={handlePriceChange("salePrice")}
            placeholder="예: 1,000,000,000"
          />
        </div>
        <div className="inquiry-desired-price">
          <label>전세</label>
          <input
            name="jeonsePrice"
            value={formData.jeonsePrice}
            onChange={handlePriceChange("jeonsePrice")}
            placeholder="예: 500,000,000"
          />
        </div>
        <div className="inquiry-desired-price">
          <label>보증금</label>
          <input
            name="deposit"
            value={formData.deposit || ""}
            onChange={handlePriceChange("deposit")}
            placeholder="예: 10,000,000"
          />
        </div>
        <div className="inquiry-desired-price">
          <label>월세</label>
          <input
            name="monthPrice"
            value={formData.monthPrice || ""}
            onChange={handlePriceChange("monthPrice")}
            placeholder="예: 500,000"
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
            <label>문의자 연락처</label>
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
          <div className="inquiry-info-box">
            <label>면적</label>
            <input
              type="text"
              value={formData.area}
              onChange={handleChange("area")}
              placeholder="00.0"
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
