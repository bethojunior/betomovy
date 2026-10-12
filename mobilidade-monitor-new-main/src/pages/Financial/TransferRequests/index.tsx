import {
  Container,
  ContentTable,
  ContentHeader,
  ContentFilters,
  LabelText,
  Row,
  ContentInput,
  ItemMenuSettings,
  ContentPagination,
} from "./styles";
import { ColumnsType } from "antd/es/table";
import locale from "antd/es/date-picker/locale/pt_BR";
import Utils from "../../../utils/Utils";
import {
  Table,
  Input,
  Checkbox,
  DatePicker,
  Button as ButtonAntd,
  Dropdown,
  Space,
  Menu,
  Pagination,
  Tag,
  Spin,
} from "antd";
import swal from "sweetalert";
import { BsGearFill } from "react-icons/bs";

//import Preload from "../../../components/Utils/Preload";
import { ModalDetailsTransfer } from "../../../components/Financial/ModalDetailsTransfer";

import api from "../../../services/api";

import { useState, useEffect, FormEvent } from "react";

import { FinancialProps } from "./types";
import { theme_colors } from "../../../theme/theme";
import { ModalRejectTransfer } from "../../../components/ModalRejectTransfer";

let last_page: number | null = null;

export const TransferRequests = () => {
  const [loading, setLoading] = useState<boolean>(false);
  //@ts-ignore
  const [showFilter, setShowFilter] = useState<boolean>(false);
  const [listFinancial, setListFinancial] = useState<FinancialProps[]>([]);
  const [financialSelected, setFinancialSelected] = useState<FinancialProps>();
  const [visibleModal, setVisibleModal] = useState<boolean>(false);
  const [isCheckedPendent, setIsCheckedPendet] = useState<boolean>(false);

  const [rejectModalVisible, setRejectModalVisible] = useState(false);
  const [rejectId, setRejectId] = useState<number | null>(null);

  const handleShowFilter = () => {
    if (showFilter) {
      setShowFilter(false);
    } else {
      setShowFilter(true);
    }
  };

  const handleGetDetailsFinancial = async (id: number) => {
    setLoading(true);
    try {
      const responseDetailsFinancial = await api.get(`withdraw/${id}`);

      if (responseDetailsFinancial.status) {
        setFinancialSelected(responseDetailsFinancial.data.response);
        setVisibleModal(true);
      }
    } catch (error) {
      console.error(error);
      swal({
        title: "Erro ao capturar listagem de transferência.",
        icon: "error",
      });
    }
    setLoading(false);
  };

  const handleSearch = async (event: FormEvent<HTMLFormElement>) => {
    setLoading(true);
    try {
      event.preventDefault();

      const formData = new FormData(event.target as HTMLFormElement);

      const nameFilter = formData.get("name-filter");
      const phoneFilter = formData.get("phone-filter");
      const cpfFilter = formData.get("cpf-filter");
      const isPendentFilter = formData.get("ispendent-filter");
      const dateInitFilter = formData.get("dateinit-filter");
      const dateFinalFilter = formData.get("datefinal-filter");

      const dateInitFormated = Utils.transformDate(
        dateInitFilter as string,
        false
      );
      const dateFinalFormated = Utils.transformDate(
        dateFinalFilter as string,
        false
      );

      const responseFilter = await api.get(
        `withdraw?page=1&name=${nameFilter}&phone=${phoneFilter}&document=${cpfFilter}&dateStart=${dateInitFormated}&dateEnd=${dateFinalFormated}&${
          isPendentFilter === "on" && "paid=0"
        }`
      );

      if (responseFilter.status) {
        setListFinancial(responseFilter.data.response.data);
      }
    } catch (error) {
      console.error(error);
      swal({
        title: "Erro ao pegar dados!",
        icon: "error",
      });
    }
    setLoading(false);
  };

  const getListFinancial = async (page: number = 1) => {
    setLoading(true);
    try {
      const responseListFinancial = await api.get(`withdraw?page=${page}`);
      if (responseListFinancial?.data) {
        const raw = responseListFinancial.data?.response ?? responseListFinancial.data?.data;
        const list = Array.isArray(raw?.data) ? raw.data : (Array.isArray(raw) ? raw : []);
        setListFinancial(list);
        last_page = raw?.last_page ?? 1;
      }
    } catch (error) {
      console.error(error);
      setListFinancial([]);
    }
    setLoading(false);
  };

  const handleConfirm = (id: number) => {
    swal({
      title: "Você deseja confirmar esta transferência?",
      icon: "info",
      buttons: ["Não", "Sim"],
    }).then((isAccept) => {
      if (isAccept) {
        setLoading(true);
        api
          .put(`withdraw/${id}`, {})
          .then((response) => {
            if (response.status) {
              swal({
                title: "Transferência confirmada com sucesso!",
                icon: "success",
              });
              getListFinancial();
            }
          })
          .catch((error) => {
            console.error(error);
            swal({
              title: "Erro ao confirmar valor",
              icon: "error",
            });
          })
          .finally(() => {
            setLoading(false);
          });
      }
    });
  };

  const handleConfirmReject = async (reason?: string) => {
    if (!rejectId) return;

    setLoading(true);

    try {
      await api.put(`withdraw/${rejectId}/reject`, {
        reason: reason || null,
      });

      swal({
        title: "Transferência recusada com sucesso!",
        icon: "success",
      });

      getListFinancial();
      setRejectModalVisible(false);
      setRejectId(null);
    } catch (error) {
      console.error(error);
      swal({
        title: "Erro ao recusar transferência",
        icon: "error",
      });
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    getListFinancial();
  }, []);

  const items = (datas: FinancialProps) => (
    <Menu>
      <ItemMenuSettings
        key="1"
        onClick={() => handleGetDetailsFinancial(datas.idWithdraw)}
      >
        Ver Detalhes
      </ItemMenuSettings>
      {datas.paid === 1 || datas.recused === 1 ? null : (
        <>
          <ItemMenuSettings
            key="2"
            onClick={() => handleConfirm(datas.idWithdraw)}
          >
            Confirmar
          </ItemMenuSettings>
          <ItemMenuSettings
            key="3"
            onClick={() => {
              setRejectId(datas.idWithdraw);
              setRejectModalVisible(true);
            }}
          >
            Recusar
          </ItemMenuSettings>
        </>
      )}
    </Menu>
  );

  const columns: ColumnsType<FinancialProps> = [
    {
      title: "Nome",
      dataIndex: "name",
      key: "name",
      width: 150,
      ellipsis: true,
    },
    {
      title: "Tipo",
      key: "name",
      width: 150,
      ellipsis: true,
      render: (_, data) => {
        return data.isDriver === 1 ? "Motorista" : "Cliente";
      },
    },
    {
      title: "Cidade",
      dataIndex: "city_name",
      key: "city_name",
      width: 150,
      ellipsis: true,
    },
    {
      title: "Status",
      key: "status",
      width: 200,
      ellipsis: true,
      render: (_, data) => {
        let color = "";
        let text = "";
        if (data.recused === 1) {
          color = "red";
          text = "Recusado";
        } else if (data.paid === 1) {
          color = "green";
          text = "Confirmado";
        } else {
          color = "orange";
          text = "Pendente";
        }
        return <Tag color={color}>{text}</Tag>;
      },
    },
        {
      title: "Data",
      key: "date",
      width: 200,
      ellipsis: true,
      render: (_, data) => {
        return new Date(data.created_at).toLocaleString();
      },
    },
    {
      title: "Valor",
      key: "status",
      width: 200,
      ellipsis: true,
      render: (_, data) => {
        return data.value.toLocaleString("pt-br", {
          style: "currency",
          currency: "BRL",
        });
      },
    },
    {
      title: "Ações",
      key: "actions",
      width: 100,
      render: (_, data) => {
        return (
          <Dropdown overlay={items(data)} trigger={["click"]}>
            <a onClick={(e) => e.preventDefault()}>
              <Space>
                <BsGearFill color={theme_colors.black} size={23} />
              </Space>
            </a>
          </Dropdown>
        );
      },
    },
  ];

  return (
    <Container>
      <ModalRejectTransfer
        visible={rejectModalVisible}
        loading={loading}
        onCancel={() => {
          setRejectModalVisible(false);
          setRejectId(null);
        }}
        onConfirm={handleConfirmReject}
      />
      {/*<Preload visible={loading} />*/}
      <ContentHeader>
        <ButtonAntd type="primary" onClick={handleShowFilter}>
          Filtros
        </ButtonAntd>
      </ContentHeader>

      {showFilter ? (
        <ContentFilters onSubmit={handleSearch}>
          <Row>
            <ContentInput>
              <LabelText>Nome</LabelText>
              <Input type="text" name="name-filter" />
            </ContentInput>

            <ContentInput>
              <LabelText>Telefone</LabelText>
              <Input type="text" name="phone-filter" />
            </ContentInput>

            <ContentInput>
              <LabelText>CPF</LabelText>
              <Input type="text" name="cpf-filter" />
            </ContentInput>

            <ContentInput
              style={{
                alignSelf: "end",
              }}
            >
              <Checkbox
                checked={isCheckedPendent}
                onChange={(event) => setIsCheckedPendet(event.target.checked)}
                name="ispendent-filter"
              >
                Apenas Pendentes
              </Checkbox>
            </ContentInput>
          </Row>
          <Row>
            <ContentInput>
              <LabelText>A partir de</LabelText>
              <DatePicker
                name="dateinit-filter"
                style={{
                  width: "100%",
                }}
                locale={locale}
                format="DD/MM/yyyy"
              />
            </ContentInput>

            <ContentInput>
              <LabelText>Até</LabelText>
              <DatePicker
                name="datefinal-filter"
                style={{
                  width: "100%",
                }}
                locale={locale}
                format="DD/MM/yyyy"
              />
            </ContentInput>
          </Row>
          <ButtonAntd type="primary" htmlType="submit">
            Buscar
          </ButtonAntd>
        </ContentFilters>
      ) : null}

      <ContentTable style={{ position: "relative", minHeight: 300 }}>
        {loading && (
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              zIndex: 1,
              backgroundColor: "rgba(255, 255, 255, 0.7)",
              padding: 20,
              borderRadius: 8,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Spin size="large" tip="Carregando..." />
          </div>
        )}
        <Table
          columns={columns}
          dataSource={listFinancial}
          pagination={false}
        />
      </ContentTable>

      {last_page && (
        <ContentPagination>
          <Pagination
            total={last_page * 10}
            onChange={(currentPage) => {
              getListFinancial(currentPage);
            }}
          />
        </ContentPagination>
      )}

      <ModalDetailsTransfer
        datasTransfer={financialSelected}
        setVisible={setVisibleModal}
        visible={visibleModal}
      />
    </Container>
  );
};
