import { useState, useEffect, useCallback, useRef, useContext } from "react";
import { useLocation } from "react-router-dom";
import AuthContext from "../../../contexts/auth";
import { MOTORISTA, ZAFIRA, ZAFIRA_VALIDAR_CADASTRO } from "../../../constants/permissions";
import {
  Container,
  ContentSearch,
  LabelText,
  ContentInput,
  FlexContentInput,
  RadioContentInput,
  SearchLottieWrapper,
  ContentHeader,
  ContentDrivers,
  ItemMenuSettings,
  ContentTypesSearch,
  ContentIconSearch,
  ContentInstructionsSearch,
  LoadingContainer,
  LoadingText,
} from "./styles";

import { Menu, Button, Badge } from "antd";

import { IoMdKeypad } from "react-icons/io";
import { LuSplitSquareVertical } from "react-icons/lu";
import { BsLockFill } from "react-icons/bs";
import { HiDocument, HiPencil } from "react-icons/hi";
import { FaMoneyBillWave } from "react-icons/fa";
import { AiFillDelete } from "react-icons/ai";
import { FaMap } from "react-icons/fa";
import { GrNotes } from "react-icons/gr";
import { MdMoneyOff } from "react-icons/md";
import { VscDebugConsole, VscStarFull } from "react-icons/vsc";
import { ClockCircleOutlined } from "@ant-design/icons";
import { MdVerifiedUser } from "react-icons/md";

import {
  DriverData,
  OptionsStatusProps,
  EditDriverData,
  TripType,
  ConfigItem,
} from "./types";


//import Preload from "../../../components/Utils/Preload";
import { CardDriver } from "../../../components/Driver/CardDriver";
import Alert from "../../../components/Utils/Alert";
import MoveBalanceModal from "../../../components/Driver/Modal/MoveBalance";
import DebugAppModal from "../../../components/Driver/Modal/DebugApp";
import DocumentsDriverModal from "../../../components/Driver/Modal/Documents";
import AnnotationsModal from "../../../components/Driver/Modal/Annotations";
import AvaliationModal from "../../../components/Driver/Modal/Avaliation";
import EditDriverModal from "../../../components/Driver/Modal/Edit";
import SplitModal from "../../../components/Driver/Modal/Split/SplitModal";

import { Input, Radio, Select } from "antd";

import Lottie from "lottie-react";

import pathIconSearch from "../../../assets/animations/icon-search-list.json";

import api from "../../../services/api";
import swal from "sweetalert";
import { runConfirmedAction } from "../../../utils/confirmedAction";
import { AxiosError } from "axios";
import { Constants } from "@/utils/constants";
import ReturnsModal from "../../../components/Driver/Modal/Returns";
import LimitHoursModal from "../../../components/Driver/Modal/LimitHours";
import { Loader } from '../../../components/Loader';
import { useDriverList } from "../../../hooks/useDriverList";
import { handleValidateRegistration } from "../../../utils/validateRegistration";
import { useZafiraEnabled } from "../../../hooks/useZafiraEnabled";

