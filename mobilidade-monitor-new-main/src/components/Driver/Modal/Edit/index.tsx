import { FC, useContext, useEffect, useState } from "react";
import { Button, Image, Input, Modal, Select, Steps, Tooltip } from "antd";
import swal from "sweetalert";
import { SelectValue } from "antd/lib/select";
import {
  UserOutlined,
  HomeOutlined,
  CarOutlined,
  CheckCircleOutlined,
  ArrowRightOutlined,
  ArrowLeftOutlined,
  SaveOutlined,
  CameraOutlined,
  EditOutlined,
  CheckOutlined,
  IdcardOutlined,
  PhoneOutlined,
  MailOutlined,
  CalendarOutlined,
  EnvironmentOutlined,
  SafetyCertificateOutlined,
} from "@ant-design/icons";

import {
  ContentModalEdit,
  WizardHeaderBanner,
  WizardHeaderLeft,
  WizardHeaderIcon,
  WizardHeaderTitle,
  WizardHeaderRight,
  StepsContainer,
  FormCard,
  FormSectionHeader,
  FormGrid,
  FieldGroup,
  FieldLabel,
  FieldError,
  PhotoManagerCard,
  PhotoActionsBox,
  StatusPill,
  SummaryOverviewGrid,
  SummaryCard,
  SummaryCardHeader,
  SummaryRow,
  FooterContainer,
  FooterActionsRight,
  SelectModalEdit,
  InputPhone,
} from "./styles";

import api from "../../../../services/api";
import Preload from "../../../Utils/Preload";
import Alert from "../../../Utils/Alert";
import Mask from "../../../../services/Mask";
import Utils from "../../../../utils/Utils";
import { Constants } from "../../../../utils/constants";
import cep from "cep-promise";

import { ModalChangedPhoto } from "../ModalChangedPhoto";
import { ProfilePhotoEditModal } from "../../../Shared/ProfilePhotoEditModal";
import { ZafiraValidationStatus } from "../../../Utils/ZafiraValidationStatus";
import { useZafiraValidationReset } from "../../../../hooks/useZafiraValidationReset";
import AuthContext from "../../../../contexts/auth";
import { ZAFIRA, ZAFIRA_VISUALIZAR_VALIDACAO } from "../../../../constants/permissions";
import { City, ModalProps } from "./types";

const { Option } = Select;
const { Step } = Steps;

