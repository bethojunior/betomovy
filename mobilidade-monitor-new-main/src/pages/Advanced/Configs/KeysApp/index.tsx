import { Collapse, Input, Button, Tooltip } from "antd";
import { FC, useEffect, useMemo, useState } from "react";
import { 
  FaKey, 
  FaSearch, 
  FaServer, 
  FaCog, 
  FaMapMarkedAlt, 
  FaCreditCard, 
  FaBell, 
  FaEnvelope, 
  FaMotorcycle, 
  FaSms,
  FaRedo,
  FaAngleDoubleDown,
  FaAngleDoubleUp,
  FaWhatsapp,
  FaVolumeUp,
  FaCar
} from "react-icons/fa";

import { InputLink } from "../../../../components/Advanced/Config/KeysApp/InputLink";
import { 
  Content, 
  HeaderContainer,
  HeaderInfo,
  MainTitle,
  Subtitle,
  ActionsContainer,
  SearchWrapper,
  StatsBar,
  StatPill,
  CategoryHeaderContent,
  CategoryTitle,
  CategoryBadge,
  GridKeys,
  KeyCard,
  KeyInfo,
  KeyTitle,
  KeyIdentifier,
  EmptyState,
  Loader 
} from "./styles";
import api from "../../../../services/api";
import swal from "sweetalert";
import { AxiosError } from "axios";
import Utils from "../../../../utils/Utils";
import { normalizeKeys, NormalizedCategory } from "./configNormalizer";

const { Panel } = Collapse;

const CATEGORY_MAP: Record<string, { label: string; icon: JSX.Element }> = {
  MAPS: {
    label: "Mapas, Geocodificação & Rotas",
    icon: <FaMapMarkedAlt />,
  },
  PAGAMENTOS: {
    label: "Gateways & Meios de Pagamento",
    icon: <FaCreditCard />,
  },
  PAGAMENTO: {
    label: "Gateways & Meios de Pagamento",
    icon: <FaCreditCard />,
  },
  FIREBASE: {
    label: "Firebase & Notificações Push",
    icon: <FaBell />,
  },
  WHATSAPP: {
    label: "WhatsApp & Atendimento Integrado",
    icon: <FaWhatsapp />,
  },
  SOCKET: {
    label: "Servidor Socket, Redis & Tempo Real",
    icon: <FaServer />,
  },
  DELIVERY: {
    label: "Módulo de Entregas & Delivery",
    icon: <FaMotorcycle />,
  },
  SMS: {
    label: "Envio de SMS & Autenticação",
    icon: <FaSms />,
  },
  EMAIL: {
    label: "Serviço de E-mail (SMTP & Notificações)",
    icon: <FaEnvelope />,
  },
  SONS: {
    label: "Sons & Alertas do Aplicativo",
    icon: <FaVolumeUp />,
  },
  VIAGENS: {
    label: "Regras de Viagens & Despacho de Corridas",
    icon: <FaCar />,
  },
  SISTEMA: {
    label: "Aplicativos, Cadastros & Segurança",
    icon: <FaCog />,
  },
  GESTOR: {
    label: "Painel & Gestão Administrativa",
    icon: <FaCog />,
  },
  GERAL: {
    label: "Configurações Gerais do Sistema",
    icon: <FaKey />,
  },
};

const getCategoryMeta = (type: string | undefined | null) => {
  const clean = (type || "").trim();
  if (!clean) {
    return {
      label: "Configurações Gerais",
      icon: <FaCog />,
    };
  }

  const upper = clean.toUpperCase();
  if (CATEGORY_MAP[upper]) {
    return CATEGORY_MAP[upper];
  }

  return {
    label: Utils.capitalizeFirstLetter(clean),
    icon: <FaKey />,
  };
};

