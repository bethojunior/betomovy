import swal from "sweetalert";
import { AiFillDelete } from "react-icons/ai";
import { Button, Collapse, Switch, Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import { FC, useContext, useEffect, useState } from "react";

import api from "../../../services/api";
import Alert from "../../../components/Utils/Alert";

import { LaunchDriver } from "../../../components/Financial/LaunchDriver";
import { balancePostingType, searchableType, userType } from "./types";
import { ButtonListPrePaid, Content, ContentTable, Loader } from "./styles";
import Mask from "../../../services/Mask";

import AuthContext from "../../../contexts/auth";
import { FINANCEIRO, FINANCEIRO_GERENCIAR_PREPAGO } from "../../../constants/permissions";
import { usePrepaidCreditTypes } from "./hooks/usePrepaidCreditTypes";
import { PrepaidCreditModal } from "./components/PrepaidCreditModal";

export const FinancialCharge: FC = () => {
  const { hasPermission } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [messageAlert, setMessage] = useState("");
  const [typeAlert, setTypeAlert] = useState<
    "success" | "info" | "warning" | "error"
  >("success");

  const [userTypeDriver, setUserTypeDriver] = useState<userType[]>([]);
  const [searchableList, setSearchableList] = useState<searchableType[]>([]);
  const [balancePosting, setBalancePosting] = useState<balancePostingType[]>(
    []
  );
  const [isDone, setIsDone] = useState(false);

  const { Panel } = Collapse;

  const canManageFinancialPosting = hasPermission(
    FINANCEIRO,
    "lancamento_financeiro"
  );
  const canManagePrepaid = hasPermission(FINANCEIRO, FINANCEIRO_GERENCIAR_PREPAGO);

  const prepaid = usePrepaidCreditTypes(
    canManagePrepaid,
    setMessage,
    setTypeAlert,
    setShowAlert
  );

  const getInformationsCharge = async () => {
    setLoading(true);
    try {
      const getDrivers = api.get("userType/drivers");
      const searchable = api.get("balanceFlowType/searchable");
      const balancePosting = api.get("balancePosting");

      const result = await Promise.all([getDrivers, searchable, balancePosting]);

      if (result[0].status) setUserTypeDriver(result[0].data.response);
      if (result[1].status) setSearchableList(result[1].data.response);
      if (result[2]?.data?.response?.length > 0) {
        mountBalancePosting(result[2].data.response);
      }
    } catch (e: any) {
      setMessage("Ocorreu um erro ao carregar as informações");
      setTypeAlert("error");
      setShowAlert(true);
    } finally {
      setLoading(false);
    }
  };

  const columnsBalance: ColumnsType<balancePostingType> = [
    {
      title: "Tipo de lançamento",
      dataIndex: "balanceTypeName",
      key: "balanceTypeName",
      width: 200,
      ellipsis: true,
    },
    {
      title: "Fluxo",
      dataIndex: "flow",
      key: "flow",
      width: 150,
      ellipsis: true,
    },
    {
      title: "Valor",
      dataIndex: "value",
      key: "value",
      width: 150,
      ellipsis: true,
    },
    {
      title: "Dia do faturamento",
      dataIndex: "billingDay",
      key: "billingDay",
      width: 150,
      ellipsis: true,
    },
    {
      title: "Categoria",
      dataIndex: "category",
      key: "category",
      width: 150,
      ellipsis: true,
    },
    {
      title: "Excluir",
      dataIndex: "id",
      key: "id",
      width: 150,
      ellipsis: true,
      align: "right",
      render: (id: number) => (
        <Button
          type="link"
          key={id}
          disabled={!canManageFinancialPosting}
          onClick={() => deleteBalance(id)}
          icon={<AiFillDelete style={{ color: "red", fontSize: 20 }} />}
        />
      ),
    },
  ];

  useEffect(() => {
    getInformationsCharge();
  }, []);

  const mountBalancePosting = async (data: balancePostingType[]) => {
    const mountBalance: balancePostingType[] = [];
    (Array.isArray(data) ? data : []).forEach((item: any) => {
      mountBalance.push({
        id: item.id,
        balanceTypeName: item.balance_flow_type?.name ?? "Lançamento",
        flow: item.balance_flow_type?.flow ?? "-",
        value: Mask.setMaskMoneyNumber(item.value),
        billingDay: item.billingDay ?? "-",
        category: item.user_type?.name ?? "Geral",
      });
    });
    setBalancePosting(mountBalance);
  };

  const doLaunch = async (
    balanceFlowTypeId: string,
    billingDay: string,
    value: string,
    userTypeDriverSelected: string | null
  ) => {
    if (!canManageFinancialPosting) {
      setMessage("Você não possui permissão para esta ação");
      setTypeAlert("warning");
      setShowAlert(true);
      return;
    }
    if (value === "" || balanceFlowTypeId === "") {
      setMessage("Todos os campos são obrigatórios");
      setTypeAlert("warning");
      setShowAlert(true);
      return;
    }

    swal({
      title: "Deseja inserir pendência mensal?",
      text: "Essa ação vai impactar no saldo dos motoristas",
      icon: "warning",
      buttons: ["Cancelar", "Continuar"],
      dangerMode: true,
    }).then(async (answer) => {
      if (!answer) {
        return;
      }

      const response: {
        balanceFlowTypeId: string;
        userTypeDriverSelected: string | null;
        value: number;
        billingDay?: string;
      } = {
        balanceFlowTypeId,
        userTypeDriverSelected,
        value: Mask.setRemoveMaskMoney(value),
      };

      if (billingDay !== "") {
        response.billingDay = billingDay;
      }

      setLoading(true);
      const { data } = await api.put("driver/balance", response);

      setLoading(false);
      if (!data.status) {
        setMessage("Erro ao alterar saldo, tente novamente");
        setTypeAlert("error");
        setShowAlert(true);
        return;
      }

      setIsDone(true);
      setMessage("Saldos alterados com sucesso!");
      setTypeAlert("success");
      setShowAlert(true);
    });
  };

  const deleteBalance = async (id: number) => {
    if (!canManageFinancialPosting) {
      setMessage("Você não possui permissão para esta ação");
      setTypeAlert("warning");
      setShowAlert(true);
      return;
    }
    swal({
      title: "Deseja remover esse lançamento?",
      icon: "warning",
      buttons: ["Cancelar", "Continuar"],
    }).then(async (answer) => {
      if (!answer) {
        return;
      }

      setLoading(true);
      const { data } = await api.delete(`balancePosting/${id}`);

      setLoading(false);
      if (!data.status) {
        setMessage("Erro ao deletar lançamento, tente novamente");
        setTypeAlert("error");
        setShowAlert(true);
        return;
      }

      const update = await api.get("balancePosting");

      if (!update.data.status) {
        return;
      }

      if (update?.data?.response?.length > 0) {
        await mountBalancePosting(update.data.response);
      } else {
        setBalancePosting([]);
      }

      setMessage("Lançamento deletado sucesso!");
      setTypeAlert("success");
      setShowAlert(true);
    });
  };

  return (
    <div>
      <Alert
        visibility={showAlert}
        setVisibility={setShowAlert}
        message={messageAlert}
        typeAlert={typeAlert}
      />
      <Content>
        <Collapse ghost>
          {canManageFinancialPosting && (
              <Panel header="Lançamento motorista" key="1">
      {loading ? (
        <Loader spinning={loading} />
      ) : (
        <LaunchDriver
          userTypeDriver={userTypeDriver}
          searchableList={searchableList}
          doLaunch={doLaunch}
          isDone={isDone}
        />
      )}
    </Panel>
          )}
          {canManageFinancialPosting && (
          <Panel header="Lista de lançamentos" key="2">
      {loading ? (
        <Loader spinning={loading} />
      ) : (
        <ContentTable>
          <Table
            rowKey="id"
            pagination={false}
            dataSource={balancePosting}
            columns={columnsBalance}
          />
        </ContentTable>
      )}
    </Panel>
          )}
          {canManagePrepaid && (
          <Panel header="Tipos de créditos pré-pago" key="3">
      {prepaid.loading ? (
        <Loader spinning={prepaid.loading} />
      ) : (
        <>
          <div style={{ display: "flex" }}>
            <Button type="primary" onClick={prepaid.handleOpenCreatePrepaid}>
              Adicionar
            </Button>
            <ButtonListPrePaid
              visible={prepaid.havePermission}
              type="primary"
              onClick={prepaid.changeListPrepaid}
            >
              {prepaid.showListPrepaid === "all"
                ? "Listar Por cidade"
                : "Listar Todas"}
            </ButtonListPrePaid>
          </div>
          <ContentTable>
            <Table
              dataSource={
                prepaid.showListPrepaid === "all"
                  ? prepaid.prepaidAll
                  : prepaid.prepaidByCity
              }
              columns={prepaid.columnsPrePaid}
              size="large"
              loading={prepaid.loading}
            />
          </ContentTable>
        </>
      )}
    </Panel>
          )}
          {canManagePrepaid && (
          <Panel header="Modo de funcionamento do pré-pago" key="4">
      {prepaid.loading ? (
        <Loader spinning={prepaid.loading} />
      ) : (
        <div style={{ display: "flex" }}>
          <Switch
            checked={prepaid.keyPrePaid === "1"}
            onChange={(e) => {
              prepaid.updateConfig(e);
            }}
          />
          <p style={{ marginLeft: 10 }}>
            Quando esta opção estiver destivada o pré-pago funcionará por
            crédito, caso contrário funcionará por período.
          </p>
        </div>
      )}
    </Panel>
          )}
        </Collapse>
      </Content>
      <PrepaidCreditModal
        open={prepaid.showModal}
        editingPrepaid={prepaid.editingPrepaid}
        form={prepaid.form}
        loading={prepaid.loading}
        typePrePaid={prepaid.typePrePaid}
        cities={prepaid.cities}
        paymentForm={prepaid.paymentForm}
        onCancel={prepaid.closePrepaidModal}
        onFinish={prepaid.handleSubmit}
        onChangeType={prepaid.setTypePrePaid}
      />
    </div>
  );
};
