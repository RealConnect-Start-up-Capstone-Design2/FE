import React, { useEffect } from "react";
import "./modal.css";

const Modal = ({
  isOpen,
  onClose,
  onSubmit,
  title,
  submitText = "확인",
  cancelText = "취소",
  children,
  modalSize = "default",
}) => {
  // ESC 키를 눌렀을 때 모달 닫기
  useEffect(() => {
    const handleEscKey = (event) => {
      if (event.key === "Escape" && isOpen) {
        onClose();
      }
    };

    window.addEventListener("keydown", handleEscKey);

    // 모달이 열렸을 때 스크롤 방지
    if (isOpen) {
      document.body.style.overflow = "hidden";
    }

    return () => {
      window.removeEventListener("keydown", handleEscKey);
      document.body.style.overflow = "auto";
    };
  }, [isOpen, onClose]);

  // 모달이 열려있지 않으면 렌더링하지 않음
  if (!isOpen) return null;

  // 모달 외부 클릭 시 닫기
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // 모달 크기 클래스 결정
  const modalSizeClass = `modal-container ${modalSize === "large" ? "modal-large" : ""}`;

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className={modalSizeClass}>
        <h2 className="modal-title">{title}</h2>
        <div className="modal-content">{children}</div>
        <div className="modal-buttons">
          <button className="cancel-button" onClick={onClose}>
            {cancelText}
          </button>
          <button className="submit-button" onClick={onSubmit}>
            {submitText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
