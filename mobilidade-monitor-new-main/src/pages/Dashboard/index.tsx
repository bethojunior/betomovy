import { FC, useState, useEffect, useRef } from "react";
import {
  DashBoardContainer,
  StatisticContainer,
  TypesOfDrivers,
  CardTyperDriverContainer,
  TypeDriverDataContainer,
  TypeDriversCard,
  TypeDriverImageContainer,
  TypeDriverImage,
  TypeDriverContainer,
  StatisticRealTime,
  TripAndTicketOfToday,
  ClientsAndDriversRealTime,
  TopDriversAndClients,
  CardOfInformations,
  TextOfCard,
  ContainerInformationsData,
  InformationsDataMap,
  TypeDriverDataLabel,
  TypeDriverDataItem,
  TripAndTicketContainer,
  TripAndTicketData,
  TripAndTicked,
  LineConatiner,
  ContentCardInformations,
  TripsLabel,
  TripsItem,
  ContainerOfCarInformationGlobal,
  ParagraphBasicGlobal,
  TopItem,
  TopContainer,
  TopName,
  TypeDriversCarousel,
  CardContainerMap,
  CustomersCardWrapper,
  CustomersCardsRow,
  CustomerMetricCard,
  CustomerMetricContent,
  CustomerMetricLabel,
  CustomerMetricValue,
  SkeletonContainer,
  TitleNotTypesDrivers,
  TripsAcceptedContainer,
  ContainerInput,
  GridButtonRefresh,
  TopListContainer,
  TopItemContainer,
  TopItemContent,
  TopItemActions,
  WhatsAppLink,
  TicketMedioText,
  LoadingMoreText,
  LoadingMoreSpinner,
  ButtonParabens,
  ContentFilteredMonthAndDay,
  ButtonsFiltered,
  RankingFilterLabel,
  CardHeaderRow,
} from "./styles";
import api from "../../services/api";
import Utils from "../../utils/Utils";
import DriverCardSkeleton from "../../components/SkeletonDashBoard/DriverCard";
import { Button, Input, InputRef, Skeleton, Tooltip, Spin } from "antd";
import { PieChart } from "@mui/x-charts/PieChart";
import { FaWhatsapp } from "react-icons/fa";

import {
  DatasDashboardProps,
  ClientRankingDataProps,
  DriversRankingDataProps,
  CurrentQuantitiesProps,
  ApiRankingDriverRaw,
  ApiRankingClientRaw,
  PercentProps,
  RankingPeriod,
  ModalParabensState,
} from "./types";
import { deduplicateByKey } from "../../utils/arrayUtils";
import swal from "sweetalert";
import ModalLottie from "../../components/ModalLottiePassword";
import { IoEyeOutline } from "react-icons/io5";
import { AiOutlineEyeInvisible } from "react-icons/ai";
import apiv1 from "../../services/apiv1";

import Session from "../../utils/Session";
import apiApp from "../../services/apiApp";
import { AxiosError } from "axios";
import ModalAlertKeysMaps from "../../components/ModalAlertKeysMaps";
import { ModalPublicity } from "../../components/ModalPublicity";
import { ListCurrentQuantitiesProps } from "./types";
import CurrencyUtils from "../../utils/currency/currency";
import { formatPhoneForWhatsApp, openWhatsApp } from "../../utils/whatsappUtils";
import { ModalWhatsAppParabens } from "../../components/ModalWhatsAppParabens";
import { buildRankingPeriodParams } from "../../utils/dashboard-ranking-date";

let keyEnableShowPublicity: string | null = null;
let roleUser: string | null = null;

