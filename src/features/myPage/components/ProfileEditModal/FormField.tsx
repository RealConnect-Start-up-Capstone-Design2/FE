import { INPUT_STYLE, LABEL_STYLE } from "./constants";

interface FormFieldProps {
  label: string;
  name: string;
  value: string;
  onChange: (field: string, value: string) => void;
  type?: string;
  placeholder?: string;
  readOnly?: boolean;
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
  readOnly,
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
        readOnly={readOnly}
        onClick={onClick}
        className={`${INPUT_STYLE} ${className} ${
          readOnly ? "cursor-pointer" : ""
        }`}
      />
    </div>
  );
}

