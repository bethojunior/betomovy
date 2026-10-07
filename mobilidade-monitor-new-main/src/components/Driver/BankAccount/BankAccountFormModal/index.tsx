import { useEffect } from "react";
import { Form, Input, Modal, Select } from "antd";
import { BsBank2 } from "react-icons/bs";

import pixIcon from "../../../../assets/pix.svg";
import { useBanks } from "../hooks/useBanks";
import { useUpdateDriverBankAccount } from "../hooks/useUpdateDriverBankAccount";
import { DriverBankAccountPayload } from "../types";
import { ACCOUNT_TYPE_LABEL, PIX_TYPE_LABEL, maskDocument } from "../utils";
import { Hint, PixIcon, Row, SectionTitle } from "./styles";
import { BankAccountFormModalProps, BankAccountFormValues } from "./types";

const ACCOUNT_TYPE_OPTIONS = Object.entries(ACCOUNT_TYPE_LABEL).map(([value, label]) => ({ value, label }));
const PIX_TYPE_OPTIONS = Object.entries(PIX_TYPE_LABEL).map(([value, label]) => ({ value, label }));

// Campo vazio vai como null para limpar o valor no banco
const emptyToNull = (value?: string | number | null) => (value === "" || value === undefined ? null : value);

const toPayload = (values: BankAccountFormValues): DriverBankAccountPayload => ({
  holderName: values.holderName.trim(),
  document: values.document.replace(/\D/g, ""),
  bankId: (emptyToNull(values.bankId) as number | null) ?? null,
  typeAccount: values.typeAccount ?? null,
  agency: emptyToNull(values.agency) as string | null,
  agencyDigit: emptyToNull(values.agencyDigit) as string | null,
  numberAccount: emptyToNull(values.numberAccount) as string | null,
  numberAccountDigit: emptyToNull(values.numberAccountDigit) as string | null,
  op: emptyToNull(values.op) as string | null,
  pixType: values.pixType ?? null,
  pix: emptyToNull(values.pix?.trim()) as string | null,
});

export const BankAccountFormModal = ({ visible, driverId, account, onClose, onSaved }: BankAccountFormModalProps) => {
  const [form] = Form.useForm<BankAccountFormValues>();
  const { banks, loading: loadingBanks } = useBanks(visible);
  const { save, saving } = useUpdateDriverBankAccount(driverId);
  const bankId = Form.useWatch("bankId", form);
  const pix = Form.useWatch("pix", form);

  // Cada abertura parte dos dados atuais do motorista
  useEffect(() => {
    if (!visible) return;
    form.resetFields();
    form.setFieldsValue({
      holderName: account?.holderName ?? "",
      document: maskDocument(account?.document ?? ""),
      bankId: account?.bankId ?? undefined,
      typeAccount: account?.typeAccount ?? undefined,
      agency: account?.agency ?? "",
      agencyDigit: account?.agencyDigit ?? "",
      numberAccount: account?.numberAccount ?? "",
      numberAccountDigit: account?.numberAccountDigit ?? "",
      op: account?.op ?? "",
      pixType: account?.pixType ?? undefined,
      pix: account?.pix ?? "",
    });
  }, [visible, account, form]);

  const handleSubmit = async () => {
    const values = await form.validateFields();
    const saved = await save(toPayload(values));
    if (saved) {
      onSaved();
      onClose();
    }
  };

  const hasBank = !!bankId;
  const hasPix = !!pix?.trim();
  const destinationRule = {
    validator: () =>
      hasBank || hasPix ? Promise.resolve() : Promise.reject(new Error("Informe uma conta bancária ou uma chave Pix")),
  };

  return (
    <Modal
      open={visible}
      title="Editar dados bancários"
      okText="Salvar"
      cancelText="Cancelar"
      confirmLoading={saving}
      onOk={handleSubmit}
      onCancel={onClose}
      width={640}
      destroyOnClose
    >
      <Form form={form} layout="vertical" requiredMark={false}>
        <Row>
          <Form.Item name="holderName" label="Titular" rules={[{ required: true, message: "Informe o titular" }]}>
            <Input maxLength={150} />
          </Form.Item>
          <Form.Item
            name="document"
            label="CPF/CNPJ do titular"
            getValueFromEvent={event => maskDocument(event.target.value)}
            rules={[
              {
                validator: (_, value?: string) => {
                  const digits = (value ?? "").replace(/\D/g, "");
                  return digits.length === 11 || digits.length === 14
                    ? Promise.resolve()
                    : Promise.reject(new Error("CPF ou CNPJ inválido"));
                },
              },
            ]}
          >
            <Input inputMode="numeric" />
          </Form.Item>
        </Row>

        <SectionTitle>
          <BsBank2 size={16} />
          Conta bancária
        </SectionTitle>
        <Hint>Preencha a conta bancária, a chave Pix ou as duas.</Hint>
        <Row>
          <Form.Item name="bankId" label="Banco" dependencies={["pix"]} rules={[destinationRule]}>
            <Select
              allowClear
              showSearch
              loading={loadingBanks}
              optionFilterProp="label"
              options={banks.map(bank => ({ value: bank.idBank, label: `${bank.bankNumber} - ${bank.bankName}` }))}
            />
          </Form.Item>
          <Form.Item name="typeAccount" label="Tipo de conta">
            <Select allowClear options={ACCOUNT_TYPE_OPTIONS} />
          </Form.Item>
        </Row>
        <Row>
          <Form.Item
            name="agency"
            label="Agência"
            rules={[{ required: hasBank, message: "Informe a agência" }]}
          >
            <Input maxLength={20} />
          </Form.Item>
          <Form.Item name="agencyDigit" label="Dígito da agência">
            <Input maxLength={10} />
          </Form.Item>
          <Form.Item
            name="numberAccount"
            label="Conta"
            rules={[{ required: hasBank, message: "Informe a conta" }]}
          >
            <Input maxLength={25} />
          </Form.Item>
          <Form.Item name="numberAccountDigit" label="Dígito da conta">
            <Input maxLength={10} />
          </Form.Item>
          <Form.Item name="op" label="Operação">
            <Input maxLength={10} />
          </Form.Item>
        </Row>

        <SectionTitle>
          <PixIcon src={pixIcon} alt="" />
          Pix
        </SectionTitle>
        <Row>
          <Form.Item
            name="pixType"
            label="Tipo da chave"
            rules={[{ required: hasPix, message: "Informe o tipo da chave" }]}
          >
            <Select allowClear options={PIX_TYPE_OPTIONS} />
          </Form.Item>
          <Form.Item name="pix" label="Chave Pix" dependencies={["bankId"]} rules={[destinationRule]}>
            <Input maxLength={100} />
          </Form.Item>
        </Row>
      </Form>
    </Modal>
  );
};
