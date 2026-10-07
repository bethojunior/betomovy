import { Dropdown, Button, DropDownProps } from "antd";

interface ButtonDropdownProps extends DropDownProps {
  titleButton: string;
  typeButton: "primary" | "default" | "dashed" | "text" | "link";
}

export const ButtonDropdown = ({
  titleButton,
  typeButton,
  ...props
}: ButtonDropdownProps) => {
  return (
    <Dropdown {...props}>
      <Button type={typeButton}>{titleButton}</Button>
    </Dropdown>
  );
};
