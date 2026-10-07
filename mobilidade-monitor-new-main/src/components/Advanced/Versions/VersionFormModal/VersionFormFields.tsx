import { Select, Input } from "antd";

import { ContentInput, LabelInput, FullWidthSelect } from "./styles";
import { MONITOR_DRIVER } from "../../../../constants/monitorApps";
import { AppOption, VersionFormValues } from "./types";

interface VersionFormFieldsProps {
  values: VersionFormValues;
  listApps: AppOption[];
  onAppChange: (idApp: string) => void;
  onFieldChange: (field: "platform" | "linkApp" | "versionApp", value: string) => void;
}

export const VersionFormFields = ({
  values,
  listApps,
  onAppChange,
  onFieldChange,
}: VersionFormFieldsProps) => (
  <>
    <ContentInput>
      <LabelInput>Escolha o app</LabelInput>
      <FullWidthSelect
        value={values.idApp !== null ? Number(values.idApp) : undefined}
        onChange={(value) => onAppChange(String(value))}
        options={listApps}
      />
    </ContentInput>

    <ContentInput>
      <LabelInput>Plataforma</LabelInput>
      <FullWidthSelect
        value={values.platform}
        onChange={(value) => onFieldChange("platform", value as string)}
      >
        <Select.Option value="android">Android</Select.Option>
        {values.idApp !== String(MONITOR_DRIVER) && (
          <Select.Option value="ios">Ios</Select.Option>
        )}
      </FullWidthSelect>
    </ContentInput>

    <ContentInput>
      <LabelInput>Link do app na loja</LabelInput>
      <Input
        value={values.linkApp}
        onChange={(event) => onFieldChange("linkApp", event.target.value)}
        placeholder="https://link.com.br"
      />
    </ContentInput>

    <ContentInput>
      <LabelInput>Versão</LabelInput>
      <Input
        value={values.versionApp}
        onChange={(event) => onFieldChange("versionApp", event.target.value)}
        placeholder="Ex: 1.0.0"
      />
    </ContentInput>
  </>
);
