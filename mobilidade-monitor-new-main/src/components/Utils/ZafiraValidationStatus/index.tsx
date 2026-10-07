import { FC } from "react";
import { MdVerified, MdVerifiedUser } from "react-icons/md";
import { ZafiraStatusBadge } from "./styles";

interface ZafiraValidationStatusProps {
  zafiraValidated?: number;
}

export const ZafiraValidationStatus: FC<ZafiraValidationStatusProps> = ({
  zafiraValidated,
}) => {
  const isValidated = zafiraValidated === 1;

  return (
    <ZafiraStatusBadge $isValidated={isValidated}>
      {isValidated ? (
        <>
          <MdVerified size={14} />
          Validado
        </>
      ) : (
        <>
          <MdVerifiedUser size={14} />
          Não validado
        </>
      )}
    </ZafiraStatusBadge>
  );
};
