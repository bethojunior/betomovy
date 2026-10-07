import { EyeOutlined } from "@ant-design/icons";
import { FaTrash, FaEdit, FaBan, FaCheckCircle } from "react-icons/fa";
import type { MenuProps } from "antd";

import { ActionsDropdown } from "../../ActionsDropdown";
import { ActionsWrapper, ViewDetailsButton } from "./styles";

interface PublicityActionsProps {
  id?: number;
  statusId?: number;
  onViewDetails: (id: number) => void;
  onEdit: (id: number) => void;
  onActivate: (id: number) => void;
  onDeactivate: (id: number) => void;
  onDelete: (id: number) => void;
}

export function PublicityActions({
  id,
  statusId,
  onViewDetails,
  onEdit,
  onActivate,
  onDeactivate,
  onDelete,
}: PublicityActionsProps) {
  const isActive = statusId === 1;

  const menuItems: MenuProps["items"] = [
    {
      key: "edit",
      label: "Editar",
      icon: <FaEdit />,
      onClick: () => id && onEdit(id),
    },
    isActive
      ? {
          key: "disable",
          label: "Desativar",
          icon: <FaBan />,
          onClick: () => id && onDeactivate(id),
        }
      : {
          key: "enable",
          label: "Ativar",
          icon: <FaCheckCircle />,
          onClick: () => id && onActivate(id),
        },
    {
      key: "delete",
      label: "Excluir",
      icon: <FaTrash />,
      danger: true,
      onClick: () => id && onDelete(id),
    },
  ];

  return (
    <ActionsWrapper>
      <ViewDetailsButton
        onClick={() => id && onViewDetails(id)}
        title="Ver detalhe"
        icon={<EyeOutlined />}
        disabled={!id}
      />

      <ActionsDropdown items={menuItems} disabled={!id} />
    </ActionsWrapper>
  );
}
