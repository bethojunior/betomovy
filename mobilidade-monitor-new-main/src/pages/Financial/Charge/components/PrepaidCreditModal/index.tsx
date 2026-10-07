import {
  AppstoreOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
  CreditCardOutlined,
  DollarOutlined,
  EnvironmentOutlined,
  FileTextOutlined,
  FontSizeOutlined,
  ShoppingOutlined,
  TagOutlined,
} from "@ant-design/icons";
import { Button, Checkbox, Col, Input, Modal, Row, Select } from "antd";
import { FC, ReactNode } from "react";

import Mask from "../../../../../services/Mask";
import { CompactForm as Form, LabelWithIcon, SectionTitle } from "./styles";
import { PrepaidCreditModalProps } from "./types";

const { TextArea } = Input;
const { Option } = Select;

const FieldLabel: FC<{ icon: ReactNode; text: string }> = ({ icon, text }) => (
  <LabelWithIcon>
    {icon}
    {text}
  </LabelWithIcon>
);

export function PrepaidCreditModal({
  open,
  editingPrepaid,
  form,
  loading,
  typePrePaid,
  cities,
  paymentForm,
  onCancel,
  onFinish,
  onChangeType,
}: PrepaidCreditModalProps) {
  const isEditing = editingPrepaid !== null;

  return (
    <Modal
      title={isEditing ? "Editar crédito pré-pago" : "Adicionar crédito pré-pago"}
      open={open}
      footer={null}
      onCancel={onCancel}
      destroyOnClose
      width="90%"
      style={{ maxWidth: 960 }}
      styles={{ body: { maxHeight: "70vh", overflowY: "auto", overflowX: "hidden", paddingRight: 8 } }}
    >
      <Form form={form} onFinish={onFinish} layout="vertical" name="form">
        <SectionTitle>Identificação</SectionTitle>
        <Row gutter={[24, 0]}>
          <Col xs={24} sm={8}>
            <Form.Item
              name="stripe"
              label={<FieldLabel icon={<TagOutlined />} text="Tarjeta" />}
              rules={[{ required: true, message: "Insira a tarjeta do pré-pago" }]}
            >
              <Input type="text" />
            </Form.Item>
          </Col>
          <Col xs={24} sm={8}>
            <Form.Item
              name="title"
              label={<FieldLabel icon={<FontSizeOutlined />} text="Título" />}
              rules={[{ required: true, message: "Insira o título do pré-pago" }]}
            >
              <Input type="text" />
            </Form.Item>
          </Col>
          <Col xs={24} sm={8}>
            <Form.Item
              name="subtitle"
              label={<FieldLabel icon={<FontSizeOutlined />} text="Sub-título" />}
              rules={[
                { required: true, message: "Insira o sub-título do pré-pago" },
              ]}
            >
              <Input type="text" />
            </Form.Item>
          </Col>
        </Row>

        <SectionTitle>Configuração</SectionTitle>
        <Row gutter={[24, 0]}>
          <Col xs={24} sm={12}>
            <Form.Item
              name="city"
              label={<FieldLabel icon={<EnvironmentOutlined />} text="Cidade" />}
            >
              <Select
                defaultValue={0}
                onChange={(e) => {
                  form.setFieldValue("city", e);
                }}
              >
                <Option key={0} value={0}>
                  Todas
                </Option>
                {cities?.map((city) => (
                  <Option key={city.cityId} value={city.cityId}>
                    {city.nome}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item
              name="type"
              label={<FieldLabel icon={<AppstoreOutlined />} text="Tipo de pré-pago" />}
            >
              <Select
                defaultValue="value"
                onChange={(e) => {
                  form.setFieldValue("type", e);
                  onChangeType(e);
                }}
              >
                <Option key={0} value="value">
                  Saldo
                </Option>
                <Option key={1} value="perPeriod">
                  Período
                </Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <SectionTitle>Valores</SectionTitle>
        <Row gutter={[24, 0]}>
          <Col xs={24} sm={12}>
            <Form.Item
              name="valueBuy"
              initialValue="0,00"
              label={
                <FieldLabel
                  icon={<DollarOutlined />}
                  text="Valor de venda = (Valor que o usuário irá pagar)"
                />
              }
              rules={[
                {
                  required: typePrePaid === "value",
                  message: "Insira o valor a ser pago",
                },
              ]}
            >
              <Input
                value={form.getFieldValue("valueBuy")}
                onChange={(e) => {
                  form.setFieldValue(
                    "valueBuy",
                    Mask.setMaskMoney(e.target.value)
                  );
                }}
              />
            </Form.Item>
          </Col>

          <Col xs={24} sm={12}>
            {typePrePaid === "value" ? (
              <Form.Item
                name="valueGain"
                initialValue="0,00"
                label={
                  <FieldLabel
                    icon={<ShoppingOutlined />}
                    text="Valor da compra - (Valor que o usuário irá contratar)"
                  />
                }
                rules={[
                  { required: true, message: "Insira o valor a ser contratado" },
                ]}
              >
                <Input
                  value={form.getFieldValue("valueGain")}
                  onChange={(e) => {
                    form.setFieldValue(
                      "valueGain",
                      Mask.setMaskMoney(e.target.value)
                    );
                  }}
                />
              </Form.Item>
            ) : null}
          </Col>
        </Row>

        {typePrePaid !== "value" && (
          <Row gutter={[24, 0]}>
            <Col xs={24} sm={12}>
              <Form.Item
                name="quantityDaysSold"
                initialValue="0"
                label={
                  <FieldLabel
                    icon={<CalendarOutlined />}
                    text="Dias Contratados - (Quantidade que o usuário irá contratar)"
                  />
                }
                rules={[
                  {
                    required: typePrePaid === "perPeriod",
                    message: "Insira a quantidade de dias",
                  },
                ]}
              >
                <Input type="number" min={0} />
              </Form.Item>
            </Col>

            <Col xs={24} sm={12}>
              <Form.Item
                name="quantityDaysPurchased"
                initialValue="0"
                label={
                  <FieldLabel
                    icon={<ClockCircleOutlined />}
                    text="Dias Liberados - (Quantidade que o usuário irá pagar)"
                  />
                }
                rules={[
                  {
                    required: typePrePaid === "perPeriod",
                    message: "Insira a quantidade de dias",
                  },
                ]}
              >
                <Input type="number" min={0} />
              </Form.Item>
            </Col>
          </Row>
        )}

        <SectionTitle>Pagamento</SectionTitle>
        <Form.Item
          name="paymentForm"
          label={<FieldLabel icon={<CreditCardOutlined />} text="Formas de pagamento" />}
          rules={[
            {
              required: true,
              message: "Insira, no mínimo, uma forma de pagamento",
            },
          ]}
        >
          <Checkbox.Group>
            <Row gutter={[16, 8]}>
              {paymentForm?.map((item) => (
                <Col xs={24} sm={12} md={8} key={item.idPaymentForm}>
                  <Checkbox value={item.idPaymentForm}>{item.name}</Checkbox>
                </Col>
              ))}
            </Row>
          </Checkbox.Group>
        </Form.Item>

        <Form.Item
          name="dataPayment"
          label={<FieldLabel icon={<FileTextOutlined />} text="Dados de pagamento" />}
        >
          <TextArea rows={4} />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            {isEditing ? "Salvar" : "Criar"}
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
}
