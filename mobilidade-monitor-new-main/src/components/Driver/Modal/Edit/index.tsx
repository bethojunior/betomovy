import { FC, useContext, useEffect, useState } from "react";
import { Button, Image, Input, Modal, Select } from "antd";
import swal from "sweetalert";
import { SelectValue } from "antd/lib/select";
import {
  ContentModalEdit,
  ModalEditSectionImage,
  ModalEditStatusDriver,
  ModalEditSectionInformation,
  SectionInformation,
  ModalEditLabel,
  SelectModalEdit,
  InputPhone,
  ModalEditSectionAddress,
  ModalEditSection,
} from "./styles";
import api from "../../../../services/api";
import apiv1 from "../../../../services/apiv1";
import Preload from "../../../Utils/Preload";
import Alert from "../../../Utils/Alert";
import Mask from "../../../../services/Mask";
import Utils from "../../../../utils/Utils";
import cep from "cep-promise";

import { ModalChangedPhoto } from "../ModalChangedPhoto";
import { ProfilePhotoEditModal } from "../../../Shared/ProfilePhotoEditModal";
import { ZafiraValidationStatus } from "../../../Utils/ZafiraValidationStatus";
import { useZafiraValidationReset } from "../../../../hooks/useZafiraValidationReset";
import AuthContext from "../../../../contexts/auth";
import { ZAFIRA, ZAFIRA_VISUALIZAR_VALIDACAO } from "../../../../constants/permissions";
import { City, ModalProps } from "./types";

const initialAddress = {
  zipCode: "",
  street: "",
  number: "",
  complement: "",
  cityId: "",
  neighborhood: "",
};

