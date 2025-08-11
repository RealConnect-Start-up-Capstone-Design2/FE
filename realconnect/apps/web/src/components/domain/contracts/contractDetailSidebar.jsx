import React, { useState, useRef, useEffect } from "react";
import "./contractDetailSidebar.css";
import { updateContract } from "@/services/contractService"; // 서비스 import
import { formatPrice } from "../../../../../../packages/shared-utils/src/formatters.js";
import { SortButton } from "@realconnect/shared-ui";

import FileIcon from "@/assets/icons/file-text.svg";
import DownloadIcon from "@/assets/icons/download.svg";
import uploadIcon from "@/assets/icons/upload.svg";
import HomeIcon from "@/assets/icons/home.svg";
import XIcon from "@/assets/icons/x.svg";
import InfoRow from "@/components/common/info/InfoRow";
import InfoBox from "@/components/common/info/InfoBox";

const ContractDetailSidebar = ({ contract, onClose, isClosing, onUpdate }) => {
  const [isEditMode, setIsEditMode] = useState(false);
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

  const handleEditMode = () => {
    setIsEditMode(true);
  };

  const handleCancel = () => {
    setIsEditMode(false);
    // 초기 데이터로 다시 설정
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
      onUpdate(updatedContract);
      setIsEditMode(false);
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

  return (
    <div className={`contract-detail-sidebar ${isClosing ? "closing" : ""}`}>
      <div className="sidebar-header">
        <div className="sidebar-header-title">계약 상세 정보</div>
        <button className="close-button" onClick={onClose}>
          ×
        </button>
      </div>

      {isEditMode ? (
        <>
          {/* 편집 모드 - 스크롤 가능한 콘텐츠 영역 */}
          <div className="sidebar-content">
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
              <button className="edit-change-property-button">변경하기</button>
            </div>

            {/* 편집 섹션 */}
            <div className="edit-section-new">
              <div className="edit-item-container">
                <label className="edit-item-label">거래 가격</label>
                <input
                  type="text"
                  name="price"
                  className="edit-item-input"
                  value={formData.price || ""}
                  onChange={handleChange}
                  placeholder="거래 가격을 입력하세요"
                  autoComplete="off"
                  readOnly={false}
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
                <label className="edit-item-label">거래 상태</label>
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
            </div>

            {/* 계약 정보 */}
            <div className="edit-contract-info">
              <div className="edit-info-row">
                <div className="edit-info-box">
                  <h4 className="edit-info-title"> 소유주(매도인)</h4>
                  <input
                    type="text"
                    name="owner"
                    className="edit-info-input"
                    value={formData.owner}
                    onChange={handleChange}
                  />
                </div>
                <div className="edit-info-box">
                  <h4 className="edit-info-title"> 소유주 연락처</h4>
                  <input
                    type="text"
                    name="ownerContact"
                    className="edit-info-input"
                    value={formData.ownerContact}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="edit-info-row">
                <div className="edit-info-box">
                  <h4 className="edit-info-title"> 임차인(매수인)</h4>
                  <input
                    type="text"
                    name="tenant"
                    className="edit-info-input"
                    value={formData.tenant}
                    onChange={handleChange}
                  />
                </div>
                <div className="edit-info-box">
                  <h4 className="edit-info-title"> 임차인 연락처</h4>
                  <input
                    type="text"
                    name="tenantContact"
                    className="edit-info-input"
                    value={formData.tenantContact}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="edit-info-row">
                <div className="edit-info-box">
                  <h4 className="edit-info-title"> 계약 일시</h4>
                  <input
                    type="date"
                    name="contractDate"
                    className="edit-info-input"
                    value={formData.contractDate}
                    onChange={handleChange}
                  />
                </div>
                <div className="edit-info-box">
                  <h4 className="edit-info-title"> 만기일</h4>
                  <input
                    type="date"
                    name="expiryDate"
                    className="edit-info-input"
                    value={formData.expiryDate}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            {/* 계약서 파일 섹션 */}
            <div className="edit-contract-file-section">
              <div className="edit-contract-file-info">
                {formData.fileName ? (
                  <>
                    <div className="file-icon">
                      <img src={FileIcon} alt="계약서" />
                    </div>
                    <div className="file-details">
                      <p className="file-name">{formData.fileName}</p>
                      <p className="file-meta">
                        {formData.fileSize} ·{" "}
                        {new Date().toLocaleDateString("ko-KR")}
                      </p>
                    </div>
                    <button className="edit-download-button">
                      <img src={DownloadIcon} alt="다운로드" />
                    </button>
                    <button
                      className="edit-delete-file-button"
                      onClick={handleRemoveFile}
                    >
                      <img src={XIcon} alt="삭제" />
                    </button>
                  </>
                ) : (
                  <div className="edit-no-file-message">
                    등록된 계약서가 없습니다.
                  </div>
                )}
              </div>

              <div className="edit-file-upload-container">
                <input
                  type="file"
                  id="edit-file-upload"
                  className="edit-file-input"
                  onChange={handleFileChange}
                  accept=".jpg,.jpeg,.png,.pdf,.docx"
                  ref={fileInputRef}
                />
                <label
                  htmlFor="edit-file-upload"
                  className="edit-file-upload-area"
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                >
                  <img
                    src={uploadIcon}
                    alt="업로드"
                    className="edit-upload-icon"
                  />
                  <p className="edit-upload-text">
                    클릭하여 파일 업로드 또는 드래그 앤 드롭
                  </p>
                  <p className="edit-upload-description">
                    JPG, PNG, PDF, DOCX 등 (최대 50MB)
                  </p>
                </label>
              </div>
            </div>
          </div>

          {/* 편집 모드 - 하단 버튼 영역 */}
          <div className="sidebar-footer">
            <div className="edit-action-buttons">
              <button className="edit-submit-button" onClick={handleSubmit}>
                저장하기
              </button>
              <button className="edit-cancel-button" onClick={handleCancel}>
                취소
              </button>
            </div>
          </div>
        </>
      ) : (
        <>
          {/* 읽기 모드 - 스크롤 가능한 콘텐츠 영역 */}
          <div className="sidebar-content">
            {/* 속성 요약 영역 */}
            <div className="property-summary">
              <div className="property-summary-item">
                <div
                  style={{
                    display: "flex",
                    backgroundColor: "#DDE2F2",
                    width: "5rem",
                    height: "5rem",
                    marginRight: "0.8rem",
                    borderRadius: "0.5rem",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                ></div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                  }}
                >
                  <div className="property-summary-item-icon">
                    <img src={HomeIcon} alt="매물" />
                    <p>{contract.apartment}</p>
                  </div>
                  <div className="property-summary-item-text">
                    <p>
                      {contract.apartment} {contract.dong}동 {contract.ho}호 (
                      {contract.area}m²)
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* 계약 정보 영역 */}
            <div className="contract-info">
              {/* 가격 및 유형 정보 */}
              <div className="pricing-info">
                <div className="price-item">
                  <p>거래 가격 {formatPrice(contract.contractPrice)}</p>
                  <p>
                    거래 유형 {getTransactionTypeText(contract.contractType)}
                  </p>
                  <p>
                    계약 상태 {getContractStatusText(contract.contractStatus)}
                  </p>
                </div>
              </div>

              {/* 연락처 정보 */}
              <div className="contact-info">
                <InfoRow>
                  <InfoBox title="소유주(매도인)" value={contract.ownerName} />
                  <InfoBox title="소유주 연락처" value={contract.ownerPhone} />
                </InfoRow>
                <InfoRow>
                  <InfoBox title="입주인(매수인)" value={contract.tenantName} />
                  <InfoBox title="입주인 연락처" value={contract.tenantPhone} />
                </InfoRow>
                <InfoRow>
                  <InfoBox title="계약 일시" value={contract.contractDate} />
                  <InfoBox title="만기일" value={contract.dueDate} />
                </InfoRow>
              </div>

              {/* 계약서 파일 정보 */}
              <div className="contract-file-section">
                <h3>계약서</h3>
                {contract.contractFile ? (
                  <div className="contract-file-info">
                    <div className="file-icon">
                      <img
                        style={{ width: "2.1rem", height: "2.1rem" }}
                        src={FileIcon}
                        alt="계약서"
                      />
                    </div>
                    <div className="file-details">
                      <p className="file-name">{contract.contractFile}</p>
                      <p className="file-meta">
                        {contract.fileSize} · {contract.fileDate}
                      </p>
                    </div>
                    <button className="download-button">
                      <img
                        style={{ width: "1.6rem", height: "1.6rem" }}
                        src={DownloadIcon}
                        alt="다운로드"
                      />
                    </button>
                  </div>
                ) : (
                  <div className="no-file-message">
                    등록된 계약서가 없습니다.
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* 읽기 모드 - 하단 버튼 영역 */}
          <div className="sidebar-footer">
            <div className="action-buttons">
              <button
                className="contract-primary-button"
                onClick={handleEditMode}
              >
                수정하기
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ContractDetailSidebar;
