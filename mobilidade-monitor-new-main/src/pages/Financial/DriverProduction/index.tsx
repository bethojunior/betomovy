import { ConfigProvider, Select } from "antd";
import ptBR from 'antd/lib/locale/pt_BR';
import dayjs from 'dayjs';
import 'dayjs/locale/pt-br';
import { useParams } from "react-router-dom";
import { FC, useEffect, useState } from "react";
import api from "../../../services/api";
import { useFullyContext } from "../../../hooks/useFullyContext";
import {
  SearchContainer,
  NoOneDataFindedContainer,
  DataInformationContainer,
  ItemsContainer,
  SearchLabel,
  FilterButton,
  ProductionDataContainer,
  DataContainer,
  DateSelect,
  SelectCity,
  Title,
  Information,
  ProductionMonth,
  ChartsContainer,
  ChartBox,
  MonthLabelProduction,
  YearProductionLabel,
} from "./styles";
import Mask from "../../../services/Mask";
import Preload from "../../../components/Utils/Preload";
import Alert from "../../../components/Utils/Alert";
import Session from "../../../utils/Session";
import Utils from "../../../utils/Utils";
import { useDebounce } from "../../../hooks/useDebounce";
import swal from "sweetalert";
import { AxiosError } from "axios";
import { Loader } from "../../../components/Loader";

dayjs.locale('pt-br');

const { Option } = Select;

interface CitiesData {
  cityId: number;
  nome: string;
  polygon: string;
  shortName: string;
}

interface UserDataProps {
  alvara: string;
  appVersion: string;
  balance: number;
  blockedBalance: number;
  carBrand: string;
  carModel: string;
  carPlate: string;
  city: string;
  cityId: number;
  created_at: string;
  document: string;
  driverRegisterStatusId: number;
  email: string;
  gender: string;
  idDriver: number;
  idUser: number;
  militaryForce: string;
  militaryPatent: string;
  militaryPatentPicture: string;
  militaryStatus: string;
  name: string;
  nickname: string;
  observation: null;
  om: string;
  phone: string;
  platform: string;
  prepaid: number;
  profileImage: string;
  proofOfResidence: string;
  rating: number;
  registerStatus: string;
  rg: string;
  rgBackPicture: string;
  rgFrontPicture: string;
  state: string;
  station: string;
  userType: string;
  userTypeId: number;
}

interface ProductionListData {
  appFee: number;
  cardPayment: number;
  driverId: number;
  driverValue: number;
  name: string;
  otherFee: number;
  paymentFormFee: number;
  taxes: number;
  taximeterPayment: number;
  totalTaxes: number;
  totalTripQuantity: number;
  totalTripValue: number;
  vehicleCardPayment: number;
  vehiclePayment: number;
  voucherPayment: number;
}

interface Config2Props {
  [key: string]: string;
}

