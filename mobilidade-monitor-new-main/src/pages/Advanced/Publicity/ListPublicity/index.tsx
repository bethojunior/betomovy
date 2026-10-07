import { useState, useEffect } from "react";
import swal from "sweetalert";
import { Table, Button, Tabs, Typography, Alert } from "antd";
import type { ColumnsType } from "antd/es/table";
import type { AxiosResponse } from "axios";
import { useHistory } from "react-router-dom";
import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";

import { DraggableRow, DragHandle } from "./DraggableRow";
import { Container, ContentTable, Header } from "./styles";


import { ModalListPublicty } from "../../../../components/Advanced/Publicity/ModalListPublicity";
import { ModalEditPublicity } from "../../../../components/Advanced/Publicity/ModalEditPublicity";
import { PublicityStatusTag } from "../../../../components/Publicity/PublicityStatusTag";
import { PublicityActions } from "../../../../components/Publicity/PublicityActions";

import Session from "../../../../utils/Session";
import api from "../../../../services/api";
import {
  MONITOR_DRIVER,
  MONITOR_CLIENT,
  MONITOR_DELIVERY,
} from "../../../../constants/monitorApps";

import { PublicityProps } from "./types";
import { formatDateTime } from "@/utils/formatters";

const locale = {
  emptyText: "Sem dados",
};

const APP_TYPE_TABS = [
  { key: String(MONITOR_DRIVER), label: "Motorista" },
  { key: String(MONITOR_CLIENT), label: "Cliente" },
  { key: String(MONITOR_DELIVERY), label: "Delivery" },
];

interface ConfirmAndRunOptions {
  confirmTitle: string;
  successTitle: string;
  errorTitle: string;
  errorText: string;
  request: () => Promise<AxiosResponse>;
}

