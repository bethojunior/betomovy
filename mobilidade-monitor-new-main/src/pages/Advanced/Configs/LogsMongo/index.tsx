import { Button, DatePickerProps, Select } from "antd";
import { FC, useState } from "react";
import Preload from "../../../../components/Utils/Preload";
import { DatePicker } from "antd";
import locale from "antd/lib/date-picker/locale/pt_BR";

import {
  Content,
  ContentInput,
  LabelText,
  ContainerRow,
  ContainerButton,
} from "./styles";
import api from "../../../../services/api";
import swal from "sweetalert";
import { AxiosError } from "axios";

interface KeysArray extends Array<Keys> {}

interface Keys {
  config: [Configs];
  type: string;
}

interface Configs {
  description: string;
  key: string;
  value: string;
}

interface Payload {
  type: number;
  dateStart?: string;
  dateEnd?: string;
  user?: string | null;
}

enum TypeUrlApiConst {
  TRANSACTIONS = "mongoLogs/logstransaction?",
  LOGS_APPLICATIONS = "mongoLogs/logsapplication?",
  LOGS = "mongoLogs?",
  LOGS_INFORMATIONS = "mongoLogs?information&",
  LOGS_ALERTS = "mongoLogs?avisos&",
  LOGS_APPLICATIONS_SMS = "mongoLogs/logsapplication?sms&",
  LOGS_APPLICATIONS_ERROR_ACTIONS = "mongoLogs/logsapplication?actions&",
}

const LogsMongo: FC = () => {
  const [loading, setLoading] = useState(false);
  const [logs, setLogs] = useState<KeysArray>([]);
  const [selectsValue, setSelectsValue] = useState({
    typeLog: null as string | null,
    dateStart: null as any,
    dateEnd: null as any,
    user: null,
    page: 1,
  });

  const getAllLogs = async (
    payload: Payload,
    typeUrlApi: string = TypeUrlApiConst.TRANSACTIONS,
    page: number = 1
  ) => {
    try {
      setLoading(true);
      const responseMongo = await api.post(
        typeUrlApi + `page=${page}`,
        payload || {}
      );

      if (responseMongo?.status) {
        setLogs(responseMongo?.data?.response?.data || []);
      }
    } catch (error) {
      console.error(error);
      const responseError = error as AxiosError;
      swal({
        title: responseError?.response?.data.response,
        icon: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFilter = () => {
    const { typeLog, dateStart, dateEnd, user } = selectsValue;
    const payload: Payload = {
      type: 1,
      dateStart,
      dateEnd,
      user: user || null,
    };
    if (TypeUrlApiConst.LOGS_APPLICATIONS_SMS === typeLog) {
      payload.type = 1;
    }
    if (TypeUrlApiConst.LOGS_APPLICATIONS_ERROR_ACTIONS === typeLog) {
      payload.type = 2;
    }
    if (TypeUrlApiConst.LOGS_INFORMATIONS === typeLog) {
      payload.type = 1;
    }
    if (TypeUrlApiConst.LOGS_ALERTS === typeLog) {
      payload.type = 2;
    }
    getAllLogs(payload, String(typeLog), 1);
    setSelectsValue({ ...selectsValue, page: 1 });
  };

  const onChangeDateStart: DatePickerProps["onChange"] = (_, dateString) => {
    console.log(dateString);
    setSelectsValue({ ...selectsValue, dateStart: dateString });
  };

  const onChangeDateEnd: DatePickerProps["onChange"] = (_, dateString) => {
    setSelectsValue({ ...selectsValue, dateEnd: dateString });
  };

  const onChangeTypeLog = (value: string) => {
    setSelectsValue({ ...selectsValue, typeLog: value || "" });
  };

  return (
    <Content>
      <Preload visible={loading} />
      <ContainerRow>
        <ContentInput>
          <LabelText>Selecione o tipo de log</LabelText>
          <Select
            style={{
              width: "100%",
            }}
            value={selectsValue.typeLog}
            onChange={onChangeTypeLog}
          >
            <Select.Option value={null}>Selecione um tipo de log</Select.Option>
            <Select.Option value={TypeUrlApiConst.TRANSACTIONS}>
              Transações
            </Select.Option>
            <Select.Option value={TypeUrlApiConst.LOGS_APPLICATIONS}>
              Aplicações
            </Select.Option>
            <Select.Option value={TypeUrlApiConst.LOGS_APPLICATIONS_SMS}>
              Logs de SMS
            </Select.Option>
            <Select.Option
              value={TypeUrlApiConst.LOGS_APPLICATIONS_ERROR_ACTIONS}
            >
              Logs de erros nas requisições
            </Select.Option>
            <Select.Option value={TypeUrlApiConst.LOGS_INFORMATIONS}>
              Logs (Monitor e App) - Informações
            </Select.Option>
            <Select.Option value={TypeUrlApiConst.LOGS_ALERTS}>
              Logs (Monitor e App) - AVISOS
            </Select.Option>
            <Select.Option value={TypeUrlApiConst.LOGS}>
              Logs (Monitor e App) - Geral
            </Select.Option>
          </Select>
        </ContentInput>

        <ContentInput>
          <LabelText>Selecione a data inicial</LabelText>
          <DatePicker
            style={{
              width: "100%",
            }}
            locale={locale}
            showTime
            format="YYYY-MM-DD"
            placeholder="Data inicial"
            onChange={onChangeDateStart}
          />
        </ContentInput>

        <ContentInput>
          <LabelText>Selecione a data final</LabelText>
          <DatePicker
            style={{
              width: "100%",
            }}
            locale={locale}
            showTime
            format="YYYY-MM-DD"
            placeholder="Data inicial"
            onChange={onChangeDateEnd}
          />
        </ContentInput>
      </ContainerRow>

      <ContainerButton>
        <Button onClick={handleFilter} loading={loading}>
          Filtrar
        </Button>
      </ContainerButton>

      {logs.map((item) => {
        return (
          <code>
            <pre>
              {JSON.stringify(item, null, 2)}
              <br />
            </pre>
          </code>
        );
      })}
    </Content>
  );
};

export default LogsMongo;
