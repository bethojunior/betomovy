import { useEffect, useState } from "react";
import { Button, Table } from "antd";
import { AiFillDelete, AiFillEdit } from "react-icons/ai";
import swal from "sweetalert";

import { ContentTable, Container} from "./styles";

import api from "../../../../../../services/api";
import Alert from "../../../../../Utils/Alert";
  
import EditTripTypeModal from "../../Modal/TripType";
import { theme_colors } from "../../../../../../theme/theme";
import { IConfigAppPartnersProps, ITripTypePartnerLinkedProps } from "../../Modal/TripType/types";
import { ICallGroupProps } from "src/pages/Advanced/Configs/CallGroup/ListCallGroups/types";

export interface TripTypeArray extends Array<TripType> {}

type TypeCall = {
  idTripType: number;
  type: string;
};

interface ITypeCallProps {
  callGroups: ICallGroupProps[];
  optionsAppPartners: IConfigAppPartnersProps[];
}

interface TripType {
  deliveryOption: number;
  description: string;
  freightOption: number;
  gender: {
    id: number;
    name: string;
  };
  gender_id: number;
  idTripType: number;
  messageNoDriversFound: string;
  onlyCentral: number;
  picture: string;
  returnOption: number;
  showType: number;
  type: string;
  openPrice: number;
  offerOption: number;
  serviceOption: number;
  trip_type_partner_linked?: ITripTypePartnerLinkedProps[];
  loopingOption: number;
  scheduledOnlyOption: number;
}


const TypeCall = ({
  callGroups,
  optionsAppPartners,
}: ITypeCallProps) => {
  const [loading, setLoading] = useState(false);
  const [messageAlert, setMessageAlert] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [typeAlert, setTypeAlert] = useState<
    "success" | "info" | "warning" | "error"
  >("success");

  const [tripTypeSelected, setTripTypeSelected] = useState<TripType>();
  const [tripType, setTripType] = useState<TripTypeArray>([]);
  const [gender, setGender] = useState([]);
  const [tripTypeModal, setTripTypeModal] = useState(false);

  const [typeModal, setTypeModal] = useState("");
  const [titleModal, setTitleModal] = useState("");

  const loadInformations = () => {
    setLoading(true);
    const requestTripType = api("tripType");
    const requestGender = api("gender");

    Promise.all([requestTripType, requestGender]).then((result) => {
      setLoading(false);
      const { response } = result[0].request;
      if (!result[0].data.status || !JSON.parse(response).status) {
        setMessageAlert(
          "Não foi possível carregar as informações, tente novamente"
        );
        setTypeAlert("error");
        return setShowAlert(true);
      }

      setTripType(result[0].data.response);
      return setGender(result[1].data.response);
    });
  };

  useEffect(() => {
    loadInformations();
  }, []);

  const deleteTripType = (id: number) => {
    swal({
      title: "Você realmente deseja excluir esse tipo de chamado?",
      text: "Caso tenha configurado tarifas para esse tipo de chamado elas serão APAGADAS, consequentemente",
      icon: "info",
      buttons: ["Cancelar", "Confirmar"],
      dangerMode: true,
    }).then((answer) => {
      if (!answer) {
        return "";
      }
      setLoading(true);
      api.delete(`tripType/${id}`).then((result) => {
        setLoading(false);
        if (!result.data.status) {
          setMessageAlert(
            "Ocorreu um erro ao deletar esse tipo de chamado, tente novamente"
          );
          setTypeAlert("error");
          return setShowAlert(true);
        }

        setMessageAlert("Tipo de chamado excluído com sucesso!");
        setTypeAlert("success");
        setShowAlert(true);
        return loadInformations();
      });
      return "";
    });
  };

  const editTripType = (id: number) => {
    setTripTypeSelected(tripType.find((el) => el.idTripType === id));
    setTripTypeModal(true);
    setTypeModal("edit");
    return setTitleModal("Editar tipo de chamado");
  };

    const TypeCallIdFormatt = (record: TypeCall) => {
      return <>
      <div>{record?.type}</div>
      <div>ID:{record?.idTripType}</div>
      </>
    }

  const columnsTripType = [
    {
      title: "Logo",
      dataIndex: "picture",
      key: "picture",
      width: 100,
      ellipsis: true,
      render: (item: string) => (
        <img style={{ height: 60, width: 60 }} src={item} alt="logo" />
      ),
    },
    {
      title: "Tipo",
      dataIndex: "type",
      key: "type",
      width: 200,
      render: (_: any, record: TypeCall) => TypeCallIdFormatt(record),
    },
    {
      title: "Descrição",
      dataIndex: "description",
      key: "description",
      width: 200,
    },
    {
      title: "Ações",
      dataIndex: "idTripType",
      key: "idTripType",
      width: 100,
      ellipsis: true,
      render: (id: number) => (
        <>
          <Button
            type="link"
            key={id}
            onClick={() => editTripType(id)}
            icon={<AiFillEdit style={{ fontSize: 20 }} />}
          />
          <Button
            type="link"
            key={id}
            onClick={() => deleteTripType(id)}
            icon={
              <AiFillDelete
                style={{ color: theme_colors.red_crismon, fontSize: 20 }}
              />
            }
          />
        </>
      ),
    },
  ];

  return (
    <Container>
      <Alert
        visibility={showAlert}
        message={messageAlert}
        typeAlert={typeAlert}
        setVisibility={setShowAlert}
      />
      <Button
        style={{ marginBottom: 10 }}
        onClick={() => {
          setTripTypeModal(true);
          setTypeModal("create");
          setTitleModal("Criar novo tipo de chamado");
        }}
        type="primary"
      >
        Novo tipo de chamado
      </Button>

      <ContentTable>
        <Table
          dataSource={tripType}
          columns={columnsTripType}
          rowKey={(_, index) => Number(index)}
          pagination={false}
          loading={loading}
        />
      </ContentTable>

      <EditTripTypeModal
        visibility={tripTypeModal}
        setVisibility={setTripTypeModal}
        loadInformations={loadInformations}
        titleModal={titleModal}
        tripTypeSelected={tripTypeSelected}
        typeModal={typeModal}
        gender={gender}
        optionsAppPartners={optionsAppPartners}
        callGroups={callGroups}
      />
    </Container>
  );
};

export default TypeCall;
