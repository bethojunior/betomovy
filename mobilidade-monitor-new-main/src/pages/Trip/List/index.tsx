import swal from "sweetalert";
import { FC, useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import Card from "../../../components/Trip/List/Card";
import Preload from "../../../components/Utils/Preload";
import AdvancedFilterAndSimpleCard from "../../../components/Trip/List/AdvancedFilterAndSimpleCard";
import {
  SimpleFilterContainer,
  OpenFilterButton,
  SimpleFilterButton,
  SimpleFilterButtonsContainer,
  CardInformationContainer,
  NoOneTripsFindedContainer,
  PaginationContainer,
  PaginationButton,
} from "./styles";
import api from "../../../services/api";
import Alert from "../../../components/Utils/Alert";
import Utils from "@/utils/Utils";

import {
  TripsData,
  FinancialMirrorProps,
} from "./types";
import { Button } from "antd";
import { AxiosError } from "axios";
import Session from "@/utils/Session";
import { Loader } from "../../../components/Loader";

const ListTrip: FC = () => {
  const [loading, setLoading] = useState(false);
  const [tripsRequest, setTripsRequest] = useState<TripsData[]>([]);
  const [currentPageListTrip, setCurrentPageListTrip] = useState(1);
  const [pagination, setPagination] = useState("");
  const [showAdvancedFilter, setShowAdvancedFilter] = useState(false);
  const [showButton, setShowButton] = useState(false);
  const [lastPage, setLastPage] = useState(0);
  const [messageAlert, setMessageAlert] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [typeAlert, setTypeAlert] = useState<
    "success" | "info" | "warning" | "error"
  >("success");
  const [datasPer, setDatasPer] = useState<"today" | "month" | "analysis">(
    "today"
  );

  const [loadingReleaseAllTrips, setLoadingReleaseAllTrips] =
    useState<boolean>(false);

  const [financialMirror, setFinancialMirror] =
    useState<FinancialMirrorProps>();

  const [lastFilterParams, setLastFilterParams] = useState<string>("");

  const { id: driverId = "0" } = useParams<{ id: string }>();
  const isSpeedMob = import.meta.env.ISSPEEDMOB === "true";
  const cityId = Session.getLocal("citySelected")?.cityId;

  const changeCardPage = (page = 1, values: any[]) => {
    if (!Array.isArray(values)) {
      console.error("Valores retornados não são um array:", values);
      return;
    }
    setCurrentPageListTrip(page);
    if (page !== 1) {
      setTripsRequest((state) => [...state, ...values]);
    } else {
      setTripsRequest(values);
    }
  };


  const pageCount = (page = 1) => {
    setLoading(true);
    const url = lastFilterParams 
      ? `trip?${lastFilterParams}&page=${page}` 
      : `trip?page=${page}`;
    
    api
      .get(url)
      .then((values) => {
        changeCardPage(page, values.data.response.trips.data);
      })
      .catch((error) => {
        console.error(error);
        swal({
          title: "Erro ao atualizar dados",
          icon: "error",
        });
      })
      .finally(() => {
        setLoading(false);
      });
    if (page === lastPage) {
      setShowButton(true);
    }
  };



  const simpleFilter = async (
    year: number,
    month: number,
    day: number,
    isToday = false
  ) => {

    const dateEnd = new Date(year, month - 1, day);
    const dateStart = new Date(dateEnd);
    dateStart.setDate(1);

    const formattedStartDate = Utils.formatDateToBackend(dateStart.toLocaleDateString('pt-BR'));
    const formattedEndDate = Utils.formatDateToBackend(dateEnd.toLocaleDateString('pt-BR'));
    
    const hasDriver = driverId !== "0";
    const driverParam = hasDriver ? `&driverId=${driverId}` : "";
    
    const filterParams = `date=${formattedStartDate},${formattedEndDate}${driverParam}&withTotalValue=0`;
    setLastFilterParams(filterParams);

    const isTodayParam = isToday ? "&isToday=1" : "&isToday=0";
    const financialMirrorUrl = `trip/financialMirror?startDate=${formattedStartDate}&endDate=${formattedEndDate}${driverParam}${isTodayParam}`;
    const tripsUrl = `trip?page=1&${filterParams}`;

    setLoading(true);

    const responseDatasFinancialMirror = api.get(financialMirrorUrl);
    const responseDatasTrip = api.get(tripsUrl);

    Promise.all([responseDatasFinancialMirror, responseDatasTrip])
      .then(([financialResponse, tripsResponse]) => {
        if (financialResponse.status) {
          setFinancialMirror(financialResponse.data.response);
        }

        if (tripsResponse.status) {
          const { trips } = tripsResponse.data.response;
          const hasMultiplePages = trips.last_page > 1;
          
          changeCardPage(1, trips.data);

          if (hasMultiplePages) {
            setPagination(trips.current_page);
            setLastPage(trips.last_page);
            setShowButton(false);
          } else {
            setShowButton(true);
          }
        }
      })
      .catch((error) => {
        console.error("Erro ao filtrar viagens:", error);
        swal({
          title: "Erro ao carregar dados",
          text: "Não foi possível carregar as viagens. Tente novamente.",
          icon: "error",
        });
      })
      .finally(() => {
        setLoading(false);
      });
  };



  const page = 1;

  useEffect(() => {
    const filterToDriverList = () => {
      const dateNow = new Date();
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);

      const formatDate = (date: Date) => {
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
      };

      const dateStart = formatDate(yesterday);
      const dateEnd = formatDate(dateNow);


      api.get(
        `trip?page=1&driverId=${driverId}&date=${dateStart},${dateEnd}&withTotalValue=0`
      )
        .then((values) => {
          if (!values.data.status) {
            setLoading(false);
            setMessageAlert(
              "Não foi possível carregar as viagens desse motorista, tente novamente"
            );
            setTypeAlert("error");
            return setShowAlert(true);
          }
          changeCardPage(page, values.data.response.trips.data);
          if (values.data.response.trips.last_page !== 1) {
            setPagination(values.data.response.trips.current_page);
            setLastPage(values.data.response.trips.last_page);
          }
          setShowAdvancedFilter(false);
          return setLoading(false);
        });

      api.defaults.headers.cityId = cityId;
    };

    if (driverId && driverId !== "0") {
      filterToDriverList();
    }
  }, [driverId, cityId]);

  type TypeStatus = {
    [key: string]: string;
  };

  const getStatus = useCallback((status: string) => {
    const allStatus: TypeStatus = {
      searching: "Buscando motorista",
      searching_favorite: "Buscando motorista favorito",
      pre_accepted: "Aceita por motorista em viagem",
      accepted: "Aceita",
      boarding: "Embarcando",
      in_progress: "Em viagem",
      finished: "Finalizada",
      canceled: "Cancelada",
      payment_refused: "Pagamento recusado",
      not_answered: "Não atendida",
      back_off: "Desistiu",
      scheduled: "Agendada",
    };

    const statusColors: { [key: string]: string } = {
      accepted: "green",
      boarding: "orange",
      in_progress: "orange",
      finished: "green",
      canceled: "red",
      payment_refused: "red",
      not_answered: "red",
      back_off: "red",
      scheduled: "blue",
    };

    const label = allStatus[status] || "Status não definido";
    const color = statusColors[status] || "#777777";

    return (
      <span style={{ color, fontWeight: "bold" }}>
        {label}
      </span>
    );
  }, []);

  type TypeStatusDriverOrCustomer = {
    [key: string]: string;
  };

  const driverOrCustomer = useCallback((status: string) => {
    const allStatus: TypeStatusDriverOrCustomer = {
      driver: "Motorista",
      customer: "Cliente",
    };

    if (!allStatus[status]) {
      return "Status não definido";
    }

    return allStatus[status];
  }, []);

  const changeStatusOfFilter = () => {
    setShowAdvancedFilter(true);
    if (showAdvancedFilter === true) {
      setShowAdvancedFilter(false);
    }
  };

  const handleReleaseAllTrips = () => {
    swal({
      title: "Aviso",
      text: "Deseja realmente liberar todas as corridas?",
      icon: "info",
      buttons: ["Não", "Sim"],
    }).then((isAccept) => {
      if (isAccept) {
        setLoadingReleaseAllTrips(true);
        api
          .put("trip/release")
          .then((response) => {
            if (response.status) {
              swal({
                title: "Sucesso",
                text: "Corridas liberadas com sucesso.",
                icon: "success",
              });
              analysisTrip();
            }
          })
          .catch((error: AxiosError) => {
            swal({
              title: "Error",
              text: error.response?.data.message,
              icon: "error",
            });
            console.error(error);
          })
          .finally(() => {
            setLoadingReleaseAllTrips(false);
          });
      }
    });
  };

  const analysisTrip = () => {
    setDatasPer("analysis");
    
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    const dateFormated = Utils.formatDateToBackend(today.toLocaleDateString('pt-BR'));
    const dateAgoFormated = Utils.formatDateToBackend(yesterday.toLocaleDateString('pt-BR'));

    const hasDriver = driverId !== "0";
    const driverParam = hasDriver ? `&driverId=${driverId}` : "";
    const driverQuery = hasDriver ? `?driverId=${driverId}` : "";

    const financialMirrorAnalysisUrl = `trip/financialMirror?startDate=${dateAgoFormated}&endDate=${dateFormated}${driverParam}&analizy=1`;
    const analysisTripsUrl = `trip/analysis${driverQuery}`;

    setLoading(true);

    const responseFinancialMirrorAnalysis = api.get(financialMirrorAnalysisUrl);
    const responseAnalysisTrip = api.get(analysisTripsUrl);
    Promise.all([responseFinancialMirrorAnalysis, responseAnalysisTrip])
      .then(([financialResponse, analysisResponse]) => {
        if (financialResponse.status) {
          setFinancialMirror(financialResponse.data.response);
        }

        if (analysisResponse.status) {
          const analysisTrips = analysisResponse.data.response;
          setShowButton(true);
          
          if (analysisTrips.length === 0) {
            setTripsRequest([]);
          } else {
            changeCardPage(1, analysisTrips);
          }
        }
      })
      .catch((error) => {
        console.error("Erro ao carregar análise de viagens:", error);
        swal({
          title: "Erro ao carregar análise",
          text: "Não foi possível carregar as viagens em análise.",
          icon: "error",
        });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    const today = new Date();
    simpleFilter(
      today.getFullYear(),
      today.getMonth() + 1,
      today.getDate(),
      true
    );
    setDatasPer("today");
      }, []);

  return (
    <>
      <Alert
        visibility={showAlert}
        setVisibility={setShowAlert}
        message={messageAlert}
        typeAlert={typeAlert}
      />
      <Preload visible={loading} />
      <div>
        <div>
          <SimpleFilterContainer>
            <div
              style={{
                display: "flex",
                gap: 10,
              }}
            >
              <OpenFilterButton onClick={() => changeStatusOfFilter()}>
                Filtros Avançado
              </OpenFilterButton>

              {datasPer === "analysis" && tripsRequest.length > 0 && (
                <Button
                  type="primary"
                  onClick={handleReleaseAllTrips}
                  loading={loadingReleaseAllTrips}
                >
                  Liberar Corridas
                </Button>
              )}
            </div>

            <SimpleFilterButtonsContainer>
              <SimpleFilterButton
                $buttonSelected={datasPer === "today" && true}
                onClick={() => {
                  simpleFilter(
                    new Date().getFullYear(),
                    new Date().getMonth() + 1,
                    new Date().getDate(),
                    true
                  );
                  setDatasPer("today");
                }}
              >
                Hoje
              </SimpleFilterButton>
              <SimpleFilterButton
                $buttonSelected={datasPer === "month" && true}
                onClick={() => {
                  simpleFilter(
                    new Date().getFullYear(),
                    new Date().getMonth() + 1,
                    new Date().getDate()
                  );
                  setDatasPer("month");
                }}
              >
                Mês
              </SimpleFilterButton>
              {!isSpeedMob && (
                <SimpleFilterButton
                  $buttonSelected={datasPer === "analysis"}
                  onClick={analysisTrip}
                >
                  Em análise
                </SimpleFilterButton>
              )}
            </SimpleFilterButtonsContainer>
          </SimpleFilterContainer>
          <AdvancedFilterAndSimpleCard
            financialMirror={financialMirror}
            setFinancialMirror={setFinancialMirror}
            showAdvancedFilterProps={showAdvancedFilter}
            setLastPage={setLastPage}
            setShowAdvancedFilter={setShowAdvancedFilter}
            changeCardPage={changeCardPage}
            setPagination={setPagination}
            setLastFilterParams={setLastFilterParams}
            setShowButton={setShowButton}
          />
        </div>
        <CardInformationContainer>
          <Loader spinning={loading}>
            {Array.isArray(tripsRequest) && tripsRequest.length > 0 ? (
              tripsRequest.map((item: TripsData, index) => (
                <Card
                  key={index}
                  isTypeSearch={datasPer}
                  item={item}
                  getStatusProps={getStatus}
                  driverOrCustomerProps={driverOrCustomer}
                />
              ))
            ) : (
              <NoOneTripsFindedContainer>
                <h1>Nenhuma corrida encontrada</h1>
              </NoOneTripsFindedContainer>
            )}
          </Loader>

          {!showButton && pagination && tripsRequest.length > 0 && currentPageListTrip < lastPage && (
            <PaginationContainer>
              <PaginationButton
                type="primary"
                onClick={() => pageCount(currentPageListTrip + 1)}
                loading={loading}
              >
                Mostrar Mais
              </PaginationButton>
            </PaginationContainer>
          )}
        </CardInformationContainer>
      </div>
    </>
  );
};

export default ListTrip;