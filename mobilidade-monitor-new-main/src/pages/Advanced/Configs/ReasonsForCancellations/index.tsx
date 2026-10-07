import { Button, Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import { FC, useContext, useEffect, useState } from "react";
import { AxiosError } from "axios";
import { FaTrash } from "react-icons/fa";
import { MdEdit } from "react-icons/md";
import swal from "sweetalert";

import Alert from "../../../../components/Utils/Alert";
import { ModalEditReasonsCancellation } from "../../../../components/Advanced/Config/ReasonsForCancellation/ModalEditReasonsCancellation";
import { SimulatorScreenInitial } from "../../../../components/Advanced/Config/ModulesActives/SimulatorScreenInitial";

import api from "../../../../services/api";

import { ReasonsCancellationsProps } from "./types";
import { AppConfigProps } from "../ModulesActives/types";

import {
  Container,
  ContentActionsBtn,
  ContentSimulation,
  ContentTable,
  Body,
  Header,
} from "./styles";
import ReasonForCancelation from "../ReasonsForCancelationModal";
import AuthContext from "../../../../contexts/auth";
import { CONFIGURACAO } from "../../../../constants/permissions";

const ReassonsCancellation: FC = () => {
  const { hasPermission } = useContext(AuthContext);
  const canManageCancellationReasons = hasPermission(
    CONFIGURACAO,
    "gerenciar_tipos_cancelamento"
  );
  const [reportsValue, setReportsValue] = useState(false);
  const [monetizedValue, setMonetizedValue] = useState(false);
  const [reasonsCancellations, setReasonsCancellations] = useState<
    ReasonsCancellationsProps[]
  >([]);
  const [reasonsCancellationsSelected, setReasonsCancellationsSelected] =
    useState<ReasonsCancellationsProps | null>(null);

  const [loading, setLoading] = useState(false);
  const [messageAlert, setMessageAlert] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [typeAlert, setTypeAlert] = useState<
    "success" | "info" | "warning" | "error"
  >("success");
  const [visibleModalEdit, setVisibleModalEdit] = useState<boolean>(false);
  const [appConfig, setAppConfig] = useState<AppConfigProps[]>([]);

  const [openModal, setOpenModal] = useState(false);

  const getAllReasonsCancellation = async () => {
    try {
      setLoading(true);
      const responseReasonsCancellation = await api.get("cancellationReasons");

      if (responseReasonsCancellation.status) {
        setReasonsCancellations(responseReasonsCancellation.data.response);
      }
    } catch (error) {
      const responseError = error as AxiosError;
      swal({
        title: responseError.response?.data.message,
        icon: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const getAppConfigs = async () => {
    try {
      setLoading(true);

      const responseAppConfig = await api.get("appConfig");

      if (responseAppConfig.status) {
        setAppConfig(responseAppConfig.data.response);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const receive = async (e: any) => {
    try {
      setLoading(true);
      const responseReceive = await api.post("cancellationReasons/insert", {
        name: e.name,
        cancellationReasonsTypeId: e.type,
        reports: reportsValue,
        monetized: monetizedValue,
      });

      if (responseReceive.status) {
        setOpenModal(false);
        getAllReasonsCancellation();
        setTypeAlert("success");
        setMessageAlert("Mensagem de cancelamento inserida com sucesso");
        setShowAlert(true);
      }
    } catch (error) {
      const responseError = error as AxiosError;
      swal({
        title: responseError.response?.data.message,
        icon: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const messageDelete = (id: number) => {
    swal({
      title: "Deseja apagar esse item?",
      icon: "info",
      buttons: ["Cancelar", "Confirmar"],
      dangerMode: true,
    }).then((res) => {
      if (res) {
        setLoading(true);
        api
          .delete(`cancellationReasons/${id}`)
          .then((result) => {
            setLoading(false);
            if (result.status) {
              getAllReasonsCancellation();
              setTypeAlert("success");
              setMessageAlert("Item apagado com sucesso");
            }
          })
          .catch((error: AxiosError) => {
            swal({
              title: error.response?.data.message,
              icon: "error",
            });
          })
          .finally(() => {
            setLoading(false);
          });
      }
    });
  };

  const handleOpenModalEditReasons = (
    dataReasonsCancellation: ReasonsCancellationsProps
  ) => {
    setVisibleModalEdit(true);
    setReasonsCancellationsSelected(dataReasonsCancellation);
  };

  useEffect(() => {
    getAllReasonsCancellation();
    getAppConfigs();
  }, []);

  const columns: ColumnsType<ReasonsCancellationsProps> = [
    {
      title: "Motivo de Cancelamento",
      dataIndex: "name",
      key: "name",
      width: 200,
      ellipsis: true,
    },
    {
      title: "Mostrado para",
      key: "screen",
      width: 200,
      ellipsis: true,
      render: (_, item) => {
        return <div>{item.cancellation_reasons_type?.name || ""}</div>;
      },
    },
    {
      title: "Tipo",
      key: "reports",
      width: 200,
      ellipsis: true,
      render: (_, item) => {
        return <div>{item.reports ? "Relatos" : "Cancelamentos"}</div>;
      },
    },
    {
      title: "Monetizado",
      key: "monetized",
      width: 200,
      ellipsis: true,
      render: (_, item) => {
        return <div>{item.monetized ? "Sim" : "Não"}</div>;
      },
    },
    {
      title: "Ações",
      key: "x",
      width: 200,
      ellipsis: true,
      render: (_, item) => {
        if (!canManageCancellationReasons) {
          return null;
        }
        return (
          <ContentActionsBtn>
            <Button
              title="Editar"
              onClick={() => handleOpenModalEditReasons(item)}
              icon={<MdEdit style={{ color: "#1677ff" }} />}
            />
            <Button
              title="Deletar"
              onClick={() => messageDelete(item.idCancellationReasons)}
              icon={<FaTrash style={{ color: "#DC143C" }} />}
            />
          </ContentActionsBtn>
        );
      },
    },
  ];

  const configApp = appConfig.find((data) => data.appId === 4);

  return (
    <Container>
      <Alert
        visibility={showAlert}
        setVisibility={setShowAlert}
        message={messageAlert}
        typeAlert={typeAlert}
      />
      <div>
        <Header>
          {canManageCancellationReasons && (
            <Button onClick={() => setOpenModal(true)} type="primary">
              Cadastrar
            </Button>
          )}
        </Header>
        <Body>
          <ContentTable>
            <Table
              columns={columns}
              dataSource={reasonsCancellations}
              loading={loading}
              pagination={false}
            />
          </ContentTable>

          <ContentSimulation>
            <SimulatorScreenInitial
              colorPrimary={configApp?.mainColor}
              colorSecond={configApp?.secondaryColor}
              colorText={configApp?.mainColorText}
              nameScreen="reasons_cancellation"
              reasonsCancellation={reasonsCancellations}
            />
          </ContentSimulation>
        </Body>
      </div>

      <ModalEditReasonsCancellation
        visible={visibleModalEdit}
        setVisible={setVisibleModalEdit}
        reasonsCancellationSelected={reasonsCancellationsSelected}
        setReasonsCancellationSelected={setReasonsCancellationsSelected}
        getAllReasonsCancellation={getAllReasonsCancellation}
      />
      <ReasonForCancelation
        open={openModal}
        onCancel={() => setOpenModal(false)}
        receive={receive}
        setReportsValue={setReportsValue}
        setMonetizedValue={setMonetizedValue}
      />
    </Container>
  );
};
export default ReassonsCancellation;
