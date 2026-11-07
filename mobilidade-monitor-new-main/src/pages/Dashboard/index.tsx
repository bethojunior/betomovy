import { FC, useState, useEffect, useRef } from "react";
import {
  DashBoardContainer,
  DashboardHeroHeader,
  DashboardTitleGroup,
  DashboardTitle,
  DashboardSubtitle,
  HeaderActionsRow,
  LiveIndicatorPill,
  PulseDot,
  CityPill,
  ModernRefreshBtn,
  KpiOverviewGrid,
  ModernKpiCard,
  KpiIconBadge,
  KpiDetails,
  KpiMetricLabel,
  KpiMetricValue,
  KpiMetricHint,
  SectionCard,
  SectionHeader,
  SectionHeaderLeft,
  SectionTitleText,
  SectionCounterBadge,
  SectionDescription,
  ModernDriverTypesGrid,
  DriverCategoryCard,
  DriverCategoryHeader,
  DriverAvatarCircle,
  DriverCategoryInfo,
  DriverCategoryName,
  DriverCategorySubtitle,
  DriverTotalBanner,
  DriverTotalLabel,
  DriverTotalValue,
  DriverStatusGrid,
  DriverStatusItem,
  DriverStatusDot,
  DriverActiveRatioBar,
  DriverActiveRatioFill,
  ModernCustomersGrid,
  ModernCustomerCard,
  CustomerCardTop,
  CustomerCardIconWrap,
  CustomerCardCount,
  CustomerCardTitleText,
  ModernAnalyticsGrid,
  ModernAnalyticsCard,
  AnalyticsCardTop,
  AnalyticsCardTitle,
  AnalyticsCardBody,
  AnalyticsDataList,
  AnalyticsDataItem,
  AnalyticsItemLeft,
  AnalyticsColorDot,
  AnalyticsItemName,
  AnalyticsItemValue,
  AnalyticsChartWrap,
  ModernRankingsGrid,
  ModernRankingCard,
  RankingHeaderWrap,
  RankingFiltersWrap,
  RankingFilterPill,
  RankingScrollList,
  RankingListItem,
  RankingPositionBadge,
  RankingUserMeta,
  RankingUserNameText,
  RankingStatsPills,
  RankingStatChip,
  RankingActionBtns,
  WhatsAppActionBtn,
  CelebrateActionBtn,
  SkeletonContainer,
  ContainerInput,
  LoadingMoreSpinner,
  LoadingMoreText,
  TitleNotTypesDrivers,
} from "./styles";
import api from "../../services/api";
import Utils from "../../utils/Utils";
import DriverCardSkeleton from "../../components/SkeletonDashBoard/DriverCard";
import { Button, Input, InputRef, Skeleton, Tooltip, Spin } from "antd";
import { PieChart } from "@mui/x-charts/PieChart";
import { FaWhatsapp, FaCarSide, FaTrophy } from "react-icons/fa";
import {
  FiRefreshCw,
  FiTrendingUp,
  FiDollarSign,
  FiUsers,
  FiUserCheck,
  FiUserX,
  FiClock,
  FiMapPin,
  FiActivity,
  FiAward,
} from "react-icons/fi";

import carDefaultImg from "../../assets/carDefault.png";

