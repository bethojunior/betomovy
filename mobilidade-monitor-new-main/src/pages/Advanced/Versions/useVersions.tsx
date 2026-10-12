import { useState, useEffect, useContext } from "react";
import { ColumnsType } from "antd/lib/table";
import { Button, Switch, Tag } from "antd";
import { AiOutlineEdit } from "react-icons/ai";
import swal from "sweetalert";

import api from "../../../services/api";
import AuthContext from "../../../contexts/auth";
import { VERSAO } from "../../../constants/permissions";
import {
  MONITOR_DRIVER,
  MONITOR_CLIENT,
  MONITOR_DELIVERY,
  MONITOR_MOBILITY,
} from "../../../constants/monitorApps";

import {
  findVersionsLatestsApps,
  filterVersions,
  switchOptionsTag,
  switchMessageAlert,
} from "./helpers";
import { VersionsProps, ListVersionsAppProps, UseVersionsResult } from "./types";

const ACTIVE_STATUS = 1;

export const useVersions = (): UseVersionsResult => {
  const { hasPermission } = useContext(AuthContext);
  const canManageVersions = hasPermission(VERSAO, "versao");

  const [listVersions, setListVersions] = useState<VersionsProps[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingTable, setLoadingTable] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [editingVersion, setEditingVersion] = useState<VersionsProps | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPage, setTotalPage] = useState<number | null>(null);

  const openCreateModal = () => {
    setEditingVersion(null);
    setShowModal(true);
  };

  const openEditModal = (version: VersionsProps) => {
    setEditingVersion(version);
    setShowModal(true);
  };

  const listVersionsApp: ListVersionsAppProps[] = (Array.isArray(listVersions) ? listVersions : []).map((value) => ({
    appType: value.appId,
    versions: value.version,
  }));

  const getAllVersions = async (page: number = 1) => {
    try {
      setLoadingTable(true);
      const responseAllVersions = await api.get(`appVersion?page=${page}`);

      if (responseAllVersions.status) {
        const raw = responseAllVersions.data?.response?.data ?? responseAllVersions.data?.response;
        setListVersions(Array.isArray(raw) ? raw : []);
        setTotalPage(responseAllVersions.data?.response?.last_page ?? null);
      }
    } catch (error) {
      setListVersions([]);
      console.error(error);
    } finally {
      setLoadingTable(false);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    getAllVersions(page);
  };

  const updateStatusVersions = (id: number, status: number) => {
    setLoadingTable(true);
    api
      .put(`appVersion/${id}`, {
        active: status !== ACTIVE_STATUS,
      })
      .then((response) => {
        if (response.status) {
          swal({
            title: "Status atualizado com sucesso",
            icon: "success",
          });
          setCurrentPage(1);
          getAllVersions();
        }
      })
      .catch((error) => {
        console.error(error);
        swal({
          title: "Erro ao atualizar status",
          icon: "error",
        });
      })
      .finally(() => {
        setLoadingTable(false);
      });
  };

  const handleUpdateStatus = async (currentVersion: VersionsProps) => {
    const currentVersionFormated = {
      appType: currentVersion.appId,
      versions: currentVersion.version,
    };

    const versionsApps = findVersionsLatestsApps(listVersionsApp);

    //MODULE DRIVERS
    if (currentVersionFormated.appType === MONITOR_DRIVER) {
      if (
        (currentVersionFormated.versions ===
          versionsApps?.driver.current_version_latest?.versions &&
          currentVersion.statusId === ACTIVE_STATUS) ||
        (currentVersionFormated.versions ===
          versionsApps?.driver.second_version_latest?.versions &&
          currentVersion.statusId === ACTIVE_STATUS)
      ) {
        swal({
          title: "Ops!",
          text: "Não é possível desativar versões muito recentes de Drivers",
          icon: "warning",
        });
        return;
      }
    }

    //MODULE CLIENT FINAL
    if (currentVersionFormated.appType === MONITOR_CLIENT) {
      if (
        (currentVersionFormated.versions ===
          versionsApps?.client_final.current_version_latest?.versions &&
          currentVersion.statusId === ACTIVE_STATUS) ||
        (currentVersionFormated.versions ===
          versionsApps?.client_final.second_version_latest?.versions &&
          currentVersion.statusId === ACTIVE_STATUS)
      ) {
        swal({
          title: "Ops!",
          text: "Não é possível desativar versões muito recentes Cliente Final",
          icon: "warning",
        });
        return;
      }
    }

    //MODULE DELIVERY
    if (currentVersionFormated.appType === MONITOR_DELIVERY) {
      if (
        (currentVersionFormated.versions ===
          versionsApps?.delivery.current_version_latest?.versions &&
          currentVersion.statusId === ACTIVE_STATUS) ||
        (currentVersionFormated.versions ===
          versionsApps?.delivery.second_version_latest?.versions &&
          currentVersion.statusId === ACTIVE_STATUS)
      ) {
        swal({
          title: "Ops!",
          text: "Não é possível desativar versões muito recentes do Delivery",
          icon: "warning",
        });
        return;
      }
    }

    // MODULE MOBILITY PRO
    if (currentVersionFormated.appType === MONITOR_MOBILITY) {
      if (
        (currentVersionFormated.versions ===
          versionsApps?.mobility_pro.current_version_latest?.versions &&
          currentVersion.statusId === ACTIVE_STATUS) ||
        (currentVersionFormated.versions ===
          versionsApps?.mobility_pro.second_version_latest?.versions &&
          currentVersion.statusId === ACTIVE_STATUS)
      ) {
        swal({
          title: "Ops!",
          text: "Não é possível desativar versões muito recentes do MobilityPro",
          icon: "warning",
        });
        return;
      }
    }

    const qntVersionsActivesOfCurrentApp = listVersions.filter(
      (data) =>
        data.statusId === ACTIVE_STATUS && data.appId === currentVersion.appId
    ).length;

    if (
      qntVersionsActivesOfCurrentApp === 1 &&
      currentVersion.statusId === ACTIVE_STATUS
    ) {
      swal({
        title: "Ops!",
        text: "Você não pode desativar todas as versões deste aplicativo, isso pode deixar a plataforma inoperante.",
        icon: "warning",
      });
      return;
    }

    swal({
      title: "Voce deseja mudar o status dessa versão?",
      icon: "info",
      buttons: ["Não", "Sim"],
    }).then((isAccept) => {
      if (isAccept) {
        updateStatusVersions(currentVersion.id, currentVersion.statusId);
      }
    });
  };

  useEffect(() => {
    if (!canManageVersions) {
      return;
    }
    getAllVersions();
  }, [canManageVersions]);

  const columns: ColumnsType<VersionsProps> = [
    {
      title: "App",
      dataIndex: "appName",
      key: "app",
      width: 200,
    },
    {
      title: "Plataforma",
      key: "platform",
      width: 200,
      render: (_, data) => {
        const tagOptions = switchOptionsTag(data.platform);
        return (
          <Tag icon={tagOptions.icon} color={tagOptions.color}>
            {data.platform.toLocaleUpperCase()}
          </Tag>
        );
      },
    },
    {
      title: "Versão",
      key: "version",
      width: 100,
      render: (_, data) => <Tag color="purple">{data.version}</Tag>,
    },
    {
      title: "Link",
      key: "link",
      dataIndex: "link",
    },
    {
      title: "Data de criação",
      key: "created_at_date",
      width: 200,
      render: (_, data) => <span>{new Date(data.created_at).toLocaleString()}</span>,
    },
    {
      title: "Ação",
      key: "actions",
      width: 100,
      render: (_, data) => (
        <Switch
          size="small"
          checked={data.statusId === ACTIVE_STATUS}
          onChange={() => handleUpdateStatus(data)}
        />
      ),
    },
    {
      title: "Editar",
      key: "edit",
      width: 80,
      render: (_, data) => (
        <Button type="text" icon={<AiOutlineEdit />} onClick={() => openEditModal(data)} />
      ),
    },
  ];

  const listVersionsActivesClientFinal = filterVersions(
    listVersions,
    ACTIVE_STATUS,
    MONITOR_CLIENT
  );

  const listVersionsActivesDrivers = filterVersions(
    listVersions,
    ACTIVE_STATUS,
    MONITOR_DRIVER
  );

  const listVersionsActivesMobilityPro = filterVersions(
    listVersions,
    ACTIVE_STATUS,
    MONITOR_MOBILITY
  );

  const listVersionsActivesDelivery = filterVersions(
    listVersions,
    ACTIVE_STATUS,
    MONITOR_DELIVERY
  );

  const isExistGraphic =
    listVersionsActivesClientFinal.length > 0 ||
    listVersionsActivesDrivers.length > 0 ||
    listVersionsActivesMobilityPro.length > 0 ||
    listVersionsActivesDelivery.length > 0;

  return {
    canManageVersions,
    listVersions,
    loading,
    setLoading,
    loadingTable,
    showModal,
    setShowModal,
    editingVersion,
    openCreateModal,
    openEditModal,
    columns,
    currentPage,
    totalPage,
    handlePageChange,
    getAllVersions,
    isExistGraphic,
    listVersionsActivesClientFinal,
    listVersionsActivesDrivers,
    listVersionsActivesDelivery,
    listVersionsActivesMobilityPro,
    switchMessageAlert,
  };
};
