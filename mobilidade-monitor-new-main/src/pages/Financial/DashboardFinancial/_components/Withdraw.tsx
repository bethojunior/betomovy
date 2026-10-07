import { useState } from "react";
import styled from "styled-components";
import { IoArrowDownSharp } from "react-icons/io5";
import { Button, Col, Form, Input, Modal, Row, Select, message } from "antd";
import { useFinancial, type CreateWithdrawalPayload } from "../../../../hooks/useFinancial";
import Session from "../../../../utils/Session";

const Container = styled.div`
  padding: 16px 8px;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.p<{ $isDark: boolean }>`
  font-size: 12px;
  line-height: 16px;
  font-weight: 700;
  color: ${({ $isDark }) =>
    $isDark ? "rgba(255,255,255,0.6)" : "#9ca3af"};
  margin: 0;
`;

const Balance = styled.h1<{ $isDark: boolean }>`
  font-size: 32px;
  line-height: 40px;
  font-weight: 700;
  color: ${({ $isDark }) =>
    $isDark ? "#ffffff" : "#0f172a"};
`;

const WithdrawButton = styled.button<{ $isDark: boolean }>`
  margin-top: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  padding: 10px 16px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  font-weight: 600;
  font-size: 14px;

  background-color: ${({ $isDark }) =>
    $isDark ? "#1f2937" : "#000"};
  color: white;

  transition: all 0.2s ease;

  &:hover {
    opacity: 0.85;
  }
`;

const IconWrapper = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;

  svg {
    width: 20px;
    height: 20px;
    transform: rotate(180deg);
  }
`;

type WithdrawProps = {
  theme?: "dark" | "light";
  onCreated?: () => void;
  balance?: number;
};

type WithdrawFormValues = Omit<
  CreateWithdrawalPayload,
  "customer_id" | "type" | "status" | "external_id"
>;

