import { AxiosError } from "axios";
import { FC, useState } from "react";
import { Button, Spin } from "antd";
import swal from "sweetalert";
import Alert from "../../../components/Utils/Alert";
import SearchFilter from "../../../components/Financial/SearchFilter";
import CancellationList from "../../../components/Financial/CancellationCardList";
import CancellationTableList from "../../../components/Financial/CancellationTableList";
//import Preload from "../../../components/Utils/Preload";
import api from "../../../services/api";
import { PaginationContainer, NoDataFindContainer } from "./styles";
import Utils from "../../../utils/Utils";
import { useDebounce } from "../../../hooks/useDebounce";

interface UserAndDrivers {
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
  observation: string;
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
  station: null;
  userType: string;
  userTypeId: number;
}

interface CancellationFeeData {
  cityId: number;
  cityName: string;
  created_at: string;
  date: string;
  driverEmail: string;
  driverName: string;
  driverPaidName: string;
  driverPhone: string;
  driverUserId: number;
  driverUserType: string;
  endDate: string;
  feeValue: number;
  id: number;
  idDriver: number;
  idDriverPaid: number;
  idUser: number;
  paid_tripReference: string;
  paymentDate: string;
  paymentForm: string;
  price: number;
  status: string;
  statusId: number;
  tripCallType: string;
  tripCancellationFeeType: number;
  tripCancellationFeeTypeCreatedAt: string;
  tripCancellationFeeTypeDescription: string;
  tripCancellationFeeTypeId: number;
  tripCancellationFeeTypeName: string;
  tripCancellationFeeTypeUpdatedAt: string;
  tripReference: string;
  tripType: string;
  userEmail: string;
  userName: string;
  userPhone: string;
}

