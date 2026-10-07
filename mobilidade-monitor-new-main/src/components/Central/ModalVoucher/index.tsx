import { FC, useState } from "react";
import { Button, Input, Modal, Select } from "antd";
import Mask from "../../../services/Mask";

interface Props {
  visible: boolean;
  setVisible: (visible: boolean) => void;
  handleBalance: (type: string, value: string) => void;
}

export const VoucherModal: FC<Props> = ({
  visible,
  setVisible,
  handleBalance,
}) => {
  const [value, setValue] = useState("");
  const [type, setType] = useState("1");

  const { Option } = Select;

  return (
    <Modal
      title="Voucher"
      open={visible}
      footer={null}
      onCancel={() => {
        setValue("");
        setVisible(false);
      }}
      destroyOnClose
      width={400}
    >
      <div
        style={{
          display: "flex",
          alignSelf: "center",
          flexDirection: "column",
        }}
      >
        <div>
          <p style={{ marginBottom: 5 }}>Valor</p>
          <Input
            value={value}
            onChange={(e) => setValue(Mask.setMaskMoney(e.target.value))}
          />
        </div>

        <div>
          <p style={{ marginBottom: 5, marginTop: 5 }}>Modo</p>
          <Select
            onChange={(e) => setType(e)}
            style={{ width: "100%" }}
            defaultValue="1"
          >
            <Option key={0} value="1">
              Inserir
            </Option>
            <Option key={1} value="2">
              Remover
            </Option>
          </Select>
        </div>
        <Button
          type="primary"
          onClick={() => {
            handleBalance(type, value);
            setValue("");
            setVisible(false);
          }}
          style={{ marginTop: 15 }}
        >
          Salvar
        </Button>
      </div>
    </Modal>
  );
};
