import {
  Button,
  Form,
  Input,
  Modal,
  Upload,
  UploadFile,
  UploadProps,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { AccessoriesModalProps } from "./types";
import { FieldType } from "../../../../../pages/Delivery/Config/DeliveryAccessories/types";
import { useEffect, useState } from "react";

const AccessoriesModal = ({
  title,
  open,
  onCancel,
  onFinish,
  editValues,
}: AccessoriesModalProps) => {
  const [fileList, setFileList] = useState<UploadFile[]>();
  const { TextArea } = Input;

  const handleChange: UploadProps["onChange"] = ({ fileList: newFileList }) => {
    setFileList(newFileList);
    return false;
  };

  useEffect(() => {
    if (open) {
      setFileList(
        editValues
          ? [
              {
                uid: "-1",
                name: "image.png",
                status: "done",
                url: editValues.picture,
              },
            ]
          : []
      );
    }
  }, [open]);

  return (
    <Modal
      title={title}
      open={open}
      onCancel={onCancel}
      destroyOnClose
      footer={[
        <Button key={0} onClick={onCancel}>
          Cancelar
        </Button>,
        <Button key={1} form="sections-form" htmlType="submit" type="primary">
          Salvar
        </Button>,
      ]}
    >
      <Form
        id="sections-form"
        name="basic"
        wrapperCol={{ span: 24 }}
        style={{ maxWidth: 600 }}
        onFinish={onFinish}
        autoComplete="off"
        initialValues={
          editValues
            ? {
                name: editValues?.name,
                description: editValues?.description,
              }
            : {}
        }
      >
        <div>
          <Form.Item<FieldType>
            name="name"
            rules={[{ required: true, message: "Insira um nome" }]}
          >
            <Input placeholder="Nome" />
          </Form.Item>
          <Form.Item<FieldType> name="description">
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
                  required: !editValues ? true : false,
                  message: "Insira uma foto",
                },
              ]}
            >
              <Upload
                listType="picture"
                maxCount={1}
                className="upload-list-inline"
                name="file"
                fileList={fileList as []}
                accept=".jpeg, .png"
                onChange={handleChange}
                beforeUpload={() => {
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

export default AccessoriesModal;
