import { Search } from "lucide-react";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from "@/components/ui/input-group";
import {
  DropdownMenu,
  type DropdownOption,
} from "@/components/ui/dropdown-menu";

export type CertificationStatus =
  | "all"
  | "approved"
  | "pending"
  | "rejected"
  | "not_certified";

interface AdminFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  certificationStatus: CertificationStatus;
  onStatusChange: (status: CertificationStatus) => void;
}

const statusOptions: DropdownOption[] = [
  { label: "전체", value: "all" },
  { label: "승인", value: "approved" },
  { label: "승인 대기", value: "pending" },
  { label: "반려", value: "rejected" },
  { label: "인증 전", value: "not_certified" },
];

export function AdminFilters({
  searchQuery,
  onSearchChange,
  certificationStatus,
  onStatusChange,
}: AdminFiltersProps) {
  return (
    <div className="flex items-center gap-3">
      {/* 필터 버튼? 이거 의도가 뭐지? */}
      <button className="h-[42px] px-[15px] bg-[#1B1B1B] text-white rounded-lg flex items-center justify-center text-[15px] font-semibold leading-[1.193] tracking-[-0.025em] shadow-[0px_0px_25px_-10px_rgba(177,182,199,1)]">
        필터
      </button>

      {/* 인증 상태 드롭다운 */}
      <DropdownMenu
        options={statusOptions}
        value={certificationStatus}
        onChange={(value) => onStatusChange(value as CertificationStatus)}
        placeholder="인증 상태"
        buttonClassName="h-[42px] px-[15px] bg-white border-[rgba(177,182,199,0.4)] rounded-lg text-[15px] font-semibold leading-[1.193] tracking-[-0.025em] text-[#1B1B1B] shadow-[0px_0px_25px_-10px_rgba(177,182,199,1)] min-w-[108px]"
        listClassName="bg-white border-[rgba(177,182,199,0.4)] shadow-[0px_0px_25px_-10px_rgba(177,182,199,1)]"
        optionClassName="text-[15px] font-medium leading-[1.193] tracking-[-0.025em] hover:bg-gray-100"
        selectedTextColor="text-[#1B1B1B]"
        placeholderTextColor="text-[#1B1B1B]"
        className="min-w-[108px]"
      />

      {/* 전화번호 검색 */}
      <InputGroup className="w-[363px] h-[42px] shadow-[0px_0px_25px_-10px_rgba(177,182,199,1)]">
        <InputGroupAddon align="inline-start">
          <InputGroupText>
            <Search className="text-[#989898]" />
          </InputGroupText>
        </InputGroupAddon>
        <InputGroupInput
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="전화번호 검색"
          className="text-[15px] font-medium leading-[1.193] tracking-[-0.025em] text-[#1B1B1B] placeholder:text-[#989898]"
        />
      </InputGroup>
    </div>
  );
}
