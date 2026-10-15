import { Collapse, Input, Button, Tooltip, Modal, Select } from "antd";
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
  FaCar,
  FaArrowUp,
  FaPlus
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
  CategoryFilterContainer,
  CategoryFilterPill,
  CategoryHeaderContent,
  CategoryTitle,
  CategoryBadge,
  GridKeys,
  KeyCard,
  KeyInfo,
  KeyTitle,
  KeyIdentifier,
  EmptyState,
  Loader,
  FloatingScrollTopButton
} from "./styles";
import api from "../../../../services/api";
import swal from "sweetalert";
import { AxiosError } from "axios";
import Utils from "../../../../utils/Utils";
import { normalizeKeys, NormalizedCategory } from "./configNormalizer";

const { Panel } = Collapse;
const { Option } = Select;

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
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [activeKeys, setActiveKeys] = useState<string[]>([]);
  const [showScrollTop, setShowScrollTop] = useState(false);

  // New key modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newKeyName, setNewKeyName] = useState("");
  const [newKeyCategory, setNewKeyCategory] = useState("SISTEMA");
  const [newKeyDesc, setNewKeyDesc] = useState("");
  const [newKeyType, setNewKeyType] = useState("text");
  const [newKeyValue, setNewKeyValue] = useState("");
  const [modalLoading, setModalLoading] = useState(false);

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

  // Listen to scroll to show/hide "Scroll to Top" button
  useEffect(() => {
    const handleScroll = () => {
      const mainEl = document.getElementById("main-scroll-content");
      const scrollPos = mainEl ? mainEl.scrollTop : window.scrollY;
      if (scrollPos > 300) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };

    const mainEl = document.getElementById("main-scroll-content");
    if (mainEl) {
      mainEl.addEventListener("scroll", handleScroll);
    }
    window.addEventListener("scroll", handleScroll);

    return () => {
      if (mainEl) {
        mainEl.removeEventListener("scroll", handleScroll);
      }
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    const mainEl = document.getElementById("main-scroll-content");
    if (mainEl) {
      mainEl.scrollTo({ top: 0, behavior: "smooth" });
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Filter keys based on search and category pill
  const filteredCategories = useMemo(() => {
    let result = listKeys;

    if (selectedCategory) {
      result = result.filter(
        (cat) => cat.type.toUpperCase() === selectedCategory.toUpperCase()
      );
    }

    if (!searchTerm.trim()) {
      return result;
    }

    const term = searchTerm.toLowerCase();

    return result
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
  }, [listKeys, searchTerm, selectedCategory]);

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

  const handleCreateNewKey = async () => {
    const cleanKey = newKeyName.trim().replace(/\s+/g, "_");
    if (!cleanKey) {
      swal({
        title: "Nome da chave obrigatório",
        text: "Por favor informe o identificador da chave (ex: minha_chave_api)",
        icon: "warning",
      });
      return;
    }

    try {
      setModalLoading(true);
      const val = newKeyType === "boolean" ? (newKeyValue === "1" ? "1" : "0") : newKeyValue;

      const res = await api.put("config", {
        [cleanKey]: val === "" ? null : val,
      });

      if (res.status) {
        swal({
          title: "Chave adicionada com sucesso!",
          icon: "success",
        });

        setIsModalOpen(false);
        setNewKeyName("");
        setNewKeyDesc("");
        setNewKeyValue("");
        await getAllKeys();
      }
    } catch (error) {
      const responseError = error as AxiosError<any>;
      swal({
        title: responseError.response?.data?.message || "Erro ao criar nova chave",
        icon: "error",
      });
    } finally {
      setModalLoading(false);
    }
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

          <Tooltip title="Adicionar nova chave ao sistema">
            <Button
              type="primary"
              icon={<FaPlus style={{ marginRight: 4 }} />}
              onClick={() => setIsModalOpen(true)}
              style={{ backgroundColor: "#0284c7", borderColor: "#0284c7" }}
            >
              Nova Chave
            </Button>
          </Tooltip>

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

      {/* Category Quick Filter Pills */}
      <CategoryFilterContainer>
        <CategoryFilterPill
          active={selectedCategory === null}
          onClick={() => {
            setSelectedCategory(null);
            handleExpandAll();
          }}
        >
          <span>Todas</span>
          <span className="pill-count">{totalKeysCount}</span>
        </CategoryFilterPill>
        {listKeys.map((cat) => {
          const meta = getCategoryMeta(cat.type);
          const count = cat.config?.length || 0;
          const isActive = selectedCategory === cat.type;

          return (
            <CategoryFilterPill
              key={cat.type}
              active={isActive}
              onClick={() => {
                if (isActive) {
                  setSelectedCategory(null);
                } else {
                  setSelectedCategory(cat.type);
                  setActiveKeys([String(cat.type)]);
                }
              }}
            >
              {meta.icon}
              <span>{meta.label.split("&")[0].trim()}</span>
              <span className="pill-count">{count}</span>
            </CategoryFilterPill>
          );
        })}
      </CategoryFilterContainer>

      {filteredCategories.length === 0 ? (
        <EmptyState>
          <FaSearch style={{ fontSize: 36, color: "#cbd5e1", marginBottom: 12 }} />
          <h3>Nenhuma chave encontrada</h3>
          <p>Tente ajustar o termo de pesquisa ou selecione outra categoria.</p>
          <Button
            type="primary"
            onClick={() => {
              setSearchTerm("");
              setSelectedCategory(null);
            }}
          >
            Limpar Filtros
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

      {/* Floating Scroll to Top Button */}
      {showScrollTop && (
        <Tooltip title="Voltar ao topo da página">
          <FloatingScrollTopButton onClick={scrollToTop} aria-label="Voltar ao topo">
            <FaArrowUp />
          </FloatingScrollTopButton>
        </Tooltip>
      )}

      {/* Modal Nova Chave */}
      <Modal
        title={
          <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 16 }}>
            <FaPlus style={{ color: "#0284c7" }} /> Adicionar Nova Chave de Configuração
          </div>
        }
        visible={isModalOpen}
        onOk={handleCreateNewKey}
        onCancel={() => setIsModalOpen(false)}
        confirmLoading={modalLoading}
        okText="Salvar Chave"
        cancelText="Cancelar"
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 14, paddingTop: 10 }}>
          <div>
            <label style={{ fontSize: 13, fontWeight: 600, color: "#334155", display: "block", marginBottom: 4 }}>
              Identificador da Chave (Nome no Banco) *
            </label>
            <Input
              placeholder="ex: nova_chave_api_servico"
              value={newKeyName}
              onChange={(e) => setNewKeyName(e.target.value)}
            />
            <span style={{ fontSize: 11, color: "#64748b" }}>Sem espaços (use underlines).</span>
          </div>

          <div>
            <label style={{ fontSize: 13, fontWeight: 600, color: "#334155", display: "block", marginBottom: 4 }}>
              Categoria
            </label>
            <Select
              style={{ width: "100%" }}
              value={newKeyCategory}
              onChange={(val) => setNewKeyCategory(val)}
            >
              <Option value="MAPS">Mapas, Geocodificação & Rotas</Option>
              <Option value="PAGAMENTOS">Gateways & Meios de Pagamento</Option>
              <Option value="FIREBASE">Firebase & Notificações Push</Option>
              <Option value="WHATSAPP">WhatsApp & Atendimento</Option>
              <Option value="SOCKET">Servidor Socket, Redis & Tempo Real</Option>
              <Option value="DELIVERY">Módulo de Entregas & Delivery</Option>
              <Option value="SMS">Envio de SMS & Autenticação</Option>
              <Option value="EMAIL">Serviço de E-mail (SMTP)</Option>
              <Option value="SONS">Sons & Alertas do Aplicativo</Option>
              <Option value="VIAGENS">Regras de Viagens & Despacho</Option>
              <Option value="SISTEMA">Aplicativos, Cadastros & Segurança</Option>
            </Select>
          </div>

          <div>
            <label style={{ fontSize: 13, fontWeight: 600, color: "#334155", display: "block", marginBottom: 4 }}>
              Descrição / Rótulo Amigável
            </label>
            <Input
              placeholder="ex: Chave Secreta da API de Pagamentos"
              value={newKeyDesc}
              onChange={(e) => setNewKeyDesc(e.target.value)}
            />
          </div>

          <div>
            <label style={{ fontSize: 13, fontWeight: 600, color: "#334155", display: "block", marginBottom: 4 }}>
              Tipo de Entrada
            </label>
            <Select
              style={{ width: "100%" }}
              value={newKeyType}
              onChange={(val) => {
                setNewKeyType(val);
                if (val === "boolean") setNewKeyValue("1");
              }}
            >
              <Option value="text">Texto / Link Comum</Option>
              <Option value="boolean">Booleano (Ativado / Desativado Switch)</Option>
              <Option value="password">Senha / Token Secreto</Option>
              <Option value="audio">URL de Arquivo de Áudio</Option>
              <Option value="number">Número / Tempo / Taxa</Option>
            </Select>
          </div>

          <div>
            <label style={{ fontSize: 13, fontWeight: 600, color: "#334155", display: "block", marginBottom: 4 }}>
              Valor Inicial
            </label>
            {newKeyType === "boolean" ? (
              <Select
                style={{ width: "100%" }}
                value={newKeyValue === "1" ? "1" : "0"}
                onChange={(val) => setNewKeyValue(val)}
              >
                <Option value="1">1 (Ativado)</Option>
                <Option value="0">0 (Desativado)</Option>
              </Select>
            ) : (
              <Input
                placeholder="Insira o valor inicial..."
                value={newKeyValue}
                onChange={(e) => setNewKeyValue(e.target.value)}
              />
            )}
          </div>
        </div>
      </Modal>
    </Content>
  );
};

export default KeysApp;
