import { Modal, Steps } from "antd";
import { AxiosError } from "axios";
import swal from "sweetalert";
import { FC, useState, useEffect } from "react";
import api from "../../../../../services/api";
import InfoStep from "../Steps/InfoStep";
import DetailStep from "../Steps/DetailStep";
import UserStep from "../Steps/UserStep";
import Alert from "../../../../Utils/Alert";
import Preload from "../../../../Utils/Preload";
import {
  ObjectPerfilLegalPersonProps,
  ModalProps,
  LocalArrayData,
  WorkersData,
  WorkerksProps,
} from "./types";

const { Step } = Steps;

const defaultObjectPerfilLegalPerson: ObjectPerfilLegalPersonProps = {
  address: "",
  billingDay: "",
  cityId: "",
  document: "",
  email: "",
  facebook: "",
  fantasyName: "",
  id: null,
  instagram: "",
  name: "",
  observation: "",
  phone: "",
  registration: "",
  site: "",
  voucherLimit: "",
  workers: [],
};

const EditionModal: FC<ModalProps> = ({
  visibility,
  closeModal,
  legalId,
  data,
  registerOrEdit,
  handleSearchProps,
  stateList,
  setCityList,
  cityList,
  stateSelected,
  setStateSelected,
  setCitySelected,
  setData,
}) => {
  const [loading, setLoading] = useState(false);
  const [current, setCurrent] = useState(0);
  const [messageAlert, setMessageAlert] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [typeAlert, setTypeAlert] = useState<
    "success" | "info" | "warning" | "error"
  >("success");

  const [userId, setUserId] = useState<number>();
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userPhone, setUserPhone] = useState("");
  const [arrayOfWorkers, setArrayOfWorkers] = useState<LocalArrayData[]>([]);
  const [objectPerfilPerson, setObjectPerfilPerson] =
    useState<ObjectPerfilLegalPersonProps | null>(null);

  const registerCompany = () => {
    return new Promise<void>((resolve, reject) => {
      if (Number(objectPerfilPerson?.billingDay) > 31) {
        setMessageAlert("O dia de pagamento não pode ser maior que 31!");
        setTypeAlert("warning");
        setShowAlert(true);
        resolve();
        return;
      }

      const method = registerOrEdit ? api.put : api.post;

      method(`company`, {
        address: objectPerfilPerson?.address,
        billingDay: Number(objectPerfilPerson?.billingDay),
        cityId: objectPerfilPerson?.cityId,
        document: objectPerfilPerson?.document,
        email: objectPerfilPerson?.email,
        facebook: objectPerfilPerson?.facebook,
        fantasyName: objectPerfilPerson?.fantasyName,
        id: registerOrEdit ? legalId : "",
        instagram: objectPerfilPerson?.instagram,
        name: objectPerfilPerson?.name,
        observation: objectPerfilPerson?.observation,
        phone: objectPerfilPerson?.phone,
        registration: objectPerfilPerson?.registration,
        site: objectPerfilPerson?.site,
        voucherLimit: objectPerfilPerson?.voucherLimit,
        workers: objectPerfilPerson?.workers.map((item: WorkerksProps) => {
          return {
            userId: item.userId,
          };
        }),
      })
        .then((values) => {
          const isSuccess = values.status === 200 || values.status === 201 || Boolean(values.data?.status);
          if (isSuccess) {
            setMessageAlert(
              registerOrEdit
                ? "Pessoa jurídica editada com sucesso!"
                : "Pessoa jurídica inserida com sucesso!"
            );
            setShowAlert(true);
            setTypeAlert("success");
            handleSearchProps();
            closeModal();
            setObjectPerfilPerson(defaultObjectPerfilLegalPerson);
            setStateSelected(1);
            setCurrent(0);
            setArrayOfWorkers([]);
            resolve();
          } else {
            throw new Error('Status de resposta inesperado');
          }
        })
        .catch((error: AxiosError) => {
          swal({
            title: "Error",
            text: "Erro ao tentar inserir pessoa jurídica",
            icon: "error",
          });
          reject(error);
        });
    });
  };

  const insertInArray = () => {
    return new Promise<void>((resolve, reject) => {
      try {
        if (arrayOfWorkers.find((el: any) => el.userId === userId)) {
          setTypeAlert("warning");
          setMessageAlert("Usuário já selecionado!");
          setShowAlert(true);
          resolve();
          return;
        }

        if (userId === undefined) {
          setTypeAlert("warning");
          setMessageAlert("Escolha um usuário!");
          setShowAlert(true);
          resolve();
          return;
        }

        const userGroup = {
          user: {
            userId,
            name: userName,
            email: userEmail,
          },
        };

        setArrayOfWorkers([...arrayOfWorkers, userGroup]);
        resolve();
      } catch (error) {
        reject(error);
      }
    });
  };

  const getWorkers = () => {
    setLoading(true);
    api.get(`company/${legalId}/workers`).then((resul) => {
      const userList = resul.data.response;
      setArrayOfWorkers(
        userList.map((item: WorkersData) => {
          return item;
        })
      );
      setLoading(false);
    });
  };

  useEffect(() => {
    if (registerOrEdit && visibility) {
      getWorkers();
    }
  }, [registerOrEdit, visibility]);

  const insertWorkers = () => {
    return new Promise<void>((resolve, reject) => {
      if (userId !== undefined) {
        if (arrayOfWorkers.find((el: any) => el.userId === userId)) {
          setTypeAlert("warning");
          setMessageAlert("Usuário já selecionado!");
          setShowAlert(true);
          resolve();
          return;
        }

        api
          .post(`companyWorker`, {
            companyId: legalId,
            userId,
          })
          .then((values) => {
            if (values.status) {
              getWorkers();
              setTypeAlert("success");
              setMessageAlert("Usuário adicionado com sucesso!");
              setShowAlert(true);
            }
            resolve();
          })
          .catch((error: AxiosError<any>) => {
            setTypeAlert("error");
            setMessageAlert(error.response?.data?.response?.message || error.response?.data?.message || "Erro ao adicionar usuário");
            console.error(error);
            reject(error);
          });
      } else {
        resolve();
      }
    });
  };

  const steps = [
    {
      title: "Informações",
      content: (
        <InfoStep
          isEdit={registerOrEdit}
          stateSelected={stateSelected}
          objectPerfilLegalPerson={objectPerfilPerson}
          setObjectPerfilLegalPerson={setObjectPerfilPerson}
          current={current}
          setCurrent={setCurrent}
          setCityList={setCityList}
          cityList={cityList}
          setCitySelected={setCitySelected}
          setLoadingProps={setLoading}
          stateList={stateList}
        />
      ),
    },
    {
      title: "Detalhes",
      content: (
        <DetailStep
          current={current}
          setCurrent={setCurrent}
          objectPerfilLegalPerson={objectPerfilPerson}
          setObjectPerfilLegalPerson={setObjectPerfilPerson}
        />
      ),
    },
    {
      title: "Usuários",
      content: (
        <UserStep
          setUserIdProps={setUserId}
          setUserNameProps={setUserName}
          userEmailProps={userEmail}
          setUserEmailProps={setUserEmail}
          arrayOfWorkersProps={arrayOfWorkers}
          insertInArrayProps={insertInArray}
          setArrayOfWorkersProps={setArrayOfWorkers}
          insertWorkersProps={insertWorkers}
          registerOrEditProps={registerOrEdit}
          setUserPhoneProps={setUserPhone}
          userPhoneProps={userPhone}
          currentStep={current}
          setCurrentStep={setCurrent}
          handleRegisterAndEditUser={registerCompany}
        />
      ),
    },
  ];

  useEffect(() => {
    if (data) {
      const defaultObjectPerfilLegalPerson: ObjectPerfilLegalPersonProps = {
        address: data.address,
        billingDay: data.billingDay,
        cityId: String(data.cityId),
        document: data.document,
        email: data.email,
        facebook: data.facebook || "",
        fantasyName: data.fantasyName,
        id: null,
        instagram: data.instagram,
        name: data.name,
        observation: data.observation,
        phone: data.phone,
        registration: data.registration,
        site: data.site,
        voucherLimit: data.voucherLimit,
        workers: arrayOfWorkers.map((item: LocalArrayData) => {
          return item.user;
        }),
      };

      setObjectPerfilPerson(defaultObjectPerfilLegalPerson);
    } else {
      setObjectPerfilPerson(defaultObjectPerfilLegalPerson);
      setStateSelected(1);
    }
  }, [data]);

  useEffect(() => {
    setObjectPerfilPerson((prevState: any) => ({
      ...prevState,
      workers: arrayOfWorkers.map((item: LocalArrayData) => item.user),
    }));
  }, [arrayOfWorkers]);

  useEffect(() => {
    setArrayOfWorkers([]);
  }, [registerOrEdit]);

  return (
    <>
      <Preload visible={loading} />
      <Alert
        visibility={showAlert}
        message={messageAlert}
        typeAlert={typeAlert}
        setVisibility={setShowAlert}
      />
      <Modal
        width={450}
        title={
          registerOrEdit
            ? "Editar Pessoa Jurídica"
            : "Cadastrar Pessoa Jurídica"
        }
        open={visibility}
        onCancel={() => {
          closeModal();
          setData(null);
          setUserName("");
          setUserPhone("");
          setUserEmail("");
          setCurrent(0);
        }}
        footer={null}
      >
        <>
          <Steps size="small" onChange={setCurrent} current={current}>
            {steps.map((item) => (
              <Step key={item.title} title={item.title} />
            ))}
          </Steps>
          <div>{steps[current].content}</div>
          {/* <ModalButtonsContainer>
            {current > 0 && (
              <Button style={{ marginRight: "8px" }} onClick={() => prev()}>
                Voltar
              </Button>
            )}
            {current < steps.length - 1 && (
              <Button
                type="primary"
                onClick={() => next()}
                disabled={!citySelected}
              >
                Próximo
              </Button>
            )}
            {current === steps.length - 1 && (
              <Button
                type="primary"
                onClick={() => {
                  registerCompany();
                  setUserPhone("");
                  setUserEmail("");
                  setCurrent(0);
                }}
              >
                Enviar
              </Button>
            )}
          </ModalButtonsContainer> */}
        </>
      </Modal>
    </>
  );
};

export default EditionModal;