import {
  DatasDashboardProps,
  ClientRankingDataProps,
  DriversRankingDataProps,
  CurrentQuantitiesProps,
  ApiRankingDriverRaw,
  ApiRankingClientRaw,
  RankingPeriod,
  ModalParabensState,
  ListCurrentQuantitiesProps,
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

  const [driversRequest, setDriversRequest] = useState<ListCurrentQuantitiesProps>();

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
  const [lastUpdated, setLastUpdated] = useState<string>("");
  const [modalParabens, setModalParabens] = useState<ModalParabensState>({
    open: false,
    name: "",
    quantityTrips: 0,
    type: "driver",
  });

  const [loadings, setLoadings] = useState({
    loadingPassword: false,
  });

  const [loadingFetchDataDashBoard, setLoadingFetchDataDashBoard] = useState(true);

  const [errorMapKey, setErrorMapKey] = useState<ErrorKeysMapsProps | null>(null);
  const [publicityInformations, setPublicityInfomations] = useState<PublicityProps[]>([]);

  const verifyHasFirstLogin = () => {
    const firstLogin = localStorage.getItem("@App:firstPasswordUsed");
    if (firstLogin) {
      modalLottie.current?.openModal();
      return;
    }
  };

  useEffect(() => {
    if (!errorMapKey) {
      return;
    }

    const alreadyShown = sessionStorage.getItem("hasSeenMapKeyModal");

    const hasError =
      errorMapKey.direction !== true ||
      errorMapKey.geocoding !== true ||
      errorMapKey.place !== true;

    const notTestPage = window.location.pathname !== "/mapSetting/tests";

    if (!alreadyShown && hasError && notTestPage) {
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

      if (responseConfigModalAdvertsings.status && Array.isArray(responseConfigModalAdvertsings.data?.response)) {
        const configsGestor = responseConfigModalAdvertsings.data.response.find(
          (data: KeysAppProps) => data?.type === "GESTOR"
        );

        if (configsGestor?.config && Array.isArray(configsGestor.config)) {
          keyEnableShowPublicity = configsGestor.config.find(
            (data: ConfigsKeyAppsProps) => data?.key === "enable_publicity"
          )?.value;
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  const getErrorsKeysMaps = async () => {
    try {
      const responseErrorKeysMaps = await apiApp.get("map/allServiceTest/");

      if (responseErrorKeysMaps?.data) {
        const data = responseErrorKeysMaps.data?.data ?? responseErrorKeysMaps.data?.response;
        if (data) {
          setErrorMapKey(data);
        }
      }
    } catch (error) {
      // Ignora erro silenciosamente
    }
  };

  const getPublicities = async () => {
    try {
      const responsePublicities = await api.get(`publicity/advertising/customer`);

      if (responsePublicities.status) {
        setPublicityInfomations(responsePublicities.data.response);
      }
    } catch (error) {
      const responseError = error as AxiosError;
      if (responseError.message === "Não autorizado") {
        return;
      }
    }
  };

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

  const switchShowModalAdvertsings = (role: string, keyShowPublicity: string) => {
    if (keyShowPublicity === "0") {
      return null;
    }

    if ((role === "admin" && keyShowPublicity === "1") || keyShowPublicity === "2") {
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
        const payload = response.data?.data || response.data?.response || {};

        const totalBilledFromApi = payload.totalBilled;
        const parsedBilled = CurrencyUtils.parseMonetaryValue(totalBilledFromApi);

        const statisticsByCity = payload.statisticsByCity || {};
        const todayTotalTrips = statisticsByCity.todayTotalTrips || 0;

        const calculatedTicketMedia = todayTotalTrips > 0 ? parsedBilled / todayTotalTrips : 0;

        const ticketMediaFromApi = statisticsByCity?.ticketMedia;
        const parsedTicketMedia = ticketMediaFromApi
          ? CurrencyUtils.parseMonetaryValue(ticketMediaFromApi)
          : calculatedTicketMedia;

        const parsedDriverRank = parseDriverRankFromApi((payload.rankingDriver || []) as ApiRankingDriverRaw[]);
        const parsedClientRank = parseClientRankFromApi((payload.rankingCustomer || []) as ApiRankingClientRaw[]);

        setDatasDashboard({
          ...statisticsByCity,
          totalBilled: parsedBilled,
          ticketMedia: parsedTicketMedia,
          todayTotalTrips: todayTotalTrips,
        });
        setDriversRequest(payload.currentQuantities || {});
        setDriverRank(parsedDriverRank);
        setClientRank(parsedClientRank);
        setCurrentDriverPage(1);
        setCurrentClientPage(1);
        setHasMoreDrivers(true);
        setHasMoreClients(true);
        setLastUpdated(
          new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit", second: "2-digit" })
        );
      }
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } }; message?: string };
      const errorMessage = err?.response?.data?.message ?? err?.message ?? "Erro ao carregar dados do dashboard";
      swal({
        title: errorMessage,
        icon: "error",
      });
    } finally {
      setLoadingFetchDataDashBoard(false);
    }
  };

  useEffect(() => {
    verifyHasFirstLogin();
    if (Session.hasCitySelected()) {
      unifiedDataDashboard();
      getConfigsModalAdvertsings();
      getErrorsKeysMaps();
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

  const driverAllActives = (driversRequest?.drivers || []).reduce((acc, curr) => {
    return acc + (Number(curr.active) || 0);
  }, 0);

  const totalVehiclesCount = (driversRequest?.drivers || []).reduce((acc, curr) => {
    return acc + (Number(curr.total) || 0);
  }, 0);

  const customersAllActives = (driversRequest?.customers || []).reduce((acc, curr) => {
    return acc + (Number(curr.active) || 0);
  }, 0);

  const customersAllTotal = (driversRequest?.customers || []).reduce((acc, curr) => {
    return acc + (Number(curr.total) || 0);
  }, 0);

  const customersAllPending = (driversRequest?.customers || []).reduce((acc, curr) => {
    return acc + (Number(curr.pending) || 0);
  }, 0);

  const customersAllBlocked = (driversRequest?.customers || []).reduce((acc, curr) => {
    return acc + (Number(curr.blocked) || 0);
  }, 0);

  const projectName = Utils.capitalizeFirstLetter(import.meta.env.PROJECT_NAME) || "Fortaleza Movel";

  const getSelectedCityLabel = (): string => {
    try {
      const raw = Session.getLocal("citySelected");
      if (!raw) return "Petrolina - PE";
      const parsed = typeof raw === "string" ? JSON.parse(raw) : raw;
      const item = Array.isArray(parsed) ? parsed[0] : parsed;
      if (item?.cityName) {
        return `${item.cityName}${item.state ? ` - ${item.state}` : ""}`;
      }
      if (item?.name) return item.name;
      return "Petrolina - PE";
    } catch {
      return "Petrolina - PE";
    }
  };

  const handleOpenModalParabens = (
    item: { name: string; quantityTrips: number; phone?: string },
    type: "driver" | "client"
  ) => {
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
    setters: {
      setData: (data: T[]) => void;
      setPage: (page: number) => void;
      setHasMore: (value: boolean) => void;
      setLoading: (value: boolean) => void;
    }
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
      const raw = response?.data?.data || response?.data?.response;
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

      const resList = response.data?.data || response.data?.response;
      if (response.status && resList) {
        const parsedDriverRank = parseDriverRankFromApi(resList as ApiRankingDriverRaw[]);

        if (parsedDriverRank.length === 0) {
          setHasMoreDrivers(false);
        } else {
          setDriverRank((prev) => {
            const safePrev = Array.isArray(prev) ? prev : [];
            const existingIds = new Set(safePrev.map((d: DriversRankingDataProps) => d.idDriver));
            const newDrivers = parsedDriverRank.filter((d: DriversRankingDataProps) => !existingIds.has(d.idDriver));

            if (newDrivers.length === 0) {
              setHasMoreDrivers(false);
              return safePrev;
            }

            return [...safePrev, ...newDrivers];
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

      const resList = response.data?.data || response.data?.response;
      if (response.status && resList) {
        const parsedClientRank = parseClientRankFromApi(resList as ApiRankingClientRaw[]);

        if (parsedClientRank.length === 0) {
          setHasMoreClients(false);
        } else {
          setClientRank((prev) => {
            const safePrev = Array.isArray(prev) ? prev : [];
            const existingIds = new Set(safePrev.map((c: ClientRankingDataProps) => c.idUser));
            const newClients = parsedClientRank.filter((c: ClientRankingDataProps) => !existingIds.has(c.idUser));

            if (newClients.length === 0) {
              setHasMoreClients(false);
              return safePrev;
            }

            return [...safePrev, ...newClients];
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

  const handleScroll = (e: React.UIEvent<HTMLDivElement>, type: "driver" | "client") => {
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

  // Pie Chart Data Setup
  const paymentFormsData = [
    { id: 1, label: "Dinheiro", value: datasDashboard?.paidOutMoney || 0, color: "#10b981" },
    { id: 2, label: "Voucher", value: datasDashboard?.paidOutVoucher || 0, color: "#6366f1" },
    { id: 3, label: "Cartão", value: datasDashboard?.paidOutCreditCard || 0, color: "#0284c7" },
  ];
  const hasPaymentData = paymentFormsData.some((d) => d.value > 0);

  const tripsStatusData = [
    { id: 1, label: "Aceitas", value: datasDashboard?.tripAccepted || 0, color: "#0284c7" },
    { id: 2, label: "Finalizadas", value: datasDashboard?.tripFinished || 0, color: "#10b981" },
  ];
  const hasTripsData = tripsStatusData.some((d) => d.value > 0);

  const cancellationsData = [
    { id: 1, label: "Pelo Motorista", value: datasDashboard?.canceledbyDriver || 0, color: "#f59e0b" },
    { id: 2, label: "Pelo Passageiro", value: datasDashboard?.canceledbyCustomer || 0, color: "#ef4444" },
  ];
  const hasCancellationsData = cancellationsData.some((d) => d.value > 0);

  const driverList = driversRequest?.drivers || [];

  return (
    <DashBoardContainer>
      {/* ==========================================================================
          Executive Hero Header
         ========================================================================== */}
      <DashboardHeroHeader>
        <DashboardTitleGroup>
          <DashboardTitle>
            <FiActivity /> Dashboard Operacional
          </DashboardTitle>
          <DashboardSubtitle>
            Métricas de frota, status de viagens e faturamento consolidado em tempo real
          </DashboardSubtitle>
        </DashboardTitleGroup>

        <HeaderActionsRow>
          <LiveIndicatorPill>
            <PulseDot />
            Ao vivo
          </LiveIndicatorPill>

          <CityPill>
            <FiMapPin />
            {getSelectedCityLabel()}
          </CityPill>

          <Tooltip title="Atualiza todos os dados e sincroniza com o servidor em tempo real.">
            <ModernRefreshBtn
              $loading={loadingFetchDataDashBoard}
              disabled={loadingFetchDataDashBoard}
              onClick={() => unifiedDataDashboard({ forceCache: true })}
            >
              <FiRefreshCw className="spin-icon" />
              <span>{loadingFetchDataDashBoard ? "Atualizando..." : "Atualizar Dados"}</span>
            </ModernRefreshBtn>
          </Tooltip>
        </HeaderActionsRow>
      </DashboardHeroHeader>

      {/* ==========================================================================
          KPI Top Cards (Quick Executive Metrics)
         ========================================================================== */}
      <KpiOverviewGrid>
        <ModernKpiCard $variant="primary">
          <KpiIconBadge $variant="primary">
            <FaCarSide />
          </KpiIconBadge>
          <KpiDetails>
            <KpiMetricLabel>Viagens Hoje</KpiMetricLabel>
            {loadingFetchDataDashBoard ? (
              <Skeleton.Input active size="small" style={{ width: 80 }} />
            ) : (
              <KpiMetricValue>{datasDashboard?.todayTotalTrips ?? 0}</KpiMetricValue>
            )}
            <KpiMetricHint>Corridas concluídas hoje</KpiMetricHint>
          </KpiDetails>
        </ModernKpiCard>

        <ModernKpiCard $variant="success">
          <KpiIconBadge $variant="success">
            <FiDollarSign />
          </KpiIconBadge>
          <KpiDetails>
            <KpiMetricLabel>Faturamento Hoje</KpiMetricLabel>
            {loadingFetchDataDashBoard ? (
              <Skeleton.Input active size="small" style={{ width: 110 }} />
            ) : (
              <KpiMetricValue>
                {CurrencyUtils.formatCurrency(datasDashboard?.totalBilled ?? 0)}
              </KpiMetricValue>
            )}
            <KpiMetricHint>Receita bruta acumulada hoje</KpiMetricHint>
          </KpiDetails>
        </ModernKpiCard>

        <ModernKpiCard $variant="info">
          <KpiIconBadge $variant="info">
            <FiTrendingUp />
          </KpiIconBadge>
          <KpiDetails>
            <KpiMetricLabel>Ticket Médio Hoje</KpiMetricLabel>
            {loadingFetchDataDashBoard ? (
              <Skeleton.Input active size="small" style={{ width: 90 }} />
            ) : (
              <KpiMetricValue>
                {CurrencyUtils.formatCurrency(datasDashboard?.ticketMedia ?? 0)}
              </KpiMetricValue>
            )}
            <KpiMetricHint>Valor médio por viagem concluída</KpiMetricHint>
          </KpiDetails>
        </ModernKpiCard>

        <ModernKpiCard $variant="warning">
          <KpiIconBadge $variant="warning">
            <FiUsers />
          </KpiIconBadge>
          <KpiDetails>
            <KpiMetricLabel>Veículos Ativos</KpiMetricLabel>
            {loadingFetchDataDashBoard ? (
              <Skeleton.Input active size="small" style={{ width: 80 }} />
            ) : (
              <KpiMetricValue>{driverAllActives}</KpiMetricValue>
            )}
            <KpiMetricHint>
              {totalVehiclesCount} veículos registrados na frota
            </KpiMetricHint>
          </KpiDetails>
        </ModernKpiCard>
      </KpiOverviewGrid>

      {/* ==========================================================================
          Tipos de Motorista & Categorias
         ========================================================================== */}
      <SectionCard>
        <SectionHeader>
          <SectionHeaderLeft>
            <SectionTitleText>
              <FaCarSide style={{ color: "#00349a" }} /> Tipos de Motorista & Frota
            </SectionTitleText>
            <SectionCounterBadge>
              {driverList.length} {driverList.length === 1 ? "categoria" : "categorias"}
            </SectionCounterBadge>
          </SectionHeaderLeft>
          <SectionDescription>
            Distribuição de veículos por modalidade de atendimento
          </SectionDescription>
        </SectionHeader>

        {loadingFetchDataDashBoard ? (
          <DriverCardSkeleton />
        ) : driverList.length === 0 ? (
          <TitleNotTypesDrivers>
            Nenhum tipo de motorista encontrado para esta cidade.
          </TitleNotTypesDrivers>
        ) : (
          <ModernDriverTypesGrid>
            {driverList.map((item: CurrentQuantitiesProps, idx: number) => {
              const activeCount = Number(item.active) || 0;
              const waitingCount = Number(item.waiting_answer) || 0;
              const pendingCount = Number(item.pending) || 0;
              const blockedCount = Number(item.blocked) || 0;
              const totalCount = Number(item.total) || 0;
              const activePercent = totalCount > 0 ? (activeCount / totalCount) * 100 : 0;

              return (
                <DriverCategoryCard key={`driver-cat-${idx}-${item.type}`}>
                  <DriverCategoryHeader>
                    <DriverAvatarCircle>
                      <img
                        src={item.picture || carDefaultImg}
                        alt={item.type}
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = carDefaultImg;
                        }}
                      />
                    </DriverAvatarCircle>
                    <DriverCategoryInfo>
                      <DriverCategoryName title={item.type}>{item.type}</DriverCategoryName>
                      <DriverCategorySubtitle>Modalidade de Corrida</DriverCategorySubtitle>
                    </DriverCategoryInfo>
                  </DriverCategoryHeader>

                  <DriverTotalBanner>
                    <DriverTotalLabel>Total de veículos:</DriverTotalLabel>
                    <DriverTotalValue>{totalCount}</DriverTotalValue>
                  </DriverTotalBanner>

                  <DriverStatusGrid>
                    <DriverStatusItem $status="active" title="Veículos disponíveis e ativos">
                      <span>
                        <DriverStatusDot $status="active" />
                        Ativos
                      </span>
                      <span>{activeCount}</span>
                    </DriverStatusItem>

                    <DriverStatusItem $status="waiting" title="Aguardando liberação de cadastro">
                      <span>
                        <DriverStatusDot $status="waiting" />
                        Aguardando
                      </span>
                      <span>{waitingCount}</span>
                    </DriverStatusItem>

                    <DriverStatusItem $status="pending" title="Cadastros pendentes de documento">
                      <span>
                        <DriverStatusDot $status="pending" />
                        Pendentes
                      </span>
                      <span>{pendingCount}</span>
                    </DriverStatusItem>

                    <DriverStatusItem $status="blocked" title="Motoristas bloqueados">
                      <span>
                        <DriverStatusDot $status="blocked" />
                        Bloqueados
                      </span>
                      <span>{blockedCount}</span>
                    </DriverStatusItem>
                  </DriverStatusGrid>

                  <Tooltip title={`${activePercent.toFixed(0)}% da frota desta categoria está ativa`}>
                    <DriverActiveRatioBar>
                      <DriverActiveRatioFill $percent={activePercent} />
                    </DriverActiveRatioBar>
                  </Tooltip>
                </DriverCategoryCard>
              );
            })}
          </ModernDriverTypesGrid>
        )}
      </SectionCard>

      {/* ==========================================================================
          Clientes & Passageiros
         ========================================================================== */}
      <SectionCard>
        <SectionHeader>
          <SectionHeaderLeft>
            <SectionTitleText>
              <FiUsers style={{ color: "#00349a" }} /> Métricas de Clientes & Passageiros
            </SectionTitleText>
            <SectionCounterBadge>{customersAllTotal} total</SectionCounterBadge>
          </SectionHeaderLeft>
          <SectionDescription>
            Visão consolidada da base de passageiros registrados
          </SectionDescription>
        </SectionHeader>

        {loadingFetchDataDashBoard ? (
          <Skeleton active paragraph={{ rows: 2 }} />
        ) : (
          <ModernCustomersGrid>
            <ModernCustomerCard $variant="total">
              <CustomerCardTop>
                <CustomerCardTitleText>Total de Clientes</CustomerCardTitleText>
                <CustomerCardIconWrap $variant="total">
                  <FiUsers />
                </CustomerCardIconWrap>
              </CustomerCardTop>
              <CustomerCardCount>{customersAllTotal}</CustomerCardCount>
            </ModernCustomerCard>

            <ModernCustomerCard $variant="active">
              <CustomerCardTop>
                <CustomerCardTitleText>Clientes Ativos</CustomerCardTitleText>
                <CustomerCardIconWrap $variant="active">
                  <FiUserCheck />
                </CustomerCardIconWrap>
              </CustomerCardTop>
              <CustomerCardCount>{customersAllActives}</CustomerCardCount>
            </ModernCustomerCard>

            <ModernCustomerCard $variant="pending">
              <CustomerCardTop>
                <CustomerCardTitleText>Clientes Pendentes</CustomerCardTitleText>
                <CustomerCardIconWrap $variant="pending">
                  <FiClock />
                </CustomerCardIconWrap>
              </CustomerCardTop>
              <CustomerCardCount>{customersAllPending}</CustomerCardCount>
            </ModernCustomerCard>

            <ModernCustomerCard $variant="blocked">
              <CustomerCardTop>
                <CustomerCardTitleText>Clientes Bloqueados</CustomerCardTitleText>
                <CustomerCardIconWrap $variant="blocked">
                  <FiUserX />
                </CustomerCardIconWrap>
              </CustomerCardTop>
              <CustomerCardCount>{customersAllBlocked}</CustomerCardCount>
            </ModernCustomerCard>
          </ModernCustomersGrid>
        )}
      </SectionCard>

      {/* ==========================================================================
          Estatísticas Operacionais & Gráficos
         ========================================================================== */}
      <ModernAnalyticsGrid>
        {/* Card 1: Formas de Pagamento */}
        <ModernAnalyticsCard>
          <AnalyticsCardTop>
            <AnalyticsCardTitle>Formas de Pagamento</AnalyticsCardTitle>
            <SectionCounterBadge>Corridas</SectionCounterBadge>
          </AnalyticsCardTop>
          <AnalyticsCardBody>
            <AnalyticsDataList>
              <AnalyticsDataItem>
                <AnalyticsItemLeft>
                  <AnalyticsColorDot $color="#10b981" />
                  <AnalyticsItemName>Em Dinheiro</AnalyticsItemName>
                </AnalyticsItemLeft>
                <AnalyticsItemValue>{datasDashboard?.paidOutMoney ?? 0}</AnalyticsItemValue>
              </AnalyticsDataItem>

              <AnalyticsDataItem>
                <AnalyticsItemLeft>
                  <AnalyticsColorDot $color="#6366f1" />
                  <AnalyticsItemName>Em Voucher</AnalyticsItemName>
                </AnalyticsItemLeft>
                <AnalyticsItemValue>{datasDashboard?.paidOutVoucher ?? 0}</AnalyticsItemValue>
              </AnalyticsDataItem>

              <AnalyticsDataItem>
                <AnalyticsItemLeft>
                  <AnalyticsColorDot $color="#0284c7" />
                  <AnalyticsItemName>Em Cartão</AnalyticsItemName>
                </AnalyticsItemLeft>
                <AnalyticsItemValue>{datasDashboard?.paidOutCreditCard ?? 0}</AnalyticsItemValue>
              </AnalyticsDataItem>
            </AnalyticsDataList>

            <AnalyticsChartWrap>
              {hasPaymentData ? (
                <PieChart
                  series={[
                    {
                      data: paymentFormsData.filter((d) => d.value > 0),
                      innerRadius: 36,
                      outerRadius: 76,
                      paddingAngle: 3,
                      cornerRadius: 5,
                    },
                  ]}
                  height={180}
                  margin={{ top: 10, bottom: 10, left: 10, right: 10 }}
                />
              ) : (
                <div style={{ textAlign: "center", color: "#94a3b8", padding: "24px 0", fontSize: 13 }}>
                  Nenhuma corrida computada no momento
                </div>
              )}
            </AnalyticsChartWrap>
          </AnalyticsCardBody>
        </ModernAnalyticsCard>

        {/* Card 2: Status das Viagens */}
        <ModernAnalyticsCard>
          <AnalyticsCardTop>
            <AnalyticsCardTitle>Status das Viagens</AnalyticsCardTitle>
            <SectionCounterBadge>Operacional</SectionCounterBadge>
          </AnalyticsCardTop>
          <AnalyticsCardBody>
            <AnalyticsDataList>
              <AnalyticsDataItem>
                <AnalyticsItemLeft>
                  <AnalyticsColorDot $color="#0284c7" />
                  <AnalyticsItemName>Aceitas</AnalyticsItemName>
                </AnalyticsItemLeft>
                <AnalyticsItemValue>{datasDashboard?.tripAccepted ?? 0}</AnalyticsItemValue>
              </AnalyticsDataItem>

              <AnalyticsDataItem>
                <AnalyticsItemLeft>
                  <AnalyticsColorDot $color="#10b981" />
                  <AnalyticsItemName>Finalizadas</AnalyticsItemName>
                </AnalyticsItemLeft>
                <AnalyticsItemValue>{datasDashboard?.tripFinished ?? 0}</AnalyticsItemValue>
              </AnalyticsDataItem>

              <AnalyticsDataItem>
                <AnalyticsItemLeft>
                  <AnalyticsColorDot $color="#475569" />
                  <AnalyticsItemName>Total de Viagens</AnalyticsItemName>
                </AnalyticsItemLeft>
                <AnalyticsItemValue>{datasDashboard?.totalTrips ?? 0}</AnalyticsItemValue>
              </AnalyticsDataItem>
            </AnalyticsDataList>

            <AnalyticsChartWrap>
              {hasTripsData ? (
                <PieChart
                  series={[
                    {
                      data: tripsStatusData.filter((d) => d.value > 0),
                      innerRadius: 36,
                      outerRadius: 76,
                      paddingAngle: 3,
                      cornerRadius: 5,
                    },
                  ]}
                  height={180}
                  margin={{ top: 10, bottom: 10, left: 10, right: 10 }}
                />
              ) : (
                <div style={{ textAlign: "center", color: "#94a3b8", padding: "24px 0", fontSize: 13 }}>
                  Nenhuma viagem registrada no período
                </div>
              )}
            </AnalyticsChartWrap>
          </AnalyticsCardBody>
        </ModernAnalyticsCard>

        {/* Card 3: Análise de Cancelamentos */}
        <ModernAnalyticsCard>
          <AnalyticsCardTop>
            <AnalyticsCardTitle>Viagens Canceladas</AnalyticsCardTitle>
            <SectionCounterBadge>Desistências</SectionCounterBadge>
          </AnalyticsCardTop>
          <AnalyticsCardBody>
            <AnalyticsDataList>
              <AnalyticsDataItem>
                <AnalyticsItemLeft>
                  <AnalyticsColorDot $color="#f59e0b" />
                  <AnalyticsItemName>Pelo Motorista</AnalyticsItemName>
                </AnalyticsItemLeft>
                <AnalyticsItemValue>{datasDashboard?.canceledbyDriver ?? 0}</AnalyticsItemValue>
              </AnalyticsDataItem>

              <AnalyticsDataItem>
                <AnalyticsItemLeft>
                  <AnalyticsColorDot $color="#ef4444" />
                  <AnalyticsItemName>Pelo Cliente</AnalyticsItemName>
                </AnalyticsItemLeft>
                <AnalyticsItemValue>{datasDashboard?.canceledbyCustomer ?? 0}</AnalyticsItemValue>
              </AnalyticsDataItem>

              <AnalyticsDataItem>
                <AnalyticsItemLeft>
                  <AnalyticsColorDot $color="#b91c1c" />
                  <AnalyticsItemName>Total Cancelamentos</AnalyticsItemName>
                </AnalyticsItemLeft>
                <AnalyticsItemValue>{datasDashboard?.totalCanceled ?? 0}</AnalyticsItemValue>
              </AnalyticsDataItem>
            </AnalyticsDataList>

            <AnalyticsChartWrap>
              {hasCancellationsData ? (
                <PieChart
                  series={[
                    {
                      data: cancellationsData.filter((d) => d.value > 0),
                      innerRadius: 36,
                      outerRadius: 76,
                      paddingAngle: 3,
                      cornerRadius: 5,
                    },
                  ]}
                  height={180}
                  margin={{ top: 10, bottom: 10, left: 10, right: 10 }}
                />
              ) : (
                <div style={{ textAlign: "center", color: "#94a3b8", padding: "24px 0", fontSize: 13 }}>
                  Nenhum cancelamento computado
                </div>
              )}
            </AnalyticsChartWrap>
          </AnalyticsCardBody>
        </ModernAnalyticsCard>
      </ModernAnalyticsGrid>

      {/* ==========================================================================
          Rankings de Performance (Top Motoristas & Top Clientes)
         ========================================================================== */}
      <ModernRankingsGrid>
        {/* Top Motoristas */}
        <ModernRankingCard>
          <RankingHeaderWrap>
            <SectionTitleText>
              <FiAward style={{ color: "#f59e0b" }} /> Top Motoristas
            </SectionTitleText>

            <RankingFiltersWrap>
              <RankingFilterPill
                type="button"
                $active={driverRankPeriod === "day"}
                onClick={() => handleDriverRankPeriodChange("day")}
              >
                Hoje
              </RankingFilterPill>
              <RankingFilterPill
                type="button"
                $active={driverRankPeriod === "month"}
                onClick={() => handleDriverRankPeriodChange("month")}
              >
                Este Mês
              </RankingFilterPill>
              <RankingFilterPill
                type="button"
                $active={driverRankPeriod === "all"}
                onClick={() => handleDriverRankPeriodChange("all")}
              >
                Geral
              </RankingFilterPill>
            </RankingFiltersWrap>
          </RankingHeaderWrap>

          <RankingScrollList onScroll={(e) => handleScroll(e, "driver")}>
            {loadingRankingDriver ? (
              <LoadingMoreSpinner>
                <Spin size="small" />
                <LoadingMoreText style={{ marginLeft: "8px" }}>Carregando ranking...</LoadingMoreText>
              </LoadingMoreSpinner>
            ) : driverRank.length === 0 ? (
              <div style={{ textAlign: "center", color: "#94a3b8", padding: "36px 0", fontSize: 13.5 }}>
                Nenhum motorista ranqueado no período selecionado.
              </div>
            ) : (
              <>
                {driverRank.map((item, index) => {
                  const ticketMedio = calculateTicketMedio(item.totalValue, item.quantityTrips);
                  const position = index + 1;

                  return (
                    <RankingListItem key={`driver-${item.idDriver}`}>
                      <RankingPositionBadge $position={position}>
                        {position === 1 ? <FaTrophy /> : `#${position}`}
                      </RankingPositionBadge>

                      <RankingUserMeta>
                        <RankingUserNameText title={item.name}>{item.name}</RankingUserNameText>
                        <RankingStatsPills>
                          <RankingStatChip $variant="trips">
                            {item.quantityTrips} {item.quantityTrips === 1 ? "viagem" : "viagens"}
                          </RankingStatChip>
                          <RankingStatChip $variant="revenue">
                            {CurrencyUtils.formatCurrency(item.totalValue)}
                          </RankingStatChip>
                          <RankingStatChip $variant="avg">
                            Méd. {CurrencyUtils.formatCurrency(ticketMedio)}
                          </RankingStatChip>
                        </RankingStatsPills>
                      </RankingUserMeta>

                      <RankingActionBtns>
                        <CelebrateActionBtn
                          type="button"
                          onClick={() => handleOpenModalParabens(item, "driver")}
                          title={`Enviar mensagem de parabéns para ${item.name}`}
                        >
                          🎉 Parabéns
                        </CelebrateActionBtn>

                        <WhatsAppActionBtn
                          onClick={(e) => {
                            e.preventDefault();
                            handleWhatsAppClick(item.phone, item.name, "driver");
                          }}
                          href="#"
                          title={`Falar com ${item.name} via WhatsApp`}
                        >
                          <FaWhatsapp />
                        </WhatsAppActionBtn>
                      </RankingActionBtns>
                    </RankingListItem>
                  );
                })}

                {loadingMoreDrivers && (
                  <LoadingMoreSpinner>
                    <Spin size="small" />
                    <LoadingMoreText style={{ marginLeft: "10px" }}>Carregando mais motoristas...</LoadingMoreText>
                  </LoadingMoreSpinner>
                )}
                {!hasMoreDrivers && driverRank.length > 0 && !loadingMoreDrivers && (
                  <LoadingMoreText>Fim dos registros para este filtro.</LoadingMoreText>
                )}
              </>
            )}
          </RankingScrollList>
        </ModernRankingCard>

        {/* Top Clientes */}
        <ModernRankingCard>
          <RankingHeaderWrap>
            <SectionTitleText>
              <FiAward style={{ color: "#0284c7" }} /> Top Clientes
            </SectionTitleText>

            <RankingFiltersWrap>
              <RankingFilterPill
                type="button"
                $active={clientRankPeriod === "day"}
                onClick={() => handleClientRankPeriodChange("day")}
              >
                Hoje
              </RankingFilterPill>
              <RankingFilterPill
                type="button"
                $active={clientRankPeriod === "month"}
                onClick={() => handleClientRankPeriodChange("month")}
              >
                Este Mês
              </RankingFilterPill>
              <RankingFilterPill
                type="button"
                $active={clientRankPeriod === "all"}
                onClick={() => handleClientRankPeriodChange("all")}
              >
                Geral
              </RankingFilterPill>
            </RankingFiltersWrap>
          </RankingHeaderWrap>

          <RankingScrollList onScroll={(e) => handleScroll(e, "client")}>
            {loadingRankingClient ? (
              <LoadingMoreSpinner>
                <Spin size="small" />
                <LoadingMoreText style={{ marginLeft: "8px" }}>Carregando ranking...</LoadingMoreText>
              </LoadingMoreSpinner>
            ) : clientRank.length === 0 ? (
              <div style={{ textAlign: "center", color: "#94a3b8", padding: "36px 0", fontSize: 13.5 }}>
                Nenhum cliente ranqueado no período selecionado.
              </div>
            ) : (
              <>
                {clientRank.map((item, index) => {
                  const ticketMedio = calculateTicketMedio(item.totalValue, item.quantityTrips);
                  const position = index + 1;

                  return (
                    <RankingListItem key={`client-${item.idUser}`}>
                      <RankingPositionBadge $position={position}>
                        {position === 1 ? <FaTrophy /> : `#${position}`}
                      </RankingPositionBadge>

                      <RankingUserMeta>
                        <RankingUserNameText title={item.name}>{item.name}</RankingUserNameText>
                        <RankingStatsPills>
                          <RankingStatChip $variant="trips">
                            {item.quantityTrips} {item.quantityTrips === 1 ? "viagem" : "viagens"}
                          </RankingStatChip>
                          <RankingStatChip $variant="revenue">
                            {CurrencyUtils.formatCurrency(item.totalValue)}
                          </RankingStatChip>
                          <RankingStatChip $variant="avg">
                            Méd. {CurrencyUtils.formatCurrency(ticketMedio)}
                          </RankingStatChip>
                        </RankingStatsPills>
                      </RankingUserMeta>

                      <RankingActionBtns>
                        <CelebrateActionBtn
                          type="button"
                          onClick={() => handleOpenModalParabens(item, "client")}
                          title={`Enviar mensagem de parabéns para ${item.name}`}
                        >
                          🎉 Parabéns
                        </CelebrateActionBtn>

                        <WhatsAppActionBtn
                          onClick={(e) => {
                            e.preventDefault();
                            handleWhatsAppClick(item.phone, item.name, "client");
                          }}
                          href="#"
                          title={`Falar com ${item.name} via WhatsApp`}
                        >
                          <FaWhatsapp />
                        </WhatsAppActionBtn>
                      </RankingActionBtns>
                    </RankingListItem>
                  );
                })}

                {loadingMoreClients && (
                  <LoadingMoreSpinner>
                    <Spin size="small" />
                    <LoadingMoreText style={{ marginLeft: "10px" }}>Carregando mais clientes...</LoadingMoreText>
                  </LoadingMoreSpinner>
                )}
                {!hasMoreClients && clientRank.length > 0 && !loadingMoreClients && (
                  <LoadingMoreText>Fim dos registros para este filtro.</LoadingMoreText>
                )}
              </>
            )}
          </RankingScrollList>
        </ModernRankingCard>
      </ModernRankingsGrid>

      {/* ==========================================================================
          System Modals
         ========================================================================== */}
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
