import {
  Container,
  Content,
  ContentHeader,
  ContentCitiesAndDrivers,
  ContentBody,
  ButtonSearch,
  ContentBtnSearch,
  ContentTable,
} from "./styles";

import { Collapse, DatePicker, Select, Checkbox, Input, Table, Spin } from "antd";
import { CheckboxChangeEvent } from "antd/es/checkbox";
import locale from "antd/es/date-picker/locale/pt_BR";
import swal from "sweetalert";
import { ColumnsType } from "antd/es/table";

import {
  CitiesProps,
  DriversProps,
  FinancialProductDriversProps,
  IndicationsProps,
  ListDatasIndicationsProps,
  ReferralMonetizationProps,
  ListDriversReferralProps,
} from "./types";

import { useState, useEffect, FormEvent } from "react";

import Preload from "../../../components/Utils/Preload";
import { SelectItems } from "../../../components/Financial/SelectItems";
import { ModalReportsFinancialList } from "../../../components/Financial/ModalReportsFinancialList";

import Utils from "../../../utils/Utils";
import api from "../../../services/api";
import apiv1 from "../../../services/apiv1";
import Session from "../../../utils/Session";

import { useDebounce } from "../../../hooks/useDebounce";

export const ReportsFinancial = () => {
  const [listCities, setListCities] = useState<CitiesProps[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [listDrivers, setListDrivers] = useState<DriversProps[]>([]);
  const [valueSearchDriver, setValueSearchDriver] = useState<string>("");
  const [isCheckedAllCities, setIsCheckedAllCities] = useState<boolean>(false);
  const [isCheckedAllDrivers, setIsCheckedAllDrivers] =
    useState<boolean>(false);
  const [listIdDrivers, setListIdDrivers] = useState<number[]>([]);
  const [listIdCities, setListIdCities] = useState<number[]>([]);
  const [datasFinancialProductDriver, setDatasFinancialProductDriver] =
    useState<FinancialProductDriversProps>();
  const [visibleModal, setVisibleModal] = useState<boolean>(false);

  const [listIndications, setListIndications] = useState<IndicationsProps[]>(
    []
  );

  const [idUserIndication, setIdUserIndication] = useState<number | null>(null);

  const [listDatasIndications, setListDatasIndications] = useState<
    ListDatasIndicationsProps[]
  >([]);

  const [referralMonetizations, setReferralMonetizations] = useState<
    ReferralMonetizationProps[]
  >([]);

  const [listDriversReferral, setListDriversReferral] = useState<
    ListDriversReferralProps[]
  >([]);

  const [idReferralMonetizations, setIdReferralMonetizations] =
    useState<number>(0);

  const citySelected = Session.getLocal("citySelected");

  const handleGetReportsProductDrivers = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData(event.target as HTMLFormElement);
      const dateInit = formData.get("date-init-product-drivers");
      const dateFinal = formData.get("date-final-product-drivers");

      if (dateInit === "" || dateFinal === "") {
        swal({
          title: "Escolha as datas!",
          icon: "info",
        });
        setLoading(false);
        return;
      }

      const dateInitFormated = Utils.transformDate(dateInit as string, false);
      const dateFinalFormated = Utils.transformDate(dateFinal as string, false);

      const responseReports = await api.get(
        `report/driver/synthetic?dateStart=${dateInitFormated}&dateEnd=${dateFinalFormated}&cities[]=${listIdCities.join(
          "&cities[]="
        )}&drivers[]=${listIdDrivers.join("&drivers[]=")}`
      );

      if (responseReports.status) {
        setDatasFinancialProductDriver(responseReports.data.response);
        setVisibleModal(true);
      }
    } catch (error) {
      console.error(error);
      swal({
        title: "Erro ao pesquisar relatório!",
        icon: "error",
      });
    }
    setLoading(false);
  };

  const getCities = async () => {
    setLoading(true);
    try {
      const responseCities = await api.get("city/actives/fully");

      if (responseCities.status) {
        setListCities(Array.isArray(responseCities.data?.response) ? responseCities.data.response : []);
      }
    } catch (error) {
      console.error(error);
      swal({
        title: "Erro ao capturar as cidades disponíveis!",
        icon: "error",
      });
    }
    setLoading(false);
  };

  const handleSearchDriver = async () => {
    setLoading(true);
    try {
      const responseSearchDriver = await api.get(
        `driver?page=0&name=${valueSearchDriver}`
      );

      if (responseSearchDriver.status) {
        const d = responseSearchDriver.data?.response?.data;
        setListDrivers(Array.isArray(d) ? d : (Array.isArray(responseSearchDriver.data?.response) ? responseSearchDriver.data.response : []));
      }
    } catch (error) {
      console.error(error);
      swal({
        title: "Erro ao capturar dados de motoristas!",
        icon: "error",
      });
    }
    setLoading(false);
  };

  const handleChangeSelectCity = (value: number[]) => {
    setListIdCities(value);
  };

  const handleChangeCheckedAllCity = (event: CheckboxChangeEvent) => {
    const isChecked = event.target.checked;

    if (isChecked) {
      const citiesIds = (listCities || []).map((value) => {
        return value.cityId;
      });

      setIsCheckedAllCities(isChecked);
      setListIdCities(citiesIds);
    } else {
      setIsCheckedAllCities(isChecked);
      setListIdCities([]);
    }
  };

  const getReferrealMonetization = async () => {
    setLoading(true);
    try {
      const cityId = citySelected?.cityId || "";
      const responseReferralMonetization = await api.get(
        `referralMonetization${cityId ? `?cityId=${cityId}` : ""}`
      );

      if (responseReferralMonetization.status) {
        setReferralMonetizations(Array.isArray(responseReferralMonetization.data?.response) ? responseReferralMonetization.data.response : []);
      }
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  const handleSearchReferralDriver = useDebounce(async (search: string) => {
    try {
      setLoading(true);
      const responseReferralDriver = await api.get(
        `userIndication/report/referredUsers?name=${search}&monetizationId=${
          idReferralMonetizations !== 0 ? idReferralMonetizations : ""
        }`
      );

      if (responseReferralDriver.status) {
        setListDriversReferral(Array.isArray(responseReferralDriver.data?.response) ? responseReferralDriver.data.response : []);
      }
    } catch (error) {
      setListDriversReferral([]);
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, 1000);

  const handleGetUsersIndications = async (search: string) => {
    try {
      const responseUserIndications = await apiv1.get(
        `user/search?q=${search}`
      );

      if (responseUserIndications.status) {
        const uList = Array.isArray(responseUserIndications.data?.data) ? responseUserIndications.data.data : [];
        setListIndications(uList);
        if (uList.length > 0) {
          setIdUserIndication(uList[0].idUser);
        }
      }
    } catch (error) {
      setListIndications([]);
      console.error(error);
      swal({
        title: "Erro ao pegar dados!",
        icon: "error",
      });
    }
  };

  const handleSearchIndications = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData(event.target as HTMLFormElement);

      const dateInitIndication = Utils.transformDate(
        formData.get("date-init-indication") as string,
        false
      );
      const dateFinalIndication = Utils.transformDate(
        formData.get("date-final-indication") as string,
        false
      );

      const responseReferrealEarnings = await api.get(
        `userIndication/report/referralEarnings?dateStart=${dateInitIndication}&dateEnd=${dateFinalIndication}&userId=${
          idUserIndication === null ? "" : idUserIndication
        }`
      );

      if (responseReferrealEarnings.status) {
        setListDatasIndications(Array.isArray(responseReferrealEarnings.data?.response) ? responseReferrealEarnings.data.response : []);
      }
    } catch (error) {
      setListDatasIndications([]);
      console.error(error);
      swal({
        title: "Erro ao buscar indicações!",
        icon: "error",
      });
    }
    setLoading(false);
  };

  useEffect(() => {
    getCities();
    getReferrealMonetization();
  }, []);

  const optionsCities = (listCities || []).map((value) => {
    return {
      label: value.nome,
      value: value.cityId,
    };
  });

  const listIndicationsFormated = (listIndications || []).map((value) => {
    return {
      label: `${value.name} - ${value.type}`,
      value: value.idUser,
    };
  });

  const columns: ColumnsType<ListDatasIndicationsProps> = [
    {
      title: "Nome",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Periodo",
      dataIndex: "period",
      key: "period",
    },
    {
      title: "Tipo",
      dataIndex: "userType",
      key: "userType",
    },
    {
      title: "Total",
      key: "total",
      render: (_, data) => {
        return data.total.toLocaleString("pt-br", {
          style: "currency",
          currency: "BRL",
        });
      },
    },
  ];

  const columnsReferral: ColumnsType<ListDriversReferralProps> = [
    {
      title: "Nome",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Tipo",
      dataIndex: "userType",
      key: "userType",
    },
    {
      title: "Telefone",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "Indicações",
      dataIndex: "userIndications",
      key: "userIndications",
    },
    {
      title: "Level",
      dataIndex: "level",
      key: "level",
    },
  ];

  return (
    <Container>
      <Preload visible={loading} />
      <Collapse>
        <Collapse.Panel header="Financeiro Produção Motorista" key={1}>
          <form onSubmit={handleGetReportsProductDrivers}>
            <Content>
              <ContentHeader>
                <DatePicker
                  style={{
                    width: "100%",
                  }}
                  name="date-init-product-drivers"
                  placeholder="Data Inicial"
                  format="DD/MM/YYYY"
                  locale={locale}
                />
                <DatePicker
                  style={{
                    width: "100%",
                  }}
                  name="date-final-product-drivers"
                  placeholder="Data Final"
                  format="DD/MM/YYYY"
                  locale={locale}
                />
              </ContentHeader>
              <ContentBody>
                <ContentCitiesAndDrivers>
                  <ContentHeader>
                    <Select
                      style={{
                        width: "100%",
                      }}
                      value={listIdCities}
                      mode="multiple"
                      placeholder="Selecione a cidade"
                      onChange={handleChangeSelectCity}
                      options={optionsCities}
                    />

                    <Checkbox
                      checked={isCheckedAllCities}
                      onChange={handleChangeCheckedAllCity}
                      style={{
                        marginBottom: 10,
                      }}
                    >
                      Todas
                    </Checkbox>
                  </ContentHeader>
                </ContentCitiesAndDrivers>

                <ContentCitiesAndDrivers>
                  <ContentHeader
                    style={{
                      marginBottom: 10,
                    }}
                  >
                    <Input.Search
                      onSearch={handleSearchDriver}
                      onChange={(event) =>
                        setValueSearchDriver(event.target.value)
                      }
                      placeholder="Busque um motorista"
                    />
                    <Checkbox
                      checked={isCheckedAllDrivers}
                      onChange={(event) => {
                        setIsCheckedAllDrivers(event.target.checked);
                        setListDrivers([]);
                      }}
                    >
                      Todos
                    </Checkbox>
                  </ContentHeader>

                  {!isCheckedAllDrivers && listDrivers.length > 0 ? (
                    <SelectItems
                      datalist={listDrivers}
                      value={listIdDrivers}
                      setValue={setListIdDrivers}
                    />
                  ) : null}
                </ContentCitiesAndDrivers>
              </ContentBody>
              <ContentBtnSearch>
                <ButtonSearch type="submit" disabled={loading}>
                  {loading && <Spin size="small" style={{ marginRight: 8 }} />}
                  Pesquisar
                </ButtonSearch>
              </ContentBtnSearch>
            </Content>
          </form>
        </Collapse.Panel>

        <Collapse.Panel header="Indicações por usuários" key={2}>
          <form onSubmit={handleSearchIndications}>
            <Content>
              <ContentHeader>
                <DatePicker
                  style={{
                    width: "100%",
                  }}
                  locale={locale}
                  format="DD/MM/YYYY"
                  placeholder="Data Inicial"
                  name="date-init-indication"
                />
                <DatePicker
                  style={{
                    width: "100%",
                  }}
                  locale={locale}
                  format="DD/MM/YYYY"
                  placeholder="Data Final"
                  name="date-final-indication"
                />
                <Input
                  placeholder="Busque um usuário"
                  onChange={(event) =>
                    handleGetUsersIndications(event.target.value)
                  }
                />
                {listIndications.length > 0 ? (
                  <Select
                    style={{
                      width: "100%",
                    }}
                    value={idUserIndication}
                    options={listIndicationsFormated}
                    onChange={(value) => setIdUserIndication(value)}
                  />
                ) : (
                  <Select
                    style={{
                      width: "100%",
                    }}
                    value="1"
                  >
                    <Select.Option value="1">Todos</Select.Option>
                  </Select>
                )}
              </ContentHeader>
              <ContentBtnSearch
                style={{
                  marginTop: 10,
                }}
              >
                <ButtonSearch type="submit" disabled={loading}>
                {loading && <Spin size="small" style={{ marginRight: 8 }} />}
                  Buscar
                </ButtonSearch>
              </ContentBtnSearch>
                  

              <ContentTable>
                <Table
                  rowKey={(record, index) => String((record as any)?.id || index)}
                  style={{
                    width: "100%",
                  }}
                  columns={columns}
                  dataSource={listDatasIndications}
                />
              </ContentTable>
            </Content>
          </form>
        </Collapse.Panel>

        <Collapse.Panel header="Indicações" key={3}>
          <Content>
            <ContentHeader>
              <Input
                placeholder="Busque por nome"
                onChange={(event) =>
                  handleSearchReferralDriver(event.target.value)
                }
              />
              <Select
                style={{
                  width: "100%",
                }}
                value={idReferralMonetizations}
                onChange={(value) => setIdReferralMonetizations(value)}
              >
                <Select.Option value={0}>TODOS</Select.Option>
                {(referralMonetizations || []).map((value) => {
                  return (
                    <Select.Option key={value.id} value={value.id}>
                      {value.label}
                    </Select.Option>
                  );
                })}
              </Select>
              {loading && <Spin size="small" style={{ marginRight: 8 }} />}
            </ContentHeader>
            <ContentTable style={{ position: "relative" }}>
              <Table
                rowKey={(record, index) => String((record as any)?.id || index)}
                style={{
                  width: "100%",
                }}
                columns={columnsReferral}
                dataSource={listDriversReferral}
              />
              {loading && (
                <div
                  style={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    zIndex: 1,
                    backgroundColor: "rgba(255, 255, 255, 0.6)",
                    padding: 10,
                    borderRadius: 8,
                  }}
                >
                  <Spin size="large" />
                </div>
              )}
            </ContentTable>
          </Content>
        </Collapse.Panel>
      </Collapse>

      <ModalReportsFinancialList
        datasDriverProduct={datasFinancialProductDriver}
        visible={visibleModal}
        setVisible={setVisibleModal}
      />
    </Container>
  );
};
