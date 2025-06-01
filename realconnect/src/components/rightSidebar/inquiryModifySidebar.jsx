import React, { useState, useEffect } from "react";
import axios from "axios";
import useAuthStore from "../../store/authStore";
import "./inquiryModifySidebar.css";
import InquirySelectButton from "../selectButtons/InquirySelectButton";
import StatusSelectButton from "../selectButtons/StatusSelectButton";

const InquiryModifySidebar = ({ inquiry, onClose, onSave }) => {
  const accessToken = useAuthStore((state) => state.accessToken);

  const getStatusDisplayValue = (apiStatus) => {
    switch (apiStatus) {
      case "진행중":
      case "진행 중":
        return "진행 중";
      case "완료":
        return "완료";
      default:
        return "진행 중"; // 기본값
    }
  };

  // "10.0억" 형태를 "1,000,000,000" 형태로 변환하는 함수
  const convertDisplayToNumber = (displayValue) => {
    if (!displayValue || displayValue === "-") return "";

    if (displayValue.includes("억")) {
      const number = parseFloat(displayValue.replace("억", ""));
      return (number * 100000000).toLocaleString();
    }

    if (displayValue.includes("천만")) {
      const number = parseFloat(displayValue.replace("천만", ""));
      return (number * 10000000).toLocaleString();
    }

    return displayValue;
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
    status: inquiry.status || "IN_PROGRESS", // 원본 영어 값 유지
    salePrice: convertDisplayToNumber(inquiry.salePrice),
    jeonsePrice: convertDisplayToNumber(inquiry.jeonsePrice),
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

  // 쉼표 자동 입력을 위한 핸들러 (매매, 전세 가격용)
  const handlePriceChange = (field) => (e) => {
    const value = e.target.value.replace(/[^0-9]/g, ""); // 숫자만 추출
    const formattedValue = value ? parseInt(value).toLocaleString() : "";
    setFormData({ ...formData, [field]: formattedValue });
  };

  const handleSave = async () => {
    const isEditMode = inquiry.id; // id가 있으면 수정 모드

    try {
      console.log("AccessToken:", accessToken); // 토큰 확인용

      if (isEditMode) {
        // 수정 모드: PUT 요청
        const apiData = {
          name: formData.name || "",
          phone: formData.phone || "",
          apartmentName: formData.apartmentName || "",
          type: (() => {
            // inquiryType 값이 한글이면 영어로 변환
            switch (formData.inquiryType) {
              case "매매":
                return "BUY";
              case "전세":
                return "JEONSE";
              case "월세":
                return "MONTH_RENT";
              default:
                return formData.inquiryType || "BUY";
            }
          })(),
          status: (() => {
            // status 값이 한글이면 영어로 변환
            switch (formData.status) {
              case "진행중":
              case "진행 중":
                return "IN_PROGRESS";
              case "완료":
                return "COMPLETED";
              default:
                return formData.status || "IN_PROGRESS";
            }
          })(),
          salePrice:
            formData.salePrice && formData.salePrice !== "-"
              ? parseInt(formData.salePrice.replace(/[^0-9]/g, ""))
              : null,
          jeonsePrice:
            formData.jeonsePrice && formData.jeonsePrice !== "-"
              ? parseInt(formData.jeonsePrice.replace(/[^0-9]/g, ""))
              : null,
          deposit:
            formData.deposit && formData.deposit !== "-"
              ? parseInt(formData.deposit.replace(/[^0-9]/g, ""))
              : null,
          monthPrice:
            formData.monthPrice && formData.monthPrice !== "-"
              ? parseInt(formData.monthPrice.replace(/[^0-9]/g, ""))
              : null,
          memo: formData.memo || "",
          favorite: formData.favorite || false,
        };

        console.log("문의 수정 요청 데이터:", apiData);

        await axios.put(
          `${import.meta.env.VITE_API_URL}/api/inquiries/${inquiry.id}`,
          apiData,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "Content-Type": "application/json",
            },
          }
        );

        console.log("문의 수정 성공");
      } else {
        // 추가 모드: POST 요청
        const apiData = {
          name: formData.name || "",
          phone: formData.phone || "",
          apartmentName: formData.apartmentName || "",
          area: formData.area || "", // String 타입 그대로
          inquiryType: (() => {
            // inquiryType 값이 한글이면 영어로 변환
            switch (formData.inquiryType) {
              case "매매":
                return "BUY";
              case "전세":
                return "JEONSE";
              case "월세":
                return "MONTH_RENT";
              default:
                return formData.inquiryType || "BUY";
            }
          })(),
          salePrice:
            formData.salePrice && formData.salePrice !== "-"
              ? parseInt(formData.salePrice.replace(/[^0-9]/g, ""))
              : null,
          jeonsePrice:
            formData.jeonsePrice && formData.jeonsePrice !== "-"
              ? parseInt(formData.jeonsePrice.replace(/[^0-9]/g, ""))
              : null,
          deposit:
            formData.deposit && formData.deposit !== "-"
              ? parseInt(formData.deposit.replace(/[^0-9]/g, ""))
              : null,
          monthPrice:
            formData.monthPrice && formData.monthPrice !== "-"
              ? parseInt(formData.monthPrice.replace(/[^0-9]/g, ""))
              : null,
          memo: formData.memo || "",
          // status, favorite 제외
        };

        console.log("문의 추가 요청 데이터:", apiData);

        await axios.post(
          `${import.meta.env.VITE_API_URL}/api/inquiries`,
          apiData,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "Content-Type": "application/json",
            },
          }
        );

        console.log("문의 추가 성공");
      }

      // 성공 시 콜백 호출
      if (onSave) {
        onSave(true);
      }
    } catch (error) {
      console.error(isEditMode ? "문의 수정 실패:" : "문의 추가 실패:", error);
      console.error("응답 데이터:", error.response?.data);
      console.error("응답 상태:", error.response?.status);
      alert(
        isEditMode ? "문의 수정에 실패했습니다." : "문의 추가에 실패했습니다."
      );

      // 실패 시 콜백 호출
      if (onSave) {
        onSave(false);
      }
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
      case "진행 중":
        apiValue = "IN_PROGRESS";
        break;
      case "완료":
        apiValue = "COMPLETED";
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