const DashBoard: FC = () => {
  const modalLottie = useRef<ModalRefProps>(null);
  const inputRefPassword = useRef<InputRef>(null);
  const [showModalMapKeysThisSession, setShowModalMapKeysThisSession] = useState(false);
  const [datasDashboard, setDatasDashboard] = useState<DatasDashboardProps>({} as DatasDashboardProps);

  const [driversRequest, setDriversRequest] =
    useState<ListCurrentQuantitiesProps>();

  const [driverRank, setDriverRank] = useState<DriversRankingDataProps[]>([]);
  const [clientRank, setClientRank] = useState<ClientRankingDataProps[]>([]);
  const [loadingMoreDrivers, setLoadingMoreDrivers] = useState<boolean>(false);
  const [loadingMoreClients, setLoadingMoreClients] = useState<boolean>(false);
  const [currentDriverPage, setCurrentDriverPage] = useState<number>(1);
  const [currentClientPage, setCurrentClientPage] = useState<number>(1);
  const [hasMoreDrivers, setHasMoreDrivers] = useState<boolean>(true);
  const [hasMoreClients, setHasMoreClients] = useState<boolean>(true);
  const [driverRankPeriod, setDriverRankPeriod] = useState<RankingPeriod>("all");
  const [clientRankPeriod, setClientRankPeriod] = useState<RankingPeriod>("all");
  const [loadingRankingDriver, setLoadingRankingDriver] = useState(false);
  const [loadingRankingClient, setLoadingRankingClient] = useState(false);
  const [modalParabens, setModalParabens] = useState<ModalParabensState>({
    open: false,
    name: "",
    quantityTrips: 0,
    type: "driver",
  });

  const [loadings, setLoadings] = useState({
    loadingPassword: false,
  });

  const [loadingFetchDataDashBoard, setLoadingFetchDataDashBoard] = useState(true)

  const [errorMapKey, setErrorMapKey] = useState<ErrorKeysMapsProps | null>(
    null
  );
  const [publicityInformations, setPublicityInfomations] = useState<
    PublicityProps[]
  >([]);

  const verifyHasFirstLogin = () => {
    const firstLogin = localStorage.getItem("@App:firstPasswordUsed");
    if (firstLogin) {
      modalLottie.current?.openModal();
      return;
    }
  };

  useEffect(() => {
    const alreadyShown = sessionStorage.getItem("hasSeenMapKeyModal");

    const shouldShow =
      errorMapKey?.direction !== true ||
      errorMapKey?.geocoding !== true ||
      errorMapKey?.place !== true;

    const notTestPage = window.location.pathname !== "/mapSetting/tests";

    if (!alreadyShown && shouldShow && notTestPage) {
      setShowModalMapKeysThisSession(true);
      sessionStorage.setItem("hasSeenMapKeyModal", "true");
    }
  }, [errorMapKey]);

  const setLoader = (key: string, value: boolean) => {
    return setLoadings({ ...loadings, [key]: value });
  };

  const getConfigsModalAdvertsings = async () => {
    try {

      const storedKeys = localStorage.getItem("keysApp");
      let keys;

      if (storedKeys && storedKeys !== "undefined" && storedKeys !== "null") {
        try {
          keys = JSON.parse(storedKeys);
          return keys;
        } catch {
          localStorage.removeItem("keysApp");
        }
      }
      
      const responseConfigModalAdvertsings = await api.get("config");

        if (responseConfigModalAdvertsings.status) {
          const configsGestor = responseConfigModalAdvertsings.data.response.find(
            (data: KeysAppProps) => data.type === "GESTOR"
          );

          keyEnableShowPublicity = configsGestor.config.find(
            (data: ConfigsKeyAppsProps) => data.key === "enable_publicity"
          ).value;
        }
      }
    } catch (error) {
      console.error(error);
    }
  };
  const getErrorsKeysMaps = async () => {
    try {
      const responseErrorKeysMaps = await apiApp.get("map/allServiceTest/");

      if (responseErrorKeysMaps.status && responseErrorKeysMaps.data?.data) {
        setErrorMapKey(responseErrorKeysMaps.data.data);
      }
    } catch (error) {
      const responseError = error as AxiosError;

      if (responseError.message === "Não autorizado") {
        return;
      }

      swal({
        title: responseError.response?.data?.message || "Erro ao carregar dados",
        icon: "error",
      });
    }
  };

  const getPublicities = async () => {
    try {
      const responsePublicities = await api.get(
        `publicity/advertising/customer`
      );

      if (responsePublicities.status) {
        setPublicityInfomations(responsePublicities.data.response);
      }
    } catch (error) {
      const responseError = error as AxiosError;

      if (responseError.message === "Não autorizado") {
        return;
      }

      // Modal de erro comentado para apresentação - erro silencioso
      // swal({
      //   title: "Error",
      //   text: "Publicidades não encontradas.",
      //   icon: "error",
      // });
    }
  };

  const dataGraphicPie = [
    {
      id: 0,
      label: "Cliente",
      value: datasDashboard?.canceledbyCustomer || 0,
    },
    {
      id: 1,
      label: "Motorista",
      value: datasDashboard?.canceledbyDriver || 0,
    },
  ];

  const configGraphicPie = {
    appendPadding: 10,
    data: dataGraphicPie,
    angleField: "value",
    colorField: "type",
    radius: 0.75,
    label: {
      type: "inner",
      labelHeight: 28,
      content: ({ percent }: PercentProps) => `${(percent * 100).toFixed(0)}%`,
    },
    interactions: [{ type: "element-selected" }, { type: "element-active" }],
  };

  const dataGraphicPieTrips = [
    {
      id: 0,
      label: "Aceitas",
      value: datasDashboard?.tripAccepted || 0,
    },
    {
      id: 1,
      label: "Finalizadas",
      value: datasDashboard?.tripFinished || 0,
    },
  ];

  const configGraphicPieTrips = {
    appendPadding: 10,
    data: dataGraphicPieTrips,
    angleField: "value",
    colorField: "type",
    radius: 0.75,
    label: {
      type: "inner",
      labelHeight: 28,
      content: ({ percent }: PercentProps) => `${(percent * 100).toFixed(0)}%`,
    },
    interactions: [{ type: "element-selected" }, { type: "element-active" }],
  };

  const dataGraphicPieTypePayment = [
    {
      id: 1,
      label: "Dinheiro",
      value: datasDashboard?.paidOutMoney || 0,
    },
    {
      id: 2,
      label: "Voucher",
      value: datasDashboard?.paidOutVoucher || 0,
    },
    {
      id: 3,
      label: "Cartão",
      value: datasDashboard?.paidOutCreditCard || 0,
    },
  ];

  const configGraphicPieTypePayment = {
    appendPadding: 10,
    data: dataGraphicPieTypePayment,
    angleField: "value",
    colorField: "type",
    radius: 0.75,
    label: {
      type: "inner",
      labelHeight: 28,
      content: ({ percent }: PercentProps) => `${(percent * 100).toFixed(0)}%`,
    },
    interactions: [{ type: "element-selected" }, { type: "element-active" }],
  };

  function separateIntoContainers<T>(items: T[] | undefined | null): T[][] {
    const auxCards = [...(items ?? [])];
    const containerCards: T[][] = [];
    const deleteCount = Utils.isMobile() ? 1 : 4;
    while (auxCards.length) {
      containerCards.push(auxCards.splice(0, deleteCount));
    }
    return containerCards;
  }

  const list = separateIntoContainers<CurrentQuantitiesProps>(driversRequest?.drivers);
  const listCustomers = separateIntoContainers<CurrentQuantitiesProps>(driversRequest?.customers);

  const onFinishChange = () => {
    let parsedUserId: string | null = null;
    try {
      const userStr = localStorage.getItem("@App:user");
      if (userStr && userStr !== "undefined" && userStr !== "null") {
        parsedUserId = JSON.parse(userStr)?.idUser ?? null;
      }
    } catch {}

    const values = {
      currentPassword: localStorage.getItem("@App:password"),
      userId: parsedUserId as string,
      newPassword: inputRefPassword?.current?.input?.value || "",
    };
    setLoader("loadingPassword", true);
    apiv1
      .put(`user/${values?.userId}/password`, {
        password: values.newPassword,
        updatePasswordByConfig: true,
      })
      .then((resul) => {
        if (resul.status === 200) {
          localStorage.removeItem("@App:firstPasswordUsed");
          setLoader("loadingPassword", false);
          modalLottie.current?.closeModal();
          swal({
            title: "Senha alterada com sucesso",
            icon: "success",
          }).then(() => {
            setLoader("loadingPassword", false);
            modalLottie.current?.closeModal();
          });
          return;
        }
        swal({
          title: "Erro ao tentar alterar a senha",
          icon: "error",
        });
      })
      .finally(() => {
        setLoader("loadingPassword", false);
        modalLottie.current?.closeModal();
      });
  };
 
  const switchShowModalAdvertsings = (
    role: string,
    keyShowPublicity: string
  ) => {
    if (keyShowPublicity === "0") {
      return null;
    }

    if (
      (role === "admin" && keyShowPublicity === "1") ||
      keyShowPublicity === "2"
    ) {
      return (
        publicityInformations.length > 0 && (
          <ModalPublicity publicityInformations={publicityInformations} />
        )
      );
    }
  };

  const unifiedDataDashboard = async ({ forceCache = false }: { forceCache?: boolean } = {}) => {
    setLoadingFetchDataDashBoard(true);
    try {
      const response = await api(`dashboard/all`, {
        params: forceCache ? { forceCache: true } : {},
      });
      if (response.status) {
      
        const totalBilledFromApi = response.data.response?.totalBilled;
        const parsedBilled = CurrencyUtils.parseMonetaryValue(totalBilledFromApi);

        const statisticsByCity = response.data.response?.statisticsByCity || {};
        const todayTotalTrips = statisticsByCity.todayTotalTrips || 0;
        
        const calculatedTicketMedia = todayTotalTrips > 0 
          ? parsedBilled / todayTotalTrips 
          : 0;
        
        const ticketMediaFromApi = statisticsByCity?.ticketMedia;
        const parsedTicketMedia = ticketMediaFromApi 
          ? CurrencyUtils.parseMonetaryValue(ticketMediaFromApi)
          : calculatedTicketMedia;

        const parsedDriverRank = parseDriverRankFromApi((response.data.response?.rankingDriver || []) as ApiRankingDriverRaw[]);
        const parsedClientRank = parseClientRankFromApi((response.data.response?.rankingCustomer || []) as ApiRankingClientRaw[]);

        setDatasDashboard({
          ...statisticsByCity, 
          totalBilled: parsedBilled,
          ticketMedia: parsedTicketMedia,
          todayTotalTrips: todayTotalTrips
        })
        setDriversRequest(response.data.response?.currentQuantities)
        setDriverRank(parsedDriverRank);
        setClientRank(parsedClientRank);
        setCurrentDriverPage(1);
        setCurrentClientPage(1);
        setHasMoreDrivers(true);
        setHasMoreClients(true);
 
      }
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } }; message?: string };
      const errorMessage = err?.response?.data?.message ?? err?.message ?? "Erro ao carregar dados do dashboard";
      swal({
        title: errorMessage,
        icon: "error",
      });
    } finally {
      setLoadingFetchDataDashBoard(false)
    }
  }

  useEffect(() => {
    verifyHasFirstLogin();
    if (Session.hasCitySelected()) {
      unifiedDataDashboard(),
      getConfigsModalAdvertsings(),
      getErrorsKeysMaps(),
      try {
        const userStr = localStorage.getItem("@App:user");
        if (userStr && userStr !== "undefined" && userStr !== "null") {
          const parsed = JSON.parse(userStr);
          if (parsed?.role?.name) {
            roleUser = parsed.role.name.toLowerCase();
          }
        }
      } catch {}
    }
  }, []);

  const driverAllActives = driversRequest?.drivers?.reduce(
    (oldValue, currentValue) => {
      return oldValue + currentValue.active;
    },
    0
  );

  const customersAllActives = driversRequest?.customers?.reduce(
    (oldValue, currentValue) => {
      return oldValue + currentValue.active;
    },
    0
  );

  const projectName = Utils.capitalizeFirstLetter(import.meta.env.PROJECT_NAME) || "Fortaleza Movel";

  const handleOpenModalParabens = (item: { name: string; quantityTrips: number; phone?: string }, type: "driver" | "client") => {
    setModalParabens({
      open: true,
      name: item.name,
      quantityTrips: item.quantityTrips,
      phone: item.phone,
      type,
    });
  };

  const handleCloseModalParabens = () => {
    setModalParabens((prev) => ({ ...prev, open: false }));
  };

  const parseDriverRankFromApi = (items: ApiRankingDriverRaw[]): DriversRankingDataProps[] => {
    const mapped = items.map((d) => ({
      ...d,
      totalValue: CurrencyUtils.parseMonetaryValue(d.totalValue),
      phone: d.phone || "",
    })) as DriversRankingDataProps[];
    return deduplicateByKey(mapped, "idDriver");
  };

  const parseClientRankFromApi = (items: ApiRankingClientRaw[]): ClientRankingDataProps[] => {
    const mapped = items.map((c) => ({
      ...c,
      totalValue: CurrencyUtils.parseMonetaryValue(c.totalValue),
      phone: c.phone || "",
    })) as ClientRankingDataProps[];
    return deduplicateByKey(mapped, "idUser");
  };

  const fetchRankingByPeriod = async <T,>(
    endpoint: string,
    period: RankingPeriod,
    parse: (items: unknown[]) => T[],
    setters: { setData: (data: T[]) => void; setPage: (page: number) => void; setHasMore: (value: boolean) => void; setLoading: (value: boolean) => void }
  ): Promise<void> => {
    setters.setLoading(true);
    try {
      const response = await api.get(endpoint, {
        params: {
          page: 1,
          limit: 10,
          ...buildRankingPeriodParams(period),
        },
      });
      const raw = response?.data?.response;
      const items = Array.isArray(raw) ? raw : [];
      const parsed = parse(items as unknown[]);
      setters.setData(parsed);
      setters.setPage(1);
      setters.setHasMore(parsed.length >= 10);
    } catch {
      setters.setData([]);
      setters.setPage(1);
      setters.setHasMore(false);
    } finally {
      setters.setLoading(false);
    }
  };

  const fetchRankingDriver = (period: RankingPeriod) =>
    fetchRankingByPeriod(
      "dashboard/rankingDriver",
      period,
      (items) => parseDriverRankFromApi(items as ApiRankingDriverRaw[]),
      {
        setData: setDriverRank,
        setPage: setCurrentDriverPage,
        setHasMore: setHasMoreDrivers,
        setLoading: setLoadingRankingDriver,
      }
    );

  const fetchRankingClient = (period: RankingPeriod) =>
    fetchRankingByPeriod(
      "dashboard/rankingCustomer",
      period,
      (items) => parseClientRankFromApi(items as ApiRankingClientRaw[]),
      {
        setData: setClientRank,
        setPage: setCurrentClientPage,
        setHasMore: setHasMoreClients,
        setLoading: setLoadingRankingClient,
      }
    );

  const handleDriverRankPeriodChange = (period: RankingPeriod) => {
    setDriverRankPeriod(period);
    fetchRankingDriver(period);
  };

  const handleClientRankPeriodChange = (period: RankingPeriod) => {
    setClientRankPeriod(period);
    fetchRankingClient(period);
  };

  const handleWhatsAppClick = (phone: string | undefined, name: string, type: "driver" | "client") => {
    const cleanPhone = formatPhoneForWhatsApp(phone);
    if (!cleanPhone) {
      swal({
        title: "Telefone não disponível",
        text: `O telefone do ${type === "driver" ? "motorista" : "cliente"} ${name} não está disponível.`,
        icon: "warning",
      });
      return;
    }

    const message = `Olá ${name}, somos o suporte da ${projectName}. Como podemos ajudar?`;
    openWhatsApp(phone, message);
  };

  const calculateTicketMedio = (totalValue: number, quantityTrips: number): number => {
    if (quantityTrips === 0) return 0;
    return totalValue / quantityTrips;
  };

  const loadMoreDrivers = async () => {
    if (loadingMoreDrivers || !hasMoreDrivers) {
      return;
    }
    
    setLoadingMoreDrivers(true);
    const nextPage = currentDriverPage + 1;
    
    try {
      const citySelected = Session.getLocal("citySelected");
      const cityId = Array.isArray(citySelected) ? citySelected[0]?.cityId : citySelected?.cityId;
      
      if (!cityId) {
        setLoadingMoreDrivers(false);
        return;
      }

      const response = await api.get(`dashboard/rankingDriver`, {
        params: {
          page: nextPage,
          limit: 10,
          ...buildRankingPeriodParams(driverRankPeriod),
        },
      });
      
      if (response.status && response.data.response) {
        const parsedDriverRank = parseDriverRankFromApi(response.data.response as ApiRankingDriverRaw[]);

        if (parsedDriverRank.length === 0) {
          setHasMoreDrivers(false);
        } else {
          setDriverRank(prev => {
            const existingIds = new Set(prev.map((d: DriversRankingDataProps) => d.idDriver));
            const newDrivers = parsedDriverRank.filter((d: DriversRankingDataProps) => !existingIds.has(d.idDriver));
            
            if (newDrivers.length === 0) {
              setHasMoreDrivers(false);
              return prev;
            }
            
            const newList = [...prev, ...newDrivers];
            return newList;
          });
          setCurrentDriverPage(nextPage);
          if (parsedDriverRank.length < 10) {
            setHasMoreDrivers(false);
          }
        }
      } else {
        setHasMoreDrivers(false);
      }
    } catch {
      setHasMoreDrivers(false);
    } finally {
      setLoadingMoreDrivers(false);
    }
  };

  const loadMoreClients = async () => {
    if (loadingMoreClients || !hasMoreClients) {
      return;
    }
    
    setLoadingMoreClients(true);
    const nextPage = currentClientPage + 1;
    
    try {
      const response = await api.get(`dashboard/rankingCustomer`, {
        params: {
          page: nextPage,
          limit: 10,
          ...buildRankingPeriodParams(clientRankPeriod),
        },
      });
      
      if (response.status && response.data.response) {
        const parsedClientRank = parseClientRankFromApi(response.data.response as ApiRankingClientRaw[]);

        if (parsedClientRank.length === 0) {
          setHasMoreClients(false);
        } else {
          setClientRank(prev => {
            const existingIds = new Set(prev.map((c: ClientRankingDataProps) => c.idUser));
            const newClients = parsedClientRank.filter((c: ClientRankingDataProps) => !existingIds.has(c.idUser));
            
            if (newClients.length === 0) {
              setHasMoreClients(false);
              return prev;
            }
            
            const newList = [...prev, ...newClients];
            return newList;
          });
          setCurrentClientPage(nextPage);
          if (parsedClientRank.length < 10) {
            setHasMoreClients(false);
          }
        }
      } else {
        setHasMoreClients(false);
      }
    } catch {
      setHasMoreClients(false);
    } finally {
      setLoadingMoreClients(false);
    }
  };

  const handleScroll = (
    e: React.UIEvent<HTMLDivElement>,
    type: "driver" | "client"
  ) => {
    const target = e.currentTarget;
    const scrollBottom = target.scrollHeight - target.scrollTop - target.clientHeight;
    
    if (scrollBottom < 100) {
      if (type === "driver") {
        if (hasMoreDrivers && !loadingMoreDrivers) {
          loadMoreDrivers();
        }
      } else {
        if (hasMoreClients && !loadingMoreClients) {
          loadMoreClients();
        }
      }
    }
  };

  return (
    <DashBoardContainer>
      <GridButtonRefresh>
        <h2>Tipos de Motorista</h2>
        <Tooltip title="Os dados são atualizados a cada 2 horas.
Clique para ver a versão mais recente agora.">
                        
                      
      <Button loading={loadings.loadingPassword}
              type="primary"
              onClick={() => {return unifiedDataDashboard({ forceCache: true })}}
              >Atualizar Dados</Button>
              </Tooltip>
      </GridButtonRefresh>
       <hr />
      <CardTyperDriverContainer>
        <TypesOfDrivers>
          {loadingFetchDataDashBoard == true ? (
            <DriverCardSkeleton />
          ) : (
            <TypeDriversCarousel>
              {list.map((content, index) => (
                <CardContainerMap key={index}>
                  {content.length === 0
                    ? "não tem motorista cadastrado para essa cidade"
                    : ""}
                  {content.map((item: CurrentQuantitiesProps, index) => (
                    <TypeDriversCard key={Number(index)}>
                      <TypeDriverImageContainer>
                        <TypeDriverImage preview={false} src={item.picture} />
                      </TypeDriverImageContainer>
                      <TypeDriverContainer>{item.type}</TypeDriverContainer>
                      <div>
                        <TypeDriverDataContainer>
                          <TypeDriverDataLabel>
                            Total de veículos:
                          </TypeDriverDataLabel>
                          <TypeDriverDataItem>{item.total}</TypeDriverDataItem>
                        </TypeDriverDataContainer>
                        <TypeDriverDataContainer>
                          <TypeDriverDataLabel>Ativos:</TypeDriverDataLabel>
                          <TypeDriverDataItem>{item.active}</TypeDriverDataItem>
                        </TypeDriverDataContainer>
                        <TypeDriverDataContainer>
                          <TypeDriverDataLabel>Pendentes:</TypeDriverDataLabel>
                          <TypeDriverDataItem>
                            {item.pending}
                          </TypeDriverDataItem>
                        </TypeDriverDataContainer>
                        <TypeDriverDataContainer>
                          <TypeDriverDataLabel>
                            Aguardando liberação:
                          </TypeDriverDataLabel>
                          <TypeDriverDataItem>
                            {item.waiting_answer}
                          </TypeDriverDataItem>
                        </TypeDriverDataContainer>
                        <TypeDriverDataContainer>
                          <TypeDriverDataLabel>Bloqueados:</TypeDriverDataLabel>
                          <TypeDriverDataItem>
                            {item.blocked}
                          </TypeDriverDataItem>
                        </TypeDriverDataContainer>
                      </div>
                    </TypeDriversCard>
                  ))}
                </CardContainerMap>
              ))}
            </TypeDriversCarousel>
          )}
          {list.length === 0 && loadingFetchDataDashBoard === false ? (
            <TitleNotTypesDrivers>
              Nenhum tipo de motorista encontrado
            </TitleNotTypesDrivers>
          ) : null}
        </TypesOfDrivers>
      </CardTyperDriverContainer>

      {listCustomers.length > 0 && (
        <>
          <h2>Clientes</h2>
          <hr />
          <CardTyperDriverContainer>
            <TypesOfDrivers>
              {loadingFetchDataDashBoard ? (
                <DriverCardSkeleton />
              ) : (
                <TypeDriversCarousel>
                  {(driversRequest?.customers ?? []).map((item: CurrentQuantitiesProps) => (
                    <CustomersCardWrapper key={`customers-${item.type}`}>
                      <CustomersCardsRow>
                        <CustomerMetricCard>
                          <CustomerMetricContent>
                            <CustomerMetricLabel>Total de clientes</CustomerMetricLabel>
                            <CustomerMetricValue>{item.total}</CustomerMetricValue>
                          </CustomerMetricContent>
                        </CustomerMetricCard>
                        <CustomerMetricCard>
                          <CustomerMetricContent>
                            <CustomerMetricLabel>Clientes ativos</CustomerMetricLabel>
                            <CustomerMetricValue>{item.active}</CustomerMetricValue>
                          </CustomerMetricContent>
                        </CustomerMetricCard>
                        <CustomerMetricCard>
                          <CustomerMetricContent>
                            <CustomerMetricLabel>Clientes pendentes</CustomerMetricLabel>
                            <CustomerMetricValue>{item.pending}</CustomerMetricValue>
                          </CustomerMetricContent>
                        </CustomerMetricCard>
                        <CustomerMetricCard>
                          <CustomerMetricContent>
                            <CustomerMetricLabel>Clientes bloqueados</CustomerMetricLabel>
                            <CustomerMetricValue>{item.blocked}</CustomerMetricValue>
                          </CustomerMetricContent>
                        </CustomerMetricCard>
                      </CustomersCardsRow>
                    </CustomersCardWrapper>
                  ))}
                </TypeDriversCarousel>
              )}
            </TypesOfDrivers>
          </CardTyperDriverContainer>
        </>
      )}

      <h2>Estatísticas</h2>
      <hr />
      <StatisticContainer>
        <LineConatiner>
          <StatisticRealTime>
            <TripAndTicketOfToday>
              <TripAndTicketContainer>
                {loadingFetchDataDashBoard ? (
                  <SkeletonContainer>
                    <Skeleton paragraph={false} active={true} />
                    <Skeleton paragraph={false} active={true} />
                  </SkeletonContainer>
                ) : (
                  <>
                    <TripAndTicketData>
                      <TripAndTicked>Total de viagens de hoje</TripAndTicked>
                      {datasDashboard?.todayTotalTrips}
                    </TripAndTicketData>
                    <TripAndTicketData>
                      
                      <TripAndTicked>Ticket médio de hoje</TripAndTicked>
                      {CurrencyUtils.formatCurrency(datasDashboard?.ticketMedia ?? 0)}
                    </TripAndTicketData>

                    <TripAndTicketData>
                      <TripAndTicked>Total faturado de hoje</TripAndTicked>
                      {CurrencyUtils.formatCurrency(datasDashboard?.totalBilled ?? 0)}
                    </TripAndTicketData>
                  </>
                )}
              </TripAndTicketContainer>
            </TripAndTicketOfToday>
            <ClientsAndDriversRealTime>
              {loadingFetchDataDashBoard == true ? (
                <SkeletonContainer>
                  <Skeleton paragraph={false} active={true} />
                  <Skeleton paragraph={false} active={true} />
                </SkeletonContainer>
              ) : (
                <TripAndTicketContainer>
                  <TripAndTicketData>
                    <TripAndTicked>Clientes ativos</TripAndTicked>
                    <TripAndTicked>{customersAllActives}</TripAndTicked>
                  </TripAndTicketData>
                  <TripAndTicketData>
                    <TripAndTicked>Motoristas ativos</TripAndTicked>
                    <TripAndTicked>{driverAllActives}</TripAndTicked>
                  </TripAndTicketData>
                </TripAndTicketContainer>
              )}
            </ClientsAndDriversRealTime>
          </StatisticRealTime>
          <CardOfInformations>
            {loadingFetchDataDashBoard ? (
              <SkeletonContainer>
                <Skeleton active={true} />
              </SkeletonContainer>
            ) : (
              <>
                <TextOfCard>Corridas</TextOfCard>
                <ContentCardInformations>
                  <ContainerInformationsData>
                    <ContainerOfCarInformationGlobal>
                      <ParagraphBasicGlobal>Em dinheiro</ParagraphBasicGlobal>
                      <ParagraphBasicGlobal>
                        {datasDashboard?.paidOutMoney}
                      </ParagraphBasicGlobal>
                    </ContainerOfCarInformationGlobal>
                    <ContainerOfCarInformationGlobal>
                      <ParagraphBasicGlobal>Em voucher</ParagraphBasicGlobal>
                      <ParagraphBasicGlobal>
                        {datasDashboard?.paidOutVoucher}
                      </ParagraphBasicGlobal>
                    </ContainerOfCarInformationGlobal>
                    <ContainerOfCarInformationGlobal
                      style={{
                        border: "none",
                      }}
                    >
                      <ParagraphBasicGlobal>Cartão</ParagraphBasicGlobal>
                      <ParagraphBasicGlobal>
                        {datasDashboard?.paidOutCreditCard}
                      </ParagraphBasicGlobal>
                    </ContainerOfCarInformationGlobal>
                  </ContainerInformationsData>

                  <PieChart
                    series={[
                      {
                        data: configGraphicPieTypePayment.data as any,
                      },
                    ]}
                    width={350}
                    height={180}
                  />
                </ContentCardInformations>
              </>
            )}
          </CardOfInformations>
        </LineConatiner>
        <LineConatiner>
          <CardOfInformations>
            {loadingFetchDataDashBoard ? (
              <SkeletonContainer>
                <Skeleton active={true} />
              </SkeletonContainer>
            ) : (
              <>
                <TextOfCard>Viagens canceladas</TextOfCard>
                <ContentCardInformations>
                  <ContainerInformationsData>
                    <InformationsDataMap>
                      <TripsLabel>Motorista</TripsLabel>
                      <TripsItem>{datasDashboard?.canceledbyDriver}</TripsItem>
                    </InformationsDataMap>
                    <InformationsDataMap>
                      <TripsLabel>Cliente</TripsLabel>
                      <TripsItem>
                        {datasDashboard?.canceledbyCustomer}
                      </TripsItem>
                    </InformationsDataMap>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        padding: "10px",
                      }}
                    >
                      <TripsLabel>Total de cancelamento</TripsLabel>
                      <TripsItem>{datasDashboard?.totalCanceled}</TripsItem>
                    </div>
                  </ContainerInformationsData>

                  <PieChart
                    series={[
                      {
                        data: configGraphicPie.data as any,
                      },
                    ]}
                    width={350}
                    height={180}
                  />
                </ContentCardInformations>
              </>
            )}
          </CardOfInformations>
          <CardOfInformations>
            {loadingFetchDataDashBoard ? (
              <SkeletonContainer>
                <Skeleton active={true} />
              </SkeletonContainer>
            ) : (
              <>
                <TextOfCard>Viagens</TextOfCard>
                <ContentCardInformations>
                  <ContainerInformationsData>
                    <InformationsDataMap>
                      <TripsLabel>Aceitas</TripsLabel>
                      <TripsItem>{datasDashboard?.tripAccepted}</TripsItem>
                    </InformationsDataMap>

                    <InformationsDataMap>
                      <TripsLabel>Finalizadas</TripsLabel>
                      <TripsItem>{datasDashboard?.tripFinished}</TripsItem>
                    </InformationsDataMap>

                    <TripsAcceptedContainer>
                      <TripsLabel>Total de viagens</TripsLabel>
                      <TripsItem>{datasDashboard?.totalTrips}</TripsItem>
                    </TripsAcceptedContainer>
                  </ContainerInformationsData>

                  <PieChart
                    series={[
                      {
                        data: configGraphicPieTrips.data as any,
                      },
                    ]}
                    width={350}
                    height={180}
                  />
                </ContentCardInformations>
              </>
            )}
          </CardOfInformations>
        </LineConatiner>
        <TopDriversAndClients>
          <CardOfInformations>
            {driverRank.length == 0 && loadingFetchDataDashBoard == true ? (
              <SkeletonContainer>
                <Skeleton active={true} />
              </SkeletonContainer>
            ) : (
              <>
                <CardHeaderRow>
                  <TextOfCard>Top Motoristas</TextOfCard>
                  <ContentFilteredMonthAndDay>
                    <RankingFilterLabel>Filtro:</RankingFilterLabel>
                    <ButtonsFiltered
                      type="button"
                      selected={driverRankPeriod === "day"}
                      onClick={() => handleDriverRankPeriodChange("day")}
                    >
                      dia
                    </ButtonsFiltered>
                    <ButtonsFiltered
                      type="button"
                      selected={driverRankPeriod === "month"}
                      onClick={() => handleDriverRankPeriodChange("month")}
                    >
                      mês
                    </ButtonsFiltered>
                    <ButtonsFiltered
                      type="button"
                      selected={driverRankPeriod === "all"}
                      onClick={() => handleDriverRankPeriodChange("all")}
                    >
                      geral
                    </ButtonsFiltered>
                  </ContentFilteredMonthAndDay>
                </CardHeaderRow>
                <TopListContainer onScroll={(e) => handleScroll(e, "driver")}>
                  {loadingRankingDriver ? (
                    <LoadingMoreSpinner>
                      <Spin size="small" />
                      <LoadingMoreText style={{ marginLeft: "8px" }}>Carregando ranking...</LoadingMoreText>
                    </LoadingMoreSpinner>
                  ) : (
                  <>
                  {driverRank.map((item) => {
                    const ticketMedio = calculateTicketMedio(item.totalValue, item.quantityTrips);
                    return (
                      <TopItemContainer key={`driver-${item.idDriver}`}>
                        <TopItemContent>
                          <TopName>{item.name}</TopName>
                          <TopContainer>
                            <TopName>{item.quantityTrips}</TopName>
                            <TopItem>viagens,</TopItem>
                            <TopItem>
                              {CurrencyUtils.formatCurrency(item.totalValue)}
                            </TopItem>
                            <TicketMedioText>
                              tícket Méd. {CurrencyUtils.formatCurrency(ticketMedio)}
                            </TicketMedioText>
                          </TopContainer>
                        </TopItemContent>
                        <TopItemActions>
                          <ButtonParabens
                            type="button"
                            onClick={() => handleOpenModalParabens(item, "driver")}
                            title="Enviar mensagem de parabéns"
                            aria-label={`Enviar mensagem de parabéns para ${item.name}`}
                          >
                            Parabéns
                          </ButtonParabens>
                          <WhatsAppLink
                            onClick={(e) => {
                              e.preventDefault();
                              handleWhatsAppClick(item.phone, item.name, "driver");
                            }}
                            href="#"
                            title={`Falar com ${item.name} via WhatsApp`}
                          >
                            <FaWhatsapp />
                          </WhatsAppLink>
                        </TopItemActions>
                      </TopItemContainer>
                    );
                  })}
                  {loadingMoreDrivers && (
                    <LoadingMoreSpinner>
                      <Spin size="small" />
                      <LoadingMoreText style={{ marginLeft: '10px' }}>Carregando mais motoristas...</LoadingMoreText>
                    </LoadingMoreSpinner>
                  )}
                  {!hasMoreDrivers && driverRank.length > 0 && !loadingMoreDrivers && (
                    <LoadingMoreText>Não há mais motoristas para carregar</LoadingMoreText>
                  )}
                  </>
                  )}
                </TopListContainer>
              </>
            )}
          </CardOfInformations>
          <CardOfInformations>
            {clientRank.length == 0 && loadingFetchDataDashBoard == true ? (
              <SkeletonContainer>
                <Skeleton active={true} />
              </SkeletonContainer>
            ) : (
              <>
                <CardHeaderRow>
                  <TextOfCard>Top Clientes</TextOfCard>
                  <ContentFilteredMonthAndDay>
                    <RankingFilterLabel>Filtro:</RankingFilterLabel>
                    <ButtonsFiltered
                      type="button"
                      selected={clientRankPeriod === "day"}
                      onClick={() => handleClientRankPeriodChange("day")}
                    >
                      dia
                    </ButtonsFiltered>
                    <ButtonsFiltered
                      type="button"
                      selected={clientRankPeriod === "month"}
                      onClick={() => handleClientRankPeriodChange("month")}
                    >
                      mês
                    </ButtonsFiltered>
                    <ButtonsFiltered
                      type="button"
                      selected={clientRankPeriod === "all"}
                      onClick={() => handleClientRankPeriodChange("all")}
                    >
                      geral
                    </ButtonsFiltered>
                  </ContentFilteredMonthAndDay>
                </CardHeaderRow>
                <TopListContainer onScroll={(e) => handleScroll(e, "client")}>
                  {loadingRankingClient ? (
                    <LoadingMoreSpinner>
                      <Spin size="small" />
                      <LoadingMoreText style={{ marginLeft: "8px" }}>Carregando ranking...</LoadingMoreText>
                    </LoadingMoreSpinner>
                  ) : (
                  <>
                  {clientRank.map((item) => {
                    const ticketMedio = calculateTicketMedio(item.totalValue, item.quantityTrips);
                    return (
                      <TopItemContainer key={`client-${item.idUser}`}>
                        <TopItemContent>
                          <TopName>{item.name}</TopName>
                          <TopContainer>
                            <TopName>{item.quantityTrips}</TopName>
                            <TopItem>viagens,</TopItem>
                            <TopItem>
                              {CurrencyUtils.formatCurrency(item.totalValue)}
                            </TopItem>
                            <TicketMedioText>
                              tícket Méd. {CurrencyUtils.formatCurrency(ticketMedio)}
                            </TicketMedioText>
                          </TopContainer>
                        </TopItemContent>
                        <TopItemActions>
                          <ButtonParabens
                            type="button"
                            onClick={() => handleOpenModalParabens(item, "client")}
                            title="Enviar mensagem de parabéns"
                            aria-label={`Enviar mensagem de parabéns para ${item.name}`}
                          >
                            Parabéns
                          </ButtonParabens>
                          <WhatsAppLink
                            onClick={(e) => {
                              e.preventDefault();
                              handleWhatsAppClick(item.phone, item.name, "client");
                            }}
                            href="#"
                            title={`Falar com ${item.name} via WhatsApp`}
                          >
                            <FaWhatsapp />
                          </WhatsAppLink>
                        </TopItemActions>
                      </TopItemContainer>
                    );
                  })}
                  {loadingMoreClients && (
                    <LoadingMoreSpinner>
                      <Spin size="small" />
                      <LoadingMoreText style={{ marginLeft: '10px' }}>Carregando mais clientes...</LoadingMoreText>
                    </LoadingMoreSpinner>
                  )}
                  {!hasMoreClients && clientRank.length > 0 && !loadingMoreClients && (
                    <LoadingMoreText>Não há mais clientes para carregar</LoadingMoreText>
                  )}
                  </>
                  )}
                </TopListContainer>
              </>
            )}
          </CardOfInformations>
        </TopDriversAndClients>
      </StatisticContainer>

      {roleUser &&
        keyEnableShowPublicity &&
        switchShowModalAdvertsings(roleUser, keyEnableShowPublicity)}

      <ModalLottie
        title="Alteração de Senha"
        description="Você está acessando o sistema pela primeira vez, por favor, altere sua senha para continuar."
        footer={[<></>]}
        ref={modalLottie}
        children={
          <ContainerInput>
            <Input.Password
              iconRender={(visible) =>
                visible ? <IoEyeOutline /> : <AiOutlineEyeInvisible />
              }
              ref={inputRefPassword}
              size="large"
              placeholder="Nova senha"
            />
            <Button
              loading={loadings.loadingPassword}
              type="primary"
              onClick={onFinishChange}
            >
              Alterar senha
            </Button>
          </ContainerInput>
        }
        noDismissAutoClose
      />

      {showModalMapKeysThisSession && <ModalAlertKeysMaps />}

      {modalParabens.open && (
        <ModalWhatsAppParabens
          open={modalParabens.open}
          onClose={handleCloseModalParabens}
          name={modalParabens.name}
          quantityTrips={modalParabens.quantityTrips}
          phone={modalParabens.phone}
          projectName={projectName}
          type={modalParabens.type}
        />
      )}

    </DashBoardContainer>
  );
};

export default DashBoard;
