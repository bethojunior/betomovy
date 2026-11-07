import { Button, DatePickerProps, Select, DatePicker } from "antd";
import React, { FC, useEffect, useState } from "react";
import Preload from "../../../../components/Utils/Preload";
import locale from "antd/lib/date-picker/locale/pt_BR";
import { AiOutlineDatabase, AiOutlineCheckCircle, AiOutlineReload } from "react-icons/ai";

import {
  Container,
  Content,
  ContentInput,
  LabelText,
  ContainerRow,
  ContainerButton,
  StatusCard,
  LogCard,
  LogHeader,
  LogBadge,
  LogTimestamp,
  LogMessage,
  LogDetails,
} from "./styles";
import api from "../../../../services/api";
import swal from "sweetalert";
import { AxiosError } from "axios";

interface LogItem {
  id?: number | string;
  type?: string;
  message?: string;
  cluster?: string;
  database?: string;
  collection?: string;
  created_at?: string;
  config?: Array<{ key: string; description: string; value: string }>;
  [key: string]: any;
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
  const [logs, setLogs] = useState<LogItem[]>([]);
  const [clusterInfo, setClusterInfo] = useState<{
    status: string;
    cluster: string;
    database: string;
  }>({
    status: "Conectado",
    cluster: "movy-mongodb-79fd3aab (DigitalOcean Managed)",
    database: "admin",
  });

  const [selectsValue, setSelectsValue] = useState({
    typeLog: TypeUrlApiConst.LOGS as string | null,
    dateStart: null as any,
    dateEnd: null as any,
    user: null,
    page: 1,
  });

  const getAllLogs = async (
    payload: Payload,
    typeUrlApi: string = TypeUrlApiConst.LOGS,
    page: number = 1
  ) => {
    try {
      setLoading(true);
      const url = typeUrlApi.includes("?")
        ? `${typeUrlApi}page=${page}`
        : `${typeUrlApi}?page=${page}`;
      const responseMongo = await api.post(url, payload || {});

      if (responseMongo?.data?.status) {
        const rawData = responseMongo.data.response?.data || [];
        setLogs(Array.isArray(rawData) ? rawData : []);
      }
    } catch (error) {
      console.error("Erro ao obter logs:", error);
      const responseError = error as AxiosError;
      swal({
        title: "Erro ao buscar logs",
        text: (responseError?.response?.data as any)?.message || "Não foi possível carregar os registros.",
        icon: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllLogs({ type: 1 }, TypeUrlApiConst.LOGS, 1);
  }, []);

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
    getAllLogs(payload, String(typeLog || TypeUrlApiConst.LOGS), 1);
    setSelectsValue({ ...selectsValue, page: 1 });
  };

  const onChangeDateStart: DatePickerProps["onChange"] = (_, dateString) => {
    setSelectsValue({ ...selectsValue, dateStart: dateString });
  };

  const onChangeDateEnd: DatePickerProps["onChange"] = (_, dateString) => {
    setSelectsValue({ ...selectsValue, dateEnd: dateString });
  };

  const onChangeTypeLog = (value: string) => {
    setSelectsValue({ ...selectsValue, typeLog: value || "" });
  };

  return (
    <Container>
      <Preload visible={loading} />

      <StatusCard>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <AiOutlineDatabase size={28} color="#00349A" />
          <div>
            <div style={{ fontSize: "15px", fontWeight: 700, color: "#0F172A" }}>
              Cluster MongoDB DigitalOcean: {clusterInfo.cluster}
            </div>
            <div style={{ fontSize: "13px", color: "#64748B" }}>
              Base de Dados: <strong>{clusterInfo.database}</strong> • Driver: <strong>MongoDB PECL Extension</strong>
            </div>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "6px", background: "#ECFDF5", border: "1px solid #A7F3D0", padding: "6px 14px", borderRadius: "20px" }}>
          <AiOutlineCheckCircle size={16} color="#059669" />
          <span style={{ fontSize: "13px", fontWeight: 700, color: "#065F46" }}>
            Operacional & Integrado
          </span>
        </div>
      </StatusCard>

