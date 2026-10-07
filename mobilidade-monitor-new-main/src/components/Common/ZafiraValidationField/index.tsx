import { FC } from "react";
import { ZafiraValidationStatus } from "../../Utils/ZafiraValidationStatus";
import { ZafiraValidationFieldProps } from "./types";

export const ZafiraValidationField: FC<ZafiraValidationFieldProps> = ({
  zafiraValidated,
  label = "Validação Zafira:",
}) => (
  <div>
    {label ? <span>{label} </span> : null}
    <ZafiraValidationStatus zafiraValidated={zafiraValidated} />
  </div>
);