const DriverProduction: FC = () => {
  const { fullyList } = useFullyContext();
  const data1 = [
    {
      year: "1-5",
      valor: 0.16,
    },
    {
      year: "5-10",
      valor: 0.125,
    },
    {
      year: "10-15",
      valor: 0.24,
    },
    {
      year: "15-20",
      valor: 0.19,
    },
    {
      year: "20-25",
      valor: 0.22,
    },
    {
      year: "25-30",
      valor: 0.05,
    },
  ];

  //@ts-ignore
  const config = {
    data: data1,
    xField: "year",
    yField: "valor",
    label: {},
    point: {
      size: 5,
      shape: "diamond",
      style: {
        fill: "white",
        stroke: "#001529",
        lineWidth: 2,
      },
    },
    tooltip: {
      showMarkers: false,
    },
    state: {
      active: {
        style: {
          shadowBlur: 4,
          stroke: "#000",
          fill: "red",
        },
      },
    },
    interactions: [
      {
        type: "marker-active",
      },
    ],
  };

  const data = [
    {
      type: "janeiro",
      value: 0.16,
    },
    {
      type: "fevereiro",
      value: 0.015,
    },
    {
      type: "março",
      value: 0.125,
    },
    {
      type: "abril",
      value: 0.24,
    },
    {
      type: "maio",
      value: 0.015,
    },
    {
      type: "junho",
      value: 0.19,
    },
    {
      type: "julho",
      value: 0.22,
    },
    {
      type: "agosto",
      value: 0.015,
    },
    {
      type: "setembro",
      value: 0.05,
    },
    {
      type: "outubro",
      value: "0.01",
    },
  ];
  const paletteSemanticRed = "#f12d2d";
  const brandColor = "#5af78e";
  //@ts-ignore
  const config2 = {
    data,
    xField: "type",
    yField: "value",
    seriesField: "",
    color: ({ type }: Config2Props) => {
      if (
        type === "fevereiro" ||
        type === "maio" ||
        type === "agosto" ||
        type === "outubro"
      ) {
        return paletteSemanticRed;
      }

      return brandColor;
    },
    label: {
      content: ({ value }: Config2Props) => {
        const val = parseFloat(value);

        if (val < 0.05) {
          return (val * 100).toFixed(1) + "%";
        }
        return "";
      },
      offset: 10,
    },
    legend: false,
    xAxis: {
      label: {
        autoHide: true,
        autoRotate: false,
      },
    },
  };

  const [loading, setLoading] = useState(false);
  const [messageAlert, setMessageAlert] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [typeAlert, setTypeAlert] = useState<
    "success" | "info" | "warning" | "error"
  >("success");
  const [dateStartFilter, setDateStartFilter] = useState("");
  const [dateEndFilter, setDateEndFilter] = useState("");
  const [cities, setCities] = useState<CitiesData[]>([]);
  const [cityId, setCityId] = useState<number | string>("");

  const [hideWhiteLine, setHideWhiteLine] = useState(false);
  const [noRace, setNoRace] = useState(false);

  const [productionList, setProductionList] = useState<ProductionListData[]>(
    []
  );

  const [driversFiltered, setDriversFiltered] = useState<
    DefaultOptionsSelectAntdProps[]
  >([]);

  const [driverSelected, setDriverSelected] = useState<UserDataProps | null>(
    null
  );

  const [loadingSelectDriver, setLoadingSelectDriver] =
    useState<boolean>(false);

    let userSession: any = {};
    try {
      const rawUser = localStorage.getItem("@App:user");
      if (rawUser && rawUser !== "undefined" && rawUser !== "null") {
        userSession = JSON.parse(rawUser);
      }
    } catch {}


    const isSupport = userSession?.support === 1;
    const allowedCities: number[] =
      userSession?.allowedCities && Array.isArray(userSession.allowedCities)
        ? userSession.allowedCities
        : [];

  const dateFormatList = ["DD/MM/YYYY", "DD/MM/YY"];
  const { id }: { id: string } = useParams();

  const datesValue = (_: any, dateStrings: [string, string]) => {
    const newDateStart = Utils.transformDate(dateStrings[0], false);
    const newDateEnd = Utils.transformDate(dateStrings[1], false);

    setDateStartFilter(newDateStart as string);
    setDateEndFilter(newDateEnd as string);
  };

  const filterDriverName = async (inputValue: string) => {
    try {
      setLoadingSelectDriver(true);

      if (!cityId) return;
      const responseDriverName = await api.get(
        `driver?name=${inputValue}&cityId=${cityId}`
      );


      if (responseDriverName.status) {
        const driversNameFormated = responseDriverName.data.response.data.map(
          (item: UserDataProps) => ({
            value: JSON.stringify(item),
            label: item.name,
          })
        );

        setDriversFiltered(driversNameFormated);
      }
    } catch (error) {
      const responseError = error as AxiosError;
      swal({
        title: responseError.response?.data.message,
        icon: "error",
      });
    } finally {
      setLoadingSelectDriver(false);
    }
  };

  const loadOptions = useDebounce((nameDriver: string) => {
    filterDriverName(nameDriver);
  }, 1000);

  const onChangeSelectDrivers = (driverSelected: string) => {
    setDriverSelected(JSON.parse(driverSelected));
  };

  const onSearchSelectDrivers = (driverNameSearch: string) => {
    loadOptions(driverNameSearch);
  };

  const searchDriverData = () => {

    if (!isSupport && allowedCities.length > 0 && !allowedCities.includes(Number(cityId))) {
      console.error("[DriverProduction] Erro: Cidade selecionada não está nas permissões", {
        cityId,
        allowedCities
      });
      setTypeAlert("error");
      setMessageAlert("Você não tem permissão para acessar esta cidade");
      setShowAlert(true);
      return;
    }

    if (!driverSelected) {
      setTypeAlert("error");
      setShowAlert(true);
      return setMessageAlert("Preencha o campo do motorista");
    }

    if (dateStartFilter === "" || dateEndFilter === "") {
      setTypeAlert("error");
      setShowAlert(true);
      return setMessageAlert("Preencha o campo da data");
    }
    
    setLoading(true);
    api
      .get(
        `trip/report/valuesByDriver?cityId=${cityId}&driverId=${driverSelected.idDriver}&dateStart=${dateStartFilter}&dateEnd=${dateEndFilter}`
      )
      .then((values) => {
        if (values.data.response === null) {
          setHideWhiteLine(false);
          return setNoRace(true);
        }
        setNoRace(false);
        setHideWhiteLine(true);
        return setProductionList(values.data.response);
      })
      .catch((error) => {
        const responseError = error as AxiosError;
        swal({
          title: responseError.response?.data.message || "Erro ao buscar produção do motorista",
          icon: "error",
        });
      })
      .finally(() => {
        setLoading(false);
      });
    return "";
  };

  const searchDriverProduction = () => {
    const citySelected = Session.getLocal("citySelected");

    if (!citySelected?.cityId) {
      console.error("[DriverProduction] Erro: Cidade não encontrada na sessão");
      setTypeAlert("error");
      setMessageAlert("Cidade não encontrada na sessão");
      setShowAlert(true);
      return;
    }

    const cityDriver = citySelected.cityId;

    if (!isSupport && allowedCities.length > 0 && !allowedCities.includes(Number(cityDriver))) {
      console.error("[DriverProduction] Erro: Usuário sem permissão para cidade", cityDriver);
      console.error("[DriverProduction] Cidades permitidas:", allowedCities);
      setTypeAlert("error");
      setMessageAlert("Você não tem permissão para acessar esta cidade");
      setShowAlert(true);
      return;
    }

    const dateNow = new Date();
    const month = dateNow.getMonth() + 1;
    const monthStart = month - 1 === 0 ? 12 : month;

    const dateStart = `${
      monthStart !== 12 ? dateNow.getFullYear() : dateNow.getFullYear() - 1
    }-${monthStart}-${dateNow.getDate()}`;

    const dateEnd = `${dateNow.getFullYear()}-${month}-${dateNow.getDate()}`;

    setLoading(true);

    api
      .get(
        `trip/report/valuesByDriver?cityId=${cityDriver}&driverId=${id}&dateStart=${dateStart}&dateEnd=${dateEnd}`
      )
      .then((values) => {
        
        if (values.data.response === null) {
          console.warn("[DriverProduction] Nenhum dado de produção encontrado");
          setHideWhiteLine(false);
          return setNoRace(true);
        }

        setNoRace(false);
        setHideWhiteLine(true);
        setProductionList(values.data.response);
      })
      .catch((error) => {
        const responseError = error as AxiosError;
        swal({
          title: responseError.response?.data.message || "Erro ao buscar produção do motorista",
          icon: "error",
        });
      })
      .finally(() => {
        setLoading(false);
      });
  };


  useEffect(() => {
    
    if (id && id !== "0") {
      searchDriverProduction();
    }
  }, [id]);

  useEffect(() => {
    if (fullyList && fullyList.length > 0) {
      setCities(fullyList as CitiesData[]);
    }
  }, [fullyList]);

  const filterOption = (
    input: string,
    option?: { label: string; value: string }
  ) => (option?.label ?? "").toLowerCase().includes(input.toLowerCase());

  return (
    <div>
      <Preload visible={loading} />
      <Alert
        visibility={showAlert}
        setVisibility={setShowAlert}
        message={messageAlert}
        typeAlert={typeAlert}
      />
      <SearchContainer>
        <ItemsContainer>
          <SearchLabel>Motorista</SearchLabel>
          <Select
            key={cityId}
            value={driverSelected ? JSON.stringify(driverSelected) : undefined}
            disabled={!cityId}
            style={{
              width: "100%",
            }}
            showSearch
            placeholder="Selecione um motorista"
            optionFilterProp="children"
            onChange={onChangeSelectDrivers}
            onSearch={onSearchSelectDrivers}
            filterOption={filterOption}
            options={driversFiltered}
            loading={loadingSelectDriver}
          />
          {/* <DriverSelect
            cacheOptions
            isClearable
            onChange={(e) =>
              setIdDriver((e as SelectEventProps)?.value?.idDriver)
            }
            loadOptions={loadOptions}
            placeholder="Selecione um motorista"
            noOptionsMessage={() => "Usuário não encontrado"}
            loadingMessage={() => "Carregando..."}
          /> */}
        </ItemsContainer>
        <ItemsContainer>
          <SearchLabel>Data</SearchLabel>
          <ConfigProvider locale={ptBR}>
            <DateSelect
              placeholder={["Data inicio", "Data fim"]}
              format={dateFormatList}
              style={{ width: "100%" }}
              onChange={datesValue}
            />
          </ConfigProvider>
        </ItemsContainer>
        <ItemsContainer>
          <SearchLabel>Cidade</SearchLabel>

         <SelectCity
            value={cityId}
            disabled={cities.length === 1}
            onChange={(value) => setCityId(value as string | number)}
          >
            {cities.map((item) => {
              return (
                <Option key={item.cityId} value={item.cityId}>
                  {item.nome}
                </Option>
              );
            })}
          </SelectCity>

        </ItemsContainer>
        <FilterButton onClick={searchDriverData} type="primary">
          Filtrar
        </FilterButton>
      </SearchContainer>
      {loading ? (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '80vh', 
            width: '100%',
          }}
        >
        <Loader spinning={loading}>
          <p></p>
        </Loader>
        </div>
      ) : (
        <>
      {noRace === false ? (
        ""
      ) : (
        <NoOneDataFindedContainer>
          <h1>Não foi encontrado dados de produção desse motorista</h1>
        </NoOneDataFindedContainer>
      )}
      {hideWhiteLine === false ? (
        ""
      ) : (
        <DataInformationContainer>
          {productionList.map((item: ProductionListData) => {
            return (
              <div key={item.driverId}>
                <ProductionDataContainer>
                  <div>
                    <DataContainer>
                      <Title>Motorista:</Title>
                      <Information>{item.name}</Information>
                    </DataContainer>
                    <DataContainer>
                      <Title>Quantidade de viagens no período:</Title>
                      <Information>{item.totalTripQuantity}</Information>
                    </DataContainer>
                    <DataContainer>
                      <Title>Valor recebido por cartão:</Title>
                      <Information>
                        R$ {Mask.setMaskMoneyNumber(item.cardPayment)}
                      </Information>
                    </DataContainer>
                  </div>
                  <div>
                    <DataContainer>
                      <Title>Valor recebido por cartão no carro:</Title>
                      <Information>
                        R$ {Mask.setMaskMoneyNumber(item.vehicleCardPayment)}
                      </Information>
                    </DataContainer>
                    <DataContainer>
                      <Title>Valor recebido por voucher:</Title>
                      <Information>
                        R$ {Mask.setMaskMoneyNumber(item.voucherPayment)}
                      </Information>
                    </DataContainer>
                    <DataContainer>
                      <Title>Valor recebido por taxímetro:</Title>
                      <Information>
                        R$ {Mask.setMaskMoneyNumber(item.taximeterPayment)}
                      </Information>
                    </DataContainer>
                  </div>
                  <div>
                    <DataContainer>
                      <Title>Valor recebido por dinheiro: </Title>
                      <Information>
                        R$ {Mask.setMaskMoneyNumber(item.vehiclePayment)}
                      </Information>
                    </DataContainer>
                    <DataContainer>
                      <Title>Taxas por forma de pagamento:</Title>
                      <Information>
                        R$ {Mask.setMaskMoneyNumber(item.paymentFormFee)}
                      </Information>
                    </DataContainer>
                    <DataContainer>
                      <Title>Taxas App: </Title>
                      <Information>
                        R$ {Mask.setMaskMoneyNumber(item.appFee)}
                      </Information>
                    </DataContainer>
                  </div>
                  <div>
                    <DataContainer>
                      <Title>Total de taxas dinâmicas: </Title>
                      <Information>
                        R$ {Mask.setMaskMoneyNumber(item.totalTaxes)}
                      </Information>
                    </DataContainer>
                    <DataContainer>
                      <Title>Total bruto: </Title>
                      <Information>
                        R$ {Mask.setMaskMoneyNumber(item.totalTripValue)}
                      </Information>
                    </DataContainer>
                    <DataContainer>
                      <Title>Total líquido: </Title>
                      <Information>
                        R$ {Mask.setMaskMoneyNumber(item.driverValue)}
                      </Information>
                    </DataContainer>
                  </div>
                </ProductionDataContainer>
                <ChartsContainer>
                  <ChartBox>
                    <MonthLabelProduction>
                      Produção do mês atual
                    </MonthLabelProduction>
                    <ProductionMonth
                      xAxis={[
                        {
                          data: [
                            1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15,
                            16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28,
                            29, 30,
                          ],
                        },
                      ]}
                      series={[
                        {
                          data: [
                            2, 3, 5.5, 8.5, 1.5, 5, 1, 4, 3, 8, 2, 3, 5.5, 8.5,
                            1.5, 5, 1, 4, 3, 8, 2, 3, 5.5, 8.5, 1.5, 5, 1, 4, 3,
                            8,
                          ],
                        },
                      ]}
                      height={300}
                    />
                  </ChartBox>
                  <ChartBox>
                    <YearProductionLabel>
                      Produção anual x lucro
                    </YearProductionLabel>
                    <p style={{ marginBottom: 0, color: "gray" }}>
                      (baseado na taxa cobrada do app e custo de motorista)
                    </p>
                  </ChartBox>
                </ChartsContainer>
              </div>
            );
          })}
        </DataInformationContainer>
      )}
      </>
      )}  
    </div>
  );
};

export default DriverProduction;
