import { Button, Pagination, Table, TableProps, Input } from "antd";
import { IoMdSend } from "react-icons/io";
import { AiOutlineSearch, AiFillDelete } from "react-icons/ai";
import { RiFilterOffFill } from "react-icons/ri";
import { FaGear } from "react-icons/fa6";
import {
  Container,
  ContentActions,
  ContentBtnActionsFilter,
  ContentBtnSendGeneral,
  ContentHeader,
  ContentInput,
  ContentPagination,
  ContentTable,
  LabelText,
} from "./styles";
import { theme_colors } from "../../../../theme/theme";
import { IListPhonesDataProps } from "./types";
import { useContext, useEffect, useState } from "react";
import Alert from "../../../../components/Utils/Alert";
import Mask from "../../../../services/Mask";
import api from "../../../../services/api";
import { AxiosError } from "axios";
import { TableRowSelection } from "antd/es/table/interface";
import { CONFIGURACAO } from "../../../../constants/permissions";
import AuthContext from "../../../../contexts/auth";
import { useHistory } from "react-router-dom";
import { ModalConfigListPhones } from "../../../../components/Advanced/Config/ListPhones/ModalConfigListPhones";
import { IResponseConfigListContactsProps } from "src/components/Advanced/Config/ListPhones/ModalConfigListPhones/types";

type typesAlertStatusProps = "success" | "info" | "warning" | "error";

let last_page: number | null = null;

