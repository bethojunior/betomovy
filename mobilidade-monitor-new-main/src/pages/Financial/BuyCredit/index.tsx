import swal from "sweetalert";
import { Button, Table, Spin } from "antd";
import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";

import { Container, ContentTable, ContentBtnActions, UserCell } from "./styles";

import api from "../../../services/api";
//import Preload from "../../../components/Utils/Preload";
import Alert from "../../../components/Utils/Alert";
import Mask from "../../../services/Mask";

import type { TableProps } from "antd";
import Utils from "../../../utils/Utils";
//import { Loader } from '../../../components/Loader';

let showButtonAll = false;

interface PrepaidProps {
  amount: number;
  balanceFlowId: number;
  cardId: number;
  created_at: string;
  creditPrepaidId: number;
  credit_prepaid: {
    accountInformation: string;
    cityId: number;
    created_at: string;
    deleted_at: string;
    id: number;
    purchasePrice: number;
    quantityDaysPurchased: number;
    quantityDaysSold: number;
    sellPrice: string;
    stripe: string;
    superTitle: string;
    title: string;
    type: string;
    updated_at: string;
  };
  credited: number;
  expirationDate: string;
  id: number;
  refused: number;
  statusDetail: string;
  transactionId: string;
  updated_at: string;
  user: {
    cityId: number;
    email: string;
    idUser: number;
    name: string;
    nickname: string;
    phone: string;
  };
  userId: number;
  value: number;
}