const EditDataModal: FC<ModalProps> = ({
  visibility,
  handleCloseModal,
  driverSelected,
  typeOfDriver,
  onSearch,
  handlePrepareEditModal,
  baseImageLink,
  enableZafiraValidationMonitor,
}) => {
  const { hasPermission } = useContext(AuthContext);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [messageAlert, setMessageAlert] = useState("");
  const [typeAlert, setTypeAlert] = useState<
    "success" | "info" | "warning" | "error"
  >("success");

  const [editName, setEditName] = useState<string>("");
  const [editNickname, setEditNickname] = useState<string>("");
  const [editEmail, setEditEmail] = useState<string>("");
  const [editPhone, setEditPhone] = useState<string>("");
  const [editDocument, setEditDocument] = useState<string>("");
  const [editCnh, setEditCnh] = useState<string>("");
  const [editGender, setEditGender] = useState("" as SelectValue);
  const [editTypeOfDriver, setEditTypeOfDriver] = useState("" as SelectValue);
  const [editZipCode, setEditZipCode] = useState<string>("");
  const [editStreet, setEditStreet] = useState<string>("");
  const [editNumber, setEditNumber] = useState<string>("");
  const [editComplement, setEditComplement] = useState<string>("");
  const [editCityId, setEditCityId] = useState("" as SelectValue);
  const [editNeighborhood, setEditNeighborhood] = useState<string>("");
  const [editDateOfBirth, setEditDateOfBirth] = useState<string>("");
  const [editYear, setEditYear] = useState<string>("");
  const [editPlate, setEditPlate] = useState<string>("");
  const [editModel, setEditModel] = useState<string>("");
  const [editColor, setEditColor] = useState<string>("");
  const [editBrand, setEditBrand] = useState<string>("");
  const [editRenavam, setEditRenavam] = useState<string>("");
  const [addressBaseline, setAddressBaseline] = useState({
    zipCode: "",
    street: "",
    number: "",
    complement: "",
    cityId: "" as SelectValue,
    neighborhood: "",
  });

  const originalFields = {
    name: driverSelected?.name || "",
    phone: driverSelected?.phone || "",
    document: driverSelected?.document || "",
    email: driverSelected?.email || "",
  };
  const currentFields = {
    name: editName,
    phone: editPhone,
    document: editDocument,
    email: editEmail,
  };
  const { zafiraValidated } = useZafiraValidationReset({
    initialValidated: driverSelected?.zafiraValidated ?? 0,
    original: originalFields,
    current: currentFields,
  });

  const applyPlateMask = (value: string) => {
    value = value.replace(/[^a-zA-Z0-9]/g, "").toUpperCase();

    if (value.length <= 7) {
      if (value.length <= 3) {
        value = value.replace(/[^A-Z]/g, "");
      } else if (value.length <= 4) {
        value = value.replace(/^([A-Z]{3})([0-9])/, "$1$2");
      } else if (value.length <= 5) {
        value = value.replace(/^([A-Z]{3})([0-9])([A-Z])/, "$1$2$3");
      } else if (value.length <= 6) {
        value = value.replace(/^([A-Z]{3})([0-9])([A-Z])([0-9])/, "$1$2$3$4");
      } else {
        value = value.replace(
          /^([A-Z]{3})([0-9])([A-Z])([0-9]{2})/,
          "$1$2$3$4"
        );
        value = value.replace(/^([A-Z]{3})([0-9]{4})/, "$1-$2");
      }
    } else if (value.length <= 8) {
      if (value.length <= 3) {
        value = value.replace(/[^A-Z]/g, "");
      } else if (value.length <= 4) {
        value = value.replace(/^([A-Z]{3})([0-9A-Z])/, "$1$2");
      } else if (value.length <= 5) {
        value = value.replace(/^([A-Z]{3})([0-9A-Z]{2})/, "$1$2");
      } else if (value.length <= 6) {
        value = value.replace(/^([A-Z]{3})([0-9A-Z]{3})/, "$1$2");
      } else {
        value = value.replace(/^([A-Z]{3})([0-9A-Z]{4})/, "$1$2");
      }
    }

    return value;
  };

  const validatePlate = (plate: string) => {
    const mercosulRegex = /^[A-Z]{3}[0-9][A-Z][0-9]{2}$/;
    const oldFormatRegex = /^[A-Z]{3}-[0-9]{4}$/;

    return mercosulRegex.test(plate) || oldFormatRegex.test(plate);
  };

  const [validationErrors, setValidationErrors] = useState<{
    [key: string]: string;
  }>({});

  const [ifSelectModalEditIsChanged, setIfSelectModalEditIsChanged] =
    useState(0);

  const [visibleModalChangePhoto, setVisibleModalChangePhoto] =
    useState<boolean>(false);
  const [visibleProfilePhotoEditModal, setVisibleProfilePhotoEditModal] =
    useState<boolean>(false);

  const [cities, setCities] = useState<City[]>([]);
  const [citiesLoaded, setCitiesLoaded] = useState(false);

  useEffect(() => {
    if (visibility && !citiesLoaded) {
      api.get("city/actives/fully").then((response) => {
        if (response.data && Array.isArray(response.data.response)) {
          const loadedCities = response.data.response.map((city: any) => ({
            id: city.cityId,
            name: city.nome,
          }));
          setCities(loadedCities);
          setCitiesLoaded(true);

          if (driverSelected?.driver_address) {
            const city = loadedCities.find(
              (city: { name: string }) =>
                city.name === driverSelected.driver_address.city
            );
            if (city) {
              setEditCityId(city.id);
            }
          }
        } else {
          setCities([]);
          console.error(
            "O formato dos dados recebidos não é uma matriz:",
            response.data
          );
        }
      });
    }

    if (driverSelected) {
      setEditName(driverSelected?.name || "");
      setEditNickname(driverSelected?.nickname || "");
      setEditEmail(driverSelected?.email || "");
      setEditPhone(driverSelected?.phone ? Mask.setMaskPhoneValue(driverSelected.phone) : "");
      setEditDocument(driverSelected?.document || "");
      setEditCnh(driverSelected?.cnh || "");
      setEditGender(driverSelected?.gender || "");
      setEditTypeOfDriver(
        driverSelected?.userTypeId !== undefined && driverSelected?.userTypeId !== null && driverSelected?.userTypeId !== ""
          ? Number(driverSelected.userTypeId)
          : ""
      );
      setIfSelectModalEditIsChanged(0);
      setEditDateOfBirth(
        driverSelected?.dateOfBirth
          ? Utils.formatDateFromBackend(driverSelected.dateOfBirth)
          : ""
      );

      const addr = driverSelected?.driver_address || {};
      const zip = addr.zipCode || driverSelected?.zipCode || "";
      const street = addr.street || driverSelected?.street || "";
      const num = addr.number || driverSelected?.number || "";
      const comp = addr.complement || driverSelected?.complement || "";
      const neigh = addr.neighborhood || driverSelected?.neighborhood || "";
      const dCityId = driverSelected?.cityId ? Number(driverSelected.cityId) : "";

      if (dCityId) {
        setEditCityId(dCityId);
      }

      setEditZipCode(zip);
      setEditStreet(street);
      setEditNumber(num);
      setEditComplement(comp);
      setEditNeighborhood(neigh);

      setAddressBaseline({
        zipCode: zip,
        street: street,
        number: num,
        complement: comp,
        neighborhood: neigh,
        cityId: dCityId,
      });

      setEditYear(driverSelected?.year || "");
      setEditPlate(driverSelected?.plate || "");
      setEditModel(driverSelected?.model || "");
      setEditColor(driverSelected?.color || "");
      setEditBrand(driverSelected?.brand || "");
      setEditRenavam(driverSelected?.renavam || "");
    }
  }, [driverSelected, visibility, citiesLoaded]);

  const validateDateOfBirth = (date: string) => {
    const [day, month, year] = date.split("/").map(Number);
    const inputBirthDate = new Date(year, month - 1, day);
    const today = new Date();
    let age = today.getFullYear() - inputBirthDate.getFullYear();

    if (
      today.getMonth() < inputBirthDate.getMonth() ||
      (today.getMonth() === inputBirthDate.getMonth() &&
        today.getDate() < inputBirthDate.getDate())
    ) {
      age--;
    }

    const isFutureDate = inputBirthDate > today;
    const isInvalidYear = year < 1920 || year > today.getFullYear();

    if (isFutureDate || age < 18 || isNaN(age) || isInvalidYear) {
      setValidationErrors((prevErrors) => ({
        ...prevErrors,
        dateOfBirth: "Insira uma data de nascimento válida.",
      }));
      return false;
    } else {
      setValidationErrors((prevErrors) => {
        const { dateOfBirth, ...otherErrors } = prevErrors;
        return otherErrors;
      });
      return true;
    }
  };

  const handleEditDriverData = () => {
    setLoading(true);

    const errors: { [key: string]: string } = {};

    if (!editName) errors.name = "O campo Nome é obrigatório.";
    if (!editDocument) errors.document = "O campo CPF/CNPJ é obrigatório.";
    if (!editNickname) errors.nickname = "O campo Apelido é obrigatório.";
    if (!editEmail) errors.email = "O campo E-mail é obrigatório.";
    if (!editPhone) errors.phone = "O campo Telefone é obrigatório.";
    if (!Utils.checkIfPhoneNumberIsValid(editPhone || "")) {
      errors.phone = "O telefone informado é inválido";
    }
    if (!Utils.checkIfEmailIsValid(editEmail || "")) {
      errors.email = "Digite um e-mail válido";
    }

    if (
      editZipCode !== "" ||
      editStreet !== "" ||
      editNumber !== "" ||
      editNeighborhood !== "" ||
      editCityId !== ""
    ) {
      if (!editZipCode) errors.zipCode = "O campo CEP é obrigatório.";
      if (!editStreet) errors.street = "O campo Rua é obrigatório.";
      if (!editNumber) errors.number = "O campo Número é obrigatório.";
      if (!editNeighborhood)
        errors.neighborhood = "O campo Bairro é obrigatório.";
      if (!editCityId) errors.cityId = "O campo Cidade é obrigatório.";
    }

    if (editDateOfBirth && !validateDateOfBirth(editDateOfBirth)) {
      errors.dateOfBirth = "Insira uma data de nascimento válida.";
    }

    if (!editYear) errors.year = "Campo obrigatório.";
    if (!editPlate) errors.plate = "Campo obrigatório.";
    if (!editModel) errors.model = "Campo obrigatório.";
    if (!editColor) errors.color = "Campo obrigatório.";
    if (!editBrand) errors.brand = "Campo obrigatório.";
    if (!editRenavam) errors.renavam = "Campo obrigatório.";

    if (!validatePlate(editPlate)) {
      errors.plate = "Placa inválida.";
    }

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      setLoading(false);
      setTypeAlert("warning");
      setMessageAlert("Por favor, preencha todos os campos obrigatórios destacados.");
      setShowAlert(true);

      // Auto-navigate to step containing the first error
      if (errors.name || errors.document || errors.nickname || errors.email || errors.phone || errors.dateOfBirth) {
        setCurrentStep(0);
      } else if (errors.zipCode || errors.street || errors.number || errors.neighborhood || errors.cityId) {
        setCurrentStep(1);
      } else if (errors.year || errors.plate || errors.model || errors.color || errors.brand || errors.renavam) {
        setCurrentStep(2);
      }
      return;
    }

    setValidationErrors({});

    const updateDriverInfo = () => {
      const formattedDateOfBirth = editDateOfBirth
        ? Utils.formatDateToBackend(editDateOfBirth)
        : null;

      const payload: Record<string, string | number | null> = {
        cnh: editCnh || null,
        document: editDocument,
        email: editEmail,
        gender: (editGender ?? null) as string | number | null,
        name: editName,
        nickname: editNickname,
        phone: editPhone,
        dateOfBirth: formattedDateOfBirth,
        userTypeId: editTypeOfDriver ? Number(editTypeOfDriver) : null,
        ...(editCityId ? { cityId: Number(editCityId) } : {}),
      };

      return api.put(`driver/${driverSelected?.idDriver}`, payload);
    };

    const updateDriverType = () => {
      if (ifSelectModalEditIsChanged && editTypeOfDriver) {
        return api.put(`user/${driverSelected?.userId}/changeType`, {
          userId: driverSelected?.userId,
          userTypeId: editTypeOfDriver?.toString(),
        });
      }
      return Promise.resolve({ data: { status: true } });
    };

    const verifyAddressChange = () => {
      return (
        addressBaseline.zipCode !== editZipCode ||
        addressBaseline.street !== editStreet ||
        addressBaseline.number !== editNumber ||
        addressBaseline.complement !== editComplement ||
        addressBaseline.cityId !== editCityId ||
        addressBaseline.neighborhood !== editNeighborhood
      );
    };

    const updateAddress = () => {
      if (verifyAddressChange()) {
        return api.post(`driver/${driverSelected?.idDriver}/address`, {
          zipCode: editZipCode,
          street: editStreet,
          number: editNumber,
          complement: editComplement,
          cityId: editCityId,
          neighborhood: editNeighborhood,
        });
      }
      return Promise.resolve({ data: { status: true } });
    };

    const updateCarInfo = () => {
      if (!driverSelected?.idCar || Number(driverSelected.idCar) <= 0) {
        return Promise.resolve({ data: { status: true } });
      }
      return api.put(`car/${driverSelected.idCar}`, {
        year: editYear,
        plate: editPlate,
        model: editModel,
        color: editColor,
        brand: editBrand,
        renavam: editRenavam,
      });
    };

    const promises = [
      updateDriverInfo(),
      updateAddress(),
      updateCarInfo(),
      updateDriverType(),
    ];

    Promise.all(promises)
      .then((results) => {
        setLoading(false);
        const failedUpdates = results.filter((result) => !result.data.status);
        if (failedUpdates.length > 0) {
          const apiMessages = failedUpdates
            .flatMap((r) => (Array.isArray(r.data.response) ? r.data.response : []))
            .filter(Boolean);
          setShowAlert(true);
          setTypeAlert("error");
          return setMessageAlert(
            apiMessages.length > 0
              ? apiMessages.join(" | ")
              : "Não foi possível atualizar todos os dados, tente novamente"
          );
        }
        setShowAlert(true);
        setTypeAlert("success");
        setMessageAlert("Os dados foram atualizados com sucesso!");
        handleCloseModal();
        onSearch();
      })
      .catch((error) => {
        setLoading(false);
        setShowAlert(true);
        setTypeAlert("error");
        const apiMessages: string[] = error?.response?.data?.response;
        setMessageAlert(
          Array.isArray(apiMessages) && apiMessages.length > 0
            ? apiMessages.join(" | ")
            : "Houve um erro ao atualizar os dados, tente novamente mais tarde"
        );
      });
  };

  const handleRequestNewPhoto = (idDriver: number) => {
    swal({
      title: "Solicitar nova foto",
      text: "Deseja solicitar uma nova foto de perfil para o motorista? O motorista será bloqueado temporariamente até que envie uma nova foto.",
      icon: "info",
      buttons: ["Cancelar", "Confirmar"],
    }).then((answer) => {
      if (answer) {
        setLoading(true);
        api
          .post(`driver/${idDriver}/profileImage/requestNew`, {
            blockDriver: true,
          })
          .then((result) => {
            setLoading(false);
            if (!result.data.status) {
              setShowAlert(true);
              setTypeAlert("error");
              return setMessageAlert(
                "Não foi possível solicitar uma nova foto"
              );
            }
            setTypeAlert("success");
            setShowAlert(true);
            return setMessageAlert("A solicitação foi enviada ao motorista");
          });
      }
    });
  };

  const handleCepChange = (cepValue: string) => {
    setEditZipCode(cepValue);
    const cleanDigits = cepValue.replace(/\D/g, "");
    if (cleanDigits.length === 8) {
      cep(cleanDigits)
        .then((address) => {
          if (address.street) setEditStreet(address.street);
          if (address.neighborhood) setEditNeighborhood(address.neighborhood);
          if (address.city && cities.length > 0) {
            const city = cities.find(
              (c) => c.name.toLowerCase() === address.city.toLowerCase()
            );
            if (city) {
              setEditCityId(city.id);
            }
          }
        })
        .catch((error) => {
          console.warn("CEP não encontrado:", error);
        });
    }
  };

  const driverImgUrl = driverSelected?.profileImage
    ? (driverSelected.profileImage.startsWith("http")
        ? driverSelected.profileImage
        : `${baseImageLink}${driverSelected.profileImage}`)
    : Constants.defaultImgNotFound;

  const currentCityName =
    cities.find((c) => String(c.id) === String(editCityId))?.name || "—";
  const currentUserTypeName =
    typeOfDriver?.find((t) => Number(t.idUserType) === Number(editTypeOfDriver))?.name || "—";

  return (
    <>
      <Preload visible={loading} />
      <Alert
        visibility={showAlert}
        setVisibility={setShowAlert}
        message={messageAlert}
        typeAlert={typeAlert}
      />
      <Modal
        title={null}
        visible={visibility}
        width={860}
        centered
        destroyOnClose={false}
        onCancel={() => {
          handleCloseModal();
          setIfSelectModalEditIsChanged(0);
        }}
        footer={
          <FooterContainer>
            <Button
              key="back"
              onClick={() => {
                handleCloseModal();
                setIfSelectModalEditIsChanged(0);
              }}
            >
              Cancelar
            </Button>
            <FooterActionsRight>
              {currentStep > 0 && (
                <Button
                  icon={<ArrowLeftOutlined />}
                  onClick={() => setCurrentStep((prev) => Math.max(0, prev - 1))}
                >
                  Etapa Anterior
                </Button>
              )}
              {currentStep < 3 ? (
                <Button
                  type="primary"
                  icon={<ArrowRightOutlined />}
                  onClick={() => setCurrentStep((prev) => Math.min(3, prev + 1))}
                  style={{ backgroundColor: "#0284c7", borderColor: "#0284c7" }}
                >
                  Próxima Etapa
                </Button>
              ) : null}
              <Button
                type="primary"
                icon={<SaveOutlined />}
                style={{
                  backgroundColor: "#10b981",
                  borderColor: "#10b981",
                  fontWeight: 600,
                }}
                onClick={handleEditDriverData}
              >
                Salvar Configurações
              </Button>
            </FooterActionsRight>
          </FooterContainer>
        }
      >
        {/* Wizard Header Banner */}
        <WizardHeaderBanner>
          <WizardHeaderLeft>
            <WizardHeaderIcon>
              <UserOutlined />
            </WizardHeaderIcon>
            <WizardHeaderTitle>
              <h2>Configurações do Motorista</h2>
              <p>
                {driverSelected?.name ? `${driverSelected.name} • ID #${driverSelected.idDriver}` : "Assistente Passo a Passo"}
              </p>
            </WizardHeaderTitle>
          </WizardHeaderLeft>
          <WizardHeaderRight>
            <StatusPill status={driverSelected?.registerStatus}>
              {driverSelected?.registerStatus || "STATUS INDEFINIDO"}
            </StatusPill>
          </WizardHeaderRight>
        </WizardHeaderBanner>

        {/* Steps Navigation Bar */}
        <StepsContainer>
          <Steps current={currentStep} onChange={setCurrentStep} size="small">
            <Step
              title="Dados & Perfil"
              subTitle="Cadastro"
              icon={<UserOutlined />}
            />
            <Step
              title="Endereço"
              subTitle="Localização"
              icon={<HomeOutlined />}
            />
            <Step
              title="Veículo"
              subTitle="Carro e CNH"
              icon={<CarOutlined />}
            />
            <Step
              title="Revisão Geral"
              subTitle="Confirmar"
              icon={<CheckCircleOutlined />}
            />
          </Steps>
        </StepsContainer>

        <ContentModalEdit>
          {/* PASSO 1: DADOS PESSOAIS & PERFIL */}
          {currentStep === 0 && (
            <div>
              <PhotoManagerCard>
                <div>
                  <Image
                    width={130}
                    height={130}
                    style={{ borderRadius: 10, objectFit: "cover" }}
                    src={driverImgUrl}
                    fallback={Constants.defaultImgNotFound}
                  />
                </div>
                <PhotoActionsBox>
                  <div>
                    <span style={{ fontSize: 13, fontWeight: 700, color: "#1e293b" }}>
                      Gerenciamento de Foto
                    </span>
                    <p style={{ margin: "2px 0 8px 0", fontSize: 12, color: "#64748b" }}>
                      Atualize ou solicite o reenvio da foto oficial de perfil do motorista.
                    </p>
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                    <Button
                      size="small"
                      icon={<CameraOutlined />}
                      onClick={() => handleRequestNewPhoto(driverSelected?.idDriver)}
                    >
                      Solicitar nova foto
                    </Button>
                    <Button
                      size="small"
                      icon={<EditOutlined />}
                      type="primary"
                      ghost
                      onClick={() => setVisibleProfilePhotoEditModal(true)}
                    >
                      Editar foto de perfil
                    </Button>
                    {driverSelected?.profileImageTemp !== null && (
                      <Button
                        size="small"
                        icon={<CheckOutlined />}
                        type="dashed"
                        onClick={() => setVisibleModalChangePhoto(true)}
                      >
                        Verificar foto temporária
                      </Button>
                    )}
                  </div>
                </PhotoActionsBox>
              </PhotoManagerCard>

              <FormCard>
                <FormSectionHeader>
                  <IdcardOutlined />
                  <h3>Identificação e Acesso</h3>
                  <span>Campos com * são obrigatórios</span>
                </FormSectionHeader>

                <FormGrid columns={2}>
                  <FieldGroup>
                    <FieldLabel>
                      Nome Completo <span style={{ color: "red" }}>*</span>
                    </FieldLabel>
                    <Input
                      placeholder="Nome do motorista"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      style={{ borderColor: validationErrors.name ? "red" : undefined }}
                    />
                    {validationErrors.name && <FieldError>{validationErrors.name}</FieldError>}
                  </FieldGroup>

                  <FieldGroup>
                    <FieldLabel>
                      CPF / CNPJ <span style={{ color: "red" }}>*</span>
                    </FieldLabel>
                    <Input
                      maxLength={18}
                      placeholder="000.000.000-00"
                      value={editDocument}
                      onChange={(e) => setEditDocument(Mask.setMaskCPFCNPJ(e.target.value))}
                      style={{ borderColor: validationErrors.document ? "red" : undefined }}
                    />
                    {validationErrors.document && <FieldError>{validationErrors.document}</FieldError>}
                  </FieldGroup>

                  <FieldGroup>
                    <FieldLabel>
                      Apelido <span style={{ color: "red" }}>*</span>
                    </FieldLabel>
                    <Input
                      placeholder="Como prefere ser chamado"
                      value={editNickname}
                      onChange={(e) => setEditNickname(e.target.value)}
                      style={{ borderColor: validationErrors.nickname ? "red" : undefined }}
                    />
                    {validationErrors.nickname && <FieldError>{validationErrors.nickname}</FieldError>}
                  </FieldGroup>

                  <FieldGroup>
                    <FieldLabel>
                      Número da CNH
                    </FieldLabel>
                    <Input
                      maxLength={11}
                      placeholder="Registro CNH"
                      value={editCnh}
                      onChange={(e) => setEditCnh(e.target.value)}
                      style={{ borderColor: validationErrors.cnh ? "red" : undefined }}
                    />
                    {validationErrors.cnh && <FieldError>{validationErrors.cnh}</FieldError>}
                  </FieldGroup>
                </FormGrid>
              </FormCard>

              <FormCard>
                <FormSectionHeader>
                  <PhoneOutlined />
                  <h3>Contato e Classificação</h3>
                </FormSectionHeader>

                <FormGrid columns={2}>
                  <FieldGroup>
                    <FieldLabel>
                      E-mail <span style={{ color: "red" }}>*</span>
                    </FieldLabel>
                    <Input
                      placeholder="exemplo@email.com"
                      value={editEmail}
                      onChange={(e) => setEditEmail(e.target.value)}
                      style={{ borderColor: validationErrors.email ? "red" : undefined }}
                    />
                    {validationErrors.email && <FieldError>{validationErrors.email}</FieldError>}
                  </FieldGroup>

                  <FieldGroup>
                    <FieldLabel>
                      Telefone <span style={{ color: "red" }}>*</span>
                    </FieldLabel>
                    <InputPhone
                      placeholder="(00) 00000-0000"
                      value={editPhone}
                      onChange={(e) => setEditPhone(Mask.setMaskPhoneValue(e.target.value))}
                      style={{ borderColor: validationErrors.phone ? "red" : undefined }}
                    />
                    {validationErrors.phone && <FieldError>{validationErrors.phone}</FieldError>}
                  </FieldGroup>

                  <FieldGroup>
                    <FieldLabel>Gênero</FieldLabel>
                    <SelectModalEdit
                      value={editGender}
                      placeholder="Selecione o gênero"
                      onChange={(value) => setEditGender(value as string)}
                    >
                      <Option value="feminino">Feminino</Option>
                      <Option value="masculino">Masculino</Option>
                    </SelectModalEdit>
                  </FieldGroup>

                  <FieldGroup>
                    <FieldLabel>Tipo de Motorista</FieldLabel>
                    <SelectModalEdit
                      value={
                        editTypeOfDriver !== "" && editTypeOfDriver !== undefined
                          ? Number(editTypeOfDriver)
                          : undefined
                      }
                      placeholder="Selecione a categoria"
                      onChange={(value) => {
                        setEditTypeOfDriver(value ? Number(value) : "");
                        setIfSelectModalEditIsChanged(1);
                      }}
                    >
                      {typeOfDriver?.map((item) => (
                        <Option key={item.idUserType} value={Number(item.idUserType)}>
                          {item.name}
                        </Option>
                      ))}
                    </SelectModalEdit>
                  </FieldGroup>

                  <FieldGroup>
                    <FieldLabel>
                      Data de Nascimento
                    </FieldLabel>
                    <Input
                      placeholder="DD/MM/AAAA"
                      value={editDateOfBirth}
                      onChange={(e) => {
                        const maskedDate = Mask.setMaskDate(e.target.value);
                        setEditDateOfBirth(maskedDate);
                        validateDateOfBirth(maskedDate);
                      }}
                      style={{ borderColor: validationErrors.dateOfBirth ? "red" : undefined }}
                    />
                    {validationErrors.dateOfBirth && <FieldError>{validationErrors.dateOfBirth}</FieldError>}
                  </FieldGroup>

                  <FieldGroup>
                    <FieldLabel>Cidade Base</FieldLabel>
                    <SelectModalEdit
                      showSearch
                      value={editCityId || undefined}
                      onChange={(value) => setEditCityId(value as string)}
                      placeholder="Selecione a cidade base"
                      filterOption={(input, option) =>
                        (option?.children as unknown as string)
                          .toLowerCase()
                          .indexOf(input.toLowerCase()) >= 0
                      }
                    >
                      {cities.map((city) => (
                        <Option key={city.id} value={city.id}>
                          {city.name}
                        </Option>
                      ))}
                    </SelectModalEdit>
                  </FieldGroup>
                </FormGrid>

                {enableZafiraValidationMonitor && hasPermission(ZAFIRA, ZAFIRA_VISUALIZAR_VALIDACAO) && (
                  <div style={{ marginTop: 16 }}>
                    <ZafiraValidationStatus zafiraValidated={zafiraValidated} />
                  </div>
                )}
              </FormCard>
            </div>
          )}

          {/* PASSO 2: ENDEREÇO */}
          {currentStep === 1 && (
            <div>
              <FormCard>
                <FormSectionHeader>
                  <HomeOutlined />
                  <h3>Endereço Residencial do Motorista</h3>
                  <span>Preenchimento automático por CEP</span>
                </FormSectionHeader>

                <FormGrid columns={3}>
                  <FieldGroup>
                    <FieldLabel>
                      CEP <span style={{ color: "red" }}>*</span>
                    </FieldLabel>
                    <Input
                      placeholder="00000-000"
                      value={editZipCode}
                      onChange={(e) => handleCepChange(e.target.value)}
                      style={{ borderColor: validationErrors.zipCode ? "red" : undefined }}
                    />
                    {validationErrors.zipCode && <FieldError>{validationErrors.zipCode}</FieldError>}
                  </FieldGroup>

                  <FieldGroup style={{ gridColumn: "span 2" }}>
                    <FieldLabel>
                      Rua / Logradouro <span style={{ color: "red" }}>*</span>
                    </FieldLabel>
                    <Input
                      placeholder="Avenida, rua, travessa..."
                      value={editStreet}
                      onChange={(e) => setEditStreet(e.target.value)}
                      style={{ borderColor: validationErrors.street ? "red" : undefined }}
                    />
                    {validationErrors.street && <FieldError>{validationErrors.street}</FieldError>}
                  </FieldGroup>

                  <FieldGroup>
                    <FieldLabel>
                      Número <span style={{ color: "red" }}>*</span>
                    </FieldLabel>
                    <Input
                      placeholder="Nº ou S/N"
                      value={editNumber}
                      onChange={(e) => setEditNumber(e.target.value)}
                      style={{ borderColor: validationErrors.number ? "red" : undefined }}
                    />
                    {validationErrors.number && <FieldError>{validationErrors.number}</FieldError>}
                  </FieldGroup>

                  <FieldGroup>
                    <FieldLabel>Complemento</FieldLabel>
                    <Input
                      placeholder="Apto, bloco, casa..."
                      value={editComplement}
                      onChange={(e) => setEditComplement(e.target.value)}
                    />
                  </FieldGroup>

                  <FieldGroup>
                    <FieldLabel>
                      Bairro <span style={{ color: "red" }}>*</span>
                    </FieldLabel>
                    <Input
                      placeholder="Bairro"
                      value={editNeighborhood}
                      onChange={(e) => setEditNeighborhood(e.target.value)}
                      style={{ borderColor: validationErrors.neighborhood ? "red" : undefined }}
                    />
                    {validationErrors.neighborhood && <FieldError>{validationErrors.neighborhood}</FieldError>}
                  </FieldGroup>

                  <FieldGroup style={{ gridColumn: "span 3" }}>
                    <FieldLabel>
                      Cidade / Município <span style={{ color: "red" }}>*</span>
                    </FieldLabel>
                    <SelectModalEdit
                      showSearch
                      value={editCityId || undefined}
                      onChange={(value) => setEditCityId(value as string)}
                      placeholder="Selecione a cidade do endereço"
                      style={{ borderColor: validationErrors.cityId ? "red" : undefined }}
                      filterOption={(input, option) =>
                        (option?.children as unknown as string)
                          .toLowerCase()
                          .indexOf(input.toLowerCase()) >= 0
                      }
                    >
                      {cities.map((city) => (
                        <Option key={city.id} value={city.id}>
                          {city.name}
                        </Option>
                      ))}
                    </SelectModalEdit>
                    {validationErrors.cityId && <FieldError>{validationErrors.cityId}</FieldError>}
                  </FieldGroup>
                </FormGrid>
              </FormCard>
            </div>
          )}

          {/* PASSO 3: DADOS DO VEÍCULO */}
          {currentStep === 2 && (
            <div>
              <FormCard>
                <FormSectionHeader>
                  <CarOutlined />
                  <h3>Dados do Veículo Vinculado</h3>
                  <span>Identificação e registro do veículo</span>
                </FormSectionHeader>

                <FormGrid columns={3}>
                  <FieldGroup>
                    <FieldLabel>
                      Ano do Veículo <span style={{ color: "red" }}>*</span>
                    </FieldLabel>
                    <Input
                      maxLength={4}
                      placeholder="Ex: 2021"
                      value={editYear}
                      onChange={(e) => setEditYear(e.target.value)}
                      style={{ borderColor: validationErrors.year ? "red" : undefined }}
                    />
                    {validationErrors.year && <FieldError>{validationErrors.year}</FieldError>}
                  </FieldGroup>

                  <FieldGroup>
                    <FieldLabel>
                      Placa <span style={{ color: "red" }}>*</span>
                    </FieldLabel>
                    <Input
                      placeholder="ABC1D23 ou ABC-1234"
                      value={editPlate}
                      onChange={(e) => {
                        const maskedPlate = applyPlateMask(e.target.value);
                        setEditPlate(maskedPlate);
                      }}
                      onBlur={() => {
                        const errors = { ...validationErrors };
                        if (!validatePlate(editPlate)) {
                          errors.plate = "Placa inválida.";
                        } else {
                          delete errors.plate;
                        }
                        setValidationErrors(errors);
                      }}
                      style={{ borderColor: validationErrors.plate ? "red" : undefined }}
                    />
                    {validationErrors.plate && <FieldError>{validationErrors.plate}</FieldError>}
                  </FieldGroup>

                  <FieldGroup>
                    <FieldLabel>
                      Renavam <span style={{ color: "red" }}>*</span>
                    </FieldLabel>
                    <Input
                      placeholder="Código Renavam"
                      value={editRenavam}
                      onChange={(e) => setEditRenavam(e.target.value)}
                      style={{ borderColor: validationErrors.renavam ? "red" : undefined }}
                    />
                    {validationErrors.renavam && <FieldError>{validationErrors.renavam}</FieldError>}
                  </FieldGroup>

                  <FieldGroup>
                    <FieldLabel>
                      Marca <span style={{ color: "red" }}>*</span>
                    </FieldLabel>
                    <Input
                      placeholder="Ex: Chevrolet, Toyota..."
                      value={editBrand}
                      onChange={(e) => setEditBrand(e.target.value)}
                      style={{ borderColor: validationErrors.brand ? "red" : undefined }}
                    />
                    {validationErrors.brand && <FieldError>{validationErrors.brand}</FieldError>}
                  </FieldGroup>

                  <FieldGroup>
                    <FieldLabel>
                      Modelo <span style={{ color: "red" }}>*</span>
                    </FieldLabel>
                    <Input
                      placeholder="Ex: Onix Plus, Corolla..."
                      value={editModel}
                      onChange={(e) => setEditModel(e.target.value)}
                      style={{ borderColor: validationErrors.model ? "red" : undefined }}
                    />
                    {validationErrors.model && <FieldError>{validationErrors.model}</FieldError>}
                  </FieldGroup>

                  <FieldGroup>
                    <FieldLabel>
                      Cor <span style={{ color: "red" }}>*</span>
                    </FieldLabel>
                    <Input
                      placeholder="Ex: Prata, Branco, Preto..."
                      value={editColor}
                      onChange={(e) => setEditColor(e.target.value)}
                      style={{ borderColor: validationErrors.color ? "red" : undefined }}
                    />
                    {validationErrors.color && <FieldError>{validationErrors.color}</FieldError>}
                  </FieldGroup>
                </FormGrid>
              </FormCard>
            </div>
          )}

          {/* PASSO 4: REVISÃO GERAL */}
          {currentStep === 3 && (
            <div>
              <div style={{ marginBottom: 14 }}>
                <span style={{ fontSize: 14, fontWeight: 700, color: "#1e293b" }}>
                  Revisão das Configurações
                </span>
                <p style={{ margin: "2px 0 0 0", fontSize: 12.5, color: "#64748b" }}>
                  Verifique atentamente os dados antes de gravar as alterações.
                </p>
              </div>

              <SummaryOverviewGrid>
                {/* Card 1: Motorista */}
                <SummaryCard>
                  <SummaryCardHeader>
                    <h4>
                      <UserOutlined /> Dados Pessoais
                    </h4>
                    <Button size="small" type="link" onClick={() => setCurrentStep(0)}>
                      Editar
                    </Button>
                  </SummaryCardHeader>
                  <SummaryRow>
                    <span className="label">Nome:</span>
                    <span className="val">{editName || "—"}</span>
                  </SummaryRow>
                  <SummaryRow>
                    <span className="label">CPF/CNPJ:</span>
                    <span className="val">{editDocument || "—"}</span>
                  </SummaryRow>
                  <SummaryRow>
                    <span className="label">Telefone:</span>
                    <span className="val">{editPhone || "—"}</span>
                  </SummaryRow>
                  <SummaryRow>
                    <span className="label">E-mail:</span>
                    <span className="val">{editEmail || "—"}</span>
                  </SummaryRow>
                  <SummaryRow>
                    <span className="label">Tipo:</span>
                    <span className="val">{currentUserTypeName}</span>
                  </SummaryRow>
                  <SummaryRow>
                    <span className="label">CNH:</span>
                    <span className="val">{editCnh || "—"}</span>
                  </SummaryRow>
                </SummaryCard>

                {/* Card 2: Endereço */}
                <SummaryCard>
                  <SummaryCardHeader>
                    <h4>
                      <HomeOutlined /> Endereço
                    </h4>
                    <Button size="small" type="link" onClick={() => setCurrentStep(1)}>
                      Editar
                    </Button>
                  </SummaryCardHeader>
                  <SummaryRow>
                    <span className="label">CEP:</span>
                    <span className="val">{editZipCode || "—"}</span>
                  </SummaryRow>
                  <SummaryRow>
                    <span className="label">Logradouro:</span>
                    <span className="val">{editStreet ? `${editStreet}, ${editNumber || "S/N"}` : "—"}</span>
                  </SummaryRow>
                  <SummaryRow>
                    <span className="label">Complemento:</span>
                    <span className="val">{editComplement || "—"}</span>
                  </SummaryRow>
                  <SummaryRow>
                    <span className="label">Bairro:</span>
                    <span className="val">{editNeighborhood || "—"}</span>
                  </SummaryRow>
                  <SummaryRow>
                    <span className="label">Cidade:</span>
                    <span className="val">{currentCityName}</span>
                  </SummaryRow>
                </SummaryCard>

                {/* Card 3: Veículo */}
                <SummaryCard>
                  <SummaryCardHeader>
                    <h4>
                      <CarOutlined /> Veículo
                    </h4>
                    <Button size="small" type="link" onClick={() => setCurrentStep(2)}>
                      Editar
                    </Button>
                  </SummaryCardHeader>
                  <SummaryRow>
                    <span className="label">Marca:</span>
                    <span className="val">{editBrand || "—"}</span>
                  </SummaryRow>
                  <SummaryRow>
                    <span className="label">Modelo:</span>
                    <span className="val">{editModel || "—"}</span>
                  </SummaryRow>
                  <SummaryRow>
                    <span className="label">Ano:</span>
                    <span className="val">{editYear || "—"}</span>
                  </SummaryRow>
                  <SummaryRow>
                    <span className="label">Placa:</span>
                    <span className="val" style={{ fontWeight: 700, color: "#0284c7" }}>
                      {editPlate || "—"}
                    </span>
                  </SummaryRow>
                  <SummaryRow>
                    <span className="label">Cor:</span>
                    <span className="val">{editColor || "—"}</span>
                  </SummaryRow>
                  <SummaryRow>
                    <span className="label">Renavam:</span>
                    <span className="val">{editRenavam || "—"}</span>
                  </SummaryRow>
                </SummaryCard>
              </SummaryOverviewGrid>
            </div>
          )}
        </ContentModalEdit>

        <ModalChangedPhoto
          handlePrepareEditModal={handlePrepareEditModal}
          visible={visibleModalChangePhoto}
          setVisible={setVisibleModalChangePhoto}
          driverSelected={driverSelected}
        />
        {driverSelected?.idDriver && (
          <ProfilePhotoEditModal
            visible={visibleProfilePhotoEditModal}
            onClose={() => setVisibleProfilePhotoEditModal(false)}
            entityType="driver"
            entityId={driverSelected.idDriver}
            currentImageUrl={driverImgUrl}
            onSuccess={() => handlePrepareEditModal(driverSelected.idDriver)}
          />
        )}
      </Modal>
    </>
  );
};

export default EditDataModal;
