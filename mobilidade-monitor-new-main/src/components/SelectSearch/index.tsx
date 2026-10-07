import { Select } from "antd";
import { UIEvent } from "react";
import styled from "styled-components";
import colors from "../../styles/colors.json";

const StyledSelect = styled(Select)`
  .ant-select-arrow .anticon-loading {
    color: ${colors.color_antd};
  }
` as typeof Select;

interface SelectSearchProps {
  onChange: (data: string) => void;
  onSearch: (data: string) => void;
  placeholder: string;
  options: DefaultOptionsSelectAntdProps[];
  loading?: boolean;
  width: string;
  value: string;
  error?: boolean;
  onPopupScroll?: (event: UIEvent<HTMLDivElement>) => void;
}

export const SelectSearch = ({
  onChange,
  onSearch,
  options,
  placeholder,
  loading,
  width,
  value,
  error,
  onPopupScroll,
}: SelectSearchProps) => {
  const filterOption = (
    input: string,
    option?: { label: string; value: string }
  ) => (option?.label ?? "").toLowerCase().includes(input.toLowerCase());
  return (
    <StyledSelect
      style={{
        width: width,
      }}
      showSearch
      placeholder={placeholder}
      optionFilterProp="children"
      onChange={onChange}
      onSearch={onSearch}
      filterOption={filterOption}
      options={options}
      loading={loading}
      value={value || undefined}
      status={Boolean(error) ? "error" : ""}
      onPopupScroll={onPopupScroll}
    />
  );
};
