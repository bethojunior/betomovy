import { FC, useEffect, useState } from "react";
import { Popover, Select } from "antd";
import { Dayjs } from "dayjs";
import {
  AdvancedFiltersAndSimpleCardInformation,
  AdvancedFilterContainerFunction,
  AdvancedFilterName,
  AdvancedFilterDate,
  DoubleDate,
  AdvancedFilterStatus,
  AdvancedButtonContainer,
  AdvancedButton,
  AdvancedLabel,
  SimpleCardContainer,
  ContantMap,
  SimpleCard,
  OthersInformation,
  OthersInformationCard,
} from "./styles";
import Utils from "../../../../utils/Utils";
import {
  FinancialMirrorProps,
  UserAndDrivers,
} from "../../../../pages/Trip/List/types";
import Mask from "../../../../services/Mask";
import { BiSolidHelpCircle } from "react-icons/bi";
import locale from "antd/lib/date-picker/locale/pt_BR";
import swal from "sweetalert";
import api from "../../../../services/api";
import { AxiosError } from "axios";
import { useDebounce } from "../../../../hooks/useDebounce";

interface SelectFilterData {
  id: string;
  text: string;
}

interface AdvancedfilterProps {
  showAdvancedFilterProps: boolean;
  financialMirror: FinancialMirrorProps | undefined;
  setFinancialMirror: (data: FinancialMirrorProps | undefined) => void;
  setLastPage: (data: number) => void;
  setShowAdvancedFilter: (data: boolean) => void;
  changeCardPage: (page: number, value: any) => void;
  setPagination: (data: string) => void;
  setLastFilterParams: (data: string) => void;
  setShowButton: (data: boolean) => void;
}

const INITIAL_PAGE = 1;
const DATE_FORMATS = ["DD/MM/YYYY", "DD/MM/YY"];
const DEBOUNCE_DELAY = 1000;

