import React, { useState } from "react";
import styles from "./SearchInput.module.css";
import searchIcon from "@shared/assets/icons/search.svg";

export const SearchInput = ({ placeholder = "검색...", onSearch }) => {
  const [value, setValue] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(value);
  };

  return (
    <form onSubmit={handleSubmit} className={styles.searchInput}>
      <img src={searchIcon} alt="검색" className={styles.searchIcon} />
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        className={styles.input}
      />
    </form>
  );
};
