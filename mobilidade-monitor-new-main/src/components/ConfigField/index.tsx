import { Input, Select } from "antd";

type SelectOption = { label: string; value: string };

type Props = {
  type: string | null;
  value: unknown;
  options?: SelectOption[];
  placeholder?: string;
  onChange: (value: string) => void;
};

const parseMultiValue = (val: unknown): string[] => {
  if (!val) return [];
  if (Array.isArray(val)) return val;
  if (typeof val !== "string") return [];

  try {
    const parsed = JSON.parse(val);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return val.split(",").filter(Boolean);
  }
};

export const ConfigField = ({ type, value, options = [], placeholder, onChange }: Props) => {
  if (type === "multi-select") {
    return (
      <Select
        mode="multiple"
        style={{ width: "100%" }}
        options={options}
        value={parseMultiValue(value)}
        placeholder={placeholder || "Selecione uma opção"}
        onChange={(selected: string[]) => onChange(JSON.stringify(selected))}
      />
    );
  }

  return (
    <Input
      defaultValue={value as string}
      placeholder={placeholder || "Digite um valor"}
      onChange={(e) => onChange(e.target.value)}
    />
  );
};
