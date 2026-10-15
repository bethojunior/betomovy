import { FC, useEffect, useState, useContext } from "react";
import { Menu } from "antd";
import swal from "sweetalert";
import { BsLockFill } from "react-icons/bs";
import { AiFillDelete } from "react-icons/ai";
import { GiTicket } from "react-icons/gi";
import { HiPencil } from "react-icons/hi";
import CardLegalPerson from "../../../components/Client/LegalPerson/Card";
import Preload from "../../../components/Utils/Preload";
import api from "../../../services/api";
import { runConfirmedAction } from "../../../utils/confirmedAction";
import Alert from "../../../components/Utils/Alert";
import {
  ItemMenuSettings,
  ItemMenuSettingsDanger,
  InstructionsLottie,
  Content,
  SearchContent,
  Section,
  SearchLabel,
  SearchInput,
  AllRadios,
  Radios,
  NewregisterButton,
  ContentIconSearch,
  ContentInstructionsSearch,
  MsgObservation,
  ShowMoreButton
} from "./styles";
import Session from "../../../utils/Session";
import EditionModal from "../../../components/Client/LegalPerson/Modal/Edition";
import VoucherModal from "../../../components/Client/LegalPerson/Modal/Voucher";
import { Data, StateInterface, CityData } from "./type";
import pathIconSearch from "../../../assets/animations/icon-search-list.json";
import { Loader } from "../../../components/Loader";
import AuthContext from "../../../contexts/auth";
import { CLIENTE } from "../../../constants/permissions";
import { useClientLegalList } from "../../../hooks/useClientLegalList";

