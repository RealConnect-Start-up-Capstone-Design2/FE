import type { propertyFieldDefaults } from "../constants/propertyConstants";
import type {
  ManageType,
  PropertyStatus,
  RequestType,
} from "../stores/propertyStore";

/**
 * 매물 필드 키 타입
 */
export type PropertyFieldKey = keyof typeof propertyFieldDefaults;

/**
 * 드롭다운 로컬 상태 타입
 */
export type DropdownState = {
  manageType?: ManageType;
  requestType?: RequestType;
  propertyStatus?: PropertyStatus;
};
