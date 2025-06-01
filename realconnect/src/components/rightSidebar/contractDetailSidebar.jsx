import React, { useState, useRef, useEffect } from "react";
import "./contractDetailSidebar.css";
import axios from "axios";
import useAuthStore from "../../store/authStore";

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
  const { accessToken } = useAuthStore();

  // 드롭박스 상태
  const [isTransactionTypeOpen, setIsTransactionTypeOpen] = useState(false);
  const [isStatusOpen, setIsStatusOpen] = useState(false);

  // 드롭박스 외부 클릭 감지를 위한 ref
  const transactionTypeRef = useRef(null);
  const statusRef = useRef(null);

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

  // 거래 가격 포맷팅 (원 → 만원/억 단위)
  const formatPrice = (price) => {
    if (!price) return "-";
    const numPrice = parseInt(price, 10);

    if (numPrice >= 100000000) {
      // 1억 이상
      const eok = numPrice / 100000000;
      return `${eok.toFixed(1)}억`;
    } else {
      // 1억 미만
      const man = numPrice / 10000;
      return `${man.toLocaleString()}만원`;
    }
  };

  // 계약 상태를 한국어로 변환
  const getContractStatusText = (status) => {
    const statusMap = {
      ACTIVE: "계약 중",
      COMPLETED: "계약 완료",
      TERMINATED: "계약 파기",
      EXPIRED: "계약 만료",
    };
    return statusMap[status] || status;
  };

  // 한국어 계약 상태를 영어로 변환 (API 요청용)
  const getContractStatusValue = (statusKo) => {
    const statusMap = {
      "계약 중": "ACTIVE",
      "계약 완료": "COMPLETED",
      "계약 파기": "TERMINATED",
      "계약 만료": "EXPIRED",
    };
    return statusMap[statusKo] || statusKo;
  };

  const contractStatusOptions = [
    "계약 중",
    "계약 완료",
    "계약 파기",
    "계약 만료",
  ];

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
        area: formData.area,
        ownerName: formData.owner,
        ownerPhone: formData.ownerContact,
        tenantName: formData.tenant,
        tenantPhone: formData.tenantContact,
        contractType: getTransactionTypeValue(formData.transactionType),
        contractPrice: formData.price,
        contractDate: formData.contractDate, // 이미 YYYY-MM-DD 형식
        dueDate: formData.expiryDate, // 이미 YYYY-MM-DD 형식
        contractStatus: getContractStatusValue(formData.status),
        favorite: contract.favorite || false,
      };

      console.log("Updating contract with data:", updateData);

      // API 호출
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/contract/update/${contract.id}`,
        updateData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Contract update response:", response.data);

      // 성공 시 부모 컴포넌트에 업데이트된 데이터 전달
      if (onUpdate) {
        const updatedContract = {
          // 기존 contract 데이터 유지
          ...contract,
          // 업데이트된 필드들 (화면 표시용으로 변환)
          ownerName: formData.owner,
          ownerPhone: formData.ownerContact,
          tenantName: formData.tenant,
          tenantPhone: formData.tenantContact,
          contractType: getTransactionTypeValue(formData.transactionType),
          contractPrice: formData.price,
          contractDate: formData.contractDate,
          dueDate: formData.expiryDate,
          contractStatus: getContractStatusValue(formData.status),
          area: formData.area,
          // 파일 관련 정보
          contractFile: formData.fileName,
          fileSize: formData.fileSize,
          // 파일 날짜는 변경된 경우에만 업데이트
          fileDate: formData.contractFile
            ? new Date()
                .toLocaleDateString("ko-KR", {
                  year: "numeric",
                  month: "numeric",
                  day: "numeric",
                })
                .replace(/\./g, ". ")
                .replace(/\s$/, "")
            : contract.fileDate,
        };

        onUpdate(updatedContract);
      }

      // 편집 모드 종료
      setIsEditMode(false);
      setIsTransactionTypeOpen(false);
      setIsStatusOpen(false);

      // 성공 메시지 (선택사항)
      console.log("계약 정보가 성공적으로 업데이트되었습니다.");
    } catch (error) {
      console.error("계약 업데이트 중 오류 발생:", error);
      console.error("Error response:", error.response);
      if (error.response) {
        console.error("Error status:", error.response.status);
        console.error("Error data:", error.response.data);
      }

      // 에러 메시지 표시 (추후 토스트나 알림으로 변경 가능)
      alert("계약 완료 대신 다른 걸 선택해주세요.");
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
          {/* 새로운 수정 모드 디자인 */}

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
                    {transactionTypeOptions.map((option) => (
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
                    {contractStatusOptions.map((option) => (
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
                    ))}
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
                <p>거래 유형 {getTransactionTypeText(contract.contractType)}</p>
                <p>
                  계약 상태 {getContractStatusText(contract.contractStatus)}
                </p>
              </div>
            </div>

            {/* 연락처 정보 */}
            <div className="contact-info">
              <div className="info-row">
                <div className="info-box">
                  <h4>소유주(매도인)</h4>
                  <p>{contract.ownerName}</p>
                </div>
                <div className="info-box">
                  <h4>소유주 연락처</h4>
                  <p>{contract.ownerPhone}</p>
                </div>
              </div>

              <div className="info-row">
                <div className="info-box">
                  <h4>입주인(매수인)</h4>
                  <p>{contract.tenantName}</p>
                </div>
                <div className="info-box">
                  <h4>입주인 연락처</h4>
                  <p>{contract.tenantPhone}</p>
                </div>
              </div>

              <div className="info-row">
                <div className="info-box">
                  <h4>계약 일시</h4>
                  <p>{contract.contractDate}</p>
                </div>
                <div className="info-box">
                  <h4>만기일</h4>
                  <p>{contract.dueDate}</p>
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
