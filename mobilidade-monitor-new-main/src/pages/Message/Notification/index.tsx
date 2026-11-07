import React, { useEffect, useState, useMemo } from "react";
import { Input, Select, Button, Space, Badge, message } from "antd";
import {
  MdNotifications,
  MdAdd,
  MdRefresh,
  MdSearch,
  MdGroup,
  MdLocationCity,
  MdCheckCircle,
} from "react-icons/md";
import api from "../../../services/api";
import NotificationTable from "../../../components/Message/NotificationTable";
import NotificationModal from "../../../components/Message/NotificationModal";
import Preload from "../../../components/Utils/Preload";
import Alert from "../../../components/Utils/Alert";
import { AlertProps } from "../../../@types";
import {
  NotificationPageContainer,
  HeaderContainer,
  HeaderTitleArea,
  HeaderActions,
  PrimaryActionBtn,
  RefreshBtn,
  StatsGrid,
  StatCard,
  FiltersCard,
  FilterRow,
  ContentCard,
  Loader,
} from "./styles";
import {
  NotificationListProps,
  TypesDriversProps,
} from "./types";
import Session from "../../../utils/Session";

const { Option } = Select;

const Notification: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [messageAlert, setMessageAlert] = useState("");
  const [typeAlert, setTypeAlert] = useState<AlertProps>("success");
  const [showAlert, setShowAlert] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const [notificationList, setNotificationList] = useState<NotificationListProps[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [pageSize, setPageSize] = useState(15);
  const [driverTypeList, setDriverTypeList] = useState<any[]>([]);

  // Search & Filter state
  const [searchText, setSearchText] = useState("");
  const [selectedCityFilter, setSelectedCityFilter] = useState<string | null>(null);

  const sessionCities = Session.getLocal("cities") || [];

  const getAllNotification = async (page = 1) => {
    try {
      setLoading(true);
      const res = await api.get(`notification?page=${page}`);
      setLoading(false);
      setRefreshing(false);
      if (res.status === 200 || res.data?.status) {
        const notifs = Array.isArray(res.data?.response?.data)
          ? res.data.response.data
          : Array.isArray(res.data?.response)
          ? res.data.response
          : Array.isArray(res.data?.data)
          ? res.data.data
          : [];
        setNotificationList(notifs);
        setCurrentPage(res.data?.response?.current_page || page);
        setTotalItems(res.data?.response?.total || notifs.length);
        setPageSize(res.data?.response?.per_page || 15);
      }
    } catch (err) {
      setLoading(false);
      setRefreshing(false);
      console.error("Erro ao listar notificações:", err);
    }
  };

  const getTypesDriver = async () => {
    try {
      const { data } = await api.get("userType/actives");
      const resp = Array.isArray(data?.response) ? data.response : [];
      setDriverTypeList(
        resp.map((item: TypesDriversProps) => ({
          id: String(item.idUserType),
          name: item.name,
        }))
      );
    } catch (err) {
      console.error("Erro ao listar tipos de usuários:", err);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    getAllNotification(currentPage);
  };

  const alertValues = (msg: string, type: AlertProps) => {
    setMessageAlert(msg);
    setTypeAlert(type);
    setShowAlert(true);
    if (type === "success") {
      message.success(msg);
    } else if (type === "warning") {
      message.warning(msg);
    } else if (type === "error") {
      message.error(msg);
    }
  };

  useEffect(() => {
    getAllNotification();
    getTypesDriver();
  }, []);

  // Filtered list based on search text and city
  const filteredNotifications = useMemo(() => {
    let list = notificationList;

    if (searchText.trim() !== "") {
      const q = searchText.toLowerCase().trim();
      list = list.filter(
        (item) =>
          item.title?.toLowerCase().includes(q) ||
          item.message?.toLowerCase().includes(q)
      );
    }

    if (selectedCityFilter) {
      list = list.filter((item) => {
        if (!item.cityId) return true; // Enviado para todas
        const ids = String(item.cityId).split(",").map((s) => s.trim());
        return ids.includes(selectedCityFilter);
      });
    }

    return list;
  }, [notificationList, searchText, selectedCityFilter]);

  return (
    <NotificationPageContainer>
      <Preload visible={loading && !refreshing} />
      <Alert
        visibility={showAlert}
        message={messageAlert}
        typeAlert={typeAlert}
        setVisibility={setShowAlert}
      />

      {/* Header com Ações Rápidas */}
      <HeaderContainer>
        <HeaderTitleArea>
          <div className="header-icon-box">
            <MdNotifications />
          </div>
          <div className="header-texts">
            <h1>Central de Notificações Push</h1>
            <p>
              Crie, envie e gerencie mensagens instantâneas para passageiros e motoristas da plataforma.
            </p>
          </div>
        </HeaderTitleArea>

        <HeaderActions>
          <RefreshBtn
            icon={<MdRefresh size={18} className={refreshing ? "ant-spin" : ""} />}
            onClick={handleRefresh}
            loading={refreshing}
          >
            Atualizar
          </RefreshBtn>
          <PrimaryActionBtn
            type="primary"
            icon={<MdAdd size={20} />}
            onClick={() => setShowModal(true)}
          >
            Nova Notificação
          </PrimaryActionBtn>
        </HeaderActions>
      </HeaderContainer>

      {/* Cards de Métricas e Status */}
      <StatsGrid>
        <StatCard>
          <div className="stat-info">
            <span className="stat-label">Total de Disparos</span>
            <span className="stat-value">{totalItems}</span>
          </div>
          <div
            className="stat-icon"
            style={{ background: "#e0f2fe", color: "#0284c7" }}
          >
            <MdNotifications />
          </div>
        </StatCard>

        <StatCard>
          <div className="stat-info">
            <span className="stat-label">Públicos-Alvo</span>
            <span className="stat-value" style={{ fontSize: 16, marginTop: 4 }}>
              Passageiros & Motoristas
            </span>
          </div>
          <div
            className="stat-icon"
            style={{ background: "#f3e8ff", color: "#9333ea" }}
          >
            <MdGroup />
          </div>
        </StatCard>

        <StatCard>
          <div className="stat-info">
            <span className="stat-label">Cidades Cobertas</span>
            <span className="stat-value">{sessionCities.length || "Todas"}</span>
          </div>
          <div
            className="stat-icon"
            style={{ background: "#fef3c7", color: "#d97706" }}
          >
            <MdLocationCity />
          </div>
        </StatCard>

        <StatCard>
          <div className="stat-info">
            <span className="stat-label">Canal de Envio</span>
            <span className="stat-value" style={{ fontSize: 16, color: "#16a34a", marginTop: 4 }}>
              <Badge status="processing" color="#16a34a" /> Operacional
            </span>
          </div>
          <div
            className="stat-icon"
            style={{ background: "#dcfce7", color: "#16a34a" }}
          >
            <MdCheckCircle />
          </div>
        </StatCard>
      </StatsGrid>

      {/* Barra de Filtros e Busca */}
      <FiltersCard>
        <FilterRow>
          <Input
            className="search-input"
            placeholder="Buscar notificação por título ou conteúdo..."
            prefix={<MdSearch size={18} color="#94a3b8" />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            allowClear
            style={{ height: 40, borderRadius: 8 }}
          />

          <Select
            className="city-filter"
            placeholder="Filtrar por cidade"
            value={selectedCityFilter}
            onChange={(val) => setSelectedCityFilter(val)}
            allowClear
            style={{ height: 40, borderRadius: 8 }}
          >
            {sessionCities.map((c: any) => (
              <Option key={String(c.cityId || c.id)} value={String(c.cityId || c.id)}>
                {c.shortName || c.nome || "Cidade"}
              </Option>
            ))}
          </Select>

          {(searchText || selectedCityFilter) && (
            <Button
              type="dashed"
              onClick={() => {
                setSearchText("");
                setSelectedCityFilter(null);
              }}
              style={{ height: 40, borderRadius: 8 }}
            >
              Limpar Filtros
            </Button>
          )}
        </FilterRow>
      </FiltersCard>

      {/* Conteúdo Principal / Tabela */}
      <ContentCard>
        {loading && notificationList.length === 0 ? (
          <Loader tip="Carregando notificações..." />
        ) : (
          <NotificationTable
            notificationList={filteredNotifications}
            alertValues={alertValues}
            setLoading={setLoading}
            currentPage={currentPage}
            totalItems={totalItems}
            pageSize={pageSize}
            getAllNotification={getAllNotification}
            onOpenCreateModal={() => setShowModal(true)}
          />
        )}
      </ContentCard>

      {/* Modal de Criação com Pré-visualização Push */}
      <NotificationModal
        cities={sessionCities}
        showModal={showModal}
        setShowModal={setShowModal}
        driverTypeList={driverTypeList}
        setLoading={setLoading}
        alertValues={alertValues}
        getAllNotification={() => getAllNotification(1)}
      />
    </NotificationPageContainer>
  );
};

export default Notification;
