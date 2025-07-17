import React from "react";

/**
 * ViewSelector - 상단 뷰 선택 버튼 공통 컴포넌트
 * @param {object} props
 * @param {{ value: string, label: string }[]} props.options - 버튼 목록
 * @param {string} props.active - 현재 활성화된 값
 * @param {(value: string) => void} props.onChange - 버튼 클릭 핸들러
 */
const ViewSelector = ({ options, active, onChange }) => (
  <div className="view_selector">
    {options.map((opt) => (
      <button
        key={opt.value}
        className={`view_option ${active === opt.value ? "view_option--active" : ""}`}
        onClick={() => onChange(opt.value)}
      >
        {opt.label}
      </button>
    ))}
  </div>
);

export default ViewSelector; 