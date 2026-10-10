import { AxiosError } from "axios";
import swal from "sweetalert";
import { Button, Input, Modal, Select } from "antd";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { FC, useEffect, useState } from "react";
import api from "../../../../../../services/api";
import Mask from "../../../../../../services/Mask";
import {
  Title,
  Section,
  SideBySide,
  FooterModal,
  MessageError,
} from "./styles";
import apiSpeedmob from "../../../../../../services/apiSpeedmob";
import Session from "../../../../../../utils/Session";
import Utils from "../../../../../../utils/Utils";

const { Option } = Select;

interface ListProfileArray extends Array<ListProfile> {}

interface ListProfile {
  cities: [];
  created_at: string;
  id: number;
  isRoot: boolean;
  name: string;
  statusId: number;
  support: boolean;
  updated_at: string;
}

interface ModalProps {
  visible: boolean;
  setVisible(value: boolean): void;
  loadUsers: () => void;
}

const schemaForm = yup
  .object({
    name: yup.string().required("Campo obrigatório"),
    nickname: yup.string().required("Campo obrigatório"),
    email: yup
      .string()
      .matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Este campo é do tipo email")
      .required("Campo obrigatório"),
    phone: yup
      .string()
      .min(11, "Telefone deve ter 11 caracteres")
      .required("Campo obrigatório"),
    document: yup
      .string()
      .min(11, "CPF deve ter 11 dígitos")
      .required("Campo obrigatório"),
    password: yup
      .string()
      .min(6, "Senha precisa ter no mínimo 6 caracteres")
      .required("Campo obrigatório"),
    confirm_password: yup
      .string()
      .min(6, "Confirmação de senha precisa ter no mínimo 6 caracteres")
      .required("Campo obrigatório"),
    type_account: yup.string().required("Campo obrigatório"),
  })
  .required();

type SchemaFormType = yup.InferType<typeof schemaForm>;

