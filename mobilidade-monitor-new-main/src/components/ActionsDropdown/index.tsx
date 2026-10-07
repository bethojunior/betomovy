import { Button, Dropdown } from "antd";
import { MoreOutlined } from "@ant-design/icons";
import type { MenuProps } from "antd";

interface ActionsDropdownProps {
  items: MenuProps["items"];
  disabled?: boolean;
}

export function ActionsDropdown({ items, disabled }: ActionsDropdownProps) {
  return (
    <Dropdown menu={{ items }} trigger={["click"]} disabled={disabled}>
      <Button icon={<MoreOutlined />} title="Mais ações" />
    </Dropdown>
  );
}
