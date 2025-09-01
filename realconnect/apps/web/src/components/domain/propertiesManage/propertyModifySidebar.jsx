import React, { useState, useEffect } from "react";
import "./propertyModifySidebar.css";
import { SortButton } from "@realconnect/shared-ui";
import BaseSidebar from "@/components/common/rightSidebar/BaseSidebar";
import { FormInput } from "@realconnect/shared-ui";
import {
  createProperty,
  updateProperty,
} from "../../../services/propertyService";
import useAuthStore from "../../../store/authStore";
import { useImageLoader } from "../../../../../../packages/shared-utils";

const PropertyModifySidebar = ({
  property,
  onClose,
  onSave,
  onUpdateProperty,
}) => {
  const accessToken = useAuthStore((state) => state.accessToken);

  // 새로운 useImageLoader Hook 사용
  const {
    imageUrl,
    loading: imageLoading,
    error: imageError,
  } = useImageLoader(property?.img, accessToken, { enabled: !!property?.img });
  const [formData, setFormData] = useState({
    expansion: "",
    wardrobe: "",
    direction: "",
    salePrice: "",
    jeonsePrice: "",
    deposit: "",
    monthPrice: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  // property 객체 존재 여부 확인
  const isNewProperty = property.status;
  useEffect(() => {
    if (!property) return;
    setFormData({
      expansion: property.expansion || "확장",
      wardrobe: property.wardrobe || "붙박이장",
      direction: property.direction || "남향",
      ...property,
    });

    // 이미지 로딩 로직이 useImageLoader Hook으로 대체되었습니다
  }, [property, accessToken]);

  useEffect(() => {
    // 숫자 외의 문자 제거 후 세 자리마다 쉼표 추가
    const formatWithCommas = (value) => {
      // value가 문자열일 때만 처리
      if (typeof value === "string" || typeof value === "number") {
        return value
          .toString() // 숫자라면 문자열로 변환
          .replace(/\B(?=(\d{3})+(?!\d))/g, ","); // 세 자리마다 쉼표 추가
      }
      return value;
    };
    setFormData((prev) => ({
      ...prev,
      salePrice: formatWithCommas(prev.salePrice),
      jeonsePrice: formatWithCommas(prev.jeonsePrice),
    }));
  }, [formData.salePrice, formData.jeonsePrice]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // 필드 유형에 따라 다른 처리
    if (
      name === "ownerName" ||
      name === "tenantName" ||
      name === "note1" ||
      name === "startDate" ||
      name === "endDate"
    ) {
      // 문자열 필드는 그대로 저장
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
    // 전화번호 필드 처리
    else if (name === "ownerPhone" || name === "tenantPhone") {
      // 숫자만 추출
      const numbersOnly = value.replace(/[^0-9]/g, "");

      // 전화번호 포맷팅 (xxx-xxxx-xxxx)
      let formattedPhone = "";
      if (numbersOnly.length <= 3) {
        formattedPhone = numbersOnly;
      } else if (numbersOnly.length <= 7) {
        formattedPhone = `${numbersOnly.slice(0, 3)}-${numbersOnly.slice(3)}`;
      } else {
        formattedPhone = `${numbersOnly.slice(0, 3)}-${numbersOnly.slice(3, 7)}-${numbersOnly.slice(7, 11)}`;
      }

      setFormData((prev) => ({
        ...prev,
        [name]: formattedPhone,
      }));
    }
    // 가격 필드 처리 (기존 로직)
    else {
      // 숫자 외의 문자 제거 후 세 자리마다 쉼표 추가
      let formattedValue = value.replace(/[^0-9]/g, ""); // 숫자 외의 문자 제거
      formattedValue = formattedValue.replace(/\B(?=(\d{3})+(?!\d))/g, ","); // 세 자리마다 쉼표 추가

      // 업데이트된 값만 저장
      setFormData((prev) => ({
        ...prev,
        [name]: formattedValue,
      }));
    }
  };

  const handleSave = async () => {
    // API 요청 시작
    setIsLoading(true);

    try {
      // 기존 매물 데이터와 수정된 데이터를 병합
      const existingProperty = property;

      // API 요청 데이터 준비 - 기존 데이터 유지하면서 수정된 부분만 업데이트
      const apiData = {
        // 기존 데이터 유지
        ownerName: formData.ownerName || existingProperty.ownerName || "",
        ownerPhone: formData.ownerPhone || existingProperty.ownerPhone || "",
        tenantName: formData.tenantName || existingProperty.tenantName || "",
        tenantPhone: formData.tenantPhone || existingProperty.tenantPhone || "",
        salePrice: formData.salePrice
          ? (() => {
              const parsed = parseInt(formData.salePrice.replace(/,/g, ""));
              return isNaN(parsed) ? 0 : parsed;
            })()
          : existingProperty.salePrice || 0,
        jeonsePrice: formData.jeonsePrice
          ? (() => {
              const parsed = parseInt(formData.jeonsePrice.replace(/,/g, ""));
              return isNaN(parsed) ? 0 : parsed;
            })()
          : existingProperty.jeonsePrice || 0,
        deposit: formData.deposit
          ? (() => {
              const parsed = parseInt(formData.deposit);
              return isNaN(parsed) ? 0 : parsed;
            })()
          : existingProperty.deposit || 0,
        monthPrice: formData.monthPrice
          ? (() => {
              const parsed = parseInt(formData.monthPrice);
              return isNaN(parsed) ? 0 : parsed;
            })()
          : existingProperty.monthPrice || 0,
        status:
          formData.status === "계약 전"
            ? "WAITING"
            : formData.status === "계약 중"
              ? "RESERVED"
              : formData.status === "계약 완료"
                ? "CONTRACTED"
                : existingProperty.status || "WAITING",
        memo: formData.note1 || existingProperty.memo || "",
        startDate: formData.startDate || existingProperty.startDate || null,
        endDate: formData.endDate || existingProperty.endDate || null,
      };

      // 새로운 매물 생성인지 확인 (id가 없는 경우)
      if (!property.id) {
        // 새로운 매물 생성 시에는 apartmentId 추가
        const createData = {
          ...apiData,
          apartmentId: property.apartmentId, // property의 apartmentId 사용
        };
        // propertyService의 createProperty 함수 사용
        const response = await createProperty(createData);
        console.log("새 매물 정보 생성 성공:", response);

        // 성공 시 부모 컴포넌트에 알림
        if (onSave) {
          onSave({
            ...property,
            ...formData,
            id: response.id,
          });
        }

        // 생성 완료 후 사이드바 닫기
        if (onClose) {
          onClose();
        }
      } else {
        // 기존 매물 수정의 경우 - 선택 시 전달받은 id 사용
        const propertyId = property.id;

        if (!propertyId) {
          console.error("매물 ID를 찾을 수 없습니다:", property);
          alert("매물 ID를 찾을 수 없습니다. 다시 시도해주세요.");
          return;
        }

        if (onUpdateProperty) {
          // 부모 컴포넌트의 mutation을 통해 업데이트
          onUpdateProperty({
            propertyId: propertyId,
            data: apiData,
          });
          // onUpdateProperty가 호출되면 onSave는 호출하지 않음 (중복 방지)

          // 수정 완료 후 사이드바 닫기
          if (onClose) {
            onClose();
          }
        } else {
          // fallback: propertyService의 updateProperty 함수 사용
          const response = await updateProperty(propertyId, apiData);
          console.log("매물 정보 업데이트 성공:", response);

          // fallback의 경우에만 onSave 호출
          if (onSave) {
            onSave({
              ...property,
              ...formData,
              id: propertyId,
            });
          }

          // 수정 완료 후 사이드바 닫기
          if (onClose) {
            onClose();
          }
        }
      }
    } catch (error) {
      console.error("매물 정보 저장 실패:", error);
      alert("매물 정보 저장에 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  const directionOptions = [
    { value: "남향", label: "남향" },
    { value: "북향", label: "북향" },
    { value: "동향", label: "동향" },
    { value: "서향", label: "서향" },
    { value: "남서향", label: "남서향" },
    { value: "북서향", label: "북서향" },
    { value: "남동향", label: "남동향" },
    { value: "북동향", label: "북동향" },
  ];

  const expansionOptions = [
    { value: "확장", label: "확장" },
    { value: "해당 없음", label: "해당 없음" },
  ];

  const wardrobeOptions = [
    { value: "붙박이장", label: "붙박이장" },
    { value: "해당 없음", label: "해당 없음" },
  ];

  const contractStatusOptions = [
    { value: "계약 전", label: "계약 전" },
    { value: "계약 중", label: "계약 중" },
    { value: "계약 완료", label: "계약 완료" },
  ];

  // 푸터 컨텐츠 준비
  const footerContent = (
    <button
      className="modify-save-button"
      onClick={handleSave}
      disabled={isLoading}
    >
      {isLoading ? "저장 중..." : isNewProperty ? "정보 추가하기" : "수정하기"}
    </button>
  );

  return (
    <BaseSidebar
      title={`${property.apartmentName} ${property.dong}동 ${property.ho}호`}
      onClose={onClose}
      isClosing={false}
      footerContent={footerContent}
      className="property-modify-sidebar"
    >
      <div className="modify-property-image-placeholder">
        <div className="modify-floor-plan-placeholder">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={`${property.apartmentName} ${property.dong} ${property.ho}`}
              style={{
                objectFit: "contain",
                width: "100%",
                height: "100%",
                maxWidth: "100%",
                maxHeight: "100%",
              }}
            />
          ) : (
            <div className="image-loading">
              <p>이미지 로딩 중...</p>
            </div>
          )}
        </div>
      </div>

      <div className="modify-property-tags">
        <SortButton
          options={directionOptions}
          value={formData.direction}
          onChange={(val) =>
            setFormData((prev) => ({ ...prev, direction: val }))
          }
        />
        <SortButton
          options={expansionOptions}
          value={formData.expansion}
          onChange={(val) =>
            setFormData((prev) => ({ ...prev, expansion: val }))
          }
        />
        <SortButton
          options={wardrobeOptions}
          value={formData.wardrobe}
          onChange={(val) =>
            setFormData((prev) => ({ ...prev, wardrobe: val }))
          }
        />
        <SortButton
          options={contractStatusOptions}
          value={formData.status}
          onChange={(value) =>
            setFormData((prev) => ({ ...prev, status: value }))
          }
        />
      </div>

      <div className="modify-form">
        <div className="modify-form-item">
          <FormInput
            type="price"
            label="매매"
            name="salePrice"
            value={formData.salePrice || ""}
            onChange={handleChange}
          />
        </div>

        <div className="modify-form-item">
          <FormInput
            type="price"
            label="전세"
            name="jeonsePrice"
            value={formData.jeonsePrice || ""}
            onChange={handleChange}
          />
        </div>

        <div className="modify-form-item">
          <label>보증금/월세</label>
          <input
            name="deposit"
            value={`${formData.deposit || ""}/${formData.monthPrice || ""}`}
            onChange={(e) => {
              const [rent, month] = e.target.value.split("/");
              setFormData((prev) => ({
                ...prev,
                deposit: rent || "",
                monthPrice: month || "",
              }));
            }}
          />
        </div>
      </div>
      <div className="modify-info-row">
        <div className="modify-info-row-box">
          <FormInput
            type="text"
            label="소유주"
            name="ownerName"
            value={formData.ownerName || ""}
            onChange={handleChange}
          />
          <FormInput
            type="phone"
            label="소유주 연락처"
            name="ownerPhone"
            value={formData.ownerPhone || ""}
            onChange={handleChange}
          />
        </div>

        <div className="modify-info-row-box">
          <FormInput
            type="text"
            label="임차인"
            name="tenantName"
            value={formData.tenantName || ""}
            onChange={handleChange}
          />
          <FormInput
            type="phone"
            label="임차인 연락처"
            name="tenantPhone"
            value={formData.tenantPhone || ""}
            onChange={handleChange}
          />
        </div>

        <div className="modify-info-row-box">
          <FormInput
            type="date"
            label="만기일"
            name="endDate"
            placeholder="yyyy-mm-dd"
            value={formData.endDate || ""}
            onChange={handleChange}
          />
          <FormInput
            type="date"
            label="등록일"
            name="startDate"
            placeholder="yyyy-mm-dd"
            value={formData.startDate || ""}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="modify-note-section">
        <FormInput
          type="textarea"
          label="상담 내용"
          name="note1"
          value={formData.note1 || ""}
          onChange={handleChange}
          placeholder={property.memo}
          rows={8}
        />
      </div>
    </BaseSidebar>
  );
};

export default PropertyModifySidebar;
