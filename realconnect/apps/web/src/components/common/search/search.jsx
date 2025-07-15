import React, { useState, useEffect, useRef } from "react";
import "./search.css";
import searchIcon from "../../../assets/icons/search.svg";

const Search = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const debounceTimeoutRef = useRef(null);

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    
    // 이전 타이머가 있으면 취소
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }
    
    // 300ms 후에 검색 실행 (디바운싱)
    debounceTimeoutRef.current = setTimeout(() => {
      if (onSearch) {
        onSearch(value);
      }
    }, 300);
  };

  // 컴포넌트 언마운트 시 타이머 정리
  useEffect(() => {
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div className="search-container">
      <div className="search-input-wrapper">
        <div className="search-icon left" aria-hidden="true">
          <img src={searchIcon} alt="search" />
        </div>
        <input
          type="text"
          className="search-input"
          placeholder="통합 검색 (이름, 동, 호수, 전화번호 등)"
          value={searchTerm}
          onChange={handleSearch}
        />
      </div>
    </div>
  );
};

export default Search;