const AdvancedFilterAndSimpleCard: FC<AdvancedfilterProps> = ({
  showAdvancedFilterProps,
  financialMirror,
  setFinancialMirror,
  setLastPage,
  setShowAdvancedFilter,
  changeCardPage,
  setPagination,
  setLastFilterParams,
  setShowButton,
}) => {
  const { Option } = Select;

  const [loadingFilter, setLoadingFilter] = useState(false);
  const [loadingSelect, setLoadingSelect] = useState(false);

  const [filterDateStart, setFilterDateStart] = useState("");
  const [filterDateEnd, setFilterDateEnd] = useState("");
  const [datePickerValues, setDatePickerValues] = useState<[Dayjs | null, Dayjs | null] | null>(null);
  const [statusTrip, setStatusTrip] = useState<string | undefined>(undefined);
  const [selectFilter, setSelectFilter] = useState<SelectFilterData[]>([]);

  const [clientsFiltered, setClientsFiltered] = useState<DefaultOptionsSelectAntdProps[]>([]);
  const [clientSelected, setClientSelected] = useState<UserAndDrivers | null>(null);

  const [driversFiltered, setDriversFiltered] = useState<DefaultOptionsSelectAntdProps[]>([]);
  const [driverSelected, setDriverSelected] = useState<UserAndDrivers | null>(null);

  const [showHelpPriceTotal, setShowHelpPriceTotal] = useState(false);

  const formatUserOptions = (data: UserAndDrivers[]) =>
    data.map((item) => ({
      value: JSON.stringify(item),
      label: item.name,
    }));

  const onSearchClients = useDebounce((inputValue: string) => {
    filterClients(inputValue);
  }, DEBOUNCE_DELAY);

  const onChangeClients = (informationsClients: string) => {
    setClientSelected(JSON.parse(informationsClients));
  };

  const filterClients = async (nameClient: string) => {
    if (!nameClient.trim()) return;

    try {
      setLoadingSelect(true);
      const response = await api.get(`customer?name=${nameClient}`);

      if (response.status) {
        const formattedClients = formatUserOptions(response.data.response.data);
        setClientsFiltered(formattedClients);
      }
    } catch (error) {
      const axiosError = error as AxiosError;
      const errorMessage = axiosError.response?.data?.message || "Erro desconhecido";
      swal({
        title: "Erro ao buscar clientes",
        text: errorMessage,
        icon: "error",
      });
    } finally {
      setLoadingSelect(false);
    }
  };

  const onSearchDrivers = useDebounce((inputValue: string) => {
    filterDriverName(inputValue);
  }, DEBOUNCE_DELAY);

  const onChangeDrivers = (informationsDrivers: string) => {
    setDriverSelected(JSON.parse(informationsDrivers));
  };

  const filterDriverName = async (nameDriver: string) => {
    if (!nameDriver.trim()) return;

    try {
      setLoadingSelect(true);
      const response = await api.get(`driver?name=${nameDriver}`);

      if (response.status) {
        const formattedDrivers = formatUserOptions(response.data.response.data);
        setDriversFiltered(formattedDrivers);
      }
    } catch (error) {
      const axiosError = error as AxiosError;
      const errorMessage = axiosError.response?.data?.message || "Erro desconhecido";
      swal({
        title: "Erro ao buscar motoristas",
        text: errorMessage,
        icon: "error",
      });
    } finally {
      setLoadingSelect(false);
    }
  };

  const datesValue = (dates: [Dayjs | null, Dayjs | null] | null, dateStrings: [string, string]) => {
    if (dates) {
      const newDateStart = Utils.transformDate(dateStrings[0], false);
      const newDateEnd = Utils.transformDate(dateStrings[1], false);

      setFilterDateStart(newDateStart as string);
      setFilterDateEnd(newDateEnd as string);
      setDatePickerValues([dates[0], dates[1]]);
    } else {
      setFilterDateStart("");
      setFilterDateEnd("");
      setDatePickerValues(null);
    }
  };

  const arraySimpleCard = [
    {
      title: "Total Chamados",
      value: financialMirror?.totalTrips,
      icon: false,
    },
    {
      title: "Finalizadas",
      value: financialMirror?.finishedTrips,
      icon: false,
    },
    {
      title: "Canceladas pelo cliente",
      value: financialMirror?.canceledByCustomer,
      icon: false,
    },
    {
      title: "Cartões recusados",
      value: financialMirror?.cardRefused,
      icon: false,
    },
    {
      title: "Canceladas pelo Motorista",
      value: financialMirror?.canceledByDriver,
      icon: false,
    },
    {
      title: "Faturamento",
      value:
        financialMirror &&
        Mask.setRemoveMaskMoney(
          financialMirror?.totalPrice as string
        ).toLocaleString("pt-br", { style: "currency", currency: "BRL" }),
      icon: true,
    },
  ];

  const advancedSearch = () => {
    if (filterDateStart === "" || filterDateEnd === "") {
      swal({
        title: "Alerta",
        text: "O período não pode ser vazio!",
        icon: "warning",
      });
      return;
    }

    const paramsFinancialMirror = new URLSearchParams({
      startDate: filterDateStart,
      endDate: filterDateEnd,
      isToday: "0",
    });

    if (statusTrip) {
      paramsFinancialMirror.append("status", statusTrip);
    }

    if (clientSelected) {
      paramsFinancialMirror.append("userId", String(clientSelected.idUser));
    }

    if (driverSelected) {
      paramsFinancialMirror.append("driverId", String(driverSelected.idDriver));
    }

    const paramsTrip = new URLSearchParams({
      date: `${filterDateStart},${filterDateEnd}`,
      withTotalValue: "0",
    });

    if (statusTrip) {
      paramsTrip.append("status", statusTrip);
    }

    if (clientSelected) {
      paramsTrip.append("customerUserId", String(clientSelected.idUser));
    }

    if (driverSelected) {
      paramsTrip.append("driverId", String(driverSelected.idDriver));
    }

    setLastFilterParams(paramsTrip.toString());

    setLoadingFilter(true);

    const responseDatasFinancialMirror = api.get(
      `trip/financialMirror?${paramsFinancialMirror.toString()}`
    );

    const responseDatasTrip = api.get(`trip?page=${INITIAL_PAGE}&${paramsTrip.toString()}`);

    Promise.all([responseDatasFinancialMirror, responseDatasTrip])
      .then(([financialMirrorResponse, tripsResponse]) => {
        if (financialMirrorResponse.status) {
          setFinancialMirror(financialMirrorResponse.data.response);
        }

        if (tripsResponse.status) {
          changeCardPage(INITIAL_PAGE, tripsResponse.data.response.trips.data);

          if (tripsResponse.data.response.trips.last_page > 1) {
            setPagination(tripsResponse.data.response.trips.current_page);
            setLastPage(tripsResponse.data.response.trips.last_page);
            setShowButton(false);
          } else {
            setShowButton(true);
          }

          setShowAdvancedFilter(false);
        }
      })
      .catch((error: AxiosError) => {
        swal({
          title: error.response?.data.message || "Erro ao buscar dados",
          icon: "error",
        });
        console.error(error);
      })
      .finally(() => {
        setLoadingFilter(false);
      });
  };

  function separateInContainer() {
    const auxCards = arraySimpleCard?.map((item) => item);

    const containerCards = [];

    const deleteCount = Utils.isMobile() ? 1 : 7;

    while (auxCards?.length) {
      containerCards.push(auxCards.splice(0, deleteCount));
    }

    return containerCards;
  }

  const separateSimpleCard = separateInContainer();

  const filterOption = (
    input: string,
    option?: { label: string; value: string }
  ) => (option?.label ?? "").toLowerCase().includes(input.toLowerCase());

  useEffect(() => {
    const fetchTripStatuses = async () => {
      try {
        const response = await api.get(`report/select/tripStatuses`);
        if (response.data.status) {
          setSelectFilter(response.data.response);
        }
      } catch (error) {
        console.error("Erro ao carregar status de viagens:", error);
      }
    };

    fetchTripStatuses();
  }, []);

  return (
    <AdvancedFiltersAndSimpleCardInformation>
      {showAdvancedFilterProps === true ? (
        <AdvancedFilterContainerFunction>
          <AdvancedFilterName>
            <AdvancedLabel>Cliente</AdvancedLabel>
            <Select
              style={{
                width: "100%",
              }}
              showSearch
              placeholder="Selecione um cliente"
              optionFilterProp="children"
              onChange={onChangeClients}
              onSearch={onSearchClients}
              filterOption={filterOption}
              options={clientsFiltered}
              loading={loadingSelect}
              value={clientSelected ? JSON.stringify(clientSelected) : undefined}
              allowClear
              onClear={() => setClientSelected(null)}
            />
          </AdvancedFilterName>
          <AdvancedFilterDate>
            <AdvancedLabel>Período</AdvancedLabel>
            <DoubleDate
              placeholder={["Data inicio", "Data fim"]}
              format={DATE_FORMATS}
              onChange={datesValue}
              locale={locale}
              value={datePickerValues}
            />
          </AdvancedFilterDate>
          <AdvancedFilterStatus>
            <AdvancedLabel>Status</AdvancedLabel>
            <Select
              onChange={setStatusTrip}
              value={statusTrip ?? undefined}
              defaultValue={"Todos"}
              style={{ width: "100%" }}
            >
              {selectFilter?.map((item) => {
                return <Option value={item.id}>{item.text}</Option>;
              })}
            </Select>
          </AdvancedFilterStatus>
          <AdvancedFilterName>
            <AdvancedLabel>Motorista</AdvancedLabel>
            <Select
              style={{
                width: "100%",
              }}
              showSearch
              placeholder="Selecione um motorista"
              optionFilterProp="children"
              onChange={onChangeDrivers}
              onSearch={onSearchDrivers}
              filterOption={filterOption}
              options={driversFiltered}
              loading={loadingSelect}
              value={driverSelected ? JSON.stringify(driverSelected) : undefined}
              allowClear
              onClear={() => setDriverSelected(null)}
            />
          </AdvancedFilterName>
          <AdvancedButtonContainer>
            <AdvancedButton
              type="primary"
              onClick={() => advancedSearch()}
              loading={loadingFilter}
            >
              Filtrar
            </AdvancedButton>
          </AdvancedButtonContainer>
        </AdvancedFilterContainerFunction>
      ) : (
        ""
      )}
      <SimpleCardContainer>
        {separateSimpleCard.map((contant) => (
          <ContantMap>
            {contant.map((item, index) => (
              <SimpleCard key={index}>
                <h3>{item.title}</h3>
                <span style={{ marginBottom: 0 }}>
                  {item.value ? item.value : 0}
                </span>
                {item.icon && (
                  <div className="content-icon">
                    <Popover
                      overlayStyle={{
                        width: 300,
                      }}
                      placement="leftTop"
                      open={showHelpPriceTotal}
                      content={
                        <span>
                          Este faturamente é referente a corridas finalizadas
                        </span>
                      }
                      onOpenChange={(value) => setShowHelpPriceTotal(value)}
                    >
                      <BiSolidHelpCircle size={20} />
                    </Popover>
                  </div>
                )}
              </SimpleCard>
            ))}
          </ContantMap>
        ))}
      </SimpleCardContainer>
      <OthersInformation>
        <OthersInformationCard>
          <h4>Clientes Envolvidos: {financialMirror?.numUniqueCustomer}</h4>
        </OthersInformationCard>
        <OthersInformationCard>
          <h4>Motoristas Envolvidos: {financialMirror?.uniqueDriverIds}</h4>
        </OthersInformationCard>
        <OthersInformationCard>
          <h4>Usuários de Primeria viagem: {financialMirror?.firstTrip}</h4>
        </OthersInformationCard>
      </OthersInformation>
    </AdvancedFiltersAndSimpleCardInformation>
  );
};

export default AdvancedFilterAndSimpleCard;
