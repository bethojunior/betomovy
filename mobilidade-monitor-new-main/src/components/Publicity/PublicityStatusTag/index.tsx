import { StatusTag } from "./styles";

interface PublicityStatusTagProps {
  statusId: number;
}

export function PublicityStatusTag({ statusId }: PublicityStatusTagProps) {
  const isActive = statusId === 1;

  return (
    <StatusTag color={isActive ? "green" : "red"}>
      {isActive ? "Ativo" : "Desativado"}
    </StatusTag>
  );
}