export const BuyCredit = () => {
  const history = useHistory();
  const [listPrePaid, setListPrepaid] = useState<PrepaidProps[]>([]);
  const listPrePaidWithKey = listPrePaid.map(item => ({ ...item, key: item.id })).filter((data) => data.credit_prepaid !== null);
  const [loading, setLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [messageAlert, setMessage] = useState("");
  const [typeAlert, setTypeAlert] = useState<
    "success" | "info" | "warning" | "error"
  >("success");
  const [cities, setCities] = useState<{[key: number]: string}>({});

  // const [showButtonAll, setShowButtonAll] = useState(false);
  const [modeList, setModeList] = useState("");

  function getDescriptionStatus(prepaid: PrepaidProps) {
    if (prepaid.credited === 1) return "Creditado";

    if (prepaid.refused === 1) return "Rejeitado";

    return "Pendente";
  }

  const columns: TableProps<PrepaidProps>["columns"] = [
    {
      title: "Usuário",
      dataIndex: "user",
      key: "user",
      width: 150,
      ellipsis: true,
      render: (user: any) => (
        <UserCell onClick={() => history.push(`/driver/list?editDriverId=${user.idUser}`)}>
          {user.name}
        </UserCell>
      ),
    },
    {
      title: "Cidade",
      dataIndex: "credit_prepaid",
      key: "city",
      width: 120,
      render: (credit_prepaid: any) => <p>{cities[credit_prepaid?.cityId] || credit_prepaid?.cityId || "N/A"}</p>,
    },
    {
      title: "Tarjeta",
      dataIndex: "credit_prepaid",
      key: "credit_prepaid",
      width: 150,
      render: (credit_prepaid: any) => (
        <p>{credit_prepaid ? credit_prepaid.stripe : ""}</p>
      ),
    },
    {
      title: "Preço de compra",
      dataIndex: "credit_prepaid",
      key: "credit_prepaid",
      width: 150,
      render: (credit_prepaid: any) => (
        <p>
          {credit_prepaid?.purchasePrice
            ? Mask.setMaskMoneyNumber(credit_prepaid.purchasePrice)
            : "N/A"}
        </p>
      ),
    },
    {
      title: "Preço da venda",
      dataIndex: "credit_prepaid",
      key: "credit_prepaid",
      width: 150,
      render: (credit_prepaid: any) => {
        return (
          <p>
            {Utils.convertStringToNumber(
              credit_prepaid?.sellPrice
            ).toLocaleString("pt-br", { style: "currency", currency: "BRL" })}
          </p>
        );
      },
    },
    {
      title: "Data",
      dataIndex: "credit_prepaid",
      key: "credit_prepaid",
      width: 200,
      render: (credit_prepaid: any) => (
        <p>
          {credit_prepaid
            ? new Date(credit_prepaid?.created_at).toLocaleDateString()
            : ""}
        </p>
      ),
    },
    {
      title: "Status",
      dataIndex: "",
      key: "",
      width: 150,
      render: (list: PrepaidProps) => <p>{getDescriptionStatus(list)}</p>,
    },
    {
      title: "Ações",
      dataIndex: "",
      key: "actions",
      align: "right",
      width: 150,
      render: (list: PrepaidProps) => {
        if (list.credited !== 1 && list.refused !== 1) {
          return (
            <ContentBtnActions>
              <Button
                type="primary"
                key={list.balanceFlowId}
                onClick={() => credit(list.id)}
              >
                Creditar
              </Button>

              <Button
                type="primary"
                key={list.balanceFlowId}
                onClick={() => refuse(list.id)}
                style={{ backgroundColor: "red", borderColor: "red" }}
              >
                Recusar
              </Button>
            </ContentBtnActions>
          );
        }
      },
    },
  ];

  const credit = async (id: number) => {
    swal({
      title: "Deseja confirmar esse pagamento?",
      icon: "warning",
      buttons: ["Cancelar", "Continuar"],
    }).then(async (answer) => {
      if (!answer) {
        return;
      }

      setLoading(true);
    try {
      const { data } = await api.put(`creditPrepaidPurchase/${id}/credit`);

      if (!data.status) {
        setMessage("Ocorreu um erro ao creditar esse pagamento");
        setTypeAlert("error");
        setShowAlert(true);
        return;
      }

      setMessage("Pagamento creditado com sucesso!");
      setTypeAlert("success");
      setShowAlert(true);
      await loadData(false);
    } finally {
      setLoading(false);
    }
  });
};

  const refuse = async (id: number) => {
    swal({
      title: "Deseja recusar esse pagamento?",
      icon: "warning",
      buttons: ["Cancelar", "Continuar"],
    }).then(async (answer) => {
      if (!answer) {
        return;
      }

      setLoading(true);
    try {
      const { data } = await api.put(`creditPrepaidPurchase/${id}/refuse`);

      if (!data.status) {
        setMessage("Ocorreu um erro ao recusado esse pagamento");
        setTypeAlert("error");
        setShowAlert(true);
        return;
      }

      setMessage("Pagamento recusado com sucesso!");
      setTypeAlert("success");
      setShowAlert(true);
      await loadData(false);
    } finally {
      setLoading(false);
    }
  });
  };

const loadCities = async () => {
  try {
    const response = await api.get('city/actives/fully');
    
    if (response.data && response.data.response) {
      const cityMap: {[key: number]: string} = {};
      response.data.response.forEach((city: any) => {
        if (city.cityId && city.nome) {
          cityMap[city.cityId] = city.nome;
        }
      });
      
      setCities(cityMap);
    }
  } catch (error) {
    console.error('Erro ao carregar cidades:', error);
  }
};

const loadData = async (changeMode = true) => {
  setLoading(true);

  let cityId = "";
  let endpoint = "creditPrepaidPurchase";

  try {
    const rawCity = localStorage.getItem("citySelected");
    if (rawCity && rawCity !== "undefined" && rawCity !== "null") {
      cityId = JSON.parse(rawCity)?.cityId ?? "";
    }
  } catch {}

  if (changeMode) {
    if (showButtonAll && modeList === "Listar todos") {
      endpoint = "creditPrepaidPurchase";
    } else {
      endpoint = cityId ? `creditPrepaidPurchase/${cityId}` : "creditPrepaidPurchase";
    }
  } else {
    if (modeList === "Listar todos") {
      endpoint = "creditPrepaidPurchase";
    } else {
      endpoint = cityId ? `creditPrepaidPurchase/${cityId}` : "creditPrepaidPurchase";
    }
  }

  try {
    const responseInformations = await api.get(endpoint);

    if (!responseInformations.status) {
      setMessage("Ocorreu um erro ao carregar as informações");
      setTypeAlert("error");
      setShowAlert(true);
      return;
    }

    if (changeMode) {
      setModeList(
        modeList === "Listar todos" ? "Por cidade" : "Listar todos"
      );
    }

    setListPrepaid(responseInformations.data.response);
  } catch (error) {
    console.error(error);
  } finally {
    setLoading(false);
  }
};

  const getPermission = async () => {
    try {
      const rawUser = localStorage.getItem("@App:user");
      if (rawUser && rawUser !== "undefined" && rawUser !== "null") {
        const parsedUser = JSON.parse(rawUser);
        const roleId = Number(parsedUser?.roleId ?? 99);
        const isSupport = Number(parsedUser?.support ?? 0);

        if (roleId < 2 && isSupport === 1) {
          showButtonAll = true;
        }

        await loadCities();
        loadData();
      }
    } catch {}
  };

  useEffect(() => {
    getPermission();
  }, []);

  return (
    <Container style={{ position: "relative", minHeight: 300 }}>
      {loading && (
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            zIndex: 1,
            backgroundColor: "rgba(255, 255, 255, 0.7)",
            padding: 20,
            borderRadius: 8,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Spin size="large" tip="Carregando..." />
        </div>
      )}
      {/*<Loader spinning={loading}>*/}
      {/*<Preload visible={loading} />*/}
      <Alert
        visibility={showAlert}
        setVisibility={setShowAlert}
        message={messageAlert}
        typeAlert={typeAlert}
      />
      <Button
        type="primary"
        onClick={() => loadData()}
        style={{ marginBottom: 10 }}
      >
        {modeList}
      </Button>

      <ContentTable>
        <Table
          pagination={{ pageSize: 10 }}
          columns={columns}
          dataSource={listPrePaidWithKey}
          size="small"
          scroll={{ x: 800 }}
        />
      </ContentTable>
    </Container>
  );
};