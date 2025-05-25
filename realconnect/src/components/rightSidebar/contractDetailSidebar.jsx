import React, { useState, useRef, useEffect } from "react";
import "./contractDetailSidebar.css";

import FileIcon from "../../assets/icons/file-text.svg";
import DownloadIcon from "../../assets/icons/download.svg";
import uploadIcon from "../../assets/icons/upload.svg";
import HomeIcon from "../../assets/icons/home.svg";
import XIcon from "../../assets/icons/x.svg";
import transactionTypeArrowUp from "../../assets/icons/transactionTypeArrow^.svg";
import transactionTypeArrowDown from "../../assets/icons/transactionTypeArrowV.svg";
import dropboxCheck from "../../assets/icons/dropboxCheck.svg";

const ContractDetailSidebar = ({ contract, onClose, isClosing, onUpdate }) => {
  const [isEditMode, setIsEditMode] = useState(false);
  const fileInputRef = useRef(null);

  // 드롭박스 상태
  const [isTransactionTypeOpen, setIsTransactionTypeOpen] = useState(false);
  const [isStatusOpen, setIsStatusOpen] = useState(false);

  // 드롭박스 외부 클릭 감지를 위한 ref
  const transactionTypeRef = useRef(null);
  const statusRef = useRef(null);

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

  const formatDateForDisplay = (dateString) => {
    if (!dateString) return "";
    // "2025-03-02" 형식을 "2025. 3. 2." 형식으로 변환
    if (dateString.includes("-")) {
      const parts = dateString.split("-");
      if (parts.length === 3) {
        const year = parts[0];
        const month = parseInt(parts[1], 10);
        const day = parseInt(parts[2], 10);
        return `${year}. ${month}. ${day}.`;
      }
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
        contractDate: formatDateForInput(contract.startDate),
        expiryDate: formatDateForInput(contract.endDate),
        owner: contract.owner || "",
        ownerContact: contract.ownerContact || "",
        tenant: contract.tenant || "",
        tenantContact: contract.tenantContact || "",
        transactionType: contract.transactionType || "",
        complex: contract.complex || "",
        building: contract.building || "",
        unit: contract.unit || "",
        area: contract.area || "",
        price: contract.sellPrice || contract.price || "", // sellPrice를 우선 사용
        contractFile: null,
        fileName: contract.contractFile || "",
        fileSize: contract.fileSize || "",
        status: contract.status || "",
      });
    }
  }, [contract]);

  // 외부 클릭 시 드롭박스 닫기
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        transactionTypeRef.current &&
        !transactionTypeRef.current.contains(event.target)
      ) {
        setIsTransactionTypeOpen(false);
      }
      if (statusRef.current && !statusRef.current.contains(event.target)) {
        setIsStatusOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // 계약 상태 클래스명 매핑
  const getStatusClass = (status) => {
    const statusMap = {
      "계약 완료": "contract-status-completed",
      "계약 중": "contract-status-ongoing",
      "계약 전": "contract-status-before",
      "계약 파기": "contract-status-terminated",
      "계약 만료": "contract-status-expired",
    };
    return statusMap[status] || "";
  };

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
    setIsTransactionTypeOpen(false);
  };

  const handleStatusSelect = (status) => {
    setFormData((prevData) => ({
      ...prevData,
      status: status,
    }));
    setIsStatusOpen(false);
  };

  const handleEditMode = () => {
    setIsEditMode(true);
  };

  const handleCancel = () => {
    setIsEditMode(false);
    // 드롭박스도 닫기
    setIsTransactionTypeOpen(false);
    setIsStatusOpen(false);
    // 초기 데이터로 다시 설정
    setFormData({
      contractDate: formatDateForInput(contract.startDate),
      expiryDate: formatDateForInput(contract.endDate),
      owner: contract.owner || "",
      ownerContact: contract.ownerContact || "",
      tenant: contract.tenant || "",
      tenantContact: contract.tenantContact || "",
      transactionType: contract.transactionType || "",
      complex: contract.complex || "",
      building: contract.building || "",
      unit: contract.unit || "",
      area: contract.area || "",
      price: contract.sellPrice || contract.price || "",
      contractFile: null,
      fileName: contract.contractFile || "",
      fileSize: contract.fileSize || "",
      status: contract.status || "",
    });
  };

  const handleSubmit = () => {
    // API를 통해 계약 정보를 업데이트하는 로직 구현

    // 부모 컴포넌트에 업데이트된 데이터 전달
    if (onUpdate) {
      const updatedContract = {
        // 기존 contract에서 변경되지 않는 필드들만 유지
        id: contract.id,
        complex: contract.complex,
        building: contract.building,
        unit: contract.unit,
        isFavorite: contract.isFavorite,
        // formData에서 수정된 필드들
        owner: formData.owner,
        ownerContact: formData.ownerContact,
        tenant: formData.tenant,
        tenantContact: formData.tenantContact,
        transactionType: formData.transactionType,
        status: formData.status,
        area: formData.area,
        fileSize: formData.fileSize,
        // 변환이 필요한 필드들 (중복 제거)
        sellPrice: formData.price,
        startDate: formatDateForDisplay(formData.contractDate),
        endDate: formatDateForDisplay(formData.expiryDate),
        contractFile: formData.fileName,
        // 기존 파일 날짜 유지 (변경되지 않은 경우)
        fileDate: contract.fileDate,
      };

      onUpdate(updatedContract);
    }

    setIsEditMode(false);
    // 드롭박스도 닫기
    setIsTransactionTypeOpen(false);
    setIsStatusOpen(false);
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
          {/* 새로운 수정 모드 디자인 */}

          {/* 관련 매물 정보 */}
          <div className="edit-property-summary">
            <div className="edit-related-property-info">
              <div className="edit-property-link-container">
                <img src={HomeIcon} alt="매물" />
                <span className="edit-property-link">관련매물로 이동</span>
              </div>
              <p className="edit-property-details">
                {contract.complex} {contract.building}동-{contract.unit}호 (
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
              <div className="edit-dropdown-container" ref={transactionTypeRef}>
                <div
                  className="edit-dropdown"
                  onClick={() =>
                    setIsTransactionTypeOpen(!isTransactionTypeOpen)
                  }
                >
                  <span className="edit-dropdown-selected">
                    {formData.transactionType || "선택하세요"}
                  </span>
                  <img
                    src={
                      isTransactionTypeOpen
                        ? transactionTypeArrowUp
                        : transactionTypeArrowDown
                    }
                    alt="dropdown arrow"
                    className="edit-dropdown-arrow"
                  />
                </div>

                {isTransactionTypeOpen && (
                  <div className="edit-dropdown-menu transaction-type-menu">
                    {["매매", "전세", "월세"].map((option) => (
                      <div
                        key={option}
                        className="edit-dropdown-option"
                        onClick={() => handleTransactionTypeSelect(option)}
                      >
                        <span>{option}</span>
                        {formData.transactionType === option && (
                          <img
                            src={dropboxCheck}
                            alt="selected"
                            className="edit-dropdown-check"
                          />
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="edit-item-container">
              <label className="edit-item-label">거래 상태</label>
              <div className="edit-dropdown-container" ref={statusRef}>
                <div
                  className="edit-dropdown"
                  onClick={() => setIsStatusOpen(!isStatusOpen)}
                >
                  <span className="edit-dropdown-selected">
                    {formData.status || "선택하세요"}
                  </span>
                  <img
                    src={
                      isStatusOpen
                        ? transactionTypeArrowUp
                        : transactionTypeArrowDown
                    }
                    alt="dropdown arrow"
                    className="edit-dropdown-arrow"
                  />
                </div>

                {isStatusOpen && (
                  <div className="edit-dropdown-menu status-menu">
                    {["계약 만료", "계약 중", "계약 완료", "계약 파기"].map(
                      (option) => (
                        <div
                          key={option}
                          className="edit-dropdown-option"
                          data-status={option}
                          onClick={() => handleStatusSelect(option)}
                        >
                          <span>{option}</span>
                          {formData.status === option && (
                            <img
                              src={dropboxCheck}
                              alt="selected"
                              className="edit-dropdown-check"
                            />
                          )}
                        </div>
                      )
                    )}
                  </div>
                )}
              </div>
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
            <h3 className="edit-file-title">계약서</h3>

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

          {/* 저장하기, 취소 버튼 */}
          <div className="edit-action-buttons">
            <button className="edit-submit-button" onClick={handleSubmit}>
              저장하기
            </button>
            <button className="edit-cancel-button" onClick={handleCancel}>
              취소
            </button>
          </div>
        </>
      ) : (
        <>
          {/* 기존 읽기 모드는 그대로 유지 */}
          {/* 속성 요약 영역 */}
          <div className="property-summary">
            <div className="property-summary-item">
              <p>{contract.complex}</p>
              <p>
                {contract.complex} {contract.building}-{contract.unit} (
                {contract.area}m²)
              </p>
            </div>
          </div>

          {/* 계약 정보 영역 */}
          <div className="contract-info">
            {/* 가격 및 유형 정보 */}
            <div className="pricing-info">
              <div className="price-item">
                <p>거래 가격 {contract.sellPrice || contract.price}</p>
                <p>거래 유형 {contract.transactionType}</p>
                <p>
                  계약 상태{" "}
                  <span className={getStatusClass(contract.status)}>
                    {contract.status}
                  </span>
                </p>
              </div>
            </div>

            {/* 연락처 정보 */}
            <div className="contact-info">
              <div className="info-row">
                <div className="info-box">
                  <h4>소유주(매도인)</h4>
                  <p>{contract.owner}</p>
                </div>
                <div className="info-box">
                  <h4>소유주 연락처</h4>
                  <p>{contract.ownerContact}</p>
                </div>
              </div>

              <div className="info-row">
                <div className="info-box">
                  <h4>입주인(매수인)</h4>
                  <p>{contract.tenant}</p>
                </div>
                <div className="info-box">
                  <h4>입주인 연락처</h4>
                  <p>{contract.tenantContact}</p>
                </div>
              </div>

              <div className="info-row">
                <div className="info-box">
                  <h4>계약 일시</h4>
                  <p>{contract.startDate}</p>
                </div>
                <div className="info-box">
                  <h4>만기일</h4>
                  <p>{contract.endDate}</p>
                </div>
              </div>
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
                <div className="no-file-message">등록된 계약서가 없습니다.</div>
              )}
            </div>

            <div className="action-buttons">
              <button className="primary-button" onClick={handleEditMode}>
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
