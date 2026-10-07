import { Container, ContentTable, Button, ContentButtons } from "./styles";
import { useState, useEffect, useContext, useMemo } from "react";
import { Table, Spin, Button as ButonAntd } from "antd";
import { ColumnsType } from "antd/es/table";
import { FaTrash } from "react-icons/fa";
import swal from "sweetalert";

import { CommissionsProps, TripTravelsProps } from "./types";

//import Preload from "../../../components/Utils/Preload";
import { ModalInsertCommission } from "../../../components/Financial/ModalInsertCommission";

import api from "../../../services/api";
import Session from "../../../utils/Session";
import AuthContext from "../../../contexts/auth";
import { FINANCEIRO } from "../../../constants/permissions";
import { RequestData } from "../../../@types/context";

export const CommissionManagement = () => {
  const { hasPermission, responseDataUser } = useContext(AuthContext);
  const canListMonetizationAllCities = hasPermission(
    FINANCEIRO,
    "criar_monetizacao_todas_cidades"
  );
  const { allowedCities, mustFilterByAllowedCities } = useMemo(() => {
    const raw: RequestData | null =
      responseDataUser ??
      ((): RequestData | null => {
        try {
          const stored = localStorage.getItem("@App:user");
          if (!stored) {
            return null;
          }
          return JSON.parse(stored) as RequestData;
        } catch {
          return null;
        }
      })();
    if (!raw) {
      return {
        allowedCities: [] as number[],
        mustFilterByAllowedCities: false,
      };
    }
    const isUserSupport = raw.support === 1;
    const cities: number[] =
      raw.allowedCities && Array.isArray(raw.allowedCities)
        ? raw.allowedCities
        : [];
    return {
      allowedCities: cities,
      mustFilterByAllowedCities: !isUserSupport && cities.length > 0,
    };
  }, [responseDataUser]);
  //@ts-ignore
  const [commissionsManagement, setCommissionManagement] = useState<
    CommissionsProps[]
  >([]);
  const [tripTypes, setTripTypes] = useState<TripTravelsProps[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [visibleModal, setVisibleModal] = useState<boolean>(false);
  const [getAllCommissions, setGetAllCommissions] = useState<boolean>(true);

  const city = Session.getLocal("citySelected");

  const filterRowsByAllowedCities = (
    rows: CommissionsProps[]
  ): CommissionsProps[] => {
    if (!mustFilterByAllowedCities) {
      return rows;
    }
    return rows.filter((row) => {
      const cid = row.cityId ?? row.city?.id;
      if (cid === null || cid === undefined || cid === "") {
        return false;
      }
      return allowedCities.includes(Number(cid));
    });
  };

  const getCommissions = async (citySelected: boolean = true) => {
    const scopeToCity =
      !canListMonetizationAllCities || mustFilterByAllowedCities
        ? true
        : citySelected;
    try {
      setLoading(true);
      const responseReferralMonetization = await api.get(
        `referralMonetization${
          scopeToCity ? `?cityId=${city.cityId}` : ""
        }`
      );

      if (responseReferralMonetization.status) {
        const raw = responseReferralMonetization.data.response;
        setCommissionManagement(filterRowsByAllowedCities(raw));
      }
    } catch (error) {
      console.error(error);
      swal({
        title: "Erro ao pegar dados de comissão",
        icon: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const getTypesTrips = async () => {
    try {
      const responseTypesTrips = await api.get("tripType");

      if (responseTypesTrips.status) {
        setTripTypes(responseTypesTrips.data.response);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteCommission = (id: number) => {
    swal({
      title: "Realmente deseja deletar esse tipo de monetização?",
      icon: "info",
      buttons: ["Não", "Sim"],
    }).then((isAccept) => {
      if (isAccept) {
        setLoading(true);
        api
          .delete(`referralMonetization/${id}`)
          .then((response) => {
            if (response.status) {
              swal({
                title: "Excluído com sucesso!",
                icon: "success",
              });
              getCommissions(
                !canListMonetizationAllCities || mustFilterByAllowedCities
                  ? true
                  : getAllCommissions
              );
            }
          })
          .catch((error) => {
            console.error(error);
          })
          .finally(() => {
            setLoading(false);
          });
      }
    });
  };

  useEffect(() => {
    getTypesTrips();
  }, []);

  useEffect(() => {
    if (!canListMonetizationAllCities && !getAllCommissions) {
      setGetAllCommissions(true);
    }
  }, [canListMonetizationAllCities, getAllCommissions]);

  const columns: ColumnsType<CommissionsProps> = [
    {
      title: "Level",
      dataIndex: "label",
      key: "label",
      ellipsis: true,
      width: 250,
    },
    {
      title: "Indicações",
      dataIndex: "indications",
      key: "indications",
      ellipsis: true,
      width: 100,
    },
    {
      title: "Tipo de corrida",
      key: "trip_types",
      ellipsis: true,
      width: 250,
      render: (_, data) => {
        const mountTripTypes = data.trip_types.map((value) => {
          return value.type;
        });
        return String(mountTripTypes);
      },
    },
    {
      title: "Valor",
      key: "value",
      ellipsis: true,
      width: 150,
      render: (_, data) => {
        return data.trip_types[0].pivot.value.toLocaleString("pt-br", {
          style: "currency",
          currency: "BRL",
        });
      },
    },
    {
      title: "Tipo do valor",
      key: "type_value",
      ellipsis: true,
      width: 100,
      render: (_, data) => {
        return data.trip_types[0].pivot.valueType;
      },
    },
    {
      title: "Cidade",
      dataIndex: "city",
      ellipsis: true,
      width: 150,
      render: (_, data) => {
        return data.city ? data.city.cityName : "Todas";
      },
    },
    {
      title: "Destino do bônus",
      key: "backToTripBalance",
      ellipsis: true,
      width: 200,
      render: (_, data) => {
        return data.trip_types[0].backToTripBalance === 0
          ? "Saldo em Conta"
          : "Voucher";
      },
    },
    {
      title: "Data",
      key: "date",
      ellipsis: true,
      width: 250,
      render: (_, data) => {
        return `${new Date(data.updated_at).toLocaleDateString()} - ${new Date(
          data.updated_at
        ).toLocaleTimeString()}`;
      },
    },
    {
      title: "Excluir",
      key: "actions",
      width: 100,
      render: (_, data) => {
        return (
          <Button
            color="#DC143C"
            onClick={() => handleDeleteCommission(data.id)}
          >
            <FaTrash />
          </Button>
        );
      },
    },
  ];

  useEffect(() => {
    const scopeByCity =
      !canListMonetizationAllCities || mustFilterByAllowedCities
        ? true
        : getAllCommissions;
    getCommissions(scopeByCity);
  }, [getAllCommissions, canListMonetizationAllCities, mustFilterByAllowedCities]);

  return (
    <Container>
      {/*<Preload visible={loading} />*/}
      <ContentButtons>
        <ButonAntd type="primary" onClick={() => setVisibleModal(true)}>
          Inserir Monetização
        </ButonAntd>
        {canListMonetizationAllCities && !mustFilterByAllowedCities && (
          <ButonAntd onClick={() => setGetAllCommissions(!getAllCommissions)}>
            {getAllCommissions
              ? "Listar todas monetizações"
              : "Listar monetizações da cidade selecionada"}
          </ButonAntd>
        )}
      </ContentButtons>

      <ContentTable style={{ position: "relative", minHeight: 300 }}>
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
        <Table
          columns={columns}
          dataSource={commissionsManagement}
          pagination={false}
        />
      </ContentTable>

      <ModalInsertCommission
        visible={visibleModal}
        setVisible={setVisibleModal}
        tripTypes={tripTypes}
        setLoading={setLoading}
        getTypesTrips={getTypesTrips}
        getCommissions={() =>
          getCommissions(
            !canListMonetizationAllCities || mustFilterByAllowedCities
              ? true
              : getAllCommissions
          )
        }
      />
    </Container>
  );
};
