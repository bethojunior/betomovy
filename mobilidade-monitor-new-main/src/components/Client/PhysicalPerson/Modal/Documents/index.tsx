import { AxiosError } from "axios";
import { useState, FC, useEffect } from "react";
import { Menu, Select, Button } from "antd";
import { FileTextOutlined, CheckCircleOutlined } from "@ant-design/icons";
import Preload from "../../../../Utils/Preload";
import Alert from "../../../../Utils/Alert";
import { DocUserList } from "../../../../Shared/DocUserList";
import { TabTransition } from "../../../../Shared/TabTransition";
import api from "../../../../../services/api";
import {
  DocumentsModal,
  DocumentsNavbar,
  PersonalDocContainerGlobal,
  PersonalDocContainer,
  PersonalDataConatiner,
  PersonalDataLabel,
  PersonalStatusSelect,
  ButtonRequestNewDoc,
  SolicitationDocContainerGlobal,
  SolicitationDocContainer,
  SolicitationField,
  LabelItemSolicitationDoc,
  FullWidthSelect,
  HaventDocumentsLabel,
  TabBody,
} from "./styles";
import swal from "sweetalert";

const { Option } = Select;

interface DocumentsClientData extends Array<DocumentsClient> {}

interface DocumentsClient {
  description: string;
  docStatus: string;
  id: number;
  image: string;
  isImage: number;
  isText: number;
  label: string;
  text: string;
  userId: number;
}

interface StatusDocument extends Array<StatusDocumentData> {}

interface StatusDocumentData {
  id: number;
  name: string;
}

interface PersonalDocumentsData extends Array<PersonalDocuments> {}

interface PersonalDocuments {
  created_at: string;
  id: number;
  pendencyFieldStatusId: number;
  pendencyFieldTypeId: number;
  pendency_field_status: { id: number; name: string };
  pendency_field_type: {
    created_at: string;
    deleted_at: string;
    description: string;
    fieldType: string;
    id: number;
    initPending: number;
    name: string;
    update_at: string;
  };
  statusId: number;
  updated_at: string;
  userId: number;
}

interface NewSolicitationFromDoc extends Array<NewSolicitationFromDocData> {}

interface NewSolicitationFromDocData {
  created_at: string;
  description: string;
  id: number;
  image: number;
  label: string;
  link: string;
  pdf: number;
  text: number;
  updated_at: string;
}

//@ts-ignore
interface ListClient {
  appVersion: string;
  balanceId: number;
  document: string;
  city: string;
  cityId: number;
  comission: number;
  created_at: string;
  dateOfBirth: number;
  email: string;
  gender: string;
  idCustomer: number;
  idUser: number;
  latitude: number;
  longitude: number;
  militaryForce: string;
  militaryStatus: string;
  name: string;
  nickname: string;
  observation: string;
  om: string;
  patent: string;
  patentPicture: string;
  phone: string;
  platform: string;
  profileImage: string;
  quantityTripsFinished: number;
  rg: number;
  rgBackPicture: string;
  rgFrontPicture: string;
  status: string;
  voucherBalance: number;
}

interface DocumentsProps {
  handleCancelProps: () => void;
  // customerProps: ListClient | null;
  visibility: boolean;
  idUser: number | undefined;
  idCustomer: number | undefined;
}