const NewUserModal: FC<ModalProps> = ({ visible, setVisible, loadUsers }) => {
  const { control, setValue, handleSubmit, resetField } =
    useForm<SchemaFormType>({
      resolver: yupResolver(schemaForm),
    });

  const [loading, setLoading] = useState(false);

  const [listTypeProfile, setListTypeProfile] = useState<ListProfileArray>([]);

  const { checkCpfIsValue } = Utils;

  useEffect(() => {
    api("role").then((result) => {
      if (!result?.data?.status) {
        return "";
      }

      return setListTypeProfile(result.data.response || result.data.data || []);
    }).catch(() => {});
  }, []);

  const handleCloseModal = () => {
    setVisible(false);

    resetField("name");
    resetField("email");
    resetField("type_account");
    resetField("phone");
    resetField("nickname");
    resetField("document");
    resetField("password");
    resetField("confirm_password");
  };

  const registerUser = async (datas: SchemaFormType) => {
    const {
      name,
      nickname,
      email,
      document,
      password,
      confirm_password,
      phone,
      type_account,
    } = datas;

    if (password !== confirm_password) {
      swal({
        title: "Aviso",
        text: "O campo confirmação de senha não é igual ao o campo senha.",
        icon: "warning",
      });
      return;
    }

    if (!checkCpfIsValue(document)) {
      swal({
        title: "Alerta",
        text: "O CPF inserido é inválido",
        icon: "warning",
      });
      return;
    }

    try {
      setLoading(true);
      const responseRegisterUser = await api.post("admin/", {
        name,
        nickname,
        email,
        phone,
        document,
        password,
        confirmationPassword: confirm_password,
        roleId: type_account,
      });

      if (responseRegisterUser.status) {
        swal({
          title: "Sucesso",
          text: "Usuário criado com sucesso",
          icon: "success",
        }).then((isAccept) => {
          if (isAccept) {
            handleCloseModal();
            loadUsers();
          }
        });
      }
    } catch (error) {
      const responseError = error as AxiosError;
      swal({
        title: "Error",
        text: responseError.response?.data.message,
        icon: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const registerUserSpeedmob = async (datas: SchemaFormType) => {
    const { name, nickname, email, password, phone } = datas;

    try {
      const responseUserSpeedmob = await apiSpeedmob.post("login/Register", {
        franchise_id: Session.getLocal("franchise_id"),
        user_type_id: 1,
        is_owner: 1,
        name,
        nickname,
        email,
        phone,
        password,
        gender: "outros",
      });

      if (responseUserSpeedmob.status) {
        registerUser(datas);
      }
    } catch (error) {
      const responseError = error as AxiosError;
      swal({
        title: "Error",
        text: responseError.response?.data.message,
        icon: "error",
      });
    }
  };

  return (
    <Modal
      title="Adicionar novo usuário"
      open={visible}
      onCancel={handleCloseModal}
      footer={[]}
    >
      <form
        onSubmit={handleSubmit(
          import.meta.env.ISSPEEDMOB == "true"
            ? registerUserSpeedmob
            : registerUser
        )}
      >
        <Controller
          control={control}
          name="name"
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <>
              <Title>Nome</Title>
              <Input
                value={value}
                onChange={onChange}
                status={Boolean(error) ? "error" : ""}
              />
              {error && <MessageError>{error.message}</MessageError>}
            </>
          )}
        />

        <Controller
          control={control}
          name="nickname"
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <>
              <Title>Apelido</Title>
              <Input
                value={value}
                onChange={onChange}
                status={Boolean(error) ? "error" : ""}
              />
              {error && <MessageError>{error.message}</MessageError>}
            </>
          )}
        />

        <Controller
          control={control}
          name="email"
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <>
              <Title>E-mail</Title>
              <Input
                value={value}
                onChange={onChange}
                status={Boolean(error) ? "error" : ""}
              />
              {error && <MessageError>{error.message}</MessageError>}
            </>
          )}
        />

        <SideBySide>
          <Controller
            control={control}
            name="phone"
            render={({ field: { value }, fieldState: { error } }) => (
              <Section>
                <Title>Telefone</Title>
                <Input
                  value={value}
                  onChange={(event) =>
                    setValue(
                      "phone",
                      Mask.setMaskPhoneValue(event.target.value)
                    )
                  }
                  status={Boolean(error) ? "error" : ""}
                />
                {error && <MessageError>{error.message}</MessageError>}
              </Section>
            )}
          />

          <Controller
            control={control}
            name="document"
            render={({ field: { value }, fieldState: { error } }) => (
              <Section>
                <Title>CPF</Title>
                <Input
                  value={value}
                  maxLength={14}
                  onChange={(event) => {
                    setValue(
                      "document",
                      Mask.setMaskCPFCNPJ(event.target.value)
                    );
                  }}
                  status={Boolean(error) ? "error" : ""}
                />
                {error && <MessageError>{error.message}</MessageError>}
              </Section>
            )}
          />
        </SideBySide>
        <SideBySide>
          <Controller
            control={control}
            name="password"
            render={({ field: { value, onChange }, fieldState: { error } }) => (
              <Section>
                <Title>Senha</Title>
                <Input
                  type="password"
                  value={value}
                  onChange={onChange}
                  status={Boolean(error) ? "error" : ""}
                />
                {error && <MessageError>{error.message}</MessageError>}
              </Section>
            )}
          />

          <Controller
            control={control}
            name="confirm_password"
            render={({ field: { value, onChange }, fieldState: { error } }) => (
              <Section>
                <Title>Senha de cofirmação</Title>
                <Input
                  type="password"
                  value={value}
                  onChange={onChange}
                  status={Boolean(error) ? "error" : ""}
                />
                {error && <MessageError>{error.message}</MessageError>}
              </Section>
            )}
          />
        </SideBySide>

        <Controller
          control={control}
          name="type_account"
          render={({ field: { value, onChange }, fieldState: { error } }) => (
            <>
              <Title>Perfil</Title>
              <Select
                value={value}
                onChange={onChange}
                style={{ width: "100%" }}
                status={Boolean(error) ? "error" : ""}
                placeholder="Perfil"
              >
                {listTypeProfile.map((item) => {
                  return (
                    <Option key={item.id} value={item.id}>
                      {item.name}
                    </Option>
                  );
                })}
              </Select>
              {error && <MessageError>{error.message}</MessageError>}
            </>
          )}
        />

        <FooterModal>
          <Button
            style={{
              width: "100px",
            }}
            onClick={handleCloseModal}
          >
            Cancelar
          </Button>

          <Button
            style={{
              width: "100px",
            }}
            htmlType="submit"
            type="primary"
            loading={loading}
          >
            Criar
          </Button>
        </FooterModal>
      </form>
    </Modal>
  );
};

export default NewUserModal;