      <Content>
        <ContainerRow>
          <ContentInput>
            <LabelText>Tipo de Log</LabelText>
            <Select
              style={{ width: "100%" }}
              value={selectsValue.typeLog}
              onChange={onChangeTypeLog}
              size="large"
            >
              <Select.Option value={TypeUrlApiConst.LOGS}>
                Logs Gerais (Monitor & App)
              </Select.Option>
              <Select.Option value={TypeUrlApiConst.TRANSACTIONS}>
                Transações & Pagamentos
              </Select.Option>
              <Select.Option value={TypeUrlApiConst.LOGS_APPLICATIONS}>
                Eventos das Aplicações
              </Select.Option>
              <Select.Option value={TypeUrlApiConst.LOGS_APPLICATIONS_SMS}>
                Logs de Envio de SMS
              </Select.Option>
              <Select.Option value={TypeUrlApiConst.LOGS_APPLICATIONS_ERROR_ACTIONS}>
                Logs de Erros de Requisição
              </Select.Option>
              <Select.Option value={TypeUrlApiConst.LOGS_INFORMATIONS}>
                Informativos de Sistema
              </Select.Option>
              <Select.Option value={TypeUrlApiConst.LOGS_ALERTS}>
                Alertas do Sistema
              </Select.Option>
            </Select>
          </ContentInput>

          <ContentInput>
            <LabelText>Data Inicial</LabelText>
            <DatePicker
              style={{ width: "100%" }}
              locale={locale}
              showTime
              format="YYYY-MM-DD"
              placeholder="Selecionar data inicial"
              onChange={onChangeDateStart}
              size="large"
            />
          </ContentInput>

          <ContentInput>
            <LabelText>Data Final</LabelText>
            <DatePicker
              style={{ width: "100%" }}
              locale={locale}
              showTime
              format="YYYY-MM-DD"
              placeholder="Selecionar data final"
              onChange={onChangeDateEnd}
              size="large"
            />
          </ContentInput>

          <ContentInput>
            <Button
              type="primary"
              size="large"
              onClick={handleFilter}
              loading={loading}
              icon={<AiOutlineReload />}
              style={{
                background: "#00349A",
                borderColor: "#00349A",
                fontWeight: 700,
                borderRadius: "8px",
                height: "40px",
              }}
            >
              Filtrar Registros
            </Button>
          </ContentInput>
        </ContainerRow>

        {logs && logs.length > 0 ? (
          logs.map((item, index) => {
            const badgeType = item.type || (item.error ? "ERROR" : "INFO");
            return (
              <LogCard key={item.id ?? index}>
                <LogHeader>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <LogBadge type={badgeType}>{badgeType}</LogBadge>
                    <span style={{ fontSize: "13px", fontWeight: 700, color: "#1E293B" }}>
                      {item.collection ? `Coleção: ${item.collection}` : `Log #${item.id ?? index + 1}`}
                    </span>
                  </div>
                  <LogTimestamp>
                    {item.created_at || new Date().toLocaleString("pt-BR")}
                  </LogTimestamp>
                </LogHeader>
                <LogMessage>
                  {item.message || "Evento registrado pelo sistema MOVY"}
                </LogMessage>
                <LogDetails>
                  {JSON.stringify(item, null, 2)}
                </LogDetails>
              </LogCard>
            );
          })
        ) : (
          <div
            style={{
              padding: "3rem",
              textAlign: "center",
              background: "#F8FAFC",
              borderRadius: "12px",
              border: "1px dashed #CBD5E1",
              color: "#64748B",
            }}
          >
            Nenhum registro encontrado para o filtro selecionado.
          </div>
        )}
      </Content>
    </Container>
  );
};

export default LogsMongo;
