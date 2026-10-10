import { Table, Divider, Button, Pagination, Select } from "antd";
import type { TableProps } from "antd";
import { FaTrash, FaCheck } from "react-icons/fa";
import { MdBlock } from "react-icons/md";
import swal from "sweetalert";
import { AxiosError } from "axios";

import { useEffect, useState } from "react";

import {
  Container,
  ContentInput,
  ContentTable,
  ContentButtonsActions,
  ContentHeader,
  ContentPagination,
  ContentBtnHeader,
} from "./styles";
import api from "../../../../../services/api";

import { EstablishmentChargesProps } from "./types";
import { theme_colors } from "../../../../../theme/theme";
import { ModalAddEstablishmentsCharge } from "../ModalAddEstablishmentsCharge";
import { useDebounce } from "../../../../../hooks/useDebounce";
import Session from "../../../../../utils/Session";

let last_page: number | null = null;

export const EstablishmentsCharges = () => {
  const [listEstablishments, setListEstablishments] = useState<
    EstablishmentChargesProps[]
  >([]);

  const [openModal, setOpenModal] = useState<boolean>(false);

  const [loading, setLoading] = useState<boolean>(false);

  const [listCompanies, setListCompanies] = useState<CompanyProps[]>([]);
  const [loadingSelect, setLoadingSelect] = useState<boolean>(false);

  const cityId = Session.getLocal("citySelected")?.cityId;

  const getEstablishments = async (
    page: number = 1,
    companyId?: string | undefined
  ) => {
    try {
      setLoading(true);
      const responseEstablishment = await api.get(
        `establishmentBilling?page=${page}${
          companyId ? `&companyId=${companyId}` : ""
        }`
      );

      if (responseEstablishment.status) {
        setListEstablishments(responseEstablishment.data.response.data);
        last_page = responseEstablishment.data.response.last_page;
      }
    } catch (error) {
      const responseError = error as AxiosError;
      swal({
        title: responseError.response?.headers.message,
        icon: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCharges = (id: number) => {
    swal({
      title: "Deseja realmente deletar esta cobrança?",
      icon: "info",
      buttons: ["Não", "Sim"],
    }).then((isAccept) => {
      if (isAccept) {
        setLoading(true);
        api
          .delete(`establishmentBilling/${id}`)
          .then((response) => {
            if (response.status) {
              swal({
                title: "Cobrança deletada com sucesso!",
                icon: "success",
              });
              getEstablishments();
            }
          })
          .catch((error: AxiosError) => {
            swal({
              title: error.response?.headers.message,
              icon: "error",
            });
          })
          .finally(() => {
            setLoading(false);
          });
      }
    });
  };

  const handleBlockCharges = (id: number) => {
    swal({
      title: "Deseja realmente recusar esta cobrança?",
      icon: "info",
      buttons: ["Não", "Sim"],
    }).then((isAccept) => {
      if (isAccept) {
        setLoading(true);
        api
          .put(`establishmentBilling/${id}/refuse`)
          .then((response) => {
            if (response.status) {
              swal({
                title: "Cobrança recusada com sucesso!",
                icon: "success",
              });
              getEstablishments();
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
      }
    });
  };

  const handleApproveCharges = (id: number) => {
    swal({
      title: "Deseja realmente aprovar esta cobrança?",
      icon: "info",
      buttons: ["Não", "Sim"],
    }).then((isAccept) => {
      if (isAccept) {
        setLoading(true);
        api
          .put(`establishmentBilling/${id}/confirm`)
          .then((response) => {
            if (response.status) {
              swal({
                title: "Cobrança aprovada com sucesso!",
                icon: "success",
              });
              getEstablishments();
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
      }
    });
  };

  useEffect(() => {
    getEstablishments();
  }, []);

  const columns: TableProps<EstablishmentChargesProps>["columns"] = [
    {
      title: "Nome",
      key: "name",
      render: (_, data) => {
        return <span>{data.company.name}</span>;
      },
    },
    {
      title: "Descrição",
      key: "description",
      dataIndex: "description",
    },
    {
      title: "Valor",
      key: "value",
      render: (_, data) => {
        return (
          <span>
            {" "}
            {data.value
              .toLocaleString("pt-br", {
                style: "currency",
                currency: "BRL",
              })
              .replace("R$", "")}
          </span>
        );
      },
    },
    {
      title: "Criado em",
      key: "created-at",
      render: (_, data) => {
        return <span>{new Date(data.created_at).toLocaleString()}</span>;
      },
    },
    {
      title: "Status de cobrança",
      key: "status-payment",
      render: (_, data) => {
        return <span>{data.status_payment.description}</span>;
      },
    },
    {
      title: "Ações",
      key: "actions",
      align: "right",
      render: (_, data) => {
        return (
          <>
            {data.statusPaymentId === 1 && (
              <ContentButtonsActions>
                <Button
                  onClick={() => handleApproveCharges(data.id)}
                  title="Aprovar"
                  icon={<FaCheck style={{ color: theme_colors.green }} />}
                />
                <Button
                  onClick={() => handleBlockCharges(data.id)}
                  title="Bloquear"
                  icon={<MdBlock style={{ color: theme_colors.dark_blue }} />}
                />
                <Button
                  onClick={() => handleDeleteCharges(data.id)}
                  title="Excluir"
                  icon={<FaTrash style={{ color: theme_colors.red_crismon }} />}
                />
              </ContentButtonsActions>
            )}
          </>
        );
      },
    },
  ];

  const onChange = (value: string) => {
    getEstablishments(1, value);
  };

  const onSearch = useDebounce(async (value: string) => {
    try {
      setLoadingSelect(true);
      const responseCompany = await api.get(
        `company?cityId=${cityId}&fantasyName=${value}`
      );

      if (responseCompany.status) {
        setListCompanies(responseCompany.data.response);
      }
    } catch (error) {
      const responseError = error as AxiosError;
      swal({
        title: responseError.response?.headers.message,
        icon: "error",
      });
    } finally {
      setLoadingSelect(false);
    }
  }, 1000);

  const filterOption = (
    input: string,
    option?: { label: string; value: string }
  ) => (option?.label ?? "").toLowerCase().includes(input.toLowerCase());

  const companiesFormated = listCompanies.map((value) => {
    return {
      value: String(value.id),
      label: `Nome: ${value.name} Telefone: ${value.phone} CNPJ: ${value.document}`,
    };
  });

  return (
    <Container>
      <ContentHeader>
        <ContentInput>
          <Select
            style={{
              width: "100%",
            }}
            showSearch
            placeholder="Busque o nome fantasia"
            optionFilterProp="children"
            onChange={onChange}
            onSearch={onSearch}
            filterOption={filterOption}
            options={companiesFormated}
            loading={loadingSelect}
            allowClear
          />
        </ContentInput>

        <ContentBtnHeader>
          <Button
            type="primary"
            onClick={() => setOpenModal(true)}
            style={{
              width: "100%",
            }}
          >
            Gerar nova cobrança
          </Button>
        </ContentBtnHeader>
      </ContentHeader>

      <Divider />

      <ContentTable>
        <Table
          columns={columns}
          dataSource={listEstablishments}
          pagination={false}
          loading={loading}
          rowKey={(item) => item.id}
          locale={{
            emptyText: "Sem dados",
          }}
        />
      </ContentTable>

      {last_page && (
        <ContentPagination>
          <Pagination
            defaultCurrent={1}
            total={last_page * 10}
            onChange={(currentPage) => getEstablishments(currentPage)}
          />
        </ContentPagination>
      )}

      <ModalAddEstablishmentsCharge
        setVisible={setOpenModal}
        visible={openModal}
        getEstablishments={getEstablishments}
      />
    </Container>
  );
};
