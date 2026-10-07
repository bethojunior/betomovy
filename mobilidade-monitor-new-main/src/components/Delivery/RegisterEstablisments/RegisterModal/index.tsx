import {
  Button,
  Form,
  Modal,
  Select,
  Switch,
  Upload,
  UploadFile,
  UploadProps,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { RegisterModalProps } from "./types";
import { useEffect, useState } from "react";

const RegisterModal = ({
  title,
  open,
  onCancel,
  onSave,
  listPerfil,
  listFantasyName,
  onSearch,
  loadingText,
  editValues,
  onEdit,
}: RegisterModalProps) => {
  const [fileList, setFileList] = useState<UploadFile[]>();

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

  const filterOption = (
    input: string,
    option?: { label: string; value: number }
  ) => (option?.label ?? "").toLowerCase().includes(input.toLowerCase());
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
        <Button
          form="establishment-form"
          htmlType="submit"
          key={1}
          type="primary"
        >
          Salvar
        </Button>,
      ]}
    >
      <Form
        id="establishment-form"
        name="basic"
        wrapperCol={{ span: 24 }}
        style={{ maxWidth: 600 }}
        onFinish={!editValues ? onSave : onEdit}
        autoComplete="off"
        initialValues={
          editValues
            ? {
                companyId: {
                  value: editValues?.companyId,
                  label: editValues?.company.fantasyName,
                },
                perfil: editValues.company.establishmentCollectionManagementId,
                releaseDelivery: editValues.releaseDelivery,
                releaseMenu: editValues.releaseMenu,
              }
            : {}
        }
      >
        <Form.Item<any>
          name="companyId"
          rules={[{ required: true, message: "Insira um nome" }]}
        >
          <Select
            style={{
              width: "100%",
            }}
            allowClear
            showSearch
            placeholder="Selecione um usuário"
            optionFilterProp="children"
            onSearch={onSearch}
            options={listFantasyName}
            filterOption={filterOption}
            notFoundContent={loadingText}
            disabled={Boolean(editValues)}
          />
        </Form.Item>
        <Form.Item<any> name="perfil">
          <Select placeholder="Selecione o perfil">
            {listPerfil.map((item) => (
              <Select.Option key={item.id} value={item.id}>
                {item.label}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item<any> name="picture">
          <Upload
            listType="picture"
            maxCount={1}
            className="upload-list-inline"
            name="file"
            accept=".jpeg, .png"
            onChange={handleChange}
            fileList={fileList as []}
            beforeUpload={() => {
              return false;
            }}
          >
            <Button icon={<UploadOutlined />}>Upload</Button>
          </Upload>
        </Form.Item>
        <div style={{ display: "flex", alignItems: "center" }}>
          <Form.Item<any>
            name="releaseMenu"
            style={{ margin: 0, marginRight: 10 }}
          >
            <Switch />
          </Form.Item>
          <span>Liberar cardapio</span>
        </div>
        <div style={{ display: "flex", alignItems: "center" }}>
          <Form.Item<any>
            name="releaseDelivery"
            style={{ margin: 0, marginRight: 10 }}
          >
            <Switch />
          </Form.Item>
          <span>Liberar entregas do estabelecimento</span>
        </div>
      </Form>
    </Modal>
  );
};

export default RegisterModal;
