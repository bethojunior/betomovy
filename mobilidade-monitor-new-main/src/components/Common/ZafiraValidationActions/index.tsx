import { Button } from "antd";
import { FC } from "react";
import { MdVerifiedUser } from "react-icons/md";
import { ZafiraValidationField } from "../ZafiraValidationField";
import { ZafiraValidationActionsProps } from "./types";
import {
  ZafiraValidationSection,
  ZafiraValidationSectionCompact,
} from "./styles";

export const ZafiraValidationActions: FC<ZafiraValidationActionsProps> = ({
  zafiraValidated,
  onValidate,
  loading,
  variant = "default",
}) => {
  const Section =
    variant === "compact"
      ? ZafiraValidationSectionCompact
      : ZafiraValidationSection;
  return (
    <Section>
      <ZafiraValidationField zafiraValidated={zafiraValidated} />
      <Button
        type="default"
        icon={<MdVerifiedUser />}
        onClick={onValidate}
        loading={loading}
      >
        Validar Cadastro
      </Button>
    </Section>
  );
};
