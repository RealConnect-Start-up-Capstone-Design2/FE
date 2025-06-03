import React, { useState, useEffect } from "react";
import Modal from "./modal";
import "./ShareInquiryModal.css";

const ShareInquiryModal = ({ isOpen, onClose, onSubmit, inquiry }) => {
  const [formData, setFormData] = useState({
    title: "",
    sido: "",
    sigungu: "",
    dong: "",
    company: "",
    contact: "",
    memo: "",
  });

  const [locationOptions, setLocationOptions] = useState({
    sido: [],
    sigungu: [],
    dong: [],
  });

  // 시도 목록 불러오기
  useEffect(() => {
    if (isOpen) {
      // 초기 시도 목록 로드
      fetchSido();
    }
  }, [isOpen]);

  // 시/도 데이터 가져오기
  const fetchSido = async () => {
    try {
      // V-World API Key 필요
      // const apiKey = "발급받은APIKEY"; // 실제 구현 시 환경변수에서 로드하는 것이 좋음

      // V-World API 사용 예시
      // 실제 구현 시 이 URL은 서버 측에서 호출하는 것이 좋음 (CORS 이슈 방지)
      // const response = await fetch(`http://api.vworld.kr/req/data?service=data&request=GetFeature&data=LT_C_ADSIDO&key=${apiKey}&format=json`);
      // const data = await response.json();

      // 예시 데이터로 대체
      const sidoData = [
        { code: "11", name: "서울특별시" },
        { code: "26", name: "부산광역시" },
        { code: "27", name: "대구광역시" },
        { code: "28", name: "인천광역시" },
        { code: "29", name: "광주광역시" },
        { code: "30", name: "대전광역시" },
        { code: "31", name: "울산광역시" },
        { code: "36", name: "세종특별자치시" },
        { code: "41", name: "경기도" },
        { code: "42", name: "강원특별자치도" },
        { code: "43", name: "충청북도" },
        { code: "44", name: "충청남도" },
        { code: "45", name: "전라북도" },
        { code: "46", name: "전라남도" },
        { code: "47", name: "경상북도" },
        { code: "48", name: "경상남도" },
        { code: "50", name: "제주특별자치도" },
      ];

      setLocationOptions((prev) => ({
        ...prev,
        sido: sidoData,
      }));
    } catch (error) {
      console.error("시도 목록을 불러오는데 실패했습니다:", error);
    }
  };

  // 시군구 데이터 가져오기
  const fetchSigungu = async (sidoCode) => {
    if (!sidoCode) return;

    try {
      // V-World API Key 필요
      // const apiKey = "발급받은APIKEY"; // 실제 구현 시 환경변수에서 로드하는 것이 좋음

      // V-World API 사용 예시
      // 실제 구현 시 이 URL은 서버 측에서 호출하는 것이 좋음 (CORS 이슈 방지)
      // const response = await fetch(`http://api.vworld.kr/req/data?service=data&request=GetFeature&data=LT_C_ADSIGG&key=${apiKey}&format=json&attrFilter=ctprvn_cd:=:${sidoCode}`);
      // const data = await response.json();

      // 예시 데이터로 대체 (서울시 일부 구)
      const sigunguData =
        sidoCode === "11"
          ? [
              { code: "11110", name: "종로구" },
              { code: "11140", name: "중구" },
              { code: "11170", name: "용산구" },
              { code: "11200", name: "성동구" },
              { code: "11215", name: "광진구" },
              { code: "11220", name: "동대문구" },
              { code: "11260", name: "중랑구" },
              { code: "11290", name: "성북구" },
              { code: "11230", name: "강남구" },
              { code: "11520", name: "서초구" },
              { code: "11710", name: "송파구" },
            ]
          : [];

      setLocationOptions((prev) => ({
        ...prev,
        sigungu: sigunguData,
        dong: [], // 시군구가 바뀌면 동 초기화
      }));

      // 시군구 선택 초기화
      setFormData((prev) => ({
        ...prev,
        sigungu: "",
        dong: "",
      }));
    } catch (error) {
      console.error("시군구 목록을 불러오는데 실패했습니다:", error);
    }
  };

  // 동 데이터 가져오기
  const fetchDong = async (sigunguCode) => {
    if (!sigunguCode) return;

    try {
      // V-World API Key 필요
      // const apiKey = "발급받은APIKEY"; // 실제 구현 시 환경변수에서 로드하는 것이 좋음

      // V-World API 사용 예시
      // 실제 구현 시 이 URL은 서버 측에서 호출하는 것이 좋음 (CORS 이슈 방지)
      // const response = await fetch(`http://api.vworld.kr/req/data?service=data&request=GetFeature&data=LT_C_ADEMD&key=${apiKey}&format=json&attrFilter=sig_cd:=:${sigunguCode}`);
      // const data = await response.json();

      // 예시 데이터로 대체 (종로구 일부 동 또는 강남구 일부 동)
      let dongData = [];

      if (sigunguCode === "11110") {
        // 종로구 동
        dongData = [
          { code: "11110111", name: "청운효자동" },
          { code: "11110112", name: "사직동" },
          { code: "11110113", name: "삼청동" },
          { code: "11110114", name: "부암동" },
          { code: "11110115", name: "평창동" },
          { code: "11110116", name: "무악동" },
          { code: "11110117", name: "교남동" },
        ];
      } else if (sigunguCode === "11230") {
        // 강남구 동
        dongData = [
          { code: "11230101", name: "신사동" },
          { code: "11230102", name: "논현동" },
          { code: "11230103", name: "압구정동" },
          { code: "11230104", name: "청담동" },
          { code: "11230105", name: "삼성동" },
          { code: "11230106", name: "대치동" },
          { code: "11230107", name: "역삼동" },
          { code: "11230108", name: "도곡동" },
        ];
      } else if (sigunguCode === "11520") {
        // 서초구 동
        dongData = [
          { code: "11520101", name: "서초동" },
          { code: "11520102", name: "반포동" },
          { code: "11520103", name: "잠원동" },
          { code: "11520104", name: "방배동" },
          { code: "11520105", name: "양재동" },
          { code: "11520106", name: "내곡동" },
        ];
      } else if (sigunguCode === "11710") {
        // 송파구 동
        dongData = [
          { code: "11710101", name: "잠실동" },
          { code: "11710102", name: "신천동" },
          { code: "11710103", name: "풍납동" },
          { code: "11710104", name: "송파동" },
          { code: "11710105", name: "석촌동" },
          { code: "11710106", name: "삼전동" },
          { code: "11710107", name: "가락동" },
          { code: "11710108", name: "문정동" },
          { code: "11710109", name: "장지동" },
        ];
      }

      setLocationOptions((prev) => ({
        ...prev,
        dong: dongData,
      }));

      // 동 선택 초기화
      setFormData((prev) => ({
        ...prev,
        dong: "",
      }));
    } catch (error) {
      console.error("동 목록을 불러오는데 실패했습니다:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    // 시도 선택 시 시군구 목록 가져오기
    if (name === "sido") {
      fetchSigungu(value);
    }

    // 시군구 선택 시 동 목록 가져오기
    if (name === "sigungu") {
      fetchDong(value);
    }
  };

  const handleSubmit = () => {
    // 지역 정보 합치기
    const location = {
      sido: formData.sido
        ? locationOptions.sido.find((item) => item.code === formData.sido)
            ?.name || ""
        : "",
      sigungu: formData.sigungu
        ? locationOptions.sigungu.find((item) => item.code === formData.sigungu)
            ?.name || ""
        : "",
      dong: formData.dong
        ? locationOptions.dong.find((item) => item.code === formData.dong)
            ?.name || ""
        : "",
    };

    // API 요구사항에 맞는 형식으로 데이터 변환
    const submitData = {
      title: formData.title,
      l1: location.sido,
      l2: location.sigungu,
      l3: location.dong,
      agentName: formData.company || "김부동산공인중개사", // 기본값
      agentPhone: formData.contact || "02-1234-5678", // 기본값
      type:
        inquiry.inquiryType === "매매"
          ? "BUY"
          : inquiry.inquiryType === "전세"
            ? "JEONSE"
            : "RENT",
      customerName: inquiry.name,
      customerPhone: inquiry.phone,
      apartmentName: inquiry.apartmentName,
      area: parseFloat(inquiry.area) || 0,
      salePrice: inquiry.salePrice
        ? parseInt(inquiry.salePrice.replace(/[^0-9]/g, ""))
        : 0,
      memo: formData.memo || inquiry.memo || "",
    };

    onSubmit(submitData);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}
      title="문의 공유하기"
      submitText="공유하기"
      cancelText="취소"
    >
      <div className="form-container">
        <div className="form-group">
          <label className="form-label" htmlFor="title">
            문의 공유 제목
          </label>
          <input
            type="text"
            id="title"
            name="title"
            className="form-input"
            placeholder="공유할 문의의 제목을 입력하세요"
            value={formData.title}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label className="form-label">문의 지역 구분</label>
          <div className="location-container">
            <select
              className="location-select"
              name="sido"
              value={formData.sido}
              onChange={handleChange}
              required
            >
              <option value="" disabled>
                시/도
              </option>
              {locationOptions.sido.map((sido) => (
                <option key={sido.code} value={sido.code}>
                  {sido.name}
                </option>
              ))}
            </select>

            <select
              className="location-select"
              name="sigungu"
              value={formData.sigungu}
              onChange={handleChange}
              disabled={!formData.sido}
              required
            >
              <option value="" disabled>
                시/군/구
              </option>
              {locationOptions.sigungu.map((sigungu) => (
                <option key={sigungu.code} value={sigungu.code}>
                  {sigungu.name}
                </option>
              ))}
            </select>

            <select
              className="location-select"
              name="dong"
              value={formData.dong}
              onChange={handleChange}
              disabled={!formData.sigungu}
              required
            >
              <option value="" disabled>
                읍/면/동
              </option>
              {locationOptions.dong.map((dong) => (
                <option key={dong.code} value={dong.code}>
                  {dong.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="company">
            업소명
          </label>
          <input
            type="text"
            id="company"
            name="company"
            className="form-input"
            placeholder="문의 공유에 기입할 업소명을 입력하세요"
            value={formData.company}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="contact">
            연락처
          </label>
          <input
            type="text"
            id="contact"
            name="contact"
            className="form-input"
            placeholder="담당업소 혹은 담당자의 연락처를 입력하세요"
            value={formData.contact}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="detail-container">
        <div className="detail-title">상세 내용</div>
        <div className="detail-boxes">
          <div className="detail-box">
            <div className="detail-box-label">문의자</div>
            <div className="detail-box-value">{inquiry?.name || "최정현"}</div>
          </div>
          <div className="detail-box">
            <div className="detail-box-label">문의자 연락처</div>
            <div className="detail-box-value">
              {inquiry?.phone || "010-1234-2334"}
            </div>
          </div>
          <div className="detail-box">
            <div className="detail-box-label">문의 유형</div>
            <div className="detail-box-value">
              {inquiry?.inquiryType || "매매"}
            </div>
          </div>
          <div className="detail-box">
            <div className="detail-box-label">희망 가격</div>
            <div className="detail-box-value">
              {inquiry?.salePrice || "24억 5000"}
            </div>
          </div>
          <div className="detail-box">
            <div className="detail-box-label">진행 상태</div>
            <div className="detail-box-value">
              {inquiry?.status || "진행중"}
            </div>
          </div>
          <div className="detail-box">
            <div className="detail-box-label">등록일</div>
            <div className="detail-box-value">{inquiry?.createdAt}</div>
          </div>
        </div>
      </div>

      <div className="memo-container">
        <div className="memo-title">메모</div>
        <textarea
          className="memo-input"
          placeholder="메모를 입력하세요"
          name="memo"
          value={formData.memo || ""}
          onChange={handleChange}
        ></textarea>
      </div>
    </Modal>
  );
};

export default ShareInquiryModal;
