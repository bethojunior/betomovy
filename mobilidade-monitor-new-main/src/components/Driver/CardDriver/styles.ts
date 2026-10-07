export {
  LabelText,
  Text,
  StatusBadge,
  Card,
  HeaderRow,
  HeaderTitle,
  SettingsButton,
  TopRow,
  CardBody,
  SectionCard,
  SectionTitleRow,
  SectionFieldsGrid,
  FieldRow,
  FieldIcon,
  Field,
  FieldLabel,
  FieldValue,
} from "../../Utils/EntityCard/styles";

export const DRIVER_STATUS_BACKGROUND_COLOR: Record<string, string> = {
  ATIVO: "#3CE64AFF",
  BLOQUEADO: "#E0142CFF",
  "BLACK LIST": "#E0142CFF",
  PENDENTE: "#EB6D13FF",
};

export const DRIVER_STATUSES_WITH_WHITE_TEXT = [
  "PENDENTE",
  "ATIVO",
  "BLOQUEADO",
  "BLACK LIST",
];