const LegalPerson: FC = () => {
  const [loading, setLoading] = useState(false);
  const [whatsAppMessage, setWhatsAppMessage] = useState("");
  const [messageAlert, setMessageAlert] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [typeAlert, setTypeAlert] = useState<
    "success" | "info" | "warning" | "error"
  >("success");

  const [legalId, setLegalId] = useState(0);

  const [showModalEdition, setShowModalEdition] = useState(false);
  const [showModalVoucher, setShowModalVoucher] = useState(false);

  const [customerEdit, setCustomerEdit] = useState<Data | null>(null);
  const [registerOrEdit, setRegisterOrEdit] = useState(false);

  const { cityId } = Session.getLocal("citySelected");

  const {
    listLegalPerson,
    loading: filterLoading,
    hasMore,
    filters: { valueSearch, filter },
    setValueSearch,
    setFilter,
    fetchMore,
    refresh,
  } = useClientLegalList(cityId);

  const [voucherValue, setVoucherValue] = useState(0);

  const [quantityBalancePJ, setQuantityBalancePJ] = useState("0,00");
  const [actionSelected, setActionSelected] = useState(1);
  const [cityList, setCityList] = useState<CityData[]>([]);
  const [stateSelected, setStateSelected] = useState(26);
  const [citySelected, setCitySelected] = useState<number | null>(null);

  const [stateList, setStateList] = useState<StateInterface>();

  const { hasPermission } = useContext(AuthContext);
  const canDeleteLegalPerson = hasPermission(CLIENTE, "excluir_pj");


  const handleCloseModal = () => {
    setShowModalEdition(false);
    setShowModalVoucher(false);
  };

  useEffect(() => {
    api.get("config/whatsapp_message_driver").then((result) => {
      setWhatsAppMessage(result.data.response);
    });
  }, []);

  const blockClient = (id: number, statusClient: string) => {
    swal({
      title: `Você realmente deseja ${statusClient === "ATIVO" ? "bloquear" : "desbloquear"
        } essa Pessoa jurídica?`,
      icon: "warning",
      buttons: ["Cancelar", "Confirmar"],
      dangerMode: true,
    }).then((value: boolean) => {
      if (value) {
        setLoading(true);
        if (statusClient === "ATIVO") {
          api.put(`company/${id}/block`).then((values) => {
            if (values.data.status) {
              setMessageAlert("Pessoa jurídica bloqueada com sucesso!");
              refresh();
              setTypeAlert("success");
              return setShowAlert(true);
            }
            setMessageAlert("Erro ao tentar bloquear Pessoa jurídica!");
            setTypeAlert("error");
            return setShowAlert(true);
          });
        } else {
          api.put(`company/${id}/enable`).then((values) => {
            if (values.data.status) {
              setMessageAlert("Pessoa jurídica desbloqueado com sucesso!");
              refresh();
              setTypeAlert("success");
              return setShowAlert(true);
            }
            setMessageAlert("Erro ao tentar desbloquear Pessoa jurídica!");
            setTypeAlert("error");
            return setShowAlert(true);
          });
        }
      }
    });
  };

  const deleteCompany = async (id: number) => {
    try {
      const values = await runConfirmedAction(
        {
          title: "Você realmente deseja excluir essa Pessoa jurídica?",
          text: "Essa ação é irreversível",
        },
        setLoading,
        () => api.delete(`company/${id}`)
      );
      if (!values) return;

      if (values.data.status) {
        refresh();
        setMessageAlert("Pessoa jurídica excluída com sucesso!");
        setTypeAlert("success");
        return setShowAlert(true);
      }
      setTypeAlert("error");
      return setMessageAlert("Erro ao tentar excluir");
    } catch (error) {
      console.error(error);
      setTypeAlert("error");
      setMessageAlert("Erro ao tentar excluir");
      setShowAlert(true);
    }
  };

  const stateAndCityEdit = async (id: number) => {
    try {
      setLoading(true);
      const [estateRes, companyRes] = await Promise.all([
        api.get("estate"),
        api.get(`company/${id}`),
      ]);
      if (estateRes.data?.response) {
        setStateList(estateRes.data.response);
      }
      const companyData = companyRes.data?.response;
      const state = companyData?.stateId;
      const city = companyData?.cityId;

      if (state) {
        const cityRes = await api.get(`city?estateId=${state}`);
        if (cityRes.data?.response) {
          setCityList(cityRes.data.response);
        }
      }
      setStateSelected(state);
      setCitySelected(city);
      setShowModalEdition(true);
    } catch (error) {
      console.error(error);
      swal({
        title: "Erro ao buscar dados da empresa",
        icon: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const resisterInfos = async () => {
    setLoading(true);

    const responseEstate = await api.get("estate");
    const responseCityByEstate = await api.get(
      `city?estateId=${stateSelected}`
    );

    Promise.all([responseEstate, responseCityByEstate])
      .then((response) => {
        if (response[0].status) {
          setStateList(response[0].data.response);
        } else {
          swal({
            title: "Erro ao buscar estados",
            icon: "error",
          });
        }

        if (response[1].status) {
          setCityList(response[1].data.response);
        } else {
          swal({
            title: "Erro ao buscar cidades",
            icon: "error",
          });
        }
      })
      .catch((error) => {
        swal({
          title: error.response.data.response.message,
          icon: "error",
        });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    resisterInfos();
  }, []);

  const menu = (item: Data) => (
    <Menu>
      <ItemMenuSettings
        key="1"
        onClick={() => {
          setLegalId(item.id);
          setCustomerEdit(item);
          setRegisterOrEdit(true);
          stateAndCityEdit(item.id);
        }}
      >
        <HiPencil /> Editar
      </ItemMenuSettings>
      <ItemMenuSettings
        key="2"
        onClick={() => blockClient(item.id, item.company_register_status.name)}
      >
        <BsLockFill />{" "}
        {item.company_register_status.name === "ATIVO"
          ? "Bloquear"
          : "Desbloquear"}
      </ItemMenuSettings>
      <ItemMenuSettings
        key="3"
        onClick={() => {
          setLegalId(item.id);
          setShowModalVoucher(true);
          setVoucherValue(item.voucherLimit);
          setQuantityBalancePJ("0,00");
          setActionSelected(1);
        }}
      >
        <GiTicket /> Voucher
      </ItemMenuSettings>
      {canDeleteLegalPerson && (
        <ItemMenuSettingsDanger key="4" onClick={() => deleteCompany(item.id)}>
          <AiFillDelete /> Excluir
        </ItemMenuSettingsDanger>
      )}
    </Menu>
  );

  return (
    <>
      <Content>
        <Preload visible={loading || filterLoading} />
        <Alert
          visibility={showAlert}
          message={messageAlert}
          typeAlert={typeAlert}
          setVisibility={setShowAlert}
        />
        <SearchContent>
          <Section>
            <SearchLabel>Buscar</SearchLabel>
            <SearchInput
              onChange={(e) => setValueSearch(e.target.value)}
              value={valueSearch}
              onSearch={refresh}
              enterButton
            />

            <AllRadios>
              <Radios.Group
                onChange={(e) => setFilter(e.target.value)}
                value={filter}
              >
                <Radios value="fantasyName">Nome fantasia</Radios>
                <Radios value="document">CNPJ</Radios>
                <Radios value="phone">Telefone</Radios>
              </Radios.Group>
            </AllRadios>
          </Section>
          <NewregisterButton
            onClick={() => {
              setRegisterOrEdit(false);
              setShowModalEdition(true);
            }}
            type="primary"
          >
            Novo cadastro
          </NewregisterButton>
        </SearchContent>
        <MsgObservation>
          Dados referentes a empresas cadastradas, incluindo nome fantasia, CNPJ, telefone, status e informações de voucher.
        </MsgObservation>
        <Loader spinning={loading || filterLoading}>
          {!listLegalPerson.length ? (
            <div>
              <ContentIconSearch>
                <InstructionsLottie loop animationData={pathIconSearch} />
              </ContentIconSearch>

              <ContentInstructionsSearch>
                <div>
                  <h3>Como usar:</h3>

                  <div>
                    <span>1 - Digite o que deseja localizar no campo buscar.</span>
                    <span>
                      2 - Selecione o tipo de busca nas opções logo abaixo do seu
                      texto, pode fazer buscas por Nome fantasia, CNPJ e telefone.
                    </span>
                    <span>
                      3 - Ao lado do campo <strong>BUSCAR</strong>, vai encontrar
                      a opção de Novo Cadastro.
                    </span>
                    <span>
                      4 - Clique na lupa e os resultados surgirão neste espaço.
                    </span>
                  </div>
                </div>
              </ContentInstructionsSearch>
            </div>
          ) : (
            (listLegalPerson || []).map((data) => {
              return (
                <CardLegalPerson
                  key={data.id}
                  data={data}
                  menu={menu}
                  whatsAppMessageProps={whatsAppMessage}
                />
              );
            })
          )}
          {hasMore && (listLegalPerson || []).length > 0 && (
            <ShowMoreButton type="primary" onClick={fetchMore}>
              Mostrar Mais
            </ShowMoreButton>
          )}
        </Loader>
      </Content>
      <EditionModal
        visibility={showModalEdition}
        closeModal={handleCloseModal}
        legalId={legalId}
        data={customerEdit}
        setData={setCustomerEdit}
        registerOrEdit={registerOrEdit}
        handleSearchProps={refresh}
        stateList={stateList}
        setCityList={setCityList}
        cityList={cityList}
        stateSelected={stateSelected}
        setStateSelected={setStateSelected}
        citySelected={citySelected}
        setCitySelected={setCitySelected}
      />
      <VoucherModal
        visibility={showModalVoucher}
        closeModal={handleCloseModal}
        legalId={legalId}
        handleSearchProps={refresh}
        voucherValueProps={voucherValue}
        quantityBalancePJ={quantityBalancePJ}
        setQuantityBalancePJ={setQuantityBalancePJ}
        actionSelected={actionSelected}
        setActionSelected={setActionSelected}
      />
    </>
  );
};

export default LegalPerson;
