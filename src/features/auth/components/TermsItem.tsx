import { Link } from "react-router-dom";

interface TermsItemProps {
  type: "service" | "privacy" | "marketing";
  title: string;
  checked: boolean;
  required?: boolean;
  onCheck: () => void;
}

export function TermsItem({
  type,
  title,
  checked,
  required = false,
  onCheck,
}: TermsItemProps) {
  return (
    <div className="flex items-center justify-between py-4">
      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          checked={checked}
          onChange={onCheck}
          className="h-5 w-5 cursor-pointer rounded border-gray-300 text-brand focus:ring-brand"
        />
        <span className="text-base text-[#222A3A]">
          {required && <span className="font-semibold text-brand">필수 </span>}
          {!required && <span className="text-gray-500">선택 </span>}
          {title}
        </span>
      </div>

      <Link
        to={`/terms/${type}`}
        className="text-sm text-gray-400 transition-colors hover:text-gray-600"
      >
        보기 →
      </Link>
    </div>
  );
}