const Documents: FC<DocumentsProps> = ({
  idUser,
  idCustomer,
  handleCancelProps,
  visibility,
}) => {
  const [loading, setLoading] = useState(false);
  const [messageAlert, setMessageAlert] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [typeAlert, setTypeAlert] = useState<
    "success" | "info" | "warning" | "error"
  >("success");

  const [personalDocuments, setPersonalDocuments] =
    useState<PersonalDocumentsData>([]);
  const [statusDocDinamic, setStatusDocDinamic] = useState<StatusDocument>([]);
  const [statusDocPersonal, setStatusDocPersonal] = useState<StatusDocument>(
    []
  );
  const [documentsOfClient, setDocumentsOfClient] =
    useState<DocumentsClientData>();
  const [newDocSolicitation, setNewDocSolicitation] =
    useState<NewSolicitationFromDoc>([]);

  const [docSolicitationSelectStatus, setDocSolicitationSelectStatus] =
    useState("");
  const [step, setStep] = useState(1);
  const [isVisibleButtonRequestDoc, setIsVisibleButtonRequestDoc] =
    useState(false);
  const [docSolicitationSelect, setDocSolicitationSelect] = useState("");
  const [optionsSelectMenuDocuments, setOptionsSelectMenuDocuments] = useState<
    string[] | undefined
  >();
  const [documentIsChanged, setDocumentIsChanged] = useState(false);

  useEffect(() => {
    if (showAlert) setTimeout(() => setShowAlert(false), 5000);
  }, [showAlert]);

  useEffect(() => {
    if (visibility) {
      setLoading(true);

      const requestPersonalDocument = api.get(`pendencyField/user/${idUser}`);
      const requestDinamicsDocument = api.get(`customer/${idCustomer}`);
      const requestDocStatusPersonal = api.get("pendencyFieldStatus");
      const requestDocStatusDinamic = api.get("docStatus");
      const requestDocLabelNewSolicitation = api.get("pendencyFieldType");

      Promise.all([
        requestPersonalDocument,
        requestDinamicsDocument,
        requestDocStatusDinamic,
        requestDocStatusPersonal,
        requestDocLabelNewSolicitation,
      ]).then((values) => {
        setLoading(false);
        if (values[0].status === 200) {
          setPersonalDocuments(values[0].data.response);
          setStatusDocDinamic(values[2].data.response);
          setStatusDocPersonal(values[3].data.response);
          setNewDocSolicitation(values[4].data.response);

          if (idCustomer === null) {
            setMessageAlert(
              "Não foi possível carregar os Outros documentos do cliente"
            );
            setTypeAlert("error");
            return setShowAlert(true);
          }

          return setDocumentsOfClient(values[1].data.response.docs);
        }
        setTypeAlert("error");
        setShowAlert(true);
        return setMessageAlert("Erro ao tentar abrir os documentos");
      });
    }
  }, [idUser, idCustomer, visibility]);

  const NewSolicitation = () => {
    setLoading(true);
    api
      .post(`pendencyField`, {
        pendencies: [
          {
            userId: idUser,
            pendencyFieldTypeId: String(docSolicitationSelect),
            pendencyFieldStatusId: String(docSolicitationSelectStatus),
          },
        ],
      })
      .then((values) => {
        if (values.request.status === 400) {
          setMessageAlert("O documento selecionado já está sendo utilizado");
          setTypeAlert("warning");
          return setShowAlert(true);
        }
        if (values.data.status) {
          setShowAlert(true);
          setTypeAlert("success");
          return setMessageAlert("Solicitação enviada com sucesso");
        }
      })
      .catch((error: AxiosError) => {
        swal({
          title: error.response?.data.message,
          icon: "error",
        });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const documentsPersonalSelect = (id: number, value: string) => {
    setLoading(true);
    api
      .put(`pendencyField/${id}/updateStatus`, {
        pendencyFieldStatusId: value,
      })
      .then((values) => {
        if (values.status === 200) {
          setShowAlert(true);
          setMessageAlert("Status alterado com sucesso");
          return setDocumentIsChanged(true);
        }
        setShowAlert(true);
        setTypeAlert("error");
        return setMessageAlert("Erro ao tentar alterar o Status");
      });
  };

  const refetchClientDocs = async () => {
    const getResponse = await api.get(`customer/${idCustomer}`);
    setDocumentsOfClient(getResponse.data.response.docs);
  };

  useEffect(() => {
    const personalDocumentsReload = () => {
      api.get(`pendencyField/user/${idUser}`).then((values) => {
        setLoading(false);
        setPersonalDocuments(values.data.response);
        setDocumentIsChanged(false);
      });
    };

    const reloadDocPersonal = async () => {
      if (documentIsChanged) {
        return personalDocumentsReload();
      }
      return "";
    };
    reloadDocPersonal();
  }, [documentIsChanged, setPersonalDocuments, idUser]);

  const LayoutStep = () => {
    switch (step) {
      case 1:
        return (
          <TabTransition key="personal">
            <PersonalDocContainerGlobal>
              {personalDocuments.length === 0 ? (
                <HaventDocumentsLabel>
                  Não existem pendencias para esse usuário
                </HaventDocumentsLabel>
              ) : (
                personalDocuments.map((item) => {
                  return (
                    <PersonalDocContainer>
                      <PersonalDataConatiner>
                        <PersonalDataLabel>
                          {item.pendency_field_type.description}
                        </PersonalDataLabel>
                      </PersonalDataConatiner>
                      <PersonalStatusSelect
                        defaultValue={item.pendency_field_status.name}
                        onChange={(value) =>
                          documentsPersonalSelect(item.id, value as string)
                        }
                      >
                        {statusDocPersonal?.map((status) => {
                          return (
                            <Option value={status.id}>{status.name}</Option>
                          );
                        })}
                      </PersonalStatusSelect>
                    </PersonalDocContainer>
                  );
                })
              )}
            </PersonalDocContainerGlobal>
          </TabTransition>
        );
      case 2:
        return (
          <TabTransition key="others">
            <DocUserList
              documents={documentsOfClient}
              statusList={statusDocDinamic}
              onDocumentsChanged={refetchClientDocs}
              emptyMessage="Não existem pendencias para esse usuário"
            />
          </TabTransition>
        );
      case 3:
        return (
          <TabTransition key="request">
            <SolicitationDocContainerGlobal>
              <SolicitationDocContainer>
                <SolicitationField>
                  <LabelItemSolicitationDoc>
                    <FileTextOutlined />
                    Documento
                  </LabelItemSolicitationDoc>
                  <FullWidthSelect
                    value={docSolicitationSelect}
                    onChange={(valueLabel) =>
                      setDocSolicitationSelect(valueLabel as string)
                    }
                  >
                    {newDocSolicitation?.map((newSolicitaion) => (
                      <Option key={newSolicitaion.id} value={newSolicitaion.id}>
                        {newSolicitaion.description}
                      </Option>
                    ))}
                  </FullWidthSelect>
                </SolicitationField>
                <SolicitationField>
                  <LabelItemSolicitationDoc>
                    <CheckCircleOutlined />
                    Status
                  </LabelItemSolicitationDoc>
                  <FullWidthSelect
                    value={docSolicitationSelectStatus}
                    onChange={(valueId) =>
                      setDocSolicitationSelectStatus(valueId as string)
                    }
                  >
                    {statusDocPersonal?.map((resStatus) => (
                      <Option value={resStatus.id}>{resStatus.name}</Option>
                    ))}
                  </FullWidthSelect>
                </SolicitationField>
              </SolicitationDocContainer>
            </SolicitationDocContainerGlobal>
          </TabTransition>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <Alert
        visibility={showAlert}
        setVisibility={setShowAlert}
        message={messageAlert}
        typeAlert={typeAlert}
      />
      <Preload visible={loading} />
      <DocumentsModal
        width={step === 3 ? 600 : 780}
        centered
        styles={{ body: { maxHeight: '75vh', overflowY: 'auto' } }}
        visible={visibility}
        title="Documentos"
        onCancel={() => {
          handleCancelProps();
        }}
        footer={[
          <Button
            key="back"
            onClick={() => {
              handleCancelProps();
            }}
          >
            Fechar
          </Button>,
          <ButtonRequestNewDoc
            visibility={isVisibleButtonRequestDoc}
            type="primary"
            onClick={NewSolicitation}
          >
            Solicitar
          </ButtonRequestNewDoc>,
        ]}
      >
        <DocumentsNavbar
          onClick={(e) => setOptionsSelectMenuDocuments([e.key])}
          selectedKeys={optionsSelectMenuDocuments}
          defaultSelectedKeys={["personalDoc"]}
          mode="horizontal"
        >
          <Menu.Item
            key="personalDoc"
            onClick={() => {
              setStep(1);
              setIsVisibleButtonRequestDoc(false);
            }}
          >
            Pessoais
          </Menu.Item>
          <Menu.Item
            key="othersDoc"
            onClick={() => {
              setStep(2);
              setIsVisibleButtonRequestDoc(false);
            }}
          >
            Outros
          </Menu.Item>
          <Menu.Item
            key="newDoc"
            onClick={() => {
              setStep(3);
              setIsVisibleButtonRequestDoc(true);
            }}
          >
            Solicitar
          </Menu.Item>
        </DocumentsNavbar>
        <TabBody>
          <LayoutStep />
        </TabBody>
      </DocumentsModal>
    </>
  );
};
export default Documents;
