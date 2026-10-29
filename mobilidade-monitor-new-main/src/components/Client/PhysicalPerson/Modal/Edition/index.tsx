import { useState, FC, useEffect } from "react";
import { Button, Select } from "antd";
import {
  FiUser,
  FiHash,
  FiMail,
  FiPhone,
  FiUsers,
  FiEdit2,
} from "react-icons/fi";
import swal from "sweetalert";
import Mask from "../../../../../services/Mask";
import Utils from "../../../../../utils/Utils";
import Preload from "../../../../Utils/Preload";
import { useForm } from "../../../../../hooks/form";
import Alert from "../../../../Utils/Alert";
import api from "../../../../../services/api";
import { ProfilePhotoEditModal } from "../../../../Shared/ProfilePhotoEditModal";
import { getCustomerPhotoUrl } from "../../../../../utils/imageUtils";
import AvatarDefault from "../../../../../assets/avatar.png";
import {
  InputEdit,
  GenderSelect,
  ModalOfEdition,
  InputLabelOfEdition,
  ErrorForm,
  InputPhone,
  ProfileImagePreview,
  ProfileImageSection,
  ProfileImageWrapper,
  EditPhotoButton,
  FieldIcon,
} from "./styles";
import {
  ListClientGroup,
  ModalProps,
  UpdateCustomerPayload,
} from "./types";

const { Option } = Select;

