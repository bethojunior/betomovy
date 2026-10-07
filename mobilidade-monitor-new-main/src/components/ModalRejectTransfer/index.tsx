import { Modal, Input, Form } from "antd";

const { TextArea } = Input;

interface ModalRejectTransferProps {
  visible: boolean;
  loading?: boolean;
  onCancel: () => void;
  onConfirm: (reason?: string) => void;
}

export const ModalRejectTransfer = ({
  visible,
  loading = false,
  onCancel,
  onConfirm,
}: ModalRejectTransferProps) => {
  const [form] = Form.useForm();

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      onConfirm(values.reason?.trim() || undefined);
    } catch (error) {
      console.error("Validação falhou:", error);
    }
  };

  return (
    <Modal
      title="Recusar transferência"
      open={visible}
      onCancel={onCancel}
      onOk={handleOk}
      okText="Recusar"
      cancelText="Cancelar"
      confirmLoading={loading}
      okButtonProps={{ danger: true }}
      destroyOnClose // <--- Limpa o formulário automaticamente ao fechar
    >
      <Form 
        form={form} 
        layout="vertical" 
        preserve={false}
      >
        <Form.Item
          name="reason"
          label="Motivo da recusa (opcional)"
        >
          <TextArea
            rows={4}
            maxLength={60}
            showCount
            placeholder="Ex: Dados inválidos, valor incorreto..."
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};