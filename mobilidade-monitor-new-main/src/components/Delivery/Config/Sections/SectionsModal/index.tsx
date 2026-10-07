import { Button, Form, Input, Modal, Upload } from "antd";
import { FieldType, SectionsModalProps } from "./types";
import { UploadOutlined } from "@ant-design/icons";

const SectionsModal = ({
  title,
  open,
  onCancel,
  registerSection,
  editValues,
  setGetFile,
}: SectionsModalProps) => {
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
        onFinish={registerSection}
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
          <div>
            <Form.Item<FieldType>
              name="icon"
              rules={[
                {
                  required: true,
                  message: "Insira uma logo",
                },
              ]}
            >
              <Upload
                listType="picture"
                maxCount={1}
                className="upload-list-inline"
                name="file"
                accept=".jpeg, .png"
                beforeUpload={(file) => {
                  setGetFile(file);
                  return false;
                }}
              >
                <Button icon={<UploadOutlined />}>Upload</Button>
              </Upload>
            </Form.Item>
          </div>
        </div>
      </Form>
    </Modal>
  );
};

export default SectionsModal;