const ModalEditCustomer: FC<ModalProps> = ({
  item,
  active,
  cancelVisible,
  reSearch,
  statusRequest,
}) => {
  const [loading, setLoading] = useState(false);
  const [visibleProfilePhotoEditModal, setVisibleProfilePhotoEditModal] =
    useState(false);
  const [genderSelected, setGenderSelected] = useState(item?.gender || "");
  const [phoneValue, setPhoneValue] = useState(item?.phone || "");
  const [showAlert, setShowAlert] = useState(false);
  const [messageAlert, setMessageAlert] = useState("");
  const [typeAlert, setTypeAlert] = useState<
    "success" | "info" | "warning" | "error"
  >("success");
  const {
    handleChange,
    handleSubmit,
    data: customerData,
    errors,
    setData,
  } = useForm<{ name: string; document: string; email: string; phone: string }>({
    initialValues: {
      name: item?.name || "",
      document: item?.document || "",
      email: item?.email || "",
      phone: item?.phone || "",
    },
    validations: {
      name: {
        required: {
          value: true,
          message: "Por favor, insira um nome",
        },
      },
      document: {
        required: {
          value: true,
          message: "Por favor, insira um CPF",
        },
      },
      email: {
        required: {
          value: true,
          message: "Por favor, insira um email",
        },
      },
      phone: {
        required: {
          value: true,
          message: "Por favor, insira um telefone",
        },
      },
    },
    onSubmit: () => {
      if (!Utils.checkIfPhoneNumberIsValid((phoneValue || "") as string)) {
        setLoading(false);
        setTypeAlert("warning");
        setMessageAlert("O telefone informado é inválido");
        setShowAlert(true);
        return;
      }

      if (!Utils.checkIfEmailIsValid((customerData.email || "") as string)) {
        setLoading(false);
        setTypeAlert("warning");
        setMessageAlert("Digite um e-mail válido");
        setShowAlert(true);
        return;
      }
      setLoading(true);

      const payload: UpdateCustomerPayload = {
        document: customerData.document as string,
        email: customerData.email as string,
        gender: genderSelected,
        idCustomer: Number(item.idCustomer),
        name: customerData?.name as string,
        phone: phoneValue,
      };

      api
        .put<ListClientGroup>(`/customer/${item.idCustomer}`, payload)
        .then((values) => {
          setLoading(false);
          if (values.data.status) {
            swal({
              title: `Informações alteradas com sucesso`,
              text: "",
              icon: "success",
            }).then(() => {
              cancelVisible();
              reSearch();
              statusRequest(true);
            });
          } else {
            const apiMessages: string[] = Array.isArray(values.data.response)
              ? values.data.response
              : [];
            setTypeAlert("error");
            setMessageAlert(
              apiMessages.length > 0
                ? apiMessages.join(" | ")
                : "Não foi possível atualizar os dados, tente novamente"
            );
            setShowAlert(true);
          }
        })
        .catch((error) => {
          setLoading(false);
          const apiMessages: string[] = error?.response?.data?.response;
          setTypeAlert("error");
          setMessageAlert(
            Array.isArray(apiMessages) && apiMessages.length > 0
              ? apiMessages.join(" | ")
              : "Erro ao atualizar os dados, tente novamente"
          );
          setShowAlert(true);
        });
    },
  });

  useEffect(() => {
    if (!item) return;
    setPhoneValue(item.phone ? Mask.setMaskPhoneValue(item.phone) : "");
    setGenderSelected(item.gender as string);
    setData({
      name: item.name,
      document: item.document,
      email: item.email,
      phone: item.phone,
    });
  }, [item, setData]);

  return (
    <>
      <Alert
        visibility={showAlert}
        setVisibility={setShowAlert}
        message={messageAlert}
        typeAlert={typeAlert}
      />
      <ModalOfEdition
        onCancel={cancelVisible}
        visible={active}
        footer={[
          <Button key="back" onClick={cancelVisible}>
            Voltar
          </Button>,
          <Button
            form={`formEdit${item?.idCustomer}`}
            key="submit"
            type="primary"
            htmlType="submit"
          >
            Salvar
          </Button>,
        ]}
      >
        <Preload visible={loading} />
        <ProfileImageSection>
          <ProfileImageWrapper>
            <ProfileImagePreview
              src={getCustomerPhotoUrl(item?.profileImage) || AvatarDefault}
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = AvatarDefault;
              }}
            />
            <EditPhotoButton
              shape="circle"
              type="default"
              icon={<FiEdit2 size={16} />}
              onClick={() => setVisibleProfilePhotoEditModal(true)}
            />
          </ProfileImageWrapper>
        </ProfileImageSection>
        <form
          id={`formEdit${item?.idCustomer}`}
          onSubmit={(e) => handleSubmit(e)}
        >
          <InputLabelOfEdition>Nome: </InputLabelOfEdition>
          <InputEdit
            name="name"
            prefix={
              <FieldIcon>
                <FiUser size={16} />
              </FieldIcon>
            }
            value={customerData?.name as string}
            onChange={handleChange("name")}
          />
          {errors.name && (
            <ErrorForm className="error">{errors.name}</ErrorForm>
          )}
          <InputLabelOfEdition>CPF: </InputLabelOfEdition>
          <InputEdit
            name="document"
            maxLength={14}
            prefix={
              <FieldIcon>
                <FiHash size={16} />
              </FieldIcon>
            }
            value={
              customerData?.document &&
              Mask.setMaskCPFCNPJ(customerData?.document as string)
            }
            onChange={handleChange("document")}
          />
          {errors.name && (
            <ErrorForm className="error">{errors?.document}</ErrorForm>
          )}
          <InputLabelOfEdition>E-mail: </InputLabelOfEdition>
          <InputEdit
            name="email"
            prefix={
              <FieldIcon>
                <FiMail size={16} />
              </FieldIcon>
            }
            value={customerData?.email as string}
            onChange={handleChange("email")}
          />
          {errors.name && (
            <ErrorForm className="error">{errors?.email}</ErrorForm>
          )}
          <InputLabelOfEdition>Telefone: </InputLabelOfEdition>
          <InputPhone
            prefix={
              <FieldIcon>
                <FiPhone size={16} />
              </FieldIcon>
            }
            value={phoneValue}
            onChange={(event) =>
              setPhoneValue(Mask.setMaskPhoneValue(event.target.value))
            }
          />
          {errors.name && (
            <ErrorForm className="error">{errors?.phone}</ErrorForm>
          )}
          <InputLabelOfEdition>Gênero: </InputLabelOfEdition>
        </form>
        <GenderSelect
          prefix={
            <FieldIcon>
              <FiUsers size={16} />
            </FieldIcon>
          }
          value={genderSelected}
          onChange={(value) => setGenderSelected(String(value))}
        >
          <Option value="Masculino">Masculino</Option>
          <Option value="Feminino">Feminino</Option>
        </GenderSelect>
      </ModalOfEdition>
      {item?.idCustomer && (
        <ProfilePhotoEditModal
          visible={visibleProfilePhotoEditModal}
          onClose={() => setVisibleProfilePhotoEditModal(false)}
          entityType="customer"
          entityId={item.idCustomer}
          currentImageUrl={getCustomerPhotoUrl(item?.profileImage)}
          onSuccess={reSearch}
        />
      )}
    </>
  );
};
export default ModalEditCustomer;
