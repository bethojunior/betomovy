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
  cities?: [];
  created_at?: string;
  id: number;
  isRoot?: boolean;
  name: string;
  statusId?: number;
  support?: boolean;
  updated_at?: string;
}

const DEFAULT_ROLES: ListProfile[] = [
  { id: 1, name: "Administrador" },
  { id: 2, name: "Gestor" },
  { id: 3, name: "Suporte" },
];

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
    type_account: yup.mixed().required("Campo obrigatório"),
  })
  .required();

type SchemaFormType = yup.InferType<typeof schemaForm>;

const NewUserModal: FC<ModalProps> = ({ visible, setVisible, loadUsers }) => {
  const { control, setValue, handleSubmit, resetField } =
    useForm<SchemaFormType>({
      resolver: yupResolver(schemaForm),
    });

  const [loading, setLoading] = useState(false);
  const [loadingRoles, setLoadingRoles] = useState(false);

  const [listTypeProfile, setListTypeProfile] = useState<ListProfile[]>(DEFAULT_ROLES);

  const { checkCpfIsValue } = Utils;

  const loadRoles = async () => {
    try {
      setLoadingRoles(true);
      const userStorage = localStorage.getItem("@App:user");
      const headers: Record<string, string> = {};
      if (userStorage && userStorage !== "undefined" && userStorage !== "null") {
        try {
          const u = JSON.parse(userStorage);
          if (u?.api_token) headers.token = u.api_token;
          if (u?.idUser) {
            headers.userid = String(u.idUser);
            headers.userId = String(u.idUser);
          }
        } catch (e) {}
      }

      const result = await api.get("role", { headers });
      const raw = result?.data?.response ?? result?.data?.data ?? result?.data;
      if (Array.isArray(raw) && raw.length > 0) {
        setListTypeProfile(raw);
      } else if (Array.isArray(raw?.data) && raw.data.length > 0) {
        setListTypeProfile(raw.data);
      } else {
        setListTypeProfile(DEFAULT_ROLES);
      }
    } catch (error) {
      console.error("Erro ao carregar perfis, usando perfis padrao:", error);
      setListTypeProfile(DEFAULT_ROLES);
    } finally {
      setLoadingRoles(false);
    }
  };

  useEffect(() => {
    if (visible) {
      loadRoles();
    }
  }, [visible]);

  useEffect(() => {
    loadRoles();
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
      const responseRegisterUser = await api.post("admin", {
        name,
        nickname,
        email,
        phone,
        document,
        password,
        confirmationPassword: confirm_password,
        roleId: Number(type_account),
      });

      if (responseRegisterUser.status === 200 || responseRegisterUser.status === 201 || responseRegisterUser.data?.status) {
        swal({
          title: "Sucesso",
          text: "Usuário criado com sucesso",
          icon: "success",
        }).then((isAccept) => {
          handleCloseModal();
          loadUsers();
        });
      }
    } catch (error) {
      const responseError = error as AxiosError<{ message?: string }>;
      swal({
        title: "Erro",
        text: responseError.response?.data?.message || "Erro ao criar usuário.",
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
              {(() => {
                const rolesToRender = (listTypeProfile && listTypeProfile.length > 0) ? listTypeProfile : DEFAULT_ROLES;
                return (
                  <Select
                    value={value}
                    onChange={onChange}
                    style={{ width: "100%" }}
                    status={Boolean(error) ? "error" : ""}
                    placeholder="Selecione o perfil"
                    loading={loadingRoles}
                    options={rolesToRender.map((item) => ({
                      label: item.name,
                      value: item.id,
                    }))}
                    onDropdownVisibleChange={(open) => {
                      if (open && listTypeProfile.length === 0) {
                        loadRoles();
                      }
                    }}
                    notFoundContent={loadingRoles ? "Carregando perfis..." : "Nenhum perfil encontrado"}
                  >
                    {rolesToRender.map((item) => {
                      return (
                        <Option key={item.id} value={item.id}>
                          {item.name}
                        </Option>
                      );
                    })}
                  </Select>
                );
              })()}
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
