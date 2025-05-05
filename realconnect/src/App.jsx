import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./styles/global.css";

// 레이아웃 컴포넌트
import Layout from "./components/Layout";

// 페이지 컴포넌트
import Dashboard from "./pages/dashboard";
import Properties from "./pages/properties";
import Inquiries from "./pages/inquiries";
import Contracts from "./pages/contracts";
import SharedInquiries from "./pages/sharedInquiries";
import Settings from "./pages/settings";
import Logout from "./pages/logout";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <Layout>
              <Dashboard />
            </Layout>
          }
        />
        <Route
          path="/properties"
          element={
            <Layout>
              <Properties />
            </Layout>
          }
        />
        <Route
          path="/inquiries"
          element={
            <Layout>
              <Inquiries />
            </Layout>
          }
        />
        <Route
          path="/contracts"
          element={
            <Layout>
              <Contracts />
            </Layout>
          }
        />
        <Route
          path="/shared-inquiries"
          element={
            <Layout>
              <SharedInquiries />
            </Layout>
          }
        />
        <Route
          path="/settings"
          element={
            <Layout>
              <Settings />
            </Layout>
          }
        />
        <Route path="/logout" element={<Logout />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
