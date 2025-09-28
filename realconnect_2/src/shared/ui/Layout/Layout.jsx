import React from "react";
import { Sidebar } from "./Sidebar";
import styles from "./Layout.module.css";

export const Layout = ({ children }) => {
  return (
    <div className={styles.appLayout}>
      <Sidebar />
      <main className={styles.mainContent}>{children}</main>
    </div>
  );
};
