import { FC } from "react";
import { Button, Form, Input, Modal, Radio, Select } from "antd";
import Mask from "../../../services/Mask";
import { TripTypes } from "../../../pages/Central/Config/types";
import { CitiesType } from "../../../pages/Financial/Charge/types";

interface Props {
  visible: boolean;
  setVisible: (visible: boolean) => void;
  setShowComissionModal: (showComissionModal: boolean) => void;
  saveComission: (values: any) => void;
  tripType: TripTypes[];
  city: CitiesType[];
  editingComission?: any;
  loading?: boolean;
}

export const ComissionModal: FC<Props> = ({
  visible,
  setVisible,
  setShowComissionModal,
  saveComission,
  tripType,
  city,
  editingComission,
  loading = false,
}) => {
  const [form] = Form.useForm();
  const { Option } = Select;

  return (
    <Modal
      title={editingComission ? "Editar comissão" : "Criar comissão"}
      open={visible}
      footer={null}
      onCancel={() => {
        setVisible(false);
        setShowComissionModal(true);
      }}
      destroyOnClose
      width={600}
      style={{ left: 100 }}
      bodyStyle={{ maxHeight: '80vh' }}
    >
      <Form 
        form={form} 
        onFinish={saveComission} 
        layout="vertical" 
        name="form"
        initialValues={{
          tripTypeId: editingComission?.trip_type?.idTripType,
          cityId: editingComission?.city?.cityId,
          partnerCommissionType: editingComission?.partnerCommissionType || '%',
          partnerCommissionValue: editingComission ? Mask.setMaskMoney(editingComission.partnerCommissionValue.toString()) : '0,00'
        }}
      >
        <Form.Item
          name="tripTypeId"
          label="Tipo de chamado"
          rules={[
            {
              required: true,
              message: "Selecione o tipo do chamado",
            },
          ]}
        >
          <Select
            onChange={(e) => form.setFieldValue("tripTypeId", e)}
            placeholder="Selecione um tipo de chamado"
          >
            {tripType?.map((item: any) => (
              <Option key={item.idTripType} value={item.idTripType}>
                {item.type}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          name="cityId"
          label="Cidade"
          rules={[
            {
              required: true,
              message: "Selecione a cidade",
            },
          ]}
        >
          <Select
            onChange={(e) => form.setFieldValue("cityId", e)}
            placeholder="Selecione uma cidade"
          >
            {city?.map((item: any) => (
              <Option key={item.cityId} value={item.cityId}>
                {item.nome}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item name="partnerCommissionType" label="Tipo de comissão">
          <Radio.Group defaultValue="%">
            <Radio key={0} value="%">
              Percentagem
            </Radio>
            <Radio key={1} value="$">
              Valor fixo
            </Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item
          name="partnerCommissionValue"
          label="Valor"
          initialValue="0,00"
          rules={[
            {
              required: true,
              message: "Insira o valor da comissão",
            },
          ]}
        >
          <Input
            value={form.getFieldValue("partnerCommissionValue")}
            onChange={(e) =>
              form.setFieldValue(
                "partnerCommissionValue",
                Mask.setMaskMoney(e.target.value)
              )
            }
          />
        </Form.Item>
        <Button type="primary" htmlType="submit" loading={loading}>
          {editingComission ? "Atualizar" : "Criar"}
        </Button>
      </Form>
    </Modal>
  );
};
