import React, { useState, useRef, useEffect } from "react";
import filterIcon from "@/assets/icons/filter.svg";
import CheckIcon from "@/assets/icons/check.svg";
import "./regionalFilter.css";


// 지역명 매핑 (UI 표시명 -> API 전송명)
const REGION_MAPPING = {
  서울: "서울특별시",
  경기: "경기도",
  인천: "인천광역시",
  대전: "대전광역시",
};

// 예시 데이터 (실제 서비스에서는 외부에서 받아올 수 있음)
const REGION_DATA = {
  전체: {},
  서울: {
    전체: [],
    강남구: ["전체", "개포1동", "개포2동", "역삼동"],
    강동구: ["전체", "천호동", "길동"],
    강북구: ["전체", "수유동", "미아동"],
    송파구: ["전체", "잠실동"],
  },
  경기: {
    전체: [],
    성남시: ["전체", "분당구", "수정구"],
    고양시: ["전체", "일산동구", "일산서구"],
  },
  인천: {
    전체: [],
    연수구: ["전체", "송도동", "연수동"],
    남동구: ["전체", "구월동", "논현동"],
  },
  대전: {
    전체: [],
    서구: ["전체", "둔산동", "탄방동"],
    유성구: ["전체", "봉명동", "장대동"],
  },
};

const SIDO_LIST = Object.keys(REGION_DATA);

const RegionalFilter = ({ onFilterChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedSido, setSelectedSido] = useState("전체");
  const [selectedGugun, setSelectedGugun] = useState("전체");
  const [selectedDong, setSelectedDong] = useState("전체");
  const dropdownRef = useRef(null);

  // 외부 클릭 시 닫기
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // 컴포넌트가 언마운트될 때 드롭다운 상태 초기화
  useEffect(() => {
    return () => {
      setIsOpen(false);
    };
  }, []);

  // 선택값이 변경될 때마다 부모 컴포넌트에 알림
  useEffect(() => {
    if (onFilterChange) {
      // 전체가 아닌 경우에만 값을 전달하고, 지역명 매핑 적용
      const l1 = selectedSido !== "전체" ? (REGION_MAPPING[selectedSido] || selectedSido) : null;
      const l2 = selectedGugun !== "전체" ? selectedGugun : null;
      const l3 = selectedDong !== "전체" ? selectedDong : null;

      onFilterChange({ l1, l2, l3 });
    }
  }, [selectedSido, selectedGugun, selectedDong]);

  // 구/군 리스트
  const gugunList =
    selectedSido === "전체" ? ["전체"] : Object.keys(REGION_DATA[selectedSido]);
  // 동/읍/면 리스트
  const dongList =
    selectedSido === "전체" || selectedGugun === "전체"
      ? ["전체"]
      : REGION_DATA[selectedSido][selectedGugun] || ["전체"];

  // 선택 핸들러
  const handleSido = (sido) => {
    setSelectedSido(sido);
    setSelectedGugun("전체");
    setSelectedDong("전체");
  };
  const handleGugun = (gugun) => {
    setSelectedGugun(gugun);
    setSelectedDong("전체");
  };
  const handleDong = (dong) => {
    setSelectedDong(dong);
    setIsOpen(false);
  };

  // 선택된 값이 하나라도 전체가 아니면 true
  const isAnySelected = () => {
    return (
      selectedSido !== "전체" ||
      selectedGugun !== "전체" ||
      selectedDong !== "전체"
    );
  };

  return (
    <div className="regional-filter-container" ref={dropdownRef}>
      <button
        className={`regional-filter-btn${isAnySelected() ? " selected" : ""}`}
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <img src={filterIcon} alt="filter" className="regional-filter-icon" />
        지역 필터
      </button>
      {isOpen && (
        <div className="regional-filter-dropdown">
          <div className="regional-filter-table">
            <div className="regional-filter-col">
              <div className="regional-filter-col-title">시·도</div>
              {SIDO_LIST.map((sido) => (
                <div
                  key={sido}
                  className={`regional-filter-option${selectedSido === sido ? " selected" : ""}`}
                  onClick={() => handleSido(sido)}
                >
                  {selectedSido === sido ? (
                    <span className="regional-filter-check">
                      <img src={CheckIcon} alt="check" />
                    </span>
                  ) : (
                    <span className="regional-filter-check regional-filter-check-placeholder">
                      <img src={CheckIcon} alt="check" />
                    </span>
                  )}
                  {sido}
                </div>
              ))}
            </div>
            <div className="regional-filter-col">
              <div className="regional-filter-col-title">구·군</div>
              {gugunList.map((gugun) => (
                <div
                  key={gugun}
                  className={`regional-filter-option${selectedGugun === gugun ? " selected" : ""}`}
                  onClick={() => handleGugun(gugun)}
                >
                  {selectedGugun === gugun ? (
                    <span className="regional-filter-check">
                      <img src={CheckIcon} alt="check" />
                    </span>
                  ) : (
                    <span className="regional-filter-check regional-filter-check-placeholder">
                      <img src={CheckIcon} alt="check" />
                    </span>
                  )}
                  {gugun}
                </div>
              ))}
            </div>
            <div className="regional-filter-col">
              <div className="regional-filter-col-title">동·읍·면</div>
              {dongList.map((dong) => (
                <div
                  key={dong}
                  className={`regional-filter-option${selectedDong === dong ? " selected" : ""}`}
                  onClick={() => handleDong(dong)}
                >
                  {selectedDong === dong ? (
                    <span className="regional-filter-check">
                      <img src={CheckIcon} alt="check" />
                    </span>
                  ) : (
                    <span className="regional-filter-check regional-filter-check-placeholder">
                      <img src={CheckIcon} alt="check" />
                    </span>
                  )}
                  {dong}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RegionalFilter;
