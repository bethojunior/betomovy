import {
  FC,
  useState,
  useEffect,
  useContext,
  useCallback,
  useMemo,
  useRef,
} from "react";
import { Button, Radio, Select, Spin, message } from "antd";
import { BsFilter } from "react-icons/bs";
import {
  FilterContainer,
  FiltersInput,
  ButtonIcon,
  ContentButton,
  Content,
  ListContent,
  WithoutNotificationContent,
  WithoutNotification,
  LinkButton,
} from "./styles";
import NotificationContext from "../../../contexts/notification";
import api from "../../../services/api";
import ItemNotification from "../ItemNotification";
import { useUserGroupContext } from "../../../hooks/useUserGroupContext";
import { UserGroupItem } from "../../../@types/context";
import { NotificationProps } from "../CitiesAndNotifications/types";
import { RequestNotificationsProps } from "./types";

const { Option } = Select;

const FILTER_VALUES = {
  ALL: "",
  UNREAD: 0,
  READ: 1,
} as const;

const INITIAL_PAGE = 1;

const Notification: FC<RequestNotificationsProps> = ({
  notificationRequestProps,
  listNotificationsProps,
  setListNotificationsProps,
  currentPageProps,
  setCurrentPageProps,
  setNextPageProps,
  nextPageProps,
}) => {
  const [readFilter, setReadFilter] = useState<number | string>(FILTER_VALUES.UNREAD);
  const [groupFilter, setGroupFilter] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const { userGroupList } = useUserGroupContext();
  const [listGroups, setListGroups] = useState<UserGroupItem[]>([]);
  const { active, handleShowNotifications } = useContext(NotificationContext);
  
  const [internalNotifications, setInternalNotifications] = useState<NotificationProps[]>([]);
  const isModalOpenRef = useRef(false);
  
  const displayedNotifications = useMemo(() => {
    return isModalOpenRef.current ? internalNotifications : (listNotificationsProps || []);
  }, [listNotificationsProps, internalNotifications]);

  const normalizeReadFilter = (filter: number | string | undefined): number | undefined => {
    if (filter === "" || filter === undefined) return undefined;
    return filter as number;
  };

  const handleFilterSuccess = (
    responseData: any,
    page: number,
    newNotifications: NotificationProps[]
  ) => {
    if (isModalOpenRef.current) {
      if (page !== INITIAL_PAGE) {
        setInternalNotifications((prev: NotificationProps[]) => [...prev, ...newNotifications]);
        setListNotificationsProps((prev: NotificationProps[]) => {
          const currentList = Array.isArray(prev) ? prev : [];
          return [...currentList, ...newNotifications];
        });
      } else {
        setInternalNotifications(newNotifications);
        setListNotificationsProps(newNotifications);
      }
    } else {
      if (page !== INITIAL_PAGE) {
        setListNotificationsProps((prevState: NotificationProps[]) => {
          const currentList = Array.isArray(prevState) ? prevState : [];
          if (newNotifications.length === 0) return currentList;
          return [...currentList, ...newNotifications];
        });
      } else {
        setListNotificationsProps(newNotifications);
      }
    }
    setNextPageProps(responseData.next_page_url);
  };

  const handleFilterError = (error: unknown) => {
    console.error("Erro ao buscar notificações:", error);
    message.error("Erro ao carregar notificações");
  };

  const doFilter = useCallback(
    async (
      page = INITIAL_PAGE,
      readFilterParam: number | string | undefined = readFilter,
      groupFilterParam: string = groupFilter
    ) => {
      if (page === INITIAL_PAGE) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }
      setCurrentPageProps(page);
      try {
        const normalizedReadFilter = normalizeReadFilter(readFilterParam);
        const result = await api.get(`adminNotification?page=${page}`, {
          params: {
            userGroupId: groupFilterParam || undefined,
            read: normalizedReadFilter,
          },
        });

        if (!result.data?.response) {
          setListNotificationsProps([]);
          setNextPageProps(null);
          return;
        }

        const responseData = result.data.response;
        const newNotifications = Array.isArray(responseData?.data)
          ? responseData.data
          : [];

        if (responseData === null || newNotifications.length === 0) {
          setListNotificationsProps([]);
          setNextPageProps(null);
          return;
        }

        handleFilterSuccess(responseData, page, newNotifications);
      } catch (error) {
        handleFilterError(error);
      } finally {
        if (page === INITIAL_PAGE) {
          setLoading(false);
        } else {
          setLoadingMore(false);
        }
      }
    },
    [
      readFilter,
      groupFilter,
      setCurrentPageProps,
      setListNotificationsProps,
      setNextPageProps,
    ]
  );

  const showNotification = useCallback(async () => {
    isModalOpenRef.current = true;
    setListGroups(userGroupList);
    setListNotificationsProps([]);
    setCurrentPageProps(INITIAL_PAGE);
    setInternalNotifications([]);
    await doFilter(INITIAL_PAGE, readFilter, groupFilter);
    handleShowNotifications(true);
  }, [
    userGroupList,
    readFilter,
    groupFilter,
    setListGroups,
    setListNotificationsProps,
    setCurrentPageProps,
    doFilter,
    handleShowNotifications,
  ]);

  useEffect(() => {
    if (active) {
      showNotification();
    } else {
      isModalOpenRef.current = false;
    }
  }, [active, showNotification]);

  const updateNotificationInList = (notificationId: number) => {
    const updater = (prevList: NotificationProps[]) => {
      const currentList = Array.isArray(prevList) ? prevList : [];
      return currentList.map((notification) =>
        notification.id === notificationId
          ? { ...notification, read: 1 }
          : notification
      );
    };
    setListNotificationsProps(updater);
    setInternalNotifications(updater);
  };

  const readNotification = async (id: number): Promise<void> => {
    try {
      const result = await api.post(`adminNotification/${id}/read`);
      if (!result?.data?.status) {
        message.error("Erro ao marcar notificação como lida");
        return;
      }
      updateNotificationInList(id);
    } catch (error) {
      console.error("Erro ao marcar notificação como lida:", error);
      message.error("Erro ao marcar notificação como lida");
    }
  };

  const markAllAsRead = async () => {
    setLoading(true);
    try {
      const response = await api.post("adminNotification/markAllAsRead");
      if (!response?.data?.status) {
        const errorMsg =
          response.data?.message || "Erro desconhecido ao marcar notificações";
        message.error(`Erro: ${errorMsg}`);
        return;
      }
      message.success("Todas as notificações foram marcadas como lidas!");
      const updater = (prevList: NotificationProps[]) => {
        const currentList = Array.isArray(prevList) ? prevList : [];
        return currentList.map((notification) => ({ ...notification, read: 1 }));
      };
      setListNotificationsProps(updater);
      setInternalNotifications(updater);
    } catch (error: any) {
      if (error.response?.status === 404) {
        message.error(
          "Endpoint não encontrado. A funcionalidade pode não estar disponível neste ambiente."
        );
      } else {
        const errorMsg =
          error.response?.data?.message ||
          error.message ||
          "Erro ao marcar notificações como lidas";
        message.error(errorMsg);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Content
        title={<h3>Notificações</h3>}
        open={active}
        centered
        onCancel={() => {
          isModalOpenRef.current = false;
          handleShowNotifications(false);
          notificationRequestProps().catch((error) => {
            console.error("Erro ao buscar notificações:", error);
          });
        }}
        footer={[
          <Button
            key="markAll"
            type="primary"
            onClick={markAllAsRead}
            disabled={loading}
          >
            {loading ? "Marcando..." : "Marcar todas como lidas"}
          </Button>,
          <Button
            key="back"
            onClick={() => {
              isModalOpenRef.current = false;
              handleShowNotifications(false);
              notificationRequestProps().catch((error) => {
                console.error("Erro ao buscar notificações:", error);
              });
            }}
          >
            Fechar
          </Button>,
        ]}
      >
        <div>
          <FilterContainer>
            <div>
              <FiltersInput>
                <p>Grupo:</p>
                <Select
                  onSelect={(item) => {
                    setGroupFilter(item);
                    setCurrentPageProps(INITIAL_PAGE);
                    doFilter(INITIAL_PAGE, readFilter, item);
                  }}
                  defaultValue="Todos os grupos"
                  style={{ width: "100%" }}
                >
                  <Option value="" key="">
                    Todos os grupos
                  </Option>
                  {listGroups.map((item) => (
                    <Option value={item.id} key={item.id}>
                      {item.name}
                    </Option>
                  ))}
                </Select>
              </FiltersInput>
              <FiltersInput>
                <p>Mostrar:</p>
                <Radio.Group
                  value={readFilter}
                  onChange={(e) => {
                    setReadFilter(e.target.value);
                    setCurrentPageProps(INITIAL_PAGE);
                    doFilter(INITIAL_PAGE, e.target.value, groupFilter);
                  }}
                >
                  <Radio value={FILTER_VALUES.ALL}>Todas</Radio>
                  <Radio value={FILTER_VALUES.UNREAD}>Não lidas</Radio>
                  <Radio value={FILTER_VALUES.READ}>Lidas</Radio>
                </Radio.Group>
              </FiltersInput>
            </div>
            <ButtonIcon
              type="primary"
              onClick={() => doFilter(INITIAL_PAGE, readFilter, groupFilter)}
            >
              <BsFilter />
            </ButtonIcon>
          </FilterContainer>
          <ListContent
            size={displayedNotifications}
            className="notificationModal"
          >
            {loading ? (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  minHeight: "300px",
                }}
              >
                <Spin size="large" />
              </div>
            ) : displayedNotifications?.length === 0 ? (
              <WithoutNotificationContent>
                <WithoutNotification>Sem notificações</WithoutNotification>
              </WithoutNotificationContent>
            ) : (
              <>
                {displayedNotifications?.map((item: NotificationProps) => (
                  <ItemNotification
                    key={item.id}
                    item={item}
                    readNotification={readNotification}
                    extraLink={
                      item.adminNotificationTypeId === 14 &&
                      item.tripReference ? (
                        <LinkButton
                          type="link"
                          target="_blank"
                          href={`/trip/list/details/${item.tripReference}`}
                        >
                          Detalhes da viagem
                        </LinkButton>
                      ) : null
                    }
                  />
                ))}
              </>
            )}
            {!loading && nextPageProps !== null && nextPageProps !== "" && (
              <ContentButton>
                <Button
                  type="primary"
                  loading={loadingMore}
                  onClick={() => {
                    doFilter(currentPageProps + 1, readFilter, groupFilter);
                  }}
                >
                  {loadingMore ? "Carregando..." : "Mostrar mais"}
                </Button>
              </ContentButton>
            )}
          </ListContent>
        </div>
      </Content>
    </>
  );
};

export default Notification;