const KeysApp: FC = () => {
  const [loading, setLoading] = useState(false);
  const [listKeys, setListKeys] = useState<NormalizedCategory[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeKeys, setActiveKeys] = useState<string[]>([]);

  const getAllKeys = async () => {
    try {
      setLoading(true);
      const responseConfigs = await api.get("config");

      if (responseConfigs.status) {
        const raw = responseConfigs.data?.response;
        const normalized = normalizeKeys(Array.isArray(raw) ? raw : []);

        setListKeys(normalized);
        localStorage.setItem("keysApp", JSON.stringify(normalized));
        
        // Open all categories by default on initial load
        setActiveKeys(normalized.map((k, index) => String(k.type || `cat-${index}`)));
      }
    } catch (error) {
      setListKeys([]);
      console.error(error);
      const responseError = error as AxiosError<any>;
      const errMsg = Array.isArray(responseError.response?.data?.response)
        ? responseError.response?.data?.response[0]
        : (responseError.response?.data?.message || "Erro ao buscar chaves de configuração");
      swal({
        title: errMsg,
        icon: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllKeys();
  }, []);

  // Filter keys based on search
  const filteredCategories = useMemo(() => {
    if (!searchTerm.trim()) {
      return listKeys;
    }

    const term = searchTerm.toLowerCase();

    return listKeys
      .map((cat) => {
        const catMeta = getCategoryMeta(cat.type);
        const matchesCategory =
          cat.type?.toLowerCase().includes(term) ||
          catMeta.label.toLowerCase().includes(term);

        const configs = (Array.isArray(cat?.config) ? cat.config : []).filter(
          (c) =>
            matchesCategory ||
            c.description?.toLowerCase().includes(term) ||
            c.key?.toLowerCase().includes(term) ||
            String(c.value || "").toLowerCase().includes(term)
        );

        if (configs.length > 0) {
          return {
            ...cat,
            config: configs,
          };
        }
        return null;
      })
      .filter((cat): cat is NormalizedCategory => cat !== null);
  }, [listKeys, searchTerm]);

  // Total configurable items count
  const totalKeysCount = useMemo(() => {
    return listKeys.reduce((acc, cat) => acc + (cat.config?.length || 0), 0);
  }, [listKeys]);

  const handleExpandAll = () => {
    setActiveKeys(filteredCategories.map((c, index) => String(c.type || `cat-${index}`)));
  };

  const handleCollapseAll = () => {
    setActiveKeys([]);
  };

  if (loading && listKeys.length === 0) return <Loader spinning tip="Carregando chaves do sistema..." />;

  return (
    <Content>
      <HeaderContainer>
        <HeaderInfo>
          <MainTitle>
            <FaKey style={{ color: "#0284c7" }} /> Configurações das Chaves do App
          </MainTitle>
          <Subtitle>
            Gerencie credenciais de APIs, conexões de servidor, gateways e parâmetros globais do ecossistema
          </Subtitle>
        </HeaderInfo>

        <ActionsContainer>
          <SearchWrapper>
            <Input
              placeholder="Buscar por nome, chave ou descrição..."
              prefix={<FaSearch style={{ color: "#94a3b8", marginRight: 6 }} />}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              allowClear
              size="middle"
            />
          </SearchWrapper>

          <Tooltip title="Expandir todas as seções">
            <Button icon={<FaAngleDoubleDown />} onClick={handleExpandAll}>
              Expandir
            </Button>
          </Tooltip>

          <Tooltip title="Recolher todas as seções">
            <Button icon={<FaAngleDoubleUp />} onClick={handleCollapseAll}>
              Recolher
            </Button>
          </Tooltip>

          <Tooltip title="Recarregar chaves do servidor">
            <Button icon={<FaRedo />} onClick={getAllKeys} loading={loading}>
              Atualizar
            </Button>
          </Tooltip>
        </ActionsContainer>
      </HeaderContainer>

      <StatsBar>
        <StatPill>
          Categorias: <span className="count">{filteredCategories.length}</span>
        </StatPill>
        <StatPill>
          Total de Parâmetros: <span className="count">{totalKeysCount}</span>
        </StatPill>
        {searchTerm && (
          <StatPill style={{ borderColor: "#0284c7", color: "#0284c7" }}>
            Filtrando por: &quot;{searchTerm}&quot;
          </StatPill>
        )}
      </StatsBar>

      {filteredCategories.length === 0 ? (
        <EmptyState>
          <FaSearch style={{ fontSize: 36, color: "#cbd5e1", marginBottom: 12 }} />
          <h3>Nenhuma chave encontrada</h3>
          <p>Tente ajustar o termo de pesquisa ou clique em &quot;Atualizar&quot; para recarregar.</p>
          <Button type="primary" onClick={() => setSearchTerm("")}>
            Limpar Busca
          </Button>
        </EmptyState>
      ) : (
        <Collapse
          activeKey={activeKeys}
          onChange={(keys) => setActiveKeys(Array.isArray(keys) ? (keys as string[]) : [keys as string])}
        >
          {filteredCategories.map((item, index) => {
            const meta = getCategoryMeta(item.type);
            const panelKey = String(item.type || `cat-${index}`);
            const configs = Array.isArray(item?.config) ? item.config : [];

            return (
              <Panel
                key={panelKey}
                header={
                  <CategoryHeaderContent>
                    <CategoryTitle>
                      {meta.icon}
                      <span>{meta.label}</span>
                    </CategoryTitle>
                    <CategoryBadge>
                      {configs.length} {configs.length === 1 ? "chave" : "chaves"}
                    </CategoryBadge>
                  </CategoryHeaderContent>
                }
              >
                <GridKeys>
                  {configs.map((value) => {
                    return (
                      <KeyCard key={value.key}>
                        <KeyInfo>
                          <KeyTitle>{value.description || value.key}</KeyTitle>
                          <KeyIdentifier title="Chave de configuração no sistema">
                            {value.key}
                          </KeyIdentifier>
                        </KeyInfo>

                        <InputLink
                          valueInput={value.value}
                          id={value.key}
                          keyInput={value.key}
                          inputTypePro={value.inputTypePro}
                        />
                      </KeyCard>
                    );
                  })}
                </GridKeys>
              </Panel>
            );
          })}
        </Collapse>
      )}
    </Content>
  );
};

export default KeysApp;
