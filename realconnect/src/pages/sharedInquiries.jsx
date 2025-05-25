import React, { useState, useEffect } from "react";
import axios from "axios";
import useAuthStore from "../store/authStore";
import RegionalFilter from "../components/regionalFilter/regionalFilter";
import TransactionType from "../components/sortButtons/transactionType";
import AddProperty from "../components/addProperrty/addProperty";
import DeleteProperty from "../components/deleteProperty/deleteProperty";
import SharedInquiriesTable from "../components/sharedInquiriesTable/sharedInquiriesTable";

const SharedInquiries = () => {
  const [activeView, setActiveView] = useState("all");
  const [sharedInquiries, setSharedInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const accessToken = useAuthStore((state) => state.accessToken);

  const handleViewChange = (view) => {
    setActiveView(view);
  };

  const handleSharedInquirySelect = (inquiry) => {
    console.log("선택된 문의:", inquiry);
  };

  const fetchSharedInquiries = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/shares`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          withCredentials: true,
        }
      );
      console.log("API 응답 데이터:", res.data);
      setSharedInquiries(res.data);
    } catch (error) {
      console.error("문의 공유 데이터 조회 중 오류 발생:", error);
      setSharedInquiries([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSharedInquiries();
  }, [accessToken]);

  return (
    <div className="page_section">
      <div className="page_header">
        <div className="header_left">
          <div className="page_title">문의 공유</div>
          <div className="page_description">
            타 부동산 업소와 공유하는 고객의 문의 목록입니다
          </div>
        </div>
        <div className="view_selector">
          <button
            className={`view_option ${activeView === "all" ? "view_option--active" : ""}`}
            onClick={() => handleViewChange("all")}
          >
            전체
          </button>
          <button
            className={`view_option ${activeView === "my" ? "view_option--active" : ""}`}
            onClick={() => handleViewChange("my")}
          >
            내 문의
          </button>
        </div>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          width: "100%",
          marginBottom: "1.6rem",
        }}
      >
        <div style={{ width: "400px" }}>
          <RegionalFilter />
        </div>
        <div style={{ display: "flex", gap: "0.8rem" }}>
          <TransactionType />
          <AddProperty />
          <DeleteProperty />
        </div>
      </div>
      <div className="page_content">
        {loading ? (
          <div>로딩 중...</div>
        ) : (
          <SharedInquiriesTable
            sharedInquiries={sharedInquiries}
            onSharedInquirySelect={handleSharedInquirySelect}
          />
        )}
      </div>
    </div>
  );
};

export default SharedInquiries;
