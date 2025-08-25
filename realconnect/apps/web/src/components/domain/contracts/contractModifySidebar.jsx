import React, { useState, useRef, useEffect } from "react";
import "./contractModifySidebar.css";
import { updateContract } from "@/services/contractService";

import { SortButton } from "@realconnect/shared-ui";
import BaseSidebar from "@/components/common/rightSidebar/BaseSidebar";
import { FormInput } from "@/components/common/form";

import FileIcon from "@/assets/icons/file-text.svg";
import DownloadIcon from "@/assets/icons/download.svg";
import uploadIcon from "@/assets/icons/upload.svg";
import HomeIcon from "@/assets/icons/home.svg";
import XIcon from "@/assets/icons/x.svg";

const ContractModifySidebar = ({ contract, onClose, onSave, isClosing }) => {
  const fileInputRef = useRef(null);

  // 거래 유형 변환 함수들
  const getTransactionTypeText = (contractType) => {
    const typeMap = { BUY: "매매", JEONSE: "전세", MONTH_RENT: "월세" };
    return typeMap[contractType] || contractType;
  };

  const getTransactionTypeValue = (contractTypeKo) => {
    const typeMap = { 매매: "BUY", 전세: "JEONSE", 월세: "MONTH_RENT" };
    return typeMap[contractTypeKo] || contractTypeKo;
  };

  const transactionTypeOptions = ["매매", "전세", "월세"];

  // 계약 상태를 한국어로 변환
  const getContractStatusText = (status) => {
    const statusMap = {
      ACTIVE: "계약 중",
      TERMINATED: "계약 파기",
      EXPIRED: "계약 만료",
    };
    return statusMap[status] || status;
  };

  // 한국어 계약 상태를 영어로 변환 (API 요청용)
  const getContractStatusValue = (statusKo) => {
    const statusMap = {
      "계약 중": "ACTIVE",
      "계약 완료": "ACTIVE", // COMPLETED 대신 ACTIVE로 매핑
      "계약 파기": "TERMINATED",
      "계약 만료": "EXPIRED",
    };
    return statusMap[statusKo] || statusKo;
  };

  const contractStatusOptions = ["계약 중", "계약 파기", "계약 만료"];

  // 날짜 형식 변환 함수들
  const formatDateForInput = (dateString) => {
    if (!dateString) return "";
    // "2025. 3. 2." 형식을 "2025-03-02" 형식으로 변환
    const parts = dateString.replace(/\./g, "").trim().split(" ");
    if (parts.length === 3) {
      const year = parts[0];
      const month = parts[1].padStart(2, "0");
      const day = parts[2].padStart(2, "0");
      return `${year}-${month}-${day}`;
    }
    return dateString;
  };

  const [formData, setFormData] = useState({
    contractDate: "",
    expiryDate: "",
    owner: "",
    ownerContact: "",
    tenant: "",
    tenantContact: "",
    transactionType: "",
    complex: "",
    building: "",
    unit: "",
    area: "",
    price: "",
    contractFile: null,
    fileName: "",
    fileSize: "",
    status: "",
  });

  useEffect(() => {
    if (contract) {
      setFormData({
        contractDate: formatDateForInput(contract.contractDate),
        expiryDate: formatDateForInput(contract.dueDate),
        owner: contract.ownerName || "",
        ownerContact: contract.ownerPhone || "",
        tenant: contract.tenantName || "",
        tenantContact: contract.tenantPhone || "",
        transactionType: getTransactionTypeText(contract.contractType) || "",
        apartment: contract.apartment || "",
        dong: contract.dong || "",
        ho: contract.ho || "",
        area: contract.area || "",
        price: contract.contractPrice || "",
        contractFile: null,
        fileName: contract.contractFile || "",
        fileSize: contract.fileSize || "",
        status: getContractStatusText(contract.contractStatus) || "",
      });
    }
  }, [contract]);

  if (!contract) return null;

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

  const handleStatusSelect = (status) => {
    setFormData((prevData) => ({
      ...prevData,
      status: status,
    }));
  };

  const handleSubmit = async () => {
    try {
      // API 요청용 데이터 구성
      const updateData = {
        apartment: contract.apartment,
        dong: contract.dong,
        ho: contract.ho,
        area: String(formData.area), // String으로 변환
        ownerName: formData.owner,
        ownerPhone: formData.ownerContact,
        tenantName: formData.tenant,
        tenantPhone: formData.tenantContact,
        contractType: getTransactionTypeValue(formData.transactionType),
        contractPrice: String(formData.price), // String으로 변환
        contractDate: formData.contractDate, // 이미 YYYY-MM-DD 형식
        dueDate: formData.expiryDate, // 이미 YYYY-MM-DD 형식
        contractStatus: getContractStatusValue(formData.status),
        favorite: contract.favorite || false,
      };

      const updatedContract = await updateContract(contract.id, updateData);

      // 부모 컴포넌트에 변경사항 전파
      if (onSave) {
        onSave(updatedContract);
      }
    } catch (error) {
      console.error("계약 정보 저장 실패:", error);
      alert("계약 정보 저장에 실패했습니다.");
    }
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

  // 푸터 컨텐츠 준비
  const footerContent = (
    <div className="edit-button-container">
      <button className="edit-cancel-button" onClick={onClose}>
        취소
      </button>
      <button className="edit-submit-button" onClick={handleSubmit}>
        저장하기
      </button>
    </div>
  );

  return (
    <BaseSidebar
      title="계약 정보 수정"
      onClose={onClose}
      isClosing={isClosing}
      footerContent={footerContent}
      className="contract-modify-sidebar"
    >
      {/* 관련 매물 정보 */}
      <div className="edit-property-summary">
        <div className="edit-related-property-info">
          <div className="edit-property-link-container">
            <img src={HomeIcon} alt="매물" />
          </div>
          <p className="edit-property-details">
            {contract.apartment} {contract.dong}동-{contract.ho}호 (
            {contract.area}㎡)
          </p>
        </div>
      </div>

      {/* 편집 섹션 */}
      <div className="edit-section-new">
        <div className="edit-item-container">
          <label className="edit-item-label">거래 가격</label>
          <FormInput
            type="price"
            name="price"
            value={formData.price || ""}
            onChange={handleChange}
            placeholder="거래 가격을 입력하세요"
          />
        </div>

        <div className="edit-item-container">
          <label className="edit-item-label">거래 유형</label>
          <SortButton
            options={transactionTypeOptions.map((opt) => ({
              value: opt,
              label: opt,
            }))}
            value={formData.transactionType}
            onChange={handleTransactionTypeSelect}
            placeholder="선택하세요"
          />
        </div>

        <div className="edit-item-container">
          <label className="edit-item-label">계약 상태</label>
          <SortButton
            options={contractStatusOptions.map((opt) => ({
              value: opt,
              label: opt,
            }))}
            value={formData.status}
            onChange={handleStatusSelect}
            placeholder="선택하세요"
          />
        </div>

        <div className="edit-horizontal-row">
          <div className="edit-item-container">
            <FormInput
              type="text"
              label="소유주"
              name="owner"
              value={formData.owner || ""}
              onChange={handleChange}
              placeholder="소유주 이름"
            />
          </div>

          <div className="edit-item-container">
            <FormInput
              type="phone"
              label="소유주 연락처"
              name="ownerContact"
              value={formData.ownerContact || ""}
              onChange={handleChange}
              placeholder="010-0000-0000"
            />
          </div>
        </div>

        <div className="edit-horizontal-row">
          <div className="edit-item-container">
            <FormInput
              type="text"
              label="임차인"
              name="tenant"
              value={formData.tenant || ""}
              onChange={handleChange}
              placeholder="임차인 이름"
            />
          </div>

          <div className="edit-item-container">
            <FormInput
              type="phone"
              label="임차인 연락처"
              name="tenantContact"
              value={formData.tenantContact || ""}
              onChange={handleChange}
              placeholder="010-0000-0000"
            />
          </div>
        </div>

        <div className="edit-horizontal-row">
          <div className="edit-item-container">
            <FormInput
              type="date"
              label="계약일"
              name="contractDate"
              value={formData.contractDate || ""}
              onChange={handleChange}
            />
          </div>

          <div className="edit-item-container">
            <FormInput
              type="date"
              label="만료일"
              name="expiryDate"
              value={formData.expiryDate || ""}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* 파일 업로드 섹션 */}
        <div
          className="edit-item-container"
          style={{ flexDirection: "column" }}
        >
          <label className="edit-item-label">계약서</label>
          <div
            className="edit-file-upload-area"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              style={{ display: "none" }}
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
            />

            {formData.fileName ? (
              <div className="edit-file-selected">
                <div className="edit-file-info">
                  <img src={FileIcon} alt="파일" className="edit-file-icon" />
                  <div className="edit-file-details">
                    <span className="edit-file-name">{formData.fileName}</span>
                    <span className="edit-file-size">{formData.fileSize}</span>
                  </div>
                </div>
                <div className="edit-file-actions">
                  <button className="edit-download-button">
                    <img src={DownloadIcon} alt="다운로드" />
                  </button>
                  <button
                    className="edit-remove-button"
                    onClick={handleRemoveFile}
                  >
                    <img src={XIcon} alt="삭제" />
                  </button>
                </div>
              </div>
            ) : (
              <div
                className="edit-file-upload-prompt"
                onClick={() => fileInputRef.current?.click()}
              >
                <img
                  src={uploadIcon}
                  alt="업로드"
                  className="edit-upload-icon"
                />
                <p>파일을 드래그하거나 클릭하여 업로드</p>
                <span>PDF, DOC, 이미지 파일 지원</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </BaseSidebar>
  );
};

export default ContractModifySidebar;