export const ListPublicity = () => {
  const history = useHistory();
  const [publicities, setPublicities] = useState<PublicityProps[]>([]);
   
  const [loadingTable, setLoadingTable] = useState<boolean>(false);
  const [visibleModal, setVisibleModal] = useState<boolean>(false);
  const [visibleModalEdit, setVisibleModalEdit] = useState<boolean>(false);
  const [publicityDetails, setPublicityDetais] = useState<PublicityProps>();
  const [publicityIdToEdit, setPublicityIdToEdit] = useState<number | null>(null);
  const [activeAppId, setActiveAppId] = useState<number>(MONITOR_DRIVER);
  const [hasPendingOrderChanges, setHasPendingOrderChanges] = useState(false);

  const citySelected = Session.getLocal("citySelected");
  const cityId = citySelected?.cityId;

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  const getPublicites = async () => {
    setLoadingTable(true);
    try {
      if (!cityId) {
        swal({
          title: "Erro",
          text: "Cidade não selecionada. Por favor, selecione uma cidade.",
          icon: "error",
        });
        setLoadingTable(false);
        return;
      }

      const responsePublicites = await api.get(
        `advertising?cityId=${cityId}&appId=${activeAppId}&company`
      );

      if (responsePublicites?.status && responsePublicites?.data?.response) {
        const publicitiesData = Array.isArray(responsePublicites.data.response)
          ? [...responsePublicites.data.response].sort(
              (a, b) => (a?.displayOrder ?? 0) - (b?.displayOrder ?? 0)
            )
          : [];
        setPublicities(publicitiesData);
      } else {
        setPublicities([]);
      }
    } catch (error) {
      console.error(error);
      swal({
        title: "Erro ao pegar dados de publicidade",
        text: "Não foi possível carregar as publicidades. Tente novamente.",
        icon: "error",
      });
      setPublicities([]);
    }
    setLoadingTable(false);
  };

  const handleGetDetailsPublicity = (id: number) => {
    try {
      const responsePublicityDetails = publicities.filter(
        (data) => data?.id === id
      );

      if (responsePublicityDetails && responsePublicityDetails.length > 0) {
        const publicity = responsePublicityDetails[0];
        if (publicity) {
          setPublicityDetais(publicity);
          setVisibleModal(true);
        } else {
          swal({
            title: "Erro",
            text: "Publicidade não encontrada.",
            icon: "error",
          });
        }
      } else {
        swal({
          title: "Erro",
          text: "Publicidade não encontrada.",
          icon: "error",
        });
      }
    } catch (error) {
      console.error(error);
      swal({
        title: "Erro",
        text: "Erro ao carregar detalhes da publicidade.",
        icon: "error",
      });
    }
  };

  const handleEditPublicity = (id: number) => {
    if (!id || id <= 0) {
      swal({
        title: "Erro",
        text: "ID da publicidade inválido.",
        icon: "error",
      });
      return;
    }
    setPublicityIdToEdit(id);
    setVisibleModalEdit(true);
  };

  const confirmAndRun = (id: number | undefined, options: ConfirmAndRunOptions) => {
    if (!id || id <= 0) {
      swal({
        title: "Erro",
        text: "ID da publicidade inválido.",
        icon: "error",
      });
      return;
    }

    swal({
      title: options.confirmTitle,
      icon: "info",
      buttons: ["Não", "Sim"],
    }).then((isAccept) => {
      if (!isAccept) return;

      setLoadingTable(true);
      options
        .request()
        .then(async (response) => {
          if (!response?.status) {
            throw new Error("Resposta inválida da API");
          }
          swal({ title: options.successTitle, icon: "success" });
          await getPublicites();
        })
        .catch((error) => {
          console.error(error);
          swal({ title: options.errorTitle, text: options.errorText, icon: "error" });
        })
        .finally(() => {
          setLoadingTable(false);
        });
    });
  };

  const handleDeleteItems = (id: number) =>
    confirmAndRun(id, {
      confirmTitle: "Você deseja apagar essa propaganda?",
      successTitle: "Deletado com sucesso",
      errorTitle: "Erro ao deletar publicidade",
      errorText: "Não foi possível deletar a publicidade. Tente novamente.",
      request: () => api.delete(`advertising/${id}`),
    });

  const handleDeactivatePublicity = (id: number) =>
    confirmAndRun(id, {
      confirmTitle: "Você deseja desativar essa propaganda?",
      successTitle: "Desativado com sucesso",
      errorTitle: "Erro ao desativar publicidade",
      errorText: "Não foi possível desativar a publicidade. Tente novamente.",
      request: () => api.put(`advertising/${id}/disable`),
    });

  const handleActivatePublicity = (id: number) =>
    confirmAndRun(id, {
      confirmTitle: "Você deseja ativar essa propaganda?",
      successTitle: "Ativado com sucesso",
      errorTitle: "Erro ao ativar publicidade",
      errorText: "Não foi possível ativar a publicidade. Tente novamente.",
      request: () => api.put(`advertising/${id}/enable`),
    });

  const handleSaveOrder = async () => {
    if (!cityId) return;

    setLoadingTable(true);
    try {
      const orders = publicities.map((item, index) => ({
        id: item.id,
        order: index + 1,
      }));

      const response = await api.put("advertising/update-order", { orders });

      if (!response?.status) {
        throw new Error("Resposta inválida da API");
      }

      swal({
        title: "Ordem atualizada com sucesso",
        icon: "success",
      });
      setHasPendingOrderChanges(false);
    } catch (error) {
      console.error(error);
      swal({
        title: "Erro ao atualizar ordem",
        text: "Não foi possível atualizar a ordem das publicidades. Tente novamente.",
        icon: "error",
      });
    } finally {
      await getPublicites();
      setLoadingTable(false);
    }
  };

  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    if (!over || active.id === over.id) return;

    const oldIndex = publicities.findIndex((item) => item.id === active.id);
    const newIndex = publicities.findIndex((item) => item.id === over.id);
    if (oldIndex === -1 || newIndex === -1) return;

    const newList = arrayMove(publicities, oldIndex, newIndex);
    setPublicities(newList);
    setHasPendingOrderChanges(true);
  };

  useEffect(() => {
    getPublicites();
    setHasPendingOrderChanges(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeAppId]);

  const columns: ColumnsType<PublicityProps> = [
    {
      title: "",
      key: "sort",
      width: 40,
      render: () => <DragHandle />,
    },
    {
      title: "Descrição",
      dataIndex: "description",
      key: "description",
      ellipsis: true,
      width: 200,
      render: (description) => description ?? "-",
    },
    {
      title: "Empresa",
      key: "company",
      render: (_, datas) => datas?.company?.name ?? "-",
      width: 100,
    },
    {
      title: "Região",
      key: "city",
      render: (_, datas) => datas?.city?.cityName ?? "-",
      width: 100,
    },
    {
      title: "Data inicio",
      dataIndex: "dateStart",
      key: "dateStart",
      render: (v: string) => (
        <Typography.Text>{formatDateTime(v)}</Typography.Text>
      ),
      width: 100,
    },
    {
      title: "Data final",
      dataIndex: "dateEnd",
      key: "dateEnd",
      render: (v: string) => (
        <Typography.Text>{formatDateTime(v)}</Typography.Text>
      ),
      width: 100,
    },
    {
      title: "Status",
      key: "statusId",
      width: 100,
      render: (_, datas) => <PublicityStatusTag statusId={datas.statusId} />,
    },
    {
      title: "Ações",
      key: "actions",
      width: 80,
      align: "right",
      render: (_, datas) => (
        <PublicityActions
          id={datas?.id}
          statusId={datas?.statusId}
          onViewDetails={handleGetDetailsPublicity}
          onEdit={handleEditPublicity}
          onActivate={handleActivatePublicity}
          onDeactivate={handleDeactivatePublicity}
          onDelete={handleDeleteItems}
        />
      ),
    },
  ];

  return (
    <Container>
      <Alert
        type="info"
        showIcon
        message="Cada tipo de aplicativo (Motorista, Cliente ou Delivery) permite no máximo 10 publicidades cadastradas."
        style={{ marginBottom: 16 }}
      />

      <Header>
        <Tabs
          activeKey={String(activeAppId)}
          onChange={(key) => setActiveAppId(Number(key))}
          items={APP_TYPE_TABS}
        />

        <Button type="primary" onClick={() => history.push("/marketing/publicidade")}>
          Nova Publicidade
        </Button>
      </Header>

      <ContentTable>
        <DndContext
          sensors={sensors}
          modifiers={[restrictToVerticalAxis]}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={publicities.map((item) => item.id)}
            strategy={verticalListSortingStrategy}
          >
            <Table
              locale={locale}
              columns={columns}
              dataSource={publicities}
              pagination={false}
              loading={loadingTable}
              rowKey="id"
              components={{ body: { row: DraggableRow } }}
              onRow={() => ({ disabled: loadingTable } as React.HTMLAttributes<HTMLTableRowElement>)}
            />
          </SortableContext>
        </DndContext>

        <Button
          type="primary"
          style={{ marginTop: 16 }}
          disabled={!hasPendingOrderChanges || loadingTable}
          onClick={handleSaveOrder}
        >
          Salvar ordem
        </Button>
      </ContentTable>

      <ModalListPublicty
        publicityDetails={publicityDetails}
        setVisible={setVisibleModal}
        visible={visibleModal}
      />

      <ModalEditPublicity
        visible={visibleModalEdit}
        setVisible={setVisibleModalEdit}
        publicityId={publicityIdToEdit}
        onSuccess={getPublicites}
      />
    </Container>
  );
};
