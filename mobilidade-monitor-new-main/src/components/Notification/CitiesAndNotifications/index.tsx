import { FC, useContext, useEffect, useState } from "react";
import NotificationContext from "../../../contexts/notification";
import api from "../../../services/api";
import Notification from "../Modal";
import {
  SelectCities,
  AlertButton,
  BellIcon,
  GeneralContainer,
  MonitoringNavExtension,
  MonitoringNavBellCell,
  MonitoringNavCityCell,
  MonitoringSelectedAreaChip,
  MonitoringSelectedAreaChipLabel,
  SelectCitiesMobileMonitoring,
  MonitoringNavAlertButton,
  citySelectDropdownStyle,
  DesktopToolbarRow,
  DesktopToolbarColumn,
  SelectNotFoundLoadingWrap,
  SelectedAreaDesktopChip,
  SelectedAreaDesktopChipName,
  AreaChipDismissButton,
} from "./styles";
import { Spin, Select } from "antd";
import Session from "../../../utils/Session";
import Utils from "../../../utils/Utils";
import {
  NotificationProps,
  PanicNotificationType,
  SelectAndButtonNotificationProps,
} from "./types";
import { useFullyContext } from "../../../hooks/useFullyContext";
import { useContextAuth } from "../../../contexts/auth";
import { useLanguage } from "../../../contexts/language";
import { AlertPanicModal } from "../../AlertPanicModal";
import swal from "sweetalert";

const { Option } = Select;

const normalizeString = (str: string) =>
  str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

