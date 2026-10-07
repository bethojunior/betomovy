import { Button, Form, Input, Modal } from "antd";
import { FieldType, RegisterAndEditModalProps } from "./types";

const RegisterAndEditModal = ({
  title,
  open,
  onCancel,
  registerOrEdit,
  editValues,
}: RegisterAndEditModalProps) => {
  const { TextArea } = Input;
  return (
    <Modal
      title={title}
      open={open}
      onCancel={onCancel}
      destroyOnClose
      footer={[
        <Button onClick={onCancel}>Cancelar</Button>,
        <Button form="sections-form" htmlType="submit" type="primary">
          Salvar
        </Button>,
      ]}
    >
      <Form
        id="sections-form"
        name="basic"
        wrapperCol={{ span: 24 }}
        style={{ maxWidth: 600 }}
        initialValues={
          editValues
            ? {
                name: editValues?.name,
                description: editValues?.description,
              }
            : {}
        }
        onFinish={registerOrEdit}
        autoComplete="off"
      >
        <div>
          <Form.Item<FieldType>
            name="name"
            rules={[{ required: true, message: "Insira um nome" }]}
          >
            <Input placeholder="Nome" />
          </Form.Item>
          <Form.Item<FieldType>
            name="description"
            rules={[{ required: true, message: "Insira uma descrição" }]}
          >
            <TextArea
              placeholder="Descrição"
              autoSize={{ minRows: 4, maxRows: 6 }}
            />
          </Form.Item>
        </div>
      </Form>
    </Modal>
  );
};

export default RegisterAndEditModal;