export function ListPhonesGeneral() {
  const [loading, setLoading] = useState<boolean>(false);
  const [listContacts, setListContacts] = useState<IListPhonesDataProps[]>([]);
  const [phoneSearch, setPhoneSearch] = useState<string | null>(null);
  const [nameSearch, setNameSearch] = useState<string | null>(null);

  const [contactsSelected, setContactsSelected] = useState<
    IListPhonesDataProps[]
  >([]);

  const [messageWpp, setMessageWpp] = useState<string | null>(null);

  const [message, setMessage] = useState<string>("");
  const [typeAlert, setTypeAlert] = useState<typesAlertStatusProps>("success");
  const [visibleAlert, setVisibleAlert] = useState<boolean>(false);

  const [visibleModalConfigListPhones, setVisibleModalConfigListPhones] =
    useState<boolean>(false);

  const { setMaskPhoneUniversal, setOnlyNumber, setMaskJustNumber } = Mask;

  const { hasPermission } = useContext(AuthContext);
  const history = useHistory();

  const hasPermissionVisualizeContacts = hasPermission(
    CONFIGURACAO,
    "visualize_list_contacts",
  );
  const hasPermissionSendLinksAppPartners = hasPermission(
    CONFIGURACAO,
    "send_links_app_partners",
  );

  const getConfigsListPhones = async () => {
    try {
      setLoading(true);
      const responseConfigListPhones = await api.get(
        "config_list_phone_general/config"
      );

      if (responseConfigListPhones.status) {
        const dataConfigListPhones: IResponseConfigListContactsProps =
          responseConfigListPhones.data.response[0] ?? null;

        setMessageWpp(dataConfigListPhones?.messageContacts ?? null);
      }
    } catch (error) {
      console.error(error);
      swal({
        title: "Error",
        text: "Erro ao salvar configuração",
        icon: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const refetchAndResetStates = () => {
    getListPhones();
    getConfigsListPhones();

    setPhoneSearch(null);
    setNameSearch(null);
    setContactsSelected([]);
    setMessageWpp(null);
  };

  const getListPhones = async (
    page: number = 1,
    phone_person?: string | null,
    name_person?: string | null,
  ) => {
    try {
      setLoading(true);

      const params: Record<string, any> = { page };
      if (phone_person != null) params.phone = setOnlyNumber(phone_person);
      if (name_person != null) params.nameContact = name_person;
      const responseConfigsApp = await api.get(`list_contacts_general/list`, {
        params,
      });

      if (responseConfigsApp.status) {
        setListContacts(responseConfigsApp.data.response.data);
        last_page = responseConfigsApp.data.response.last_page;
      }
    } catch (error) {
      const responseError = error as AxiosError;
      swal({
        title: "Error",
        text: responseError.response?.data.response[0],
        icon: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSendLinkApp = async (phone: string) => {
    try {
      setLoading(true);
      const responseSendLinkApp = await api.post("whatsapp/test", {
        phone: setMaskJustNumber(phone),
        message: messageWpp,
      });

      if (responseSendLinkApp.status) {
        setMessage("Mensagem enviado com sucesso");
        setTypeAlert("success");
        setVisibleAlert(true);
      }
    } catch (error) {
      console.error(error);
      setMessage("Erro ao enviar mensagem");
      setTypeAlert("error");
      setVisibleAlert(true);
    } finally {
      setLoading(false);
    }
  };

  const handleSendLinkGeneral = async () => {
    try {
      setLoading(true);

      const responsePayload = contactsSelected.map((response) => {
        return {
          phone: setMaskJustNumber(response.phone_person),
          message: messageWpp,
        };
      });

      const payload = {
        messages: responsePayload,
      };

      const responseSendLinkApp = await api.post("whatsapp/send_many", payload);

      if (responseSendLinkApp.status) {
        setMessage("Mensagens enviado com sucesso");
        setTypeAlert("success");
        setVisibleAlert(true);
      }
    } catch (error) {
      console.error(error);
      setMessage("Erro ao enviar mensagens");
      setTypeAlert("error");
      setVisibleAlert(true);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteContact = async (idContact: number) => {
    try {
      setLoading(true);
      const responseDeleteContact = await api.delete(
        `list_contacts_general/delete/${idContact}`
      );

      if (responseDeleteContact.status) {
        setMessage("Deletado com sucesso");
        setTypeAlert("success");
        setVisibleAlert(true);

        await getListPhones(1);
      }
    } catch (error) {
      console.error(error);
      const responseError = error as AxiosError;

      setMessage(responseError.response?.data.response[0]);
      setTypeAlert("error");
      setVisibleAlert(true);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchContacts = async () => {
    await getListPhones(1, phoneSearch, nameSearch);
  };

  const handleClearSearch = async () => {
    setPhoneSearch(null);
    setNameSearch(null);
    await getListPhones(1);
  };

  const columns: TableProps<IListPhonesDataProps>["columns"] = [
    {
      title: "ID",
      key: 1,
      render: (_, data) => {
        return (
          <span
            style={{
              fontWeight: "bold",
            }}
          >
            {data?.id}
          </span>
        );
      },
    },
    {
      title: "Nome",
      key: 2,
      render: (_, data) => {
        return <span>{data?.name_person}</span>;
      },
    },
    {
      title: "Telefone/Celular",
      key: 3,
      render: (_, data) => {
        return <span>{setMaskPhoneUniversal(data?.phone_person)}</span>;
      },
    },
    {
      title: "Ações",
      key: 5,
      align: "right",
      render: (_, data) => {
        return hasPermissionSendLinksAppPartners ? (
          <ContentActions>
            <Button
              title="Enviar Link"
              icon={<IoMdSend style={{ color: theme_colors.primary_antd }} />}
              onClick={() => handleSendLinkApp(data.phone_person)}
            />

            <Button
              title="Deletar Contato"
              icon={
                <AiFillDelete style={{ color: theme_colors.red_crismon }} />
              }
              onClick={() => handleDeleteContact(data?.id)}
            />
          </ContentActions>
        ) : null;
      },
    },
  ];

  const onSelectChange = (
    _: React.Key[],
    newSelectedRows: IListPhonesDataProps[]
  ) => {
    setContactsSelected(newSelectedRows);
  };

  const rowSelection: TableRowSelection<IListPhonesDataProps> = {
    selectedRowKeys: contactsSelected.map((c) => c.id),
    onChange: onSelectChange,
  };

  useEffect(() => {
    if (!hasPermissionVisualizeContacts) {
      history.push("/");
    }

    getListPhones();
    getConfigsListPhones();
  }, []);

  return (
    <Container>
      <Alert
        message={message}
        typeAlert={typeAlert}
        visibility={visibleAlert}
        setVisibility={setVisibleAlert}
      />

      <ModalConfigListPhones
        setVisible={setVisibleModalConfigListPhones}
        visible={visibleModalConfigListPhones}
        refetchAndResetStates={refetchAndResetStates}
      />

      <ContentHeader>
        <ContentInput>
          <LabelText>Nome</LabelText>
          <Input
            style={{
              maxWidth: "300px",
              width: "100%",
            }}
            value={nameSearch ?? ""}
            onChange={(event) => setNameSearch(event.target.value)}
          />
        </ContentInput>

        <ContentInput>
          <LabelText>Telefone/Celular</LabelText>
          <Input
            placeholder="+00 (00) 00000-0000"
            style={{
              maxWidth: "300px",
              width: "100%",
            }}
            value={phoneSearch ?? ""}
            onChange={(event) => {
              const valueInput = event.target.value;
              setPhoneSearch(setMaskPhoneUniversal(valueInput));
            }}
          />
        </ContentInput>

        <ContentBtnActionsFilter>
          <Button
            style={{
              width: "100%",
            }}
            type="primary"
            title="Pesquisar"
            icon={<AiOutlineSearch style={{ color: theme_colors.white }} />}
            onClick={handleSearchContacts}
            disabled={loading}
          />

          <Button
            style={{
              width: "100%",
            }}
            title="Limpar"
            icon={
              <RiFilterOffFill style={{ color: theme_colors.red_crismon }} />
            }
            onClick={handleClearSearch}
            disabled={loading}
          />

          <Button
            style={{
              width: "100%",
            }}
            title="Configurações de lista telefônica"
            icon={<FaGear style={{ color: theme_colors.primary_antd }} />}
            onClick={() => setVisibleModalConfigListPhones(true)}
            disabled={loading}
          />
        </ContentBtnActionsFilter>
      </ContentHeader>

      {contactsSelected.length > 0 && hasPermissionSendLinksAppPartners ? (
        <ContentBtnSendGeneral>
          <Button
            type="primary"
            onClick={handleSendLinkGeneral}
            style={{
              width: "100%",
            }}
            loading={loading}
          >
            Enviar notificações
          </Button>
        </ContentBtnSendGeneral>
      ) : null}

      <ContentTable>
        <Table
          rowKey={(record) => record.id}
          columns={columns}
          dataSource={listContacts}
          pagination={false}
          loading={loading}
          rowSelection={rowSelection}
        />
      </ContentTable>

      {last_page && (
        <ContentPagination>
          <Pagination
            defaultCurrent={1}
            total={last_page * 10}
            onChange={(currentPage) => getListPhones(currentPage)}
          />
          ;
        </ContentPagination>
      )}
    </Container>
  );
}
