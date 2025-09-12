import React, { useState } from "react";
import BaseSidebar from "./BaseSidebar";

/**
 * 상세 정보 표시를 위한 공통 사이드바 컴포넌트
 * DetailSidebar들의 공통 패턴을 추상화
 *
 * @param {string} title - 사이드바 제목
 * @param {function} onClose - 닫기 콜백
 * @param {boolean} isClosing - 닫히는 중 상태
 * @param {React.ReactNode} children - 상세 내용 컴포넌트
 * @param {Array} actions - 액션 버튼 배열
 * @param {React.Component} editComponent - 편집 모드 컴포넌트
 * @param {string} editPropName - 편집 컴포넌트에 전달할 명시적 prop 이름 (예: "property", "inquiry")
 * @param {function} onUpdate - 업데이트 콜백
 * @param {Object} data - 편집할 데이터
 * @param {string} className - 추가 CSS 클래스
 */
const DetailSidebar = ({
  title,
  onClose,
  isClosing = false,
  children,
  actions = [],
  editComponent: EditComponent = null,
  editPropName = null, // 명시적 prop 이름 (null이면 기존 방식 사용)
  onUpdate,
  data,
  className = "",
}) => {
  const [isEditMode, setIsEditMode] = useState(false);

  // 편집 모드일 때는 편집 컴포넌트 렌더링
  if (isEditMode && EditComponent) {
    // 명시적 prop 이름이 있으면 사용, 없으면 기존 추론 방식 사용 (하위 호환성)
    const propName = editPropName || getDataPropName(EditComponent);

    // 디버깅을 위한 로그 (프로덕션에서 문제 추적 가능)
    console.log("DetailSidebar editMode:", {
      editPropName,
      propName,
      componentName: EditComponent?.name,
      hasData: !!data,
    });

    return (
      <EditComponent
        {...{ [propName]: data }}
        onClose={() => setIsEditMode(false)}
        onSave={(updatedData) => {
          if (onUpdate) onUpdate(updatedData);
          setIsEditMode(false);
        }}
        isClosing={isClosing}
      />
    );
  }

  // 액션 버튼들을 푸터로 렌더링
  const footerContent = actions.length > 0 && (
    <div className="action-buttons">
      {(() => {
        // group 속성에 따라 버튼들을 그룹화
        const groupedActions = actions.reduce((acc, action, index) => {
          const group = action.group || "main";
          if (!acc[group]) acc[group] = [];
          acc[group].push({ ...action, originalIndex: index });
          return acc;
        }, {});

        const elements = [];

        // main 그룹 먼저 렌더링
        if (groupedActions.main) {
          groupedActions.main.forEach((action) => {
            elements.push(
              <button
                key={`main-${action.originalIndex}`}
                className={action.className || "primary-button"}
                onClick={() => {
                  if (action.type === "edit") {
                    setIsEditMode(true);
                  } else if (action.onClick) {
                    action.onClick();
                  }
                }}
                disabled={action.disabled}
              >
                {action.label}
              </button>
            );
          });
        }

        // 다른 그룹들을 button-group으로 렌더링
        Object.entries(groupedActions).forEach(([groupName, groupActions]) => {
          if (groupName !== "main") {
            elements.push(
              <div key={`group-${groupName}`} className="button-group">
                {groupActions.map((action) => (
                  <button
                    key={`${groupName}-${action.originalIndex}`}
                    className={action.className || "secondary-button"}
                    onClick={() => {
                      if (action.type === "edit") {
                        setIsEditMode(true);
                      } else if (action.onClick) {
                        action.onClick();
                      }
                    }}
                    disabled={action.disabled}
                  >
                    {action.label}
                  </button>
                ))}
              </div>
            );
          }
        });

        return elements;
      })()}
    </div>
  );

  return (
    <BaseSidebar
      title={title}
      onClose={onClose}
      isClosing={isClosing}
      footerContent={footerContent}
      className={className}
    >
      {children}
    </BaseSidebar>
  );
};

/**
 * 편집 컴포넌트의 데이터 prop 이름을 추론
 * 예: ContractModifySidebar -> contract, InquiryModifySidebar -> inquiry
 */
function getDataPropName(EditComponent) {
  if (!EditComponent?.name) return "data";

  const componentName = EditComponent.name.toLowerCase();
  if (componentName.includes("contract")) return "contract";
  if (componentName.includes("inquiry")) return "inquiry";
  if (componentName.includes("property")) return "property";
  return "data";
}

export default DetailSidebar;
