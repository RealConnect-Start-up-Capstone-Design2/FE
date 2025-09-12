import React from "react";
import Sidebar from "./leftSidebar/sidebar";

const Layout = ({ children }) => {
  return (
    <div className="app_layout">
      <Sidebar />
      <main className="main_content">{children}</main>
    </div>
  );
};

export default Layout;