const CancellationFee: FC = () => {
  const [loading, setLoading] = useState(false);
  const [messageAlert, setMessageAlert] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [typeAlert, setTypeAlert] = useState<
    "success" | "info" | "warning" | "error"
  >("success");

  const [pagination, setPagination] = useState("");
  const [thisPage, setThisPage] = useState(1);

  const [filterDateStart, setFilterDateStart] = useState("");
  const [filterDateEnd, setFilterDateEnd] = useState("");
  const [cityId, setCityId] = useState("");
  const [cancellationList, setCancellationList] = useState<
    CancellationFeeData[]
  >([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [lastPage, setLastPage] = useState(0);
  const [showTableButtons, setShowTableButtons] = useState(false);
  const [showCardButtons, setShowCardButtons] = useState(false);
  const [showNoData, setShowNoData] = useState(false);
  const [hideCard, setHideCard] = useState(false);
  const [searchCheckBox, setSearchCheckBox] = useState<boolean | string>(false);

  const [clientsFiltered, setClientsFiltered] = useState<
    DefaultOptionsSelectAntdProps[]
  >([]);
  const [clientSelected, setClientSelected] = useState<UserAndDrivers | null>(
    null
  );

  const [driversFiltered, setDriversFiltered] = useState<
    DefaultOptionsSelectAntdProps[]
  >([]);
  const [driverSelected, setDriverSelected] = useState<UserAndDrivers | null>(
    null
  );

  const filterDriverName = async (nameClient: string) => {
    try {
      const responseDrivers = await api.get(`driver?name=${nameClient}`);

      if (responseDrivers.status) {
        const rawList = Array.isArray(responseDrivers.data?.response?.data)
          ? responseDrivers.data.response.data
          : (Array.isArray(responseDrivers.data?.response) ? responseDrivers.data.response : []);
        const driversFormated = rawList.map(
          (item: UserAndDrivers) => ({
            value: JSON.stringify(item),
            label: item.name,
          })
        );

        setDriversFiltered(driversFormated);
      }
    } catch (error) {
      const responseError = error as AxiosError;
      swal({
        title: responseError.response?.data.message,
        icon: "error",
      });
    }
  };

  const filterClients = async (nameClient: string) => {
    try {
      const responseClients = await api.get(`customer?name=${nameClient}`);

      if (responseClients.status) {
        const rawList = Array.isArray(responseClients.data?.response?.data)
          ? responseClients.data.response.data
          : (Array.isArray(responseClients.data?.response) ? responseClients.data.response : []);
        const clientsFormated = rawList.map(
          (item: UserAndDrivers) => ({
            value: JSON.stringify(item),
            label: item.name,
          })
        );

        setClientsFiltered(clientsFormated);
      }
    } catch (error) {
      const responseError = error as AxiosError;
      swal({
        title: responseError.response?.data.message,
        icon: "error",
      });
    }
  };

  const onSearchClients = useDebounce((inputValue: string) => {
    filterClients(inputValue);
  }, 1000);

  const onChangeClients = (informationsClients: string) => {
    setClientSelected(JSON.parse(informationsClients));
  };

  const onSearchDrivers = useDebounce((inputValue: string) => {
    filterDriverName(inputValue);
  }, 1000);

  const onChangeDrivers = (informationsClients: string) => {
    setDriverSelected(JSON.parse(informationsClients));
  };

  const searchRequest = (page = 1) => {
    setLoading(true);

    let dateStart = filterDateStart;
    let dateEnd = filterDateEnd;

    if (filterDateStart === "undefined-undefined-") {
      dateStart = "";
      dateEnd = "";
    }
    let checkBox = searchCheckBox;
    if (searchCheckBox === false) {
      checkBox = "";
    }

    api
      .get(
        `trip/cancellationFee/findAll?page=${page}&dateStart=${dateStart}&dateEnd=${dateEnd}&cityId=${cityId}&withTrash=${checkBox}&userId=${
          clientSelected?.idUser || ""
        }&driverId=${driverSelected?.idDriver || ""}`
      )
      .then((values) => {
        setShowCardButtons(false);
        setLoading(false);
        setThisPage(page);
        if (values.data.response.data.length === 0) {
          setShowNoData(true);
          setHideCard(true);
          setShowCardButtons(true);
          setShowTableButtons(false);
          return;
        }
        setHideCard(false);
        setShowNoData(false);
        setShowTableButtons(true);
        setCurrentPage(values.data.response.current_page);
        setLastPage(values.data.response.last_page);
        if (page === lastPage) {
          setShowCardButtons(true);
        }
        if (page !== 1) {
          if (Utils.isMobile()) {
            setCancellationList((state) =>
              state?.concat(...values.data.response.data)
            );
            return;
          }
          setCancellationList(values.data.response.data);
          return;
        }
        setCancellationList(values.data.response.data);
        setPagination(values.data.response.next_page_url);
      });
  };

  const deleteFee = (idFee: number) => {
    swal({
      title: "Você realmente deseja zera essa taxa?",
      text: "Essa ação é irreversível",
      icon: "warning",
      buttons: ["Cancelar", "Confirmar"],
      dangerMode: true,
    }).then((value) => {
      if (value) {
        setLoading(true);
        api.delete(`trip/cancellationFee/${idFee}`).then(() => {
          setMessageAlert("Taxa zerada com sucesso!");
          setTypeAlert("success");
          searchRequest();
          return setShowAlert(true);
        });
        // setLoading(false);
        setTypeAlert("error");
        setMessageAlert("Erro ao tentar zerada taxa");
      }
    });
  };

  const handlePagination = () => {
    searchRequest(thisPage + 1);
  };

  const previesPage = () => {
    searchRequest(thisPage - 1);
  };

  return (
    <div>
      <Alert
        visibility={showAlert}
        setVisibility={setShowAlert}
        message={messageAlert}
        typeAlert={typeAlert}
      />
      {/*<Preload visible={loading} />*/}
      <div>
        <SearchFilter
          cityIdValue={cityId}
          onChangeDriver={onChangeDrivers}
          onSearchDriver={onSearchDrivers}
          nameDriversFiltered={driversFiltered}
          onChangeClient={onChangeClients}
          nameClientsFiltered={clientsFiltered}
          onSearchClient={onSearchClients}
          setFilterDateStartProps={setFilterDateStart}
          setFilterDateEndProps={setFilterDateEnd}
          setCityIdProps={setCityId}
          searchRequestProps={() => searchRequest()}
          setSearchCheckBoxProps={setSearchCheckBox}
        />
      </div>
      {showNoData === true ? (
        <NoDataFindContainer>
          <h1>Nenhum dado encontrado</h1>
        </NoDataFindContainer>
      ) : (
        ""
      )}
      {Utils.isMobile() ? (
        <div>
          {hideCard === true ? (
            ""
          ) : (
            <CancellationList
              cancellationListProps={cancellationList}
              searchRequestProps={searchRequest}
              deleteFeeProps={deleteFee}
              searchRequest={searchRequest}
            />
          )}
          {pagination && (
            <>
              {showCardButtons === true ? (
                ""
              ) : (
                <PaginationContainer>
                  <Button
                    style={{ marginBottom: 10 }}
                    type="primary"
                    onClick={handlePagination}
                    loading={loading}
                  >
                    Mostrar Mais
                  </Button>
                </PaginationContainer>
              )}
            </>
          )}
        </div>
      ) : (
        <div style={{ position: "relative" }}>
          <CancellationTableList
            cancellationListDataProps={cancellationList}
            handlePaginationProps={() => handlePagination()}
            previesPageProps={() => previesPage()}
            currentPageProps={currentPage}
            lastPageProps={lastPage}
            showTableButtonsProps={showTableButtons}
            deleteFeeProps={deleteFee}
            searchRequest={searchRequest}
          />

          {loading && (
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              zIndex: 2,
              backgroundColor: "rgba(255, 255, 255, 0.6)",
              padding: 20,
              borderRadius: 8,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "100%",
              height: "100%",
            }}
          >
            <Spin size="large" tip="Carregando..." />
          </div>
        )}
        </div>
      )}
    </div>
  );
};

export default CancellationFee;
