import { Button, Form, Input, Modal, Select, Switch } from "antd";
import { useEffect, useState } from "react";
import { ContentInputAddReasons } from "./styles";

const Constants = {
  driver: "1",
  client: "2",
};

interface ReasonForCancelationProps {
  open: boolean;
  onCancel: () => void;
  receive: (e: any) => void;
  setReportsValue: (val: boolean) => void;
  setMonetizedValue: (val: boolean) => void;
}

const ReasonForCancelation = ({
  open,
  onCancel,
  receive,
  setReportsValue,
  setMonetizedValue,
}: ReasonForCancelationProps) => {
  const [type, setType] = useState("2");
  const [reports, setReports] = useState(false);
  const [monetized, setMonetized] = useState(false);

  const handleChange = (e: boolean, reports: boolean) => {
    if (reports) {
      setReports(e);
      setReportsValue(e);
    } else {
      setMonetized(e);
      setMonetizedValue(e);
    }
    if (!e && reports) {
      setMonetized(false);
      setMonetizedValue(false);
    }
  };

  useEffect(() => {
    if (open) {
      setReports(false);
      setReportsValue(false);
      setMonetized(false);
      setMonetizedValue(false);
      setType(Constants.client);
    }
  }, [open]);

  useEffect(() => {
    if (type == Constants.driver) {
      setReports(false);
      setMonetized(false);
      setReportsValue(false);
      setMonetizedValue(false);
    }
  }, [type]);

  return (
    <Modal
      destroyOnClose
      onCancel={onCancel}
      title="Cadastrar"
      open={open}
      footer={[
        <Button key={0} onClick={onCancel}>
          Cancelar
        </Button>,
        <Button
          key={1}
          form="reasonForCancelation"
          htmlType="submit"
          type="primary"
        >
          Salvar
        </Button>,
      ]}
    >
      <Form
        id="reasonForCancelation"
        onFinish={receive}
        initialValues={{
          type: Constants.client,
        }}
        layout="vertical"
        name="form"
      >
        <ContentInputAddReasons>
          <div>
            <Form.Item
              name="name"
              label="Nome"
              rules={[
                {
                  required: true,
                  message: "Insira uma mensagem",
                },
              ]}
            >
              <Input />
            </Form.Item>
          </div>

          <div>
            <Form.Item
              name="type"
              label="Para quem será mostrado?"
              rules={[
                {
                  required: true,
                  message: "Insira uma mensagem",
                },
              ]}
            >
              <Select
                defaultValue={"2"}
                style={{ width: "100%" }}
                value={type}
                onChange={(e) => setType(e)}
                options={[
                  {
                    value: "1",
                    label: "Motorista",
                  },
                  {
                    value: "2",
                    label: "Cliente",
                  },
                ]}
              />
            </Form.Item>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
            }}
          >
            <Form.Item style={{ marginBottom: 0 }} name="reports">
              <Switch
                checked={reports}
                value={reports}
                onChange={(e) => handleChange(e, true)}
                disabled={type == Constants.driver}
              />
            </Form.Item>
            <span style={{ marginLeft: 10 }}>Relatos da viagem</span>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
            }}
          >
            <Form.Item style={{ marginBottom: 0 }} name="monetized">
              <Switch
                checked={monetized}
                disabled={type == Constants.driver || !reports}
                onChange={(e) => handleChange(e, false)}
              />
            </Form.Item>
            <span style={{ marginLeft: 10 }}>Monetizado</span>
          </div>
        </ContentInputAddReasons>
      </Form>
    </Modal>
  );
};

export default ReasonForCancelation;
