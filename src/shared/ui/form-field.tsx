import {
  INPUT_STYLE,
  LABEL_STYLE,
} from "@/features/myPage/components/ProfileEditModal/constants";

interface FormFieldProps {
  label: string;
  name: string;
  value: string;
  onChange: (field: string, value: string) => void;
  type?: string;
  placeholder?: string;
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
}

export function FormField({
  label,
  name,
  value,
  onChange,
  type = "text",
  placeholder,
  disabled,
  onClick,
  className = "",
}: FormFieldProps) {
  return (
    <div className="flex flex-col gap-[12px]">
      <label className={LABEL_STYLE}>{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(name, e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        onClick={onClick}
        className={`${INPUT_STYLE} ${className} ${
          disabled
            ? "cursor-default text-[#989898] disabled:text-[#989898] bg-[#EBEBEB] disabled:bg-[#EBEBEB]"
            : ""
        }`}
        style={
          disabled
            ? { color: "#989898", backgroundColor: "#EBEBEB" }
            : undefined
        }
      />
    </div>
  );
}