const ListDrivers = () => {
  const { hasPermission } = useContext(AuthContext);
  const location = useLocation();
  const [listOptions, setListOptions] = useState<OptionsStatusProps[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const {
    listDrivers,
    setListDirectly,
    filterLoading,
    hasMore,
    filters: { valueSearch, searchBy, idStatusSearch, driverType },
    setValueSearch,
    setSearchBy,
    setIdStatusSearch,
    setDriverType,
    fetchMore,
    refresh: refreshDrivers,
  } = useDriverList();

  const [whatsppMessage, setWhatsppMessage] = useState("");

  const [showAlert, setShowAlert] = useState(false);
  const [messageAlert, setMessageAlert] = useState("");
  const [typeAlert, setTypeAlert] = useState<
    "success" | "info" | "warning" | "error"
  >("success");

  const [userId, setUserId] = useState(0);
  const [driverId, setDriverId] = useState(0);
  const [currentDriver, setCurrentDriver] = useState({} as EditDriverData);
  const [nextPageAvaliation, setNextPageAvaliation] = useState("");

  const [selectTypeOfDriver, setSelectTypeOfDriver] = useState([]);
  const [dataModalDebugApp, setDataModalDebugApp] = useState([]);
  const [nextPageDebugApp, setNextPageDebugApp] = useState("");
  const [currentPageDebugApp, setCurrentPageDebugApp] = useState(1);
  const [documentsDriver, setDocumentsDriver] = useState([]);
  const [documentsDriverId, setDocumentsDriverId] = useState<number | null>(null);
  const [statusDriverDoc, setStatusDriverDoc] = useState([]);
  const [typeOfDocuments, setTypeOfDocuments] = useState([]);
  const [raceHistory, setRaceHistory] = useState([]);
  const [annotations, setAnnotations] = useState("");
  const [currentPageAvaliation, setCurrentPageAvaliation] = useState(1);
  const [isVisibleModalMoveBalance, setIsVisibleModalMoveBalance] =
    useState(false);
  const [isVisibleModalDebugApp, setIsVisibleModalDebugApp] = useState(false);
  const [isVisibleModalEdit, setIsVisibleModalEdit] = useState(false);
  const [isVisibleModalDocuments, setIsVisibleModalDocuments] = useState(false);
  const [raceHistoryModal, setRaceHistoryModal] = useState(false);
  const [annotationsModal, setAnnotationsModal] = useState(false);
  const [isVisibleSplitModal, setIsVisibleSplitModal] = useState(false);
  const [splitDriverId, setSplitDriverId] = useState<number | null>(null);
  const [tripTypeData, setTripTypeData] = useState<TripType[]>([]);
  const [isSplitPaymentEnabled, setIsSplitPaymentEnabled] = useState(false);
  const { enableZafiraValidationMonitor } = useZafiraEnabled();
  const [isVisibleReturnsModal, setIsVisibleReturnsModal] = useState(false);
  const [returnsDriverId, setReturnsDriverId] = useState<number | null>(null);
  const [isVisibleLimitHoursModal, setIsVisibleLimitHoursModal] = useState(false);
  const [limitHoursDriverId, setLimitHoursDriverId] = useState<number | null>(null);
  const [currentHoursOpen, setCurrentHoursOpen] = useState<number | null>(null);
  const hasInitializedFilter = useRef(false);

  const baseImageLink = Constants.url_photo_driver;

  const getTripTypeList = async () => {
    try {
      const result = await api.get("userType/drivers");
      const { response } = result.data;
      if (!response) return;
      setTripTypeData(response);
    } catch (error) {
      const responseError = error as AxiosError;
      console.error(responseError);
      swal({
        title: "Erro ao listar tipos de motorista",
        icon: "error",
      });
    }
  };

  const handleOpenReturnsModal = (idDriver: number) => {
    setReturnsDriverId(idDriver);
    setIsVisibleReturnsModal(true);
  };


  const getConfigKeys = useCallback(async () => {
    try {
      const globalResult = await api.get("config");

      const { response } = globalResult.data as { response: { config: ConfigItem[] }[] };
      if (response && response[0]?.config) {
        const configItems = response[0].config;
        const splitPaymentConfig = configItems.find((item) => item.key === "enable_driver_split_payment");
        setIsSplitPaymentEnabled(splitPaymentConfig?.value === "1");
      }

    } catch (error) {
      const responseError = error as AxiosError;
      console.error(responseError);
    }
  }, []);



  const getOptionsStatus = async () => {
    setLoading(true);
    try {
      const responseOptionsStatus = await api.get(
        "report/select/driverRegisterStatus"
      );
      if (responseOptionsStatus.status) {
        setListOptions(responseOptionsStatus.data.response);
      }
    } catch (error) {
      console.error(error);
      swal({
        title: "Erro ao pegar opções de status",
        icon: "error",
      });
    }
    setLoading(false);
  };


  const handleGenerateDefaultPassword = (idDriver: number) => {
    swal({
      title: "Você realmente deseja resetar a senha deste usuário?",
      text: "Essa ação é irreversível",
      icon: "info",
      buttons: ["Cancelar", "Confirmar"],
      dangerMode: true,
    }).then((result) => {
      if (result) {
        setLoading(true);
        api
          .put(`driver/${idDriver}`, {
            password: "123456",
          })
          .then((value) => {
            setLoading(false);
            if (!value.data.status) {
              setMessageAlert("Ocorreu um erro ao gerar senha padrão");
              setTypeAlert("error");
              return setShowAlert(true);
            }
            setMessageAlert("Senha padrão foi gerada");
            setTypeAlert("success");
            return setShowAlert(true);
          });
      }
    });
  };

  const handleResetBalanceDriver = (idDriver: number) => {
    swal({
      title: "Você realmente deseja zerar o saldo deste motorista?",
      text: "Essa ação é irreversível",
      icon: "info",
      buttons: ["Cancelar", "Confirmar"],
      dangerMode: true,
    }).then((answer) => {
      if (answer) {
        setLoading(true);
        api
          .post(`resetBalance/driver/${idDriver}`, {
            userId: idDriver,
          })
          .then((result) => {
            setLoading(false);
            if (!result.data.status) {
              setMessageAlert("Não foi possível zerar o saldo");
              setTypeAlert("error");
              return setShowAlert(true);
            }
            setMessageAlert("Saldo do motorista foi zerado");
            setTypeAlert("success");
            setShowAlert(true);
            return refreshDrivers();
          });
      }
    });
  };

  const handleChangeStatusDriver = (driverStatus: string, idDriver: number) => {
    swal({
      title: `Você realmente deseja ${driverStatus === "ATIVO" ? "bloquear" : "desbloquear"
        } esse motorista?`,
      icon: "info",
      buttons: ["Cancelar", "Confirmar"],
      dangerMode: true,
    }).then((answer) => {
      if (!answer) return;
      setLoading(true);
      if (driverStatus === "ATIVO") {
        api
          .post(`blockreasons/driver/${idDriver}`, {
            blockReasonsTypeIds: ["2"],
          })
          .then((result) => {
            if (!result.data.status) {
              setMessageAlert("Não foi possível bloquear esse motorista");
              setTypeAlert("error");
              setShowAlert(true);
              return;
            }
            setMessageAlert("Motorista foi bloqueado");
            setTypeAlert("success");
            setShowAlert(true);
            refreshDrivers();
          })
          .catch(() => {
            setMessageAlert("Não foi possível bloquear esse motorista");
            setTypeAlert("error");
            setShowAlert(true);
          })
          .finally(() => setLoading(false));
      } else {
        api
          .put(`driver/${idDriver}/activateRegister`, {})
          .then((result) => {
            if (!result.data.status) {
              setMessageAlert("Não foi possível desbloquear esse motorista");
              setTypeAlert("error");
              setShowAlert(true);
              return;
            }
            setMessageAlert("Motorista foi desbloqueado");
            setTypeAlert("success");
            setShowAlert(true);
            refreshDrivers();
          })
          .catch(() => {
            setMessageAlert("Não foi possível desbloquear esse motorista");
            setTypeAlert("error");
            setShowAlert(true);
          })
          .finally(() => setLoading(false));
      }
    });
  };

  const handlePrepareDebugAppModal = (idDriver: number, page = 1, date = "") => {
    setLoading(true);
    setCurrentPageDebugApp(page);
    const dateQuery = date ? `&date=${date}` : "";
    api.get(`driver/${idDriver}/driverAppInfo?page=${page}${dateQuery}`).then((result) => {
      setLoading(false);
      if (!result.data.status) {
        setShowAlert(true);
        setTypeAlert("error");
        return setMessageAlert(
          "Não foi possível mostrar as configurações desse motorista"
        );
      }

      if (result.data.response.data.length === 0) {
        if (page === 1) {
          setDataModalDebugApp([]);
          setNextPageDebugApp("");
          return swal({
            title: date
              ? "Não existem configurações para esse motorista nessa data"
              : "Não existem configurações para esse motorista",
            icon: "info",
          });
        }
        return;
      }

      if (page !== 1) {
        setDataModalDebugApp((state) => state.concat(...result.data.response.data));
        setNextPageDebugApp(result.data.response.next_page_url);
        return;
      }

      setDataModalDebugApp(result.data.response.data);
      setNextPageDebugApp(result.data.response.next_page_url);
      return setIsVisibleModalDebugApp(true);
    });
  };

  const handlePrepareEditModal = useCallback((idDriver: number | undefined) => {
    setLoading(true);
    const requestDriverData = api.get(`driver/${idDriver}`);
    const requestTypeOfDriver = api.get(`userType/drivers`);

    return Promise.all([requestDriverData, requestTypeOfDriver]).then((result) => {
      setLoading(false);
      if (!result[0].data.status) {
        setShowAlert(true);
        setTypeAlert("error");
        return setMessageAlert(
          "Não foi possível carregar os dados deste motorista"
        );
      }

      setSelectTypeOfDriver(result[1].data.response);
      setCurrentDriver(result[0].data.response);
      return setIsVisibleModalEdit(true);
    });
  }, []);

  const handlePrepareDocumentModal = (idDriver: number) => {
    setLoading(true);
    setDocumentsDriverId(idDriver);
    const requestDriverDocs = api.get(`driver/${idDriver}`);
    const requestStatusDocs = api.get(`docStatus`);
    const requestTypeOfDocuments = api.get(`doc`);

    Promise.all([
      requestDriverDocs,
      requestStatusDocs,
      requestTypeOfDocuments,
    ]).then((result) => {
      setLoading(false);
      setStatusDriverDoc(result[1].data.response);
      setTypeOfDocuments(result[2].data.response);
      setUserId(result[0].data.response.idUser);
      setDocumentsDriver(result[0].data.response.docs_user);
      return setIsVisibleModalDocuments(true);
    });
  };

  const refetchDriverDocuments = () => {
    if (!documentsDriverId) return;

    api.get(`driver/${documentsDriverId}`).then((result) => {
      setDocumentsDriver(result.data.response.docs_user);
    });
  };

  const handleCloseModal = () => {
    setIsVisibleModalDocuments(false);
    setDocumentsDriver([]);
    setDocumentsDriverId(null);
    setIsVisibleModalEdit(false);
    setIsVisibleModalDebugApp(false);
    setIsVisibleModalMoveBalance(false);
    setAnnotationsModal(false);
    setRaceHistoryModal(false);
    setIsVisibleSplitModal(false);
    setIsVisibleLimitHoursModal(false);
  };

  const deleteDriver = async (idDriver: number) => {
    try {
      const values = await runConfirmedAction(
        { title: "Você realmente deseja excluir esse motorista?" },
        setLoading,
        () => api.delete(`driver/${idDriver}`)
      );
      if (!values) return;

      if (values.data.status) {
        setMessageAlert("Motorista excluído com sucesso!");
        refreshDrivers();
        setTypeAlert("success");
        return setShowAlert(true);
      }
      setTypeAlert("error");
      setMessageAlert("Erro ao tentar excluir");
      return setShowAlert(true);
    } catch (error) {
      console.error(error);
      setTypeAlert("error");
      setMessageAlert("Erro ao tentar excluir");
      setShowAlert(true);
    }
  };

  const driverAvaliation = (idDriver: number, page = 1) => {
    setLoading(true);
    setCurrentPageAvaliation(page);
    api.get(`tripRating?driverId=${idDriver}&page=${page}`).then((values) => {
      setLoading(false);
      if (values.data.response.data.length !== 0) {
        if (page !== 1) {
          setRaceHistory((state) => state.concat(...values.data.response.data));
          setNextPageAvaliation(values.data.response.next_page_url);
          return;
        }
        setRaceHistory(values.data.response.data);
        setNextPageAvaliation(values.data.response.next_page_url);
        setRaceHistoryModal(true);
        return;
      }
      swal("Esse motorista não possui avaliações!", "", "info");
    });
  };

  const handleSplitAction = (idDriver: number) => {
    setSplitDriverId(idDriver);
    setIsVisibleSplitModal(true);
  };

  const handleDriverValidation = (idDriver: number) => {
    handleValidateRegistration(
      idDriver,
      "driver",
      (message) => {
        setMessageAlert(message);
        setTypeAlert("success");
        setShowAlert(true);
        refreshDrivers();
      },
      (message) => {
        setMessageAlert(message);
        setTypeAlert("error");
        setShowAlert(true);
      },
      setLoading
    );
  };

  const menu = (item: DriverData) => {
    return (
      <Menu>
        {hasPermission(MOTORISTA, "editar") && (
          <ItemMenuSettings
            key="1"
            onClick={() => handlePrepareEditModal(item.idDriver)}
          >
            <HiPencil /> Editar
          </ItemMenuSettings>
        )}
        {hasPermission(MOTORISTA, "listar") && (
          <ItemMenuSettings
            key="12"
            onClick={() => handleOpenReturnsModal(item.idDriver)}
          >
            <FaMap /> Meus Retornos
          </ItemMenuSettings>
        )}
        {hasPermission(MOTORISTA, "listar") && (
          <ItemMenuSettings
            key="2"
            onClick={() => {
              handlePrepareDocumentModal(item.idDriver);
            }}
          >
            <HiDocument /> Documentos
          </ItemMenuSettings>
        )}
        {hasPermission(MOTORISTA, "bloquear_desbloquear") && (
          <ItemMenuSettings
          key="3"
          onClick={() =>
            handleChangeStatusDriver(item.registerStatus, item.idDriver)
          }
        >
          <BsLockFill />
          {item.registerStatus === "ATIVO" ? "Bloquear" : "Desbloquear"}
        </ItemMenuSettings>
        )}
        {hasPermission(MOTORISTA, "editar") && (
          <ItemMenuSettings
          key="4"
          onClick={() => handleGenerateDefaultPassword(item.idDriver)}
        >
          <IoMdKeypad /> Zerar senha
        </ItemMenuSettings>
        )}
        {hasPermission(MOTORISTA, "editar") && (
          <ItemMenuSettings
          key="5"
          onClick={() => {
            setIsVisibleModalMoveBalance(true);
            setDriverId(item.idDriver);
          }}
        >
          <FaMoneyBillWave /> Movimentar Saldo
        </ItemMenuSettings>
        )}
        {hasPermission(MOTORISTA, "listar") && (
          <ItemMenuSettings
          key="6"
          onClick={() => {
            setAnnotationsModal(true);
            setUserId(item.idUser);
            setAnnotations(item.observation);
          }}
        >
          <Badge dot color="red" offset={[5, 0]} style={{ marginRight: 6 }} count={item.observation?.trim() ? 1 : 0}>
            <GrNotes style={{ fontSize: 16 }} />
          </Badge>
          Anotações
        </ItemMenuSettings>
        )}
        {hasPermission(MOTORISTA, "listar") && (
          <ItemMenuSettings
            key="7"
            onClick={() => {
              setDriverId(item.idDriver);
              handlePrepareDebugAppModal(item.idDriver);
            }}
          >
            <VscDebugConsole /> Debug App
          </ItemMenuSettings>
        )}
        {hasPermission(MOTORISTA, "listar") && (
          <ItemMenuSettings
            key="8"
            onClick={() => {
              setDriverId(item.idDriver);
              driverAvaliation(item.idDriver);
            }}
          >
            <VscStarFull /> Avaliações
          </ItemMenuSettings>
        )}
        {enableZafiraValidationMonitor && hasPermission(ZAFIRA, ZAFIRA_VALIDAR_CADASTRO) && (
          <ItemMenuSettings
            key="8a"
            onClick={() => handleDriverValidation(item.idDriver)}
          >
            <MdVerifiedUser /> Validar Cadastro
          </ItemMenuSettings>
        )}
        {hasPermission(MOTORISTA, "editar") && (
          <ItemMenuSettings
            key="13"
            onClick={() => {
              setLimitHoursDriverId(item.idDriver);
              setCurrentHoursOpen(item.hours_open);
              setIsVisibleLimitHoursModal(true);
            }}
          >
            <ClockCircleOutlined /> Limite de Horas
          </ItemMenuSettings>
        )}
        {isSplitPaymentEnabled && hasPermission(MOTORISTA, "editar") && (
          <ItemMenuSettings key="11" onClick={() => handleSplitAction(item.idDriver)}>
            <LuSplitSquareVertical /> Split
          </ItemMenuSettings>
        )}
        {hasPermission(MOTORISTA, "editar") && (
          <ItemMenuSettings
            key="9"
            style={{ color: "red" }}
            onClick={() => handleResetBalanceDriver(item.idDriver)}
          >
            <MdMoneyOff />
            Zerar saldo
          </ItemMenuSettings>
        )}
        {hasPermission(MOTORISTA, "excluir") && (
          <ItemMenuSettings
            key="10"
            style={{ color: "red" }}
            onClick={() => deleteDriver(item.idDriver)}
          >
            <AiFillDelete />
            Excluir Motorista
          </ItemMenuSettings>
        )}
      </Menu>
    );
  };


  useEffect(() => {
    const requestMessageWhatsapp = api("config/whatsapp_message_driver");
    const requestDriverStatus = api("report/select/driverRegisterStatus");

    Promise.all([requestMessageWhatsapp, requestDriverStatus]).then(
      (result) => {
        if (!result[0]?.data?.status) {
          return "";
        }

        setWhatsppMessage(result[0].data.response || result[0].data.data || []);
      }
    ).catch(() => {});
    getTripTypeList();
  }, []);

  useEffect(() => {
    getOptionsStatus();
    getConfigKeys();
  }, [getConfigKeys]);


  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const editDriverId = urlParams.get('editDriverId');
    const openModalDriverId = urlParams.get('openModalDriverId');

    if (editDriverId && !hasInitializedFilter.current) {
      hasInitializedFilter.current = true;

      const filterDriverByUserId = async () => {
        try {
          setLoading(true);

          const responseListDrivers = await api.get(
            `driver?page=1&driverRegisterStatusId=${idStatusSearch > 0 ? idStatusSearch : ""}&driverType=${driverType > 0 ? driverType : ""}`
          );

          if (responseListDrivers.data.status && responseListDrivers.data.response.data.length > 0) {
            const filteredDrivers = responseListDrivers.data.response.data.filter(
              (driver: any) => driver.idUser === parseInt(editDriverId)
            );

            if (filteredDrivers.length > 0) {
              const driverData = filteredDrivers[0];

              setValueSearch(driverData.name);
              setSearchBy('name');
              setListDirectly(filteredDrivers);
            } else {
              refreshDrivers();
            }
          } else {
            refreshDrivers();
          }
        } catch (error) {
          console.error('Erro ao buscar motorista:', error);
          refreshDrivers();
        } finally {
          setLoading(false);
        }
      };

      filterDriverByUserId();

      const newUrl = location.pathname;
      window.history.replaceState({}, '', newUrl);
    }

    if (openModalDriverId && hasPermission(MOTORISTA, "editar")) {
      setIsRedirecting(true);
      handlePrepareEditModal(Number(openModalDriverId)).finally(() => {
        setIsRedirecting(false);
      });
      window.history.replaceState({}, '', location.pathname);
    }
  }, [
    location.search,
    refreshDrivers,
    location.pathname,
    handlePrepareEditModal,
    hasPermission,
  ]);

  return (
    <>
      <Container>
        {/*<Preload visible={loading} />*/}
        <Alert
          message={messageAlert}
          typeAlert={typeAlert}
          visibility={showAlert}
          setVisibility={setShowAlert}
        />
        <ContentHeader>
          <ContentSearch>
            <FlexContentInput>
              <LabelText>Buscar</LabelText>
              <Input.Search
                style={{ width: "100%" }}
                value={valueSearch}
                onChange={(event) => setValueSearch(event.target.value)}
                onSearch={refreshDrivers}
                enterButton
              />
            </FlexContentInput>
            <ContentInput>
              <LabelText>Tipo de motorista</LabelText>
              <Select
                style={{ width: 250 }}
                value={driverType}
                onChange={(value) => setDriverType(value)}
              >
                <Select.Option value={0}>TODOS</Select.Option>
                {tripTypeData?.map((value: any) => {
                  return (
                    <Select.Option
                      key={value.idUserType}
                      value={value.idUserType}
                    >
                      {value.name}
                    </Select.Option>
                  );
                })}
              </Select>
            </ContentInput>
            <FlexContentInput>
              <LabelText>Status</LabelText>
              <Select
                style={{ width: 250 }}
                value={idStatusSearch}
                onChange={(value) => setIdStatusSearch(value)}
              >
                <Select.Option value={0}>TODOS</Select.Option>
                {listOptions.map((value) => {
                  return (
                    <Select.Option key={value.id} value={value.id}>
                      {value.text}
                    </Select.Option>
                  );
                })}
              </Select>
            </FlexContentInput>
          </ContentSearch>
          <ContentTypesSearch>
            <RadioContentInput>
              <Radio.Group
                onChange={(event) => setSearchBy(event.target.value)}
                value={searchBy}
              >
                <Radio value="name">Nome</Radio>
                <Radio value="email">E-mail</Radio>
                <Radio value="document">CPF</Radio>
                <Radio value="phone">Telefone</Radio>
                <Radio value="carPlate">Placa</Radio>
              </Radio.Group>
            </RadioContentInput>
          </ContentTypesSearch>
        </ContentHeader>
        <Loader spinning={loading || filterLoading}>
          {listDrivers.length <= 0 && !isRedirecting && (
            <div>
              <ContentIconSearch>
                <SearchLottieWrapper>
                  <Lottie loop animationData={pathIconSearch} />
                </SearchLottieWrapper>
              </ContentIconSearch>

              <ContentInstructionsSearch>
                <div>
                  <h3>Como usar:</h3>

                  <div>
                    <span>
                      1 - Digite o que deseja localizar no campo buscar.
                    </span>
                    <span>
                      2 - Selecione o tipo de busca nas opções logo abaixo do seu
                      texto, pode fazer buscas por nome, email, documento e
                      telefone e etc...
                    </span>
                    <span>
                      3 - Ao lado do campo <strong>BUSCAR</strong>, vai encontrar
                      as opçoes de status, como Ativos, Bloqueados, Inativos,
                      Aguardando, etc...
                    </span>
                    <span>
                      4 - Clique na lupa e os resultados surgiram neste espaço.
                    </span>
                  </div>
                </div>
              </ContentInstructionsSearch>
            </div>
          )}
          <ContentDrivers>
            {listDrivers.filter(Boolean).map((value) => {
              return (
                <CardDriver
                  baseImageLink={baseImageLink}
                  menu={menu}
                  setLoading={setLoading}
                  key={value.idDriver}
                  datas={value}
                  message={whatsppMessage}
                  enableZafiraValidationMonitor={enableZafiraValidationMonitor}
                />
              );
            })}
            {hasMore ? (
              listDrivers.length > 0 ? (
                <Button
                  style={{ marginTop: 10, marginBottom: 5, alignSelf: "center" }}
                  type="primary"
                  onClick={fetchMore}
                >
                  Mostrar Mais
                </Button>
              ) : null
            ) : null}
          </ContentDrivers>
          {isRedirecting && (
            <LoadingContainer>
              <LoadingText>Carregando dados do motorista...</LoadingText>
            </LoadingContainer>
          )}
        </Loader>
      </Container>

      <MoveBalanceModal
        visibility={isVisibleModalMoveBalance}
        handleCloseModal={handleCloseModal}
        driverId={driverId}
        onSearch={refreshDrivers}
      />
      <DebugAppModal
        visibility={isVisibleModalDebugApp}
        handleCloseModal={handleCloseModal}
        driverConfigs={dataModalDebugApp}
        driverId={driverId}
        page={currentPageDebugApp}
        nextPageDebugApp={nextPageDebugApp}
        debugAppInfo={handlePrepareDebugAppModal}
      />
      <EditDriverModal
        baseImageLink={baseImageLink}
        visibility={isVisibleModalEdit}
        handleCloseModal={handleCloseModal}
        driverSelected={currentDriver}
        typeOfDriver={selectTypeOfDriver}
        onSearch={refreshDrivers}
        handlePrepareEditModal={handlePrepareEditModal}
        enableZafiraValidationMonitor={enableZafiraValidationMonitor}
      />
      <DocumentsDriverModal
        userId={userId}
        driverDoc={documentsDriver}
        typeOfDocument={typeOfDocuments}
        statusDriverDoc={statusDriverDoc}
        handleCloseModal={handleCloseModal}
        visibility={isVisibleModalDocuments}
        onDocumentsChanged={refetchDriverDocuments}
      />
      <AnnotationsModal
        visibility={annotationsModal}
        handleCloseModal={handleCloseModal}
        onSearch={refreshDrivers}
        userId={userId}
        annotations={annotations}
      />
      <AvaliationModal
        visibility={raceHistoryModal}
        handleCloseModal={handleCloseModal}
        raceHistory={raceHistory}
        driverId={driverId}
        page={currentPageAvaliation}
        nextPageAvaliation={nextPageAvaliation}
        driverAvaliation={driverAvaliation}
      />
      <SplitModal
        visibility={isVisibleSplitModal}
        handleCloseModal={() => setIsVisibleSplitModal(false)}
        driverId={splitDriverId}
      />
      <ReturnsModal
        visibility={isVisibleReturnsModal}
        handleCloseModal={() => setIsVisibleReturnsModal(false)}
        driverId={returnsDriverId}
      />
      <LimitHoursModal
        visibility={isVisibleLimitHoursModal}
        handleCloseModal={handleCloseModal}
        driverId={limitHoursDriverId || 0}
        currentHoursOpen={currentHoursOpen}
      />
    </>
  );
};

export default ListDrivers;
