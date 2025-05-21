import React, { useState, useRef } from "react";
import Modal from "./modal.jsx";
import "./createContractModal.css";
import uploadIcon from "../../assets/icons/upload.svg";

const CreateContractModal = ({ isOpen, onClose, onSubmit }) => {
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
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
  });

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

  const handleSubmit = () => {
    onSubmit(formData);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}
      title="계약 작성하기"
      submitText="저장하기"
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
              type="text"
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
              type="text"
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
              <input
                type="text"
                className="form-input"
                placeholder="등록된 파일이 없습니다"
                readOnly
              />
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