export function Withdraw({ theme = "dark", onCreated, balance = 0 }: WithdrawProps) {
  const isDark = theme === "dark";
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [receiveMethod, setReceiveMethod] = useState<"pix" | "bank">("pix");
  const [form] = Form.useForm<WithdrawFormValues>();
  const { createWithdrawal, customers } = useFinancial();

  const formatPhone = (value?: string) => {
    const digits = (value || "").replace(/\D/g, "").slice(0, 11);

    if (digits.length <= 2) return digits;
    if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
    if (digits.length <= 10) {
      return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
    }

    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
  };

  const parseCurrency = (value: unknown): number => {
    const digits = String(value ?? "").replace(/\D/g, "");
    if (!digits) return 0;
    return Number((Number(digits) / 100).toFixed(2));
  };

  const formatCurrency = (value: unknown): string => {
    if (value === undefined || value === null || value === "") return "";
    const num = typeof value === "number" ? value : parseCurrency(value);
    return num.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  };

  const handleRequestWithdraw = async (values: WithdrawFormValues) => {
    setLoading(true);
    try {
      const customer = await customers.getProjectCustomer();

      if (!customer?.id) {
        message.error("Não foi possível identificar o customer do projeto.");
        return;
      }

      const loggedUser = Session.getLocal("@App:user");
      const userId = Number(loggedUser?.idUser);

      if (!userId) {
        message.error("Não foi possível identificar o usuário logado.");
        return;
      }

      await createWithdrawal({
        ...values,
        customer_id: customer.id,
        type: "manager",
        status: "pending",
        bank_account: receiveMethod === "pix" ? null : values.bank_account || null,
        pix_key: receiveMethod === "pix" ? values.pix_key || null : null,
      });

      message.success("Solicitação de saque enviada com sucesso.");
      setOpen(false);
      setReceiveMethod("pix");
      form.resetFields();
      onCreated?.();
    } catch (error) {
      console.error("Erro ao criar solicitação de saque:", error);
      message.error("Erro ao solicitar saque.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <Label $isDark={isDark}>SALDO DISPONÍVEL</Label>

      <Balance $isDark={isDark}>
        {balance.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
      </Balance>

      <WithdrawButton
        $isDark={isDark}
        onClick={() => setOpen(true)}
        disabled={loading}
      >
        <IconWrapper>
          <IoArrowDownSharp />
        </IconWrapper>
        {loading ? "Solicitando..." : "Solicitar Saque"}
      </WithdrawButton>

      <Modal
        open={open}
        title="Solicitar Saque"
        onCancel={() => setOpen(false)}
        destroyOnClose
        width={720}
        footer={[
          <Button key="cancel" onClick={() => setOpen(false)}>
            Cancelar
          </Button>,
          <Button
            key="submit"
            type="primary"
            loading={loading}
            onClick={() => form.submit()}
          >
            Solicitar saque
          </Button>,
        ]}
      >
        <Form<WithdrawFormValues>
          form={form}
          layout="vertical"
          initialValues={{
            amount: 0,
            recipient_name: "",
            recipient_phone: "",
            recipient_document: "",
            bank_account: null,
            pix_key: "",
          }}
          onFinish={handleRequestWithdraw}
        >
          <div
            style={{
              marginBottom: 12,
              fontSize: 12,
              color: "#6b7280",
            }}
          >
            Os campos com <span style={{ color: "#ff4d4f" }}>*</span> são obrigatórios.
          </div>

          <Row gutter={12}>
            <Col xs={24} md={12}>
              <Form.Item label="Tipo de recebimento">
                <Select
                  value={receiveMethod}
                  onChange={(value: "pix" | "bank") => {
                    setReceiveMethod(value);
                    if (value === "pix") {
                      form.setFieldValue("bank_account", null);
                    } else {
                      form.setFieldValue("pix_key", "");
                    }
                  }}
                  options={[
                    { label: "PIX", value: "pix" },
                    { label: "Conta bancária", value: "bank" },
                  ]}
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                label="Valor"
                name="amount"
                rules={[
                  { required: true, message: "Informe o valor" },
                  {
                    validator: (_, value) => {
                      if (value <= 0) {
                        return Promise.reject(new Error("O valor deve ser maior que zero"));
                      }
                      if (value > balance) {
                        return Promise.reject(new Error("O valor não pode ser maior que o saldo disponível"));
                      }
                      return Promise.resolve();
                    },
                  },
                ]}
                normalize={(value) => parseCurrency(value)}
                getValueProps={(value) => ({ value: formatCurrency(value) })}
              >
                <Input
                  style={{ width: "100%" }}
                  placeholder="R$ 0,00"
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={12}>
            <Col xs={24}>
              <Form.Item
                label="Nome do destinatário"
                name="recipient_name"
                rules={[{ required: true, message: "Informe o nome" }]}
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={12}>
            <Col xs={24}>
              {receiveMethod === "pix" ? (
                <Form.Item
                  label="Chave PIX"
                  name="pix_key"
                  rules={[{ required: true, message: "Informe a chave PIX" }]}
                >
                  <Input />
                </Form.Item>
              ) : (
                <Form.Item
                  label="Conta bancária"
                  name="bank_account"
                  rules={[{ required: true, message: "Informe a conta bancária" }]}
                >
                  <Input />
                </Form.Item>
              )}
            </Col>
          </Row>

          <Row gutter={12}>
            <Col xs={24} md={12}>
              <Form.Item
                label="Telefone do destinatário"
                name="recipient_phone"
                rules={[
                  { required: true, message: "Informe o telefone" },
                  {
                    validator: (_, value) => {
                      const digits = String(value || "").replace(/\D/g, "");
                      if (digits.length === 10 || digits.length === 11) {
                        return Promise.resolve();
                      }
                      return Promise.reject(
                        new Error("Telefone deve ter 10 ou 11 dígitos")
                      );
                    },
                  },
                ]}
              >
                <Input
                  placeholder="(11) 99999-9999"
                  onChange={(event) => {
                    form.setFieldValue(
                      "recipient_phone",
                      formatPhone(event.target.value)
                    );
                  }}
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                label="Documento do destinatário"
                name="recipient_document"
                rules={[{ required: true, message: "Informe o documento" }]}
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </Container>
  );
}
