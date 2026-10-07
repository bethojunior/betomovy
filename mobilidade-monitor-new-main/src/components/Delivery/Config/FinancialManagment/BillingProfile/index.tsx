import { Button, Select, Divider, Table } from "antd";
import type { TableProps } from "antd";
import { FaTrash } from "react-icons/fa";
import swal from "sweetalert";
import { AxiosError } from "axios";

import { useEffect, useState } from "react";

import { Container, ContentInput, ContentTable, ContentHeader } from "./styles";

import { EstablishmentCollectionProps } from "./types";
import api from "../../../../../services/api";
import { theme_colors } from "../../../../../theme/theme";

import { ModalAddCharge } from "../ModalAddCharge";
import { PopoverHelper } from "../../../../PopoverHelper";

export const BillingProfile = () => {
  const [establishmentsCollection, setEstablishmentsCollections] = useState<
    EstablishmentCollectionProps[]
  >([]);
  const [billingDate, setBillingDate] = useState<string>("");
  const [openModal, setOpenModal] = useState<boolean>(false);

  const [loadingDayBilling, setLoadingDayBilling] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const getEstabilishments = async () => {
    try {
      setLoading(true);
      const responseEstabilishments = await api.get(
        "establishmentCollectionManagement"
      );

      if (responseEstabilishments.status) {
        setEstablishmentsCollections(responseEstabilishments.data.response);
      }
    } catch (error) {
      const responseError = error as AxiosError;
      swal({
        title: responseError.response?.data.message,
        icon: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const getBillingDate = async () => {
    try {
      setLoadingDayBilling(true);
      const responseBillingDate = await api.get("config/billing_date");

      if (responseBillingDate.status) {
        setBillingDate(responseBillingDate.data.response);
      }
    } catch (error) {
      const responseError = error as AxiosError;
      swal({
        title: responseError.response?.data.message,
        icon: "error",
      });
    } finally {
      setLoadingDayBilling(false);
    }
  };

  const handleDeleteEstablishment = (idEstablishment: number) => {
    swal({
      title: "Deseja realmente executar esta ação?",
      icon: "info",
      buttons: ["Não", "Sim"],
    }).then((isAccept) => {
      if (isAccept) {
        setLoading(true);
        api
          .delete(`establishmentCollectionManagement/${idEstablishment}`)
          .then((response) => {
            if (response.status) {
              swal({
                title: "Cobrança deletada com sucesso!",
                icon: "success",
              });
              getEstabilishments();
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

  const handleChangeDayBilling = async (dayBilling: number) => {
    try {
      setLoadingDayBilling(true);
      const responseChangeBilling = await api.put("config/billingDate", {
        billingDate: String(dayBilling),
      });

      if (responseChangeBilling.status) {
        swal({
          title: "Dia da cobrança atualizado com sucesso!",
          icon: "success",
        });
        setBillingDate(String(dayBilling));
      }
    } catch (error) {
      const responseError = error as AxiosError;
      swal({
        title: responseError.response?.data.message,
        icon: "error",
      });
    } finally {
      setLoadingDayBilling(false);
    }
  };

  useEffect(() => {
    getEstabilishments();
    getBillingDate();
  }, []);

  const columns: TableProps<EstablishmentCollectionProps>["columns"] = [
    {
      title: "Nome",
      dataIndex: "label",
      key: "name",
      width: 200,
    },
    {
      title: "Valor Fixo",
      key: "value-fixe",
      width: 150,
      render: (_, data) => {
        return (
          <span>
            {data.fixedValue.toLocaleString("pt-br", {
              style: "currency",
              currency: "BRL",
            })}
          </span>
        );
      },
    },
    {
      title: "R$ por entrega",
      key: "order-value",
      width: 150,
      render: (_, data) => {
        return (
          <span>
            {" "}
            {data.orderValue
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
      title: "% por entrega",
      key: "order-percentage",
      width: 150,
      render: (_, data) => {
        return (
          <span>
            {data.orderPercentage
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
      width: 200,
      render: (_, data) => {
        return <span>{new Date(data.created_at).toLocaleString()}</span>;
      },
    },
    {
      title: "Ações",
      key: "actions",
      align: "right",
      width: 100,
      render: (_, data) => {
        return (
          <div>
            <Button
              onClick={() => handleDeleteEstablishment(data.id)}
              icon={<FaTrash style={{ color: theme_colors.red_crismon }} />}
            />
          </div>
        );
      },
    },
  ];

  return (
    <Container>
      <ContentInput>
        <Select
          style={{
            width: "100%",
          }}
          onChange={(value) => handleChangeDayBilling(value)}
          placeholder="Dia de cobrança"
          loading={loadingDayBilling}
          value={Number(billingDate)}
          options={[
            {
              label: "1",
              value: 1,
            },
            {
              label: "5",
              value: 5,
            },
            {
              label: "15",
              value: 15,
            },
            {
              label: "20",
              value: 20,
            },
            {
              label: "25",
              value: 25,
            },
          ]}
        />
      </ContentInput>

      <ContentHeader>
        <Button
          type="primary"
          onClick={() => setOpenModal(true)}
          style={{
            width: "100%",
          }}
        >
          Adicionar Cobrança
        </Button>

        <PopoverHelper
          title="Dia de cobrança"
          description="Este campo você preenche para emissão da cobrança mensal, automaticamente o sistema vai emitir no dia informado neste campo um e-mail para seu cliente informando o valor de sua fatura. OBS: Está data é valida para todos os estabelecimentos."
        />
      </ContentHeader>

      <Divider />

      <ContentTable>
        <Table
          columns={columns}
          dataSource={establishmentsCollection}
          pagination={false}
          loading={loading}
          rowKey={(item) => item.id}
          locale={{
            emptyText: "Sem dados",
          }}
        />
      </ContentTable>

      <ModalAddCharge
        setVisible={setOpenModal}
        visible={openModal}
        getEstabilishments={getEstabilishments}
      />
    </Container>
  );
};
