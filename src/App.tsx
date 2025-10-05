import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AppProviders } from "@/components/common/AppProviders";
import { Layout } from "@/components/common/Layout";
import { HomePage } from "@/pages/home";
import { PropertyManagePage } from "@/pages/propertyManage";
import { LoginPage, SignupPage } from "@/pages/auth";

function App() {
  return (
    <AppProviders>
      <Router>
        <Routes>
          {/* Auth routes without sidebar */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />

          {/* Main routes with sidebar */}
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="property-manage" element={<PropertyManagePage />} />
            <Route
              path="inquiry-manage"
              element={<div className="p-6">문의 관리 페이지</div>}
            />
            <Route
              path="contract-manage"
              element={<div className="p-6">계약 관리 페이지</div>}
            />
            <Route
              path="inquiry-share"
              element={<div className="p-6">문의 공유 페이지</div>}
            />
            <Route
              path="settings"
              element={<div className="p-6">설정 페이지</div>}
            />
          </Route>
        </Routes>
      </Router>
    </AppProviders>
  );
}

export default App;
