import React, { useState, useRef, useEffect } from "react";
import Modal from "./modal.jsx";
import "./createContractModal.css";
import uploadIcon from "../../assets/icons/upload.svg";
import axios from "axios";
import useAuthStore from "../../store/authStore";

const CreateContractModal = ({
  isOpen,
  onClose,
  onSubmit,
  property = null,
}) => {
  const fileInputRef = useRef(null);
  const accessToken = useAuthStore((state) => state.accessToken);

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
  const [isSubmitting, setIsSubmitting] = useState(false);

  // property 정보가 있으면 폼 데이터 초기화
  useEffect(() => {
    console.log(property);
    if (property) {
      // 거래 유형 결정 (매매, 전세, 월세)
      let transactionType = "";
      if (property.sellPrice && property.sellPrice !== "-") {
        transactionType = "매매";
      } else if (property.rentDeposit && property.rentDeposit !== "-") {
        transactionType = "전세";
      } else if (property.deposit && property.deposit !== "-") {
        transactionType = "월세";
      }

      // 가격 정보 처리
      let price = "";
      if (transactionType === "매매" && property.sellPrice !== "-") {
        price = property.sellPrice;
      } else if (transactionType === "전세" && property.rentDeposit !== "-") {
        price = property.rentDeposit;
      } else if (transactionType === "월세") {
        price = `${property.deposit || "0"}/${property.monthlyRent || "0"}`;
      }

      // 폼 데이터 설정
      setFormData({
        ...initialFormData,
        id: 100,
        owner: property.ownerName || "",
        tenant: property.tenant || "",
        complex: property.apartmentName || "",
        building: property.building || "",
        unit: property.unit || "",
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
    // 숫자와 소수점만 추출
    const numericValue = priceStr.replace(/[^0-9.]/g, "");
    return numericValue ? parseFloat(numericValue) : 0;
  };

  // 가격 변환 (억 단위 처리)
  const convertPrice = (priceStr) => {
    if (!priceStr) return 0;

    // "억" 포함 여부 확인
    if (priceStr.includes("억")) {
      const value = extractPrice(priceStr);
      return value * 100000000; // 1억 = 100,000,000
    }

    return extractPrice(priceStr);
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

  const handleSubmit = async () => {
    // 유효성 검사
    if (!validateFormData()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // API 요청 데이터 구성 (통일된 형식)
      const requestData = {
        apartment: formData.complex,
        dong: formData.building ? formData.building.replace(/동$/, "") : "",
        ho: formData.unit ? formData.unit.replace(/호$/, "") : "",
        area: "55", // 기본값 또는 property에서 가져온 값
        ownerName: formData.owner,
        ownerPhone: "010-1111-1111", // 기본값 또는 실제 입력값
        tenantName: formData.tenant,
        tenantPhone: "010-1234-5678", // 기본값 또는 실제 입력값
        contractType: getContractTypeApiValue(formData.transactionType),
        contractPrice: convertPrice(formData.price).toString(), // String으로 변환
        contractDate: formData.contractDate,
        dueDate: formData.expiryDate,
        contractStatus: "ACTIVE", // 기본값을 ACTIVE로 설정
        favorite: false,
      };

      console.log("계약 요청 데이터:", requestData);

      // 통일된 엔드포인트 사용
      const endpoint = "/api/contract";

      // Axios 인스턴스 생성
      const axiosInstance = axios.create({
        baseURL: import.meta.env.VITE_API_URL,
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });

      console.log(
        "API 요청 URL:",
        `${import.meta.env.VITE_API_URL}${endpoint}`
      );

      // API 호출
      try {
        const response = await axiosInstance.post(endpoint, requestData);
        console.log("계약 등록 성공:", response.data);

        if (onSubmit) {
          onSubmit(response.data);
        }
        onClose();
      } catch (apiError) {
        console.error("API 호출 실패:", apiError);

        // 응답 데이터가 있는 경우 출력
        if (apiError.response) {
          console.error("API 응답 상태:", apiError.response.status);
          console.error("API 응답 데이터:", apiError.response.data);
        }

        // 원본 에러를 다시 throw하여 상위 catch 블록에서 처리
        throw new Error(
          `API 오류: ${apiError.response?.data?.message || apiError.message}`
        );
      }
    } catch (error) {
      console.error("계약 등록 실패:", error);
      alert(`계약 등록에 실패했습니다: ${error.message}`);
    } finally {
      setIsSubmitting(false);
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
              onChange={handleChange}
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
