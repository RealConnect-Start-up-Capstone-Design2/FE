import React, { useState } from "react";
import "./inquiryDetailSidebar.css";
import ShareInquiryModal from "@/pages/modal/shareInquiryModal";
import CreateContractModal from "@/pages/modal/createContractModal";
import axios from "axios";
import useAuthStore from "@/store/authStore";

const InquiryDetailSidebar = ({ inquiry, onClose, isClosing, onModify }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isContractModalOpen, setIsContractModalOpen] = useState(false);
  const accessToken = useAuthStore((state) => state.accessToken);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const openContractModal = () => {
    setIsContractModalOpen(true);
  };

  const closeContractModal = () => {
    setIsContractModalOpen(false);
  };

  const handleSubmit = async (data) => {
    console.log("문의 공유하기 제출:", data);
    // 여기서 API 호출 등의 로직 구현
    const response = await axios.post(
      `${import.meta.env.VITE_API_URL}/api/shares`,
      data,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    console.log(response);
    closeModal();
  };

  const handleContractSubmit = (contractData) => {
    console.log("계약 작성 완료:", contractData);
    // 계약 작성 성공 후 처리 로직
    closeContractModal();
  };

  // 문의 정보를 계약 모달용 데이터로 변환
  const convertInquiryToContractData = () => {
    // 한국어 통화 형식을 쉼표 포함 숫자로 변환하는 함수
    const convertCurrencyToNumber = (currencyStr) => {
      if (!currencyStr || currencyStr === "-") return "";

      if (currencyStr.includes("억")) {
        const number = parseFloat(currencyStr.replace("억", ""));
        const result = number * 100000000;
        return result.toLocaleString(); // 쉼표 포함 형태로 변환
      }

      if (currencyStr.includes("천만")) {
        const number = parseFloat(currencyStr.replace("천만", ""));
        const result = number * 10000000;
        return result.toLocaleString();
      }

      // 이미 숫자 형태인 경우
      const numericValue = currencyStr.replace(/[^0-9]/g, "");
      if (numericValue) {
        return parseInt(numericValue).toLocaleString();
      }

      return currencyStr;
    };

    return {
      apartmentName: inquiry.apartmentName,
      inquiryType: inquiry.inquiryType,
      salePrice: convertCurrencyToNumber(inquiry.salePrice),
      jeonsePrice: convertCurrencyToNumber(inquiry.jeonsePrice),
      deposit: convertCurrencyToNumber(inquiry.deposit),
      monthPrice: inquiry.monthPrice, // 월세는 보통 만원 단위라서 그대로
      area: inquiry.area,
      tenant: inquiry.name, // 문의자가 임차인(매수인)이 됨
      tenantPhone: inquiry.phone,
    };
  };

  return (
    <div className={`inquiry-detail-sidebar ${isClosing ? "closing" : ""}`}>
      <div className="sidebar-header">
        <div className="sidebar-header-title">{inquiry.apartmentName}</div>
        <button className="close-button" onClick={onClose}>
          ×
        </button>
      </div>

      {/* 스크롤 가능한 콘텐츠 영역 */}
      <div className="sidebar-content">
        <div className="property-addresses">
          <div className="property-address">
            <div className="address-icon">🏠</div>
            <div className="address-text">
              <div>관련 매물 1</div>
              <div>파크리오 101-3301 34 C</div>
            </div>
          </div>
          <div className="property-address">
            <div className="address-icon">🏠</div>
            <div className="address-text">
              <div>관련 매물 1</div>
              <div>파크리오 101-3301 34 C</div>
            </div>
          </div>
          <div className="more-button">더보기</div>
        </div>

        <div className="price-info">
          <div className="price-label">매매 {inquiry.salePrice}</div>
          <div className="price-label">전세 {inquiry.jeonsePrice}</div>
          <div className="price-label">
            보증금/월세 {inquiry.deposit}/{inquiry.monthPrice}
          </div>
        </div>

        <div className="contact-info">
          <div className="info-row">
            <div className="info-box">
              <h4>문의자</h4>
              <p>{inquiry?.name || "김규식"}</p>
            </div>
            <div className="info-box">
              <h4>연락처</h4>
              <p>{inquiry?.phone || "010-1234-2334"}</p>
            </div>
          </div>
        </div>

        <div className="inquiry-info">
          <div className="info-row">
            <div className="info-box">
              <h4>문의 유형</h4>
              <p>{inquiry.inquiryType}</p>
            </div>
            <div className="info-box">
              <h4>진행 상태</h4>
              <p className={inquiry.status.replace(/\s+/g, "")}>
                {inquiry.status}
              </p>
            </div>
          </div>
        </div>

        <div className="property-details">
          <div className="info-row">
            <div className="info-box">
              <h4>면적</h4>
              <p>{inquiry.area} m²</p>
            </div>
            <div className="info-box">
              <h4>등록일</h4>
              <p>{inquiry.createdAt}</p>
            </div>
          </div>
        </div>

        <div className="inquiry-content">
          <h3>문의 내용</h3>
          <p>{inquiry.memo}</p>
        </div>
      </div>

      {/* 하단 버튼 영역 */}
      <div className="sidebar-footer">
        <div className="action-buttons">
          <button className="inquiry-primary-button" onClick={onModify}>
            수정하기
          </button>
          <div className="button-group">
            <button className="secondary-button" onClick={openContractModal}>
              계약 작성
            </button>
            <button className="secondary-button" onClick={openModal}>
              공유하기
            </button>
          </div>
        </div>
      </div>

      <ShareInquiryModal
        isOpen={isModalOpen}
        inquiry={inquiry}
        onClose={closeModal}
        onSubmit={handleSubmit}
      />

      <CreateContractModal
        isOpen={isContractModalOpen}
        onClose={closeContractModal}
        onSubmit={handleContractSubmit}
        property={convertInquiryToContractData()}
      />
    </div>
  );
};

export default InquiryDetailSidebar;
