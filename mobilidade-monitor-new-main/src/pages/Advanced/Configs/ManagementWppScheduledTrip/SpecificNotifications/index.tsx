import {
  BellOutlined,
  CarOutlined,
  EnvironmentOutlined,
  MessageOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import { Button, Col, Form, Input, Modal, Row, Select, Switch, Table, Tag } from "antd";
import { FC, ReactNode } from "react";
import { AiFillDelete, AiFillEdit } from "react-icons/ai";
import {
  AlertsStack,
  BannerAlert,
  FeatureHeadline,
  FeatureHeadlineRow,
  FormSectionDivider,
  LabelWithIcon,
} from "../management-wpp-scheduled-trip.styles";
import { filterGroupSelectOption } from "../management-wpp-scheduled-trip.helpers";
import { buildRowScopeLabel } from "./specific-notifications.helpers";
import type { SpecificNotificationRow } from "./specific-notifications.types";
import { useSpecificNotifications } from "./use-specific-notifications";

const FieldLabel: FC<{ icon: ReactNode; text: string }> = ({ icon, text }) => (
  <LabelWithIcon>
    {icon}
    {text}
  </LabelWithIcon>
);

export function SpecificNotifications() {
  const {
    form,
    rows,
    loadingRows,
    saving,
    deletingId,
    modalOpen,
    editingRow,
    errorBanner,
    groupsLoadError,
    groupsEmptyHint,
    groupSelectOptions,
    groupOptionsCount,
    tripTypeOptions,
    cityOptions,
    openCreateModal,
    openEditModal,
    closeModal,
    regenerateMessage,
    handleSubmit,
    handleDelete,
    dismissErrorBanner,
    dismissGroupsLoadError,
    dismissGroupsEmptyHint,
  } = useSpecificNotifications();

  const columns = [
    {
      title: "Grupo",
      dataIndex: "group_name",
      key: "group_name",
    },
    {
      title: "Filtro",
      key: "scope",
      render: (_: unknown, row: SpecificNotificationRow) => buildRowScopeLabel(row),
    },
    {
      title: "Status",
      key: "status",
      render: (_: unknown, row: SpecificNotificationRow) => (
        <Tag color={row.status ? "green" : "default"}>{row.status ? "Ativo" : "Inativo"}</Tag>
      ),
    },
    {
      title: "Ações",
      key: "actions",
      render: (_: unknown, row: SpecificNotificationRow) => (
        <>
          <Button type="link" onClick={() => openEditModal(row)} icon={<AiFillEdit style={{ fontSize: 18 }} />} />
          <Button
            type="link"
            danger
            loading={deletingId === row.id}
            onClick={() => handleDelete(row)}
            icon={<AiFillDelete style={{ fontSize: 18 }} />}
          />
        </>
      ),
    },
  ];

  return (
    <>
      <FormSectionDivider />
      <FeatureHeadlineRow>
        <FeatureHeadline>Notificações específicas por cidade e/ou tipo de chamado (opcional)</FeatureHeadline>
      </FeatureHeadlineRow>
      <AlertsStack>
        {errorBanner ? (
          <BannerAlert type="error" message={errorBanner} showIcon closable onClose={dismissErrorBanner} />
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
      <Button type="primary" style={{ marginBottom: 12 }} onClick={openCreateModal}>
        Nova notificação específica
      </Button>
      <Table
        dataSource={rows}
        columns={columns}
        rowKey="id"
        pagination={false}
        loading={loadingRows}
      />

      <Modal
        title={editingRow ? "Editar notificação específica" : "Nova notificação específica"}
        open={modalOpen}
        onCancel={closeModal}
        footer={null}
        destroyOnClose
        width="90%"
        style={{ maxWidth: 640 }}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            name="groupSelectValue"
            label={<FieldLabel icon={<TeamOutlined />} text="Grupo da sessão" />}
            rules={[{ required: true, message: "Selecione um grupo" }]}
          >
            <Select
              showSearch
              placeholder="Selecione o grupo"
              optionFilterProp="label"
              options={groupSelectOptions}
              filterOption={filterGroupSelectOption}
              notFoundContent={
                groupOptionsCount === 0
                  ? "Nenhum grupo listado. Confira se o WhatsApp está conectado."
                  : "Nenhum resultado para a busca"
              }
            />
          </Form.Item>
          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Form.Item
                name="cityId"
                label={<FieldLabel icon={<EnvironmentOutlined />} text="Cidade (opcional)" />}
                extra="Deixe em branco para valer em todas as cidades."
              >
                <Select
                  showSearch
                  allowClear
                  placeholder="Todas as cidades"
                  optionFilterProp="label"
                  options={cityOptions.map((c) => ({ value: c.cityId, label: c.nome }))}
                  onChange={(value) => regenerateMessage({ cityId: value ?? null })}
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                name="tripTypeId"
                label={<FieldLabel icon={<CarOutlined />} text="Tipo de chamado (opcional)" />}
                extra="Deixe em branco para valer em todos os tipos de chamado."
              >
                <Select
                  showSearch
                  allowClear
                  placeholder="Todos os tipos de chamado"
                  optionFilterProp="label"
                  options={tripTypeOptions.map((t) => ({ value: t.idTripType, label: t.type }))}
                  onChange={(value) => regenerateMessage({ tripTypeId: value ?? null })}
                />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item
            name="message"
            label={<FieldLabel icon={<MessageOutlined />} text="Mensagem" />}
            extra="Atualiza sozinha ao trocar cidade/tipo. Edite à vontade."
          >
            <Input.TextArea rows={3} />
          </Form.Item>
          <Form.Item
            name="status"
            label={<FieldLabel icon={<BellOutlined />} text="Enviar avisos automáticos" />}
            valuePropName="checked"
          >
            <Switch checkedChildren="Sim" unCheckedChildren="Não" />
          </Form.Item>
          <Form.Item style={{ textAlign: "center", marginBottom: 0 }}>
            <Button type="primary" htmlType="submit" loading={saving}>
              Salvar
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}
