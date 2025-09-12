import React, { useState, useRef, useEffect } from "react";
import Modal from "./modal.jsx";
import "./createContractModal.css";
import uploadIcon from "../../assets/icons/upload.svg";

const CreateContractModal = ({
  isOpen,
  onClose,
  onSubmit,
  property = null,
  isSubmitting = false,
}) => {
  const fileInputRef = useRef(null);

  // 초기 폼 데이터 상태 (원래 있던 필드들만 유지)
  const initialFormData = {
    id: "",
    contractDate: "",
    expiryDate: "",
    owner: "",
    tenant: "",
    transactionType: "",
    complex: "",
    building: "",
    unit: "",
    price: "",
    contractFile: null,
    fileName: "",
    fileSize: "",
  };

  const [formData, setFormData] = useState(initialFormData);

  // property 정보가 있으면 폼 데이터 초기화
  useEffect(() => {
    console.log(property);
    if (property) {
      // 거래 유형 결정 (매매, 전세, 월세)
      let transactionType = "";
      if (property.inquiryType) {
        // 문의에서 온 경우
        switch (property.inquiryType) {
          case "매매":
            transactionType = "매매";
            break;
          case "전세":
            transactionType = "전세";
            break;
          case "월세":
            transactionType = "월세";
            break;
          default:
            transactionType = "매매";
        }
      } else {
        // 기존 매물에서 온 경우
        if (property.sellPrice && property.sellPrice !== "-") {
          transactionType = "매매";
        } else if (property.rentDeposit && property.rentDeposit !== "-") {
          transactionType = "전세";
        } else if (property.deposit && property.deposit !== "-") {
          transactionType = "월세";
        }
      }

      // 가격 정보 처리
      let price = "";
      if (property.inquiryType) {
        // 문의에서 온 경우 - 이미 변환된 쉼표 포함 숫자
        if (
          transactionType === "매매" &&
          property.salePrice &&
          property.salePrice !== "-"
        ) {
          price = property.salePrice;
        } else if (
          transactionType === "전세" &&
          property.jeonsePrice &&
          property.jeonsePrice !== "-"
        ) {
          price = property.jeonsePrice;
        } else if (transactionType === "월세") {
          const deposit =
            property.deposit && property.deposit !== "-"
              ? property.deposit
              : "0";
          const monthPrice =
            property.monthPrice && property.monthPrice !== "-"
              ? property.monthPrice
              : "0";
          price = `${deposit}/${monthPrice}`;
        }
      } else {
        // 기존 매물에서 온 경우
        if (transactionType === "매매" && property.sellPrice !== "-") {
          price = property.sellPrice;
        } else if (transactionType === "전세" && property.rentDeposit !== "-") {
          price = property.rentDeposit;
        } else if (transactionType === "월세") {
          price = `${property.deposit || "0"}/${property.monthlyRent || "0"}`;
        }
      }

      // 폼 데이터 설정
      setFormData({
        ...initialFormData,
        id: 100,
        owner: property.ownerName || "",
        tenant: property.tenantName || "",
        complex: property.apartmentName || "",
        building: property.dong || "",
        unit: property.ho || "",
        transactionType: transactionType,
        price: price,
        contractDate: new Date().toISOString().split("T")[0], // 오늘 날짜
        expiryDate: property.endDate || "", // 만기일이 있으면 사용
      });
    } else {
      // property가 없으면 초기 상태로 리셋
      setFormData(initialFormData);
    }
  }, [property, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleTransactionTypeSelect = (type) => {
    setFormData((prevData) => ({
      ...prevData,
      transactionType: type,
    }));
  };

  // 숫자에 쉼표 추가하는 함수
  const formatNumberWithCommas = (value) => {
    // 숫자가 아닌 문자 제거
    const numericValue = value.replace(/[^0-9]/g, "");

    // 빈 문자열이면 그대로 반환
    if (!numericValue) return "";

    // 숫자에 쉼표 추가
    return parseInt(numericValue).toLocaleString();
  };

  // 거래 금액 입력 핸들러
  const handlePriceChange = (e) => {
    const { value } = e.target;
    const formattedValue = formatNumberWithCommas(value);

    setFormData((prevData) => ({
      ...prevData,
      price: formattedValue,
    }));
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";

    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const fileSize = formatFileSize(file.size);
      setFormData((prevData) => ({
        ...prevData,
        contractFile: file,
        fileName: file.name,
        fileSize: fileSize,
      }));
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      const fileSize = formatFileSize(file.size);
      setFormData((prevData) => ({
        ...prevData,
        contractFile: file,
        fileName: file.name,
        fileSize: fileSize,
      }));
    }
  };

  const handleRemoveFile = () => {
    setFormData((prevData) => ({
      ...prevData,
      contractFile: null,
      fileName: "",
      fileSize: "",
    }));

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  // 거래 유형 API 형식으로 변환
  const getContractTypeApiValue = (uiType) => {
    switch (uiType) {
      case "매매":
        return "BUY";
      case "전세":
        return "JEONSE";
      case "월세":
        return "MONTH_RENT";
      default:
        return "BUY";
    }
  };

  // 가격 문자열에서 숫자만 추출
  const extractPrice = (priceStr) => {
    if (!priceStr) return 0;
    // 쉼표와 기타 숫자가 아닌 문자 제거 (소수점은 유지)
    const numericValue = priceStr.replace(/[^0-9.]/g, "");
    return numericValue ? parseFloat(numericValue) : 0;
  };

  // 가격 변환 (억 단위 처리)
  const convertPrice = (priceStr) => {
    if (!priceStr) return 0;

    // 쉼표 제거 후 처리
    const cleanPriceStr = priceStr.replace(/,/g, "");

    // "억" 포함 여부 확인
    if (cleanPriceStr.includes("억")) {
      const value = extractPrice(cleanPriceStr);
      return value * 100000000; // 1억 = 100,000,000
    }

    // 월세의 경우 (보증금/월세) 형태 처리
    if (cleanPriceStr.includes("/")) {
      const [deposit] = cleanPriceStr.split("/");
      const depositValue = extractPrice(deposit);
      return depositValue; // 보증금만 반환
    }

    return extractPrice(cleanPriceStr);
  };

  // 필수 입력값 검증 함수
  const validateFormData = () => {
    // 필수 입력값 확인
    const requiredFields = {
      owner: "소유주(매도인)",
      tenant: "임차인(매수인)",
      transactionType: "거래 유형",
      complex: "단지명",
      contractDate: "계약 일시",
      expiryDate: "계약 만기일",
    };

    const missingFields = [];
    Object.entries(requiredFields).forEach(([field, label]) => {
      if (!formData[field]) {
        missingFields.push(label);
      }
    });

    if (missingFields.length > 0) {
      alert(`다음 필수 항목을 입력해주세요: ${missingFields.join(", ")}`);
      return false;
    }
    return true;
  };

  const handleSubmit = () => {
    // 유효성 검사
    if (!validateFormData()) {
      return;
    }

    // API 요청 데이터 구성 (통일된 형식)
    const requestData = {
      apartment: formData.complex,
      dong: formData.building ? formData.building.replace(/동$/, "") : "",
      ho: formData.unit ? formData.unit.replace(/호$/, "") : "",
      area: property?.area ? property.area.replace(/[^0-9.]/g, "") : "55", // 문의에서 면적 정보 가져오기
      ownerName: formData.owner,
      ownerPhone: property?.ownerPhone || "010-1111-1111", // 소유주 연락처
      tenantName: formData.tenant,
      tenantPhone: property?.tenantPhone || "010-1234-5678", // 임차인 연락처
      contractType: getContractTypeApiValue(formData.transactionType),
      contractPrice: convertPrice(formData.price).toString(), // String으로 변환
      contractDate: formData.contractDate,
      dueDate: formData.expiryDate,
      contractStatus: "ACTIVE", // 기본값을 ACTIVE로 설정
      favorite: false,
    };

    console.log("계약 요청 데이터:", requestData);

    // 부모 컴포넌트에 데이터 전달
    if (onSubmit) {
      onSubmit(requestData);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}
      title="계약 작성하기"
      submitText={isSubmitting ? "저장 중..." : "저장하기"}
      cancelText="취소"
      modalSize="large"
    >
      <div className="contract-form-container">
        <div className="contract-form">
          <div className="form-group">
            <label className="form-label" htmlFor="contractDate">
              계약 일시
            </label>
            <input
              type="date"
              id="contractDate"
              name="contractDate"
              className="form-input"
              placeholder="계약이 이루어진 일시를 입력하세요"
              value={formData.contractDate}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="expiryDate">
              계약 만기일
            </label>
            <input
              type="date"
              id="expiryDate"
              name="expiryDate"
              className="form-input"
              placeholder="해당 계약의 만기일을 입력하세요"
              value={formData.expiryDate}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="owner">
              소유주(매도인)
            </label>
            <input
              type="text"
              id="owner"
              name="owner"
              className="form-input"
              placeholder="소유주의 이름을 입력하세요"
              value={formData.owner}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="tenant">
              임차인(매수인)
            </label>
            <input
              type="text"
              id="tenant"
              name="tenant"
              className="form-input"
              placeholder="임차인의 이름을 입력하세요"
              value={formData.tenant}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label className="form-label">거래유형</label>
            <div className="transaction-type-buttons">
              <button
                className={`transaction-type-button ${formData.transactionType === "매매" ? "selected" : ""}`}
                onClick={() => handleTransactionTypeSelect("매매")}
                type="button"
              >
                매매
              </button>
              <button
                className={`transaction-type-button ${formData.transactionType === "전세" ? "selected" : ""}`}
                onClick={() => handleTransactionTypeSelect("전세")}
                type="button"
              >
                전세
              </button>
              <button
                className={`transaction-type-button ${formData.transactionType === "월세" ? "selected" : ""}`}
                onClick={() => handleTransactionTypeSelect("월세")}
                type="button"
              >
                월세
              </button>
            </div>
          </div>
        </div>

        <div className="contract-details">
          <div className="form-group">
            <label className="form-label" htmlFor="complex">
              단지
            </label>
            <input
              type="text"
              id="complex"
              name="complex"
              className="form-input"
              placeholder="단지명을 입력하세요"
              value={formData.complex}
              onChange={handleChange}
            />
          </div>

          <div className="address-section">
            <div className="address-group">
              <label className="form-label" htmlFor="building">
                동
              </label>
              <input
                type="text"
                id="building"
                name="building"
                className="form-input"
                placeholder="동을 입력하세요"
                value={formData.building}
                onChange={handleChange}
              />
            </div>
            <div className="address-group">
              <label className="form-label" htmlFor="unit">
                호수
              </label>
              <input
                type="text"
                id="unit"
                name="unit"
                className="form-input"
                placeholder="호수를 입력하세요"
                value={formData.unit}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="price">
              거래 금액
            </label>
            <input
              type="text"
              id="price"
              name="price"
              className="form-input"
              placeholder="해당 계약의 거래 금액을 입력하세요"
              value={formData.price}
              onChange={handlePriceChange}
            />
          </div>

          <div className="contract-file-container">
            <label className="form-label">계약서 파일</label>
            {formData.contractFile ? (
              <div className="file-display">
                <span className="file-name">{formData.fileName}</span>
                <span className="file-size">({formData.fileSize})</span>
                <button className="remove-button" onClick={handleRemoveFile}>
                  ×
                </button>
              </div>
            ) : (
              <div className="form-input file-placeholder">
                등록된 파일이 없습니다
              </div>
            )}
            <div
              className="file-upload-area"
              onDrop={handleDrop}
              onDragOver={handleDragOver}
            >
              <input
                type="file"
                id="contractFile"
                name="contractFile"
                onChange={handleFileChange}
                className="file-input"
                accept=".jpg,.jpeg,.png,.pdf,.docx"
                ref={fileInputRef}
              />
              <div className="upload-content">
                <img src={uploadIcon} alt="Upload" className="upload-icon" />
                <p className="upload-text">
                  클릭하여 파일 업로드 또는 드래그 앤 드롭
                </p>
                <p className="upload-format">
                  JPG, PNG, PDF, DOCX 등 (최대 50MB)
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default CreateContractModal;
