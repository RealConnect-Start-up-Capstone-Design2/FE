import React from "react";
import styles from "./FormInput.web.module.css";

/**
 * 웹용 FormInput 컴포넌트
 * 다양한 타입의 입력을 지원하는 공통 폼 입력 컴포넌트
 *
 * 지원 타입:
 * - text: 일반 텍스트 입력
 * - price: 가격 입력 (쉼표 자동 추가)
 * - phone: 전화번호 입력 (하이픈 자동 추가)
 * - number: 숫자 입력 (소수점 지원)
 * - date: 날짜 입력
 * - textarea: 텍스트 영역
 *
 * @param {Object} props
 * @param {string} props.type - 입력 타입
 * @param {string} props.label - 라벨 텍스트
 * @param {string} props.name - 입력 필드 이름
 * @param {string} props.value - 입력 값
 * @param {function} props.onChange - 값 변경 핸들러
 * @param {string} props.placeholder - 플레이스홀더 텍스트
 * @param {boolean} props.disabled - 비활성 상태
 * @param {string} props.className - 추가 CSS 클래스
 * @param {number} props.rows - textarea 행 수
 */
const FormInput = ({
  type = "text",
  label,
  name,
  value,
  onChange,
  placeholder,
  disabled = false,
  className = "",
  rows = 4, // textarea용
  ...props
}) => {
  // 가격 포맷팅 함수 (입력용 - 쉼표만 추가)
  const formatPrice = (inputValue) => {
    const numericValue = inputValue.replace(/[^0-9]/g, "");
    return numericValue ? parseInt(numericValue).toLocaleString() : "";
  };

  // 전화번호 포맷팅 함수
  const formatPhone = (inputValue) => {
    const numbersOnly = inputValue.replace(/[^0-9]/g, "");

    if (numbersOnly.length <= 3) {
      return numbersOnly;
    } else if (numbersOnly.length <= 7) {
      return `${numbersOnly.slice(0, 3)}-${numbersOnly.slice(3)}`;
    } else {
      return `${numbersOnly.slice(0, 3)}-${numbersOnly.slice(3, 7)}-${numbersOnly.slice(7, 11)}`;
    }
  };

  // 숫자 포맷팅 함수 (소수점 지원)
  const formatNumber = (inputValue) => {
    // 숫자와 소수점만 허용
    return inputValue.replace(/[^0-9.]/g, "");
  };

  // 타입별 onChange 핸들러
  const handleInputChange = (e) => {
    let formattedValue = e.target.value;

    switch (type) {
      case "price":
        formattedValue = formatPrice(e.target.value);
        break;
      case "phone":
        formattedValue = formatPhone(e.target.value);
        break;
      case "number":
        formattedValue = formatNumber(e.target.value);
        break;
      default:
        // text, date 등은 그대로
        formattedValue = e.target.value;
    }

    // 가공된 값으로 onChange 호출
    const syntheticEvent = {
      ...e,
      target: {
        ...e.target,
        name,
        value: formattedValue,
      },
    };

    onChange(syntheticEvent);
  };

  // 입력 타입 결정
  const getInputType = () => {
    switch (type) {
      case "date":
        return "date";
      case "price":
      case "phone":
      case "number":
      case "text":
      default:
        return "text";
    }
  };

  // textarea 렌더링
  if (type === "textarea") {
    return (
      <div className={`${styles.formGroup} ${className}`}>
        {label && <label className={styles.label}>{label}</label>}
        <textarea
          name={name}
          value={value || ""}
          onChange={handleInputChange}
          placeholder={placeholder}
          disabled={disabled}
          rows={rows}
          className={`${styles.textarea} ${disabled ? styles.disabled : ""}`}
          {...props}
        />
      </div>
    );
  }

  // input 렌더링
  return (
    <div className={`${styles.formGroup} ${className}`}>
      {label && <label className={styles.label}>{label}</label>}
      <input
        type={getInputType()}
        name={name}
        value={value || ""}
        onChange={handleInputChange}
        placeholder={placeholder}
        disabled={disabled}
        className={`${styles.input} ${disabled ? styles.disabled : ""}`}
        {...props}
      />
    </div>
  );
};

export { FormInput };
