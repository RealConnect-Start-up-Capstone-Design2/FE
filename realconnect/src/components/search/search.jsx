import React, { useState } from "react";
import "./search.css";
import searchIcon from "../../assets/icons/search.svg";

const Search = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    if (onSearch) {
      onSearch(e.target.value);
    }
  };

  return (
    <div className="search-container">
      <div className="search-input-wrapper">
        <div className="search-icon left" aria-hidden="true">
          <img src={searchIcon} alt="" />
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
