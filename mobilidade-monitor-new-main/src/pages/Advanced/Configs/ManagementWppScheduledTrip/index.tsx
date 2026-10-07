import { Button, Form, Select, Spin, Switch } from "antd";
import {
  AlertsStack,
  BannerAlert,
  CenteredColumn,
  Content,
  FeatureHeadline,
  FeatureHeadlineRow,
  FormSectionDivider,
  LoadingWrap,
  MainCard,
  SaveActionsFormItem,
} from "./management-wpp-scheduled-trip.styles";
import { buildManagementConfigTitle, filterGroupSelectOption } from "./management-wpp-scheduled-trip.helpers";
import { useManagementWppScheduledTrip } from "./use-management-wpp-scheduled-trip";
import { SpecificNotifications } from "./SpecificNotifications";

export function ManagementWppScheduledTrip() {
  const {
    form,
    loadingPage,
    saving,
    activeRow,
    whatsappMainSelectValue,
    onWhatsappMainSelectChange,
    errorBanner,
    groupsLoadError,
    groupsEmptyHint,
    selectOptions,
    groupOptionsCount,
    handleSubmit,
    dismissErrorBanner,
    dismissGroupsLoadError,
    dismissGroupsEmptyHint,
  } = useManagementWppScheduledTrip();

  if (loadingPage) {
    return (
      <LoadingWrap>
        <Spin size="large" />
      </LoadingWrap>
    );
  }

  const configTitle: string = activeRow ? buildManagementConfigTitle(activeRow) : "";

  return (
    <Content>
      <CenteredColumn>
        <AlertsStack>
          {errorBanner ? (
            <BannerAlert
              type="error"
              message={errorBanner}
              showIcon
              closable
              onClose={dismissErrorBanner}
            />
          ) : null}
          {groupsLoadError ? (
            <BannerAlert
              type="error"
              message="Não foi possível carregar os grupos do WhatsApp."
              description={groupsLoadError}
              showIcon
              closable
              onClose={dismissGroupsLoadError}
            />
          ) : null}
          {!groupsLoadError && groupsEmptyHint ? (
            <BannerAlert type="warning" message={groupsEmptyHint} showIcon closable onClose={dismissGroupsEmptyHint} />
          ) : null}
        </AlertsStack>
        {!activeRow ? (
          <BannerAlert
            type="info"
            showIcon
            message="Não encontramos esta configuração agora."
            description="Atualize a página ou tente novamente em instantes. Se continuar assim, fale com o suporte."
          />
        ) : (
          <MainCard bordered title="Notificações de viagem">
            <FeatureHeadlineRow>
              <FeatureHeadline>{configTitle}</FeatureHeadline>
            </FeatureHeadlineRow>
            <FormSectionDivider />
            <Form form={form} layout="vertical" onFinish={handleSubmit} requiredMark={false}>
              <Form.Item
                label="Grupo da sessão"
                extra="Lista obtida do WhatsApp conectado (menu Conectar whatsapp). Se estiver vazia, confira a sessão e recarregue a página."
              >
                <Select
                  size="middle"
                  showSearch
                  allowClear
                  placeholder="Selecione o grupo"
                  optionFilterProp="label"
                  options={selectOptions}
                  value={whatsappMainSelectValue}
                  onChange={(v) => onWhatsappMainSelectChange(v as string | null | undefined)}
                  filterOption={filterGroupSelectOption}
                  notFoundContent={
                    groupOptionsCount === 0
                      ? "Nenhum grupo listado. Confira se o WhatsApp está conectado em “Conectar whatsapp”."
                      : "Nenhum resultado para a busca"
                  }
                  listHeight={280}
                />
              </Form.Item>
              <Form.Item
                name="status"
                label="Enviar avisos automáticos"
                valuePropName="checked"
                extra="Quando desligado, nenhum aviso automático é enviado para o grupo configurado."
              >
                <Switch checkedChildren="Sim" unCheckedChildren="Não" disabled={!activeRow} />
              </Form.Item>
              <SaveActionsFormItem>
                <Button type="primary" htmlType="submit" loading={saving} disabled={!activeRow}>
                  Salvar alterações
                </Button>
              </SaveActionsFormItem>
            </Form>
            <SpecificNotifications />
          </MainCard>
        )}
      </CenteredColumn>
    </Content>
  );
}
