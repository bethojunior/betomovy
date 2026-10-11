import { useEffect, useState } from "react";
import api from "../../../services/api";
import NotificationTable from "../../../components/Message/NotificationTable";
import { AiOutlineArrowLeft, AiOutlineArrowRight } from "react-icons/ai";
import Preload from "../../../components/Utils/Preload";
import Alert from "../../../components/Utils/Alert";
import { AlertProps } from "../../../@types";
import NotificationModal from "../../../components/Message/NotificationModal";
import Session from "../../../utils/Session";
import { TypesDriversProps } from "./types";
import { ButtonContainer, MessageListEmpty, NewNotificationButton, PaginationButton, Loader } from "./styles";

const Notification = () => {
  const [loading, setLoading] = useState(false);
  const [messageAlert, setMessageAlert] = useState("");
  const [typeAlert, setTypeAlert] = useState<AlertProps>("success");
  const [showAlert, setShowAlert] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const [notificationList, setNotificationList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [driverTypeList, setDriverTypeList] = useState([]);

  const cities = Session.getLocal("cities");

  const getAllNotification = (page = 1) => {
    setLoading(true);
    api.get(`notification?page=${page}`).then((res) => {
      setLoading(false);
      if (res.status === 200) {
        const notifs = Array.isArray(res.data?.response?.data)
          ? res.data.response.data
          : (Array.isArray(res.data?.response) ? res.data.response : []);
        setNotificationList(notifs);
        setCurrentPage(res.data?.response?.current_page || 1);
        setLastPage(res.data?.response?.last_page || 1);
      }
    });
  };

  const getTypesDriver = () => {
    api.get("userType/actives").then(({ data }) => {
      const resp = Array.isArray(data?.response) ? data.response : [];
      setDriverTypeList(
        resp.map((response: TypesDriversProps) => {
          return {
            id: response.idUserType,
            name: response.name,
          };
        })
      );
    });
  };

  const changePage = (page: number) => {
    getAllNotification(page);
  };

  const alertValues = (message: string, type: AlertProps) => {
    setMessageAlert(message);
    setTypeAlert(type);
    setShowAlert(true);
  };

  useEffect(() => {
    getAllNotification();
    getTypesDriver();
  }, []);

  if (loading) return <Loader spinning />;

  return (
    <>
      <Preload visible={loading} />
      <Alert
        visibility={showAlert}
        message={messageAlert}
        typeAlert={typeAlert}
        setVisibility={setShowAlert}
      />
      <NewNotificationButton
        type="primary"
        onClick={() => setShowModal(true)}
      >
        Nova notificação
      </NewNotificationButton>
      <NotificationModal
        cities={cities}
        showModal={showModal}
        setShowModal={setShowModal}
        driverTypeList={driverTypeList}
        setLoading={setLoading}
        alertValues={alertValues}
        getAllNotification={getAllNotification}
      />
      {
        notificationList.length === 0 
        ? 
          <MessageListEmpty>Não existe nenhuma notificação</MessageListEmpty>
        :
        <>
          <NotificationTable
            notificationList={notificationList}
            alertValues={alertValues}
            setLoading={setLoading}
            currentPage={currentPage}
            getAllNotification={getAllNotification}
          />
          <ButtonContainer>
            <PaginationButton
              disabled={currentPage === 1}
              onClick={() => changePage(currentPage - 1)}
            >
              <AiOutlineArrowLeft />
            </PaginationButton>
            <PaginationButton
              disabled={currentPage === lastPage}
              onClick={() => changePage(currentPage + 1)}
            >
              <AiOutlineArrowRight />
            </PaginationButton>
          </ButtonContainer>
        </>
      }
    </>
  );
};

export default Notification;