const { Option } = Select;

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
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
      setMessageAlert("Por favor, preencha todos os campos obrigatórios.");
      setShowAlert(true);
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
            : "Erro ao atualizar os dados, tente novamente"
        );
      });
  };

  const handleRequestNewPhoto = (idDriver: number | undefined) => {
    swal({
      title: "Você realmente deseja solicitar uma nova foto?",
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
        title="Edição de dados"
        visible={visibility}
        width={800}
        onCancel={() => {
          handleCloseModal();
          setIfSelectModalEditIsChanged(0);
        }}
        footer={[
          <Button
            key="back"
            onClick={() => {
              handleCloseModal();
              setIfSelectModalEditIsChanged(0);
            }}
          >
            Voltar
          </Button>,
          <Button
            type="primary"
            key="submit"
            style={{ marginRight: "10px" }}
            onClick={() => handleEditDriverData()}
          >
            Salvar
          </Button>,
        ]}
      >
        <ContentModalEdit>
          <ModalEditSection>
            <ModalEditSectionImage>
              <ModalEditStatusDriver status={driverSelected?.registerStatus}>
                {driverSelected?.registerStatus}
              </ModalEditStatusDriver>
              <Image
                width={200}
                height={200}
                style={{ borderRadius: 10, objectFit: "cover" }}
                src={baseImageLink + driverSelected.profileImage}
              />
              <Button
                onClick={() => handleRequestNewPhoto(driverSelected?.idDriver)}
                type="link"
              >
                Solicitar nova foto
              </Button>
              <Button
                onClick={() => setVisibleProfilePhotoEditModal(true)}
                type="link"
              >
                Editar foto de perfil
              </Button>
              {driverSelected.profileImageTemp !== null ? (
                <Button
                  onClick={() => setVisibleModalChangePhoto(true)}
                  type="link"
                >
                  Verificar mudança na imagem de perfil
                </Button>
              ) : null}
            </ModalEditSectionImage>
            <ModalEditSectionInformation>
              <h3>
                <b>Dados Pessoais</b>
              </h3>
              <SectionInformation>
                <div>
                  <ModalEditLabel>Nome</ModalEditLabel>
                  <Input
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    style={{
                      borderColor: validationErrors.name ? "red" : undefined,
                    }}
                  />
                  {validationErrors.name && (
                    <p style={{ color: "red" }}>{validationErrors.name}</p>
                  )}
                </div>
                <div>
                  <ModalEditLabel>CPF/CNPJ</ModalEditLabel>
                  <Input
                    maxLength={18}
                    value={editDocument}
                    onChange={(e) =>
                      setEditDocument(Mask.setMaskCPFCNPJ(e.target.value))
                    }
                    style={{
                      borderColor: validationErrors.document
                        ? "red"
                        : undefined,
                    }}
                  />
                  {validationErrors.document && (
                    <p style={{ color: "red" }}>{validationErrors.document}</p>
                  )}
                </div>
              </SectionInformation>
              <SectionInformation>
                <div>
                  <ModalEditLabel>Apelido</ModalEditLabel>
                  <Input
                    value={editNickname}
                    onChange={(e) => setEditNickname(e.target.value)}
                    style={{
                      borderColor: validationErrors.nickname
                        ? "red"
                        : undefined,
                    }}
                  />
                  {validationErrors.nickname && (
                    <p style={{ color: "red" }}>{validationErrors.nickname}</p>
                  )}
                </div>
                <div>
                  <ModalEditLabel>CNH</ModalEditLabel>
                  <Input
                    maxLength={11}
                    value={editCnh}
                    onChange={(e) => setEditCnh(e.target.value)}
                    style={{
                      borderColor: validationErrors.cnh ? "red" : undefined,
                    }}
                  />
                  {validationErrors.cnh && (
                    <p style={{ color: "red" }}>{validationErrors.cnh}</p>
                  )}
                </div>
              </SectionInformation>
              <SectionInformation>
                <div>
                  <ModalEditLabel>E-mail</ModalEditLabel>
                  <Input
                    value={editEmail}
                    onChange={(e) => setEditEmail(e.target.value)}
                    style={{
                      borderColor: validationErrors.email ? "red" : undefined,
                    }}
                  />
                  {validationErrors.email && (
                    <p style={{ color: "red" }}>{validationErrors.email}</p>
                  )}
                </div>
                <div>
                  <ModalEditLabel>Telefone</ModalEditLabel>
                  <InputPhone
                    value={editPhone}
                    onChange={(event) =>
                      setEditPhone(Mask.setMaskPhoneValue(event.target.value))
                    }
                    style={{
                      borderColor: validationErrors.phone ? "red" : undefined,
                    }}
                  />
                  {validationErrors.phone && (
                    <p style={{ color: "red" }}>{validationErrors.phone}</p>
                  )}
                </div>
              </SectionInformation>
              <SectionInformation>
                <div>
                  <ModalEditLabel>Gênero</ModalEditLabel>
                  <SelectModalEdit
                    value={editGender}
                    onChange={(value) => setEditGender(value as string)}
                  >
                    <Option value="feminino">Feminino</Option>
                    <Option value="masculino">Masculino</Option>
                  </SelectModalEdit>
                </div>
                <div>
                  <ModalEditLabel>Tipo de motorista</ModalEditLabel>
                  <SelectModalEdit
                    value={
                      editTypeOfDriver !== "" && editTypeOfDriver !== undefined
                        ? Number(editTypeOfDriver)
                        : undefined
                    }
                    placeholder="Selecione o tipo de motorista"
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
                </div>
              </SectionInformation>
              <SectionInformation>
                <div>
                  <ModalEditLabel>Data de Nascimento</ModalEditLabel>
                  <Input
                    value={editDateOfBirth}
                    onChange={(e) => {
                      const inputDate = e.target.value;
                      const maskedDate = Mask.setMaskDate(inputDate);
                      setEditDateOfBirth(maskedDate);
                      validateDateOfBirth(maskedDate);
                    }}
                    style={{
                      borderColor: validationErrors.dateOfBirth
                        ? "red"
                        : undefined,
                    }}
                  />
                  {validationErrors.dateOfBirth && (
                    <p style={{ color: "red" }}>
                      {validationErrors.dateOfBirth}
                    </p>
                  )}
                </div>
              </SectionInformation>
              <SectionInformation>
                <div>
                  <ModalEditLabel>Cidade</ModalEditLabel>
                  <SelectModalEdit
                    showSearch
                    value={editCityId}
                    onChange={(value) => setEditCityId(value as string)}
                    placeholder="Selecione uma cidade"
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
                </div>
              </SectionInformation>
              {enableZafiraValidationMonitor && hasPermission(ZAFIRA, ZAFIRA_VISUALIZAR_VALIDACAO) && (
                <SectionInformation>
                  <ZafiraValidationStatus zafiraValidated={zafiraValidated} />
                </SectionInformation>
              )}

            </ModalEditSectionInformation>
          </ModalEditSection>
          <ModalEditSectionAddress>
            <h3>
              <b>Endereço</b>
            </h3>
            <SectionInformation>
              <div>
                <ModalEditLabel>CEP</ModalEditLabel>
                <Input
                  value={editZipCode}
                  onChange={(e) => handleCepChange(e.target.value)}
                  style={{
                    borderColor: validationErrors.zipCode ? "red" : undefined,
                  }}
                />
                {validationErrors.zipCode && (
                  <p style={{ color: "red" }}>{validationErrors.zipCode}</p>
                )}
              </div>
              <div>
                <ModalEditLabel>Rua</ModalEditLabel>
                <Input
                  value={editStreet}
                  onChange={(e) => setEditStreet(e.target.value)}
                  style={{
                    borderColor: validationErrors.street ? "red" : undefined,
                  }}
                />
                {validationErrors.street && (
                  <p style={{ color: "red" }}>{validationErrors.street}</p>
                )}
              </div>
              <div>
                <ModalEditLabel>Número</ModalEditLabel>
                <Input
                  value={editNumber}
                  onChange={(e) => setEditNumber(e.target.value)}
                  style={{
                    borderColor: validationErrors.number ? "red" : undefined,
                  }}
                />
                {validationErrors.number && (
                  <p style={{ color: "red" }}>{validationErrors.number}</p>
                )}
              </div>
            </SectionInformation>
            <SectionInformation>
              <div>
                <ModalEditLabel>Complemento</ModalEditLabel>
                <Input
                  value={editComplement}
                  onChange={(e) => setEditComplement(e.target.value)}
                />
              </div>
              <div>
                <ModalEditLabel>Bairro</ModalEditLabel>
                <Input
                  value={editNeighborhood}
                  onChange={(e) => setEditNeighborhood(e.target.value)}
                  style={{
                    borderColor: validationErrors.neighborhood
                      ? "red"
                      : undefined,
                  }}
                />
                {validationErrors.neighborhood && (
                  <p style={{ color: "red" }}>
                    {validationErrors.neighborhood}
                  </p>
                )}
              </div>
              <div>
                <ModalEditLabel>Cidade</ModalEditLabel>
                <SelectModalEdit
                  value={editCityId}
                  onChange={(value) => setEditCityId(value as string)}
                  style={{
                    borderColor: validationErrors.cityId ? "red" : undefined,
                  }}
                >
                  {cities.map((city) => (
                    <Option key={city.id} value={city.id}>
                      {city.name}
                    </Option>
                  ))}
                </SelectModalEdit>
                {validationErrors.cityId && (
                  <p style={{ color: "red" }}>{validationErrors.cityId}</p>
                )}
              </div>
            </SectionInformation>
          </ModalEditSectionAddress>
          <ModalEditSectionAddress>
            <h3>
              <b>Dados do Veículo</b>
            </h3>
            <SectionInformation>
              <div>
                <ModalEditLabel>Ano</ModalEditLabel>
                <Input
                  value={editYear}
                  onChange={(e) => setEditYear(e.target.value)}
                  style={{
                    borderColor: validationErrors.year ? "red" : undefined,
                  }}
                />
                {validationErrors.year && (
                  <p style={{ color: "red" }}>{validationErrors.year}</p>
                )}
              </div>
              <div>
                <ModalEditLabel>Placa</ModalEditLabel>
                <Input
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
                  style={{
                    borderColor: validationErrors.plate ? "red" : undefined,
                  }}
                />
                {validationErrors.plate && (
                  <p style={{ color: "red" }}>{validationErrors.plate}</p>
                )}
              </div>
            </SectionInformation>
            <SectionInformation>
              <div>
                <ModalEditLabel>Modelo</ModalEditLabel>
                <Input
                  value={editModel}
                  onChange={(e) => setEditModel(e.target.value)}
                  style={{
                    borderColor: validationErrors.model ? "red" : undefined,
                  }}
                />
                {validationErrors.model && (
                  <p style={{ color: "red" }}>{validationErrors.model}</p>
                )}
              </div>
              <div>
                <ModalEditLabel>Cor</ModalEditLabel>
                <Input
                  value={editColor}
                  onChange={(e) => setEditColor(e.target.value)}
                  style={{
                    borderColor: validationErrors.color ? "red" : undefined,
                  }}
                />
                {validationErrors.color && (
                  <p style={{ color: "red" }}>{validationErrors.color}</p>
                )}
              </div>
              <div>
                <ModalEditLabel>Marca</ModalEditLabel>
                <Input
                  value={editBrand}
                  onChange={(e) => setEditBrand(e.target.value)}
                  style={{
                    borderColor: validationErrors.brand ? "red" : undefined,
                  }}
                />
                {validationErrors.brand && (
                  <p style={{ color: "red" }}>{validationErrors.brand}</p>
                )}
              </div>
              <div>
                <ModalEditLabel>Renavam</ModalEditLabel>
                <Input
                  value={editRenavam}
                  onChange={(e) => setEditRenavam(e.target.value)}
                  style={{
                    borderColor: validationErrors.renavam ? "red" : undefined,
                  }}
                />
                {validationErrors.renavam && (
                  <p style={{ color: "red" }}>{validationErrors.renavam}</p>
                )}
              </div>
            </SectionInformation>
          </ModalEditSectionAddress>
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
            currentImageUrl={baseImageLink + driverSelected.profileImage}
            onSuccess={() => handlePrepareEditModal(driverSelected.idDriver)}
          />
        )}
      </Modal>
    </>
  );
};

export default EditDataModal;