const SelectAndButtonNotification: FC<SelectAndButtonNotificationProps> = ({
  selectedArea,
  onClearArea,
  monitoringMobileNavGrid = false,
}) => {
  const { t, language } = useLanguage();
  const [citiesActives, setCitiesActives] = useState<CityProps[]>([]);
  const [defaultCity, setDefaultCity] = useState("");
  const [twinkleButton, setTwinkleButton] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [listNotifications, setListNotifications] = useState<
    NotificationProps[]
  >([]);
  const [panicNotification, setPanicNotification] =
    useState<PanicNotificationType>();
  const [loadingButton, setLoadingButton] = useState(false);

  const [nextPage, setNextPage] = useState(null);
  const { handleShowNotifications } = useContext(NotificationContext);

  const { fullyList } = useFullyContext();
  const { signed } = useContextAuth();
  const { getPathByPolygon } = Utils;

  const NOTIFICATION_REFRESH_INTERVAL = 15000;
  const INITIAL_PAGE = 1;
  const UNREAD_FILTER = 0;

  const extractNotificationsData = (response: any): NotificationProps[] => {
    return Array.isArray(response?.data?.response?.data)
      ? response.data.response.data
      : [];
  };

  const notificationRequest = (): Promise<void> => {
    return new Promise((resolve, reject) => {
      api
        .get(`adminNotification?read=${UNREAD_FILTER}&page=${INITIAL_PAGE}`)
        .then((values) => {
          if (!values?.data?.status) {
            reject(new Error("Erro ao trazer notificações"));
            return;
          }
          const notificationsData = extractNotificationsData(values);
          setListNotifications(notificationsData);
          setCurrentPage(values?.data?.response?.current_page || INITIAL_PAGE);
          setNextPage(values?.data?.response?.next_page_url);
          resolve();
        })
        .catch((error) => {
          setTwinkleButton(false);
          reject(error);
        });
    });
  };

  const findPanicNotification = (notifications: any) => {
    return notifications?.find(
      (notification: any) =>
        notification?.emergency_monitoring_type?.id === 6 &&
        Utils.normalizeText(notification?.emergency_monitoring_type?.name) ===
          Utils.normalizeText("Alerta com foto") &&
        !notification.read
    );
  };

  const checkHasUnreadNotifications = (notifications: any) => {
    return notifications?.some((notification: any) => !notification.read);
  };

  useEffect(() => {
    const panicNotification = findPanicNotification(listNotifications);
    setPanicNotification(panicNotification);

    const hasUnread = checkHasUnreadNotifications(listNotifications);
    setTwinkleButton(hasUnread);
  }, [listNotifications]);

  const readNotification = (id: number | undefined): Promise<void> => {
    if (!id) return Promise.resolve();
    
    setLoadingButton(true);
    return new Promise((resolve, reject) => {
      api
        .post(`adminNotification/${id}/read`)
        .then((result) => {
          if (!result?.data?.status) {
            reject(new Error("Erro ao marcar notificação como lida"));
            return;
          }
          setPanicNotification(undefined);
          return notificationRequest();
        })
        .then(() => {
          setLoadingButton(false);
          resolve();
        })
        .catch((error) => {
          console.error("Erro ao marcar notificação como lida:", error);
          setLoadingButton(false);
          reject(error);
        });
    });
  };

  useEffect(() => {
    if (!signed) return;

    const fetchNotifications = () => {
      notificationRequest().catch((error) => {
        console.error("Erro ao buscar notificações:", error);
      });
    };

    fetchNotifications();
    const interval = setInterval(fetchNotifications, NOTIFICATION_REFRESH_INTERVAL);

    return () => {
      clearInterval(interval);
    };
  }, [signed]);

  const getCities = async () => {
    try {
      setCitiesActives(fullyList);
      const defaultCityName = Session.getLocal("citySelected")?.nome || "";
      setDefaultCity(defaultCityName);
    } catch (error) {
      swal({
        title: "Error",
        text: "Erro ao pegar cidades ativas.",
        icon: "error",
      });
    }
  };

  useEffect(() => {
    if (signed) {
      getCities();
    }
  }, [signed, fullyList]);

  const changeCity = (value: number) => {
    const cityActive = citiesActives?.find((el) => el.cityId === value);
    if (!cityActive) return;
    Session.setLocal("citySelected", JSON.stringify(cityActive));
    if (cityActive.polygon) {
      Session.setLocal(
        "pointsCity",
        JSON.stringify(getPathByPolygon(cityActive.polygon))
      );
    }
    setIsSearching(false);
    window.location.reload();
  };

  useEffect(() => {
    const selectedCity = Session.getLocal("citySelected");
    if (selectedCity && typeof selectedCity === "object" && selectedCity.nome) {
      setDefaultCity(selectedCity.nome);
    }
  }, []);

  const CitySelectComponent = monitoringMobileNavGrid
    ? SelectCitiesMobileMonitoring
    : SelectCities;

  const citySelectNode =
    defaultCity !== "" ? (
      <CitySelectComponent
        showSearch
        defaultValue={defaultCity}
        onChange={(e) => changeCity(e as number)}
        filterOption={(input, option) =>
          normalizeString(option?.children as unknown as string).includes(
            normalizeString(input)
          )
        }
        notFoundContent={
          isSearching ? (
            <SelectNotFoundLoadingWrap>
              <Spin size="small" />
            </SelectNotFoundLoadingWrap>
          ) : (
            t("Cidade não encontrada")
          )
        }
        popupMatchSelectWidth={false}
        onFocus={() => setIsSearching(true)}
        onBlur={() => setIsSearching(false)}
        dropdownStyle={citySelectDropdownStyle}
      >
        {citiesActives?.map((cityActive) => {
          const isUS =
            (cityActive as any).country === "US" ||
            ["miami", "orlando", "new york", "los angeles"].includes(
              (cityActive.nome || "").toLowerCase()
            );
          const flag = isUS ? "🇺🇸" : "🇧🇷";
          return (
            <Option key={cityActive.cityId} value={cityActive.cityId}>
              {`${flag} ${cityActive.nome}`}
            </Option>
          );
        })}
      </CitySelectComponent>
    ) : null;

  const bellNode = monitoringMobileNavGrid ? (
    <MonitoringNavAlertButton
      active={twinkleButton}
      className="button-notfication"
      onClick={() => {
        handleShowNotifications(true);
        setTwinkleButton(false);
        notificationRequest();
      }}
    >
      <BellIcon />
    </MonitoringNavAlertButton>
  ) : (
    <AlertButton
      active={twinkleButton}
      className="button-notfication"
      onClick={() => {
        handleShowNotifications(true);
        setTwinkleButton(false);
        notificationRequest();
      }}
    >
      <BellIcon />
    </AlertButton>
  );

  const selectedAreaDesktopNode =
    selectedArea && !monitoringMobileNavGrid ? (
      <SelectedAreaDesktopChip>
        <SelectedAreaDesktopChipName>{selectedArea.name}</SelectedAreaDesktopChipName>
        {onClearArea && (
          <AreaChipDismissButton type="text" size="small" onClick={onClearArea}>
            ✕
          </AreaChipDismissButton>
        )}
      </SelectedAreaDesktopChip>
    ) : null;

  const selectedAreaMobileChipNode =
    selectedArea && monitoringMobileNavGrid ? (
      <MonitoringSelectedAreaChip>
        <MonitoringSelectedAreaChipLabel title={selectedArea.name}>
          {selectedArea.name}
        </MonitoringSelectedAreaChipLabel>
        {onClearArea && (
          <AreaChipDismissButton
            type="text"
            size="small"
            onClick={onClearArea}
            $compact={true}
          >
            ✕
          </AreaChipDismissButton>
        )}
      </MonitoringSelectedAreaChip>
    ) : null;

  return (
    <>
      <Notification
        notificationRequestProps={notificationRequest}
        listNotificationsProps={listNotifications}
        setListNotificationsProps={setListNotifications}
        currentPageProps={currentPage}
        setCurrentPageProps={setCurrentPage}
        setNextPageProps={setNextPage}
        nextPageProps={nextPage}
      />
      {monitoringMobileNavGrid ? (
        <MonitoringNavExtension>
          <MonitoringNavBellCell>{bellNode}</MonitoringNavBellCell>
          <MonitoringNavCityCell>
            {selectedAreaMobileChipNode}
            {citySelectNode}
          </MonitoringNavCityCell>
        </MonitoringNavExtension>
      ) : (
        <GeneralContainer>
          <DesktopToolbarRow>
            <DesktopToolbarColumn>
              {citySelectNode}
              {selectedAreaDesktopNode}
            </DesktopToolbarColumn>
            {bellNode}
          </DesktopToolbarRow>
        </GeneralContainer>
      )}
      <AlertPanicModal
        open={!!panicNotification}
        onConfirm={() => readNotification(panicNotification?.id)}
        notification={panicNotification}
        loadingButton={loadingButton}
      />
    </>
  );
};

export default SelectAndButtonNotification;