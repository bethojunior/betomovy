import { FC, useCallback, useContext, useEffect, useRef, useState } from "react";
import { Link, useHistory, useLocation } from "react-router-dom";
import { Menu as MenuAnt } from "antd";
import Swal from "sweetalert";
import api from "../../../services/api";
import {
  AiOutlineUser,
  AiOutlineLogout,
  AiOutlineDollar,
  AiOutlineSolution,
  AiOutlineTeam,
  AiOutlineHome,
  AiOutlineDashboard,
  AiOutlineDesktop,
  AiOutlineBulb,
  AiOutlineLock,
  AiOutlineMessage,
  AiOutlineMail,
  AiFillNotification,
  AiOutlineClear,
  AiOutlineClose,
} from "react-icons/ai";
import { MdGroups2 } from "react-icons/md";
import AuthContext from "../../../contexts/auth";
import { useLanguage } from "../../../contexts/language";
import {
  CLIENTE,
  CONFIGURACAO,
  FINANCEIRO,
  MENSAGEM,
  MONITORAMENTO,
  MOTORISTA,
  PUBLICIDADE,
  PROMOCAO,
  TARIFAS,
  VIAGEM,
  CENTRAL,
  CENTRAL_LISTAGEM,
  CENTRAL_SUBMENU_PERMISSIONS,
  CENTRAL_USUARIOS,
  CENTRAL_BAIRROS,
  CENTRAL_CONFIGURACOES,
  hasAnySubmenuPermission,
  POLITICA_USO_APP,
  DELIVERY,
  FRETE,
  ENTREGA,
  WEBHOOKS,
  ROTA,
  GESTOR,
  MAPA,
  WHATSAPP,
  ACESSAR_GRUPO_WHATSAPP_VIAGEM_AGENDADA,
  CONTATO,
  VERSAO,
  CIDADE,
  CIDADE_ADICIONAR_AREA,
  CIDADE_EDITAR_AREA,
  FINANCEIRO_PRODUCAO_MOTORISTA,
  FINANCEIRO_COMPRA_CREDITO,
  FINANCEIRO_SOLICITACOES_TRANSFERENCIA,
  FINANCEIRO_RELATORIOS,
  FINANCEIRO_TAXA_CANCELAMENTO,
  FINANCEIRO_LANCAMENTO_FINANCEIRO,
  FINANCEIRO_GESTAO_MONETIZACAO,
  FINANCEIRO_EXIBIR_DASHBOARD_ADQUIRENTE,
  FINANCEIRO_RELATORIO_GERAL_SINTETICO,
  CONFIGURACAO_GERENCIAR_CADASTRO_APP,
  CONFIGURACAO_CATEGORIA_CADASTRO,
  CONFIGURACAO_GERENCIAR_DOCUMENTO,
  CONFIGURACAO_DOCUMENTOS_APP,
  CONFIGS_REGISTER_SUBMENU_PERMISSIONS,
} from "../../../constants/permissions";
import ChangePassword from "../../ChangePasswordModal";
import { CrispChatCloseFab, SubMenuStyle } from "./styles";

interface MenuItem {
  key: string;
  name: string;
  to: string;
  permission: boolean;
  children?: MenuItem[];
  onClick?: () => void;
  icon?: JSX.Element;
  speedmob?: string;
}

interface ListProps {
  setCollapsed(collapsed: boolean): void;
  isMobile: boolean;
}

interface CrispWindow extends Window {
  $crisp?: unknown[] & {
    push(command: unknown[]): void;
    get?(method: string): number | string | null;
    /** Doc: não usar antes do Crisp estar pronto; proteger com try/catch. */
    is?(method: string): boolean;
  };
  CRISP_WEBSITE_ID?: string;
}

const CRISP_SCRIPT_ID = "crisp-script";
const SUPPORT_CHAT_VISIBILITY_POLL_INTERVAL_IN_MS = 3000;

const resolveCrispWebsiteId = (): string => {
  return String(import.meta.env.CRISP_WEBSITE_ID ?? "").trim();
};
const ListMenu: FC<ListProps> = ({ isMobile, setCollapsed }) => {
  const { signOut, hasPermission } = useContext(AuthContext);
  const { t } = useLanguage();
  const history = useHistory();
  const location = useLocation();
  const canImportClients = hasPermission(CONFIGURACAO, "importar_cliente");
  const canImportDrivers = hasPermission(CONFIGURACAO, "importar_motorista");
  const canBulkBlockDrivers = hasPermission(
    CONFIGURACAO,
    "bloquear_massa_prestadores"
  );
  const canBulkUnblockDrivers = hasPermission(
    CONFIGURACAO,
    "desbloquear_massa_prestadores_cpf"
  );
  const canResetDriverBalance = hasPermission(
    CONFIGURACAO,
    "zerar_saldo_motorista"
  );
  const canResetDriverRating = hasPermission(
    CONFIGURACAO,
    "zerar_nota_motorista"
  );
  const canAccessImportSettings =
    canImportClients ||
    canImportDrivers ||
    canBulkBlockDrivers ||
    canBulkUnblockDrivers ||
    canResetDriverBalance ||
    canResetDriverRating;
  /** true = usuário clicou no X nesta “tela”; zera ao mudar rota ou recarregar a página. */
  const crispBubbleDismissedUntilNavRef = useRef<boolean>(false);
  /** Painel do chat expandido (eventos chat:opened / chat:closed). O bubble pode estar visível com painel fechado. */
  const [isCrispPanelOpen, setIsCrispPanelOpen] = useState<boolean>(false);
  /** Widget/bubble visível na página ($crisp.is("chat:visible")). */
  const [isCrispBubbleVisible, setIsCrispBubbleVisible] = useState<boolean>(false);

  const handleLogout = useCallback(async () => {
    signOut();
  }, [signOut]);

  const handleCloseMenuIfMobile = () => {
    if (isMobile) {
      return setCollapsed(true);
    }
    return "";
  };

  const handleResetBalance = async () => {
    const result = await Swal({
      title: "Cuidado!",
      text: "Essa função ZERA O SALDO DE TODOS OS MOTORISTAS DA CIDADE. Deseja continuar?",
      icon: "warning",
      buttons: {
        cancel: {
          text: "Não",
          value: null,
          visible: true,
          className: "btn-cancel",
          closeModal: true,
        },
        confirm: {
          text: "Sim",
          value: true,
          visible: true,
          className: "btn-confirm",
          closeModal: true,
        },
      },
      dangerMode: true,
      className: "custom-swal",
    });

    if (result) {
      try {
        const response = await api.post("resetBalance/driver");
        if (response.data.status) {
          Swal({
            title: "Sucesso",
            text: "Saldos zerados com sucesso!",
            icon: "success",
            className: "custom-swal",
          });
        }
      } catch (error) {
        Swal({
          title: "Erro",
          text: "Erro ao zerar saldo dos motoristas",
          icon: "error",
          className: "custom-swal",
        });
      }
    }
  };

  const handleResetRating = async () => {
    const result = await Swal({
      title: "Cuidado!",
      text: "Essa função RESETA A NOTA DE TODOS OS MOTORISTAS DA CIDADE. Deseja continuar?",
      icon: "warning",
      buttons: {
        cancel: {
          text: "Não",
          value: null,
          visible: true,
          className: "btn-cancel",
          closeModal: true,
        },
        confirm: {
          text: "Sim",
          value: true,
          visible: true,
          className: "btn-confirm",
          closeModal: true,
        },
      },
      dangerMode: true,
      className: "custom-swal",
    });

    if (result) {
      try {
        const response = await api.put("driver/resetRating");
        if (response.data.status) {
          Swal({
            title: "Sucesso",
            text: "Notas resetadas com sucesso!",
            icon: "success",
            className: "custom-swal",
          });
        }
      } catch (error) {
        Swal({
          title: "Erro",
          text: "Erro ao resetar nota dos motoristas",
          icon: "error",
          className: "custom-swal",
        });
      }
    }
  };

  const handleClearCache = () => {
    Swal({
      title: "Atenção",
      text: "Ao realizar o processo o usuário será deslogado do sistema.",
      icon: "warning",
      buttons: ["VOLTAR", "SEGUIR"],
    }).then(async (result: boolean) => {
      if (result) {
        document.cookie.split(";").forEach((cookie) => {
          const eqPos = cookie.indexOf("=");
          const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
          document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
        });

        localStorage.clear();
        sessionStorage.clear();

        if ("caches" in window) {
          const cacheNames = await caches.keys();
          await Promise.all(cacheNames.map((cache) => caches.delete(cache)));
        }

        window.location.reload();
      }
    });
  };

  const [isModalVisible, setIsModalVisible] = useState(false);

  const speedmob = import.meta.env.ISSPEEDMOB;

  const handleCloseCrispChat = useCallback((): void => {
    crispBubbleDismissedUntilNavRef.current = true;
    const crispWindow = window as CrispWindow;
    if (crispWindow.$crisp && typeof crispWindow.$crisp.push === "function") {
      crispWindow.$crisp.push(["do", "chat:hide"]);
    }
    setIsCrispPanelOpen(false);
    setIsCrispBubbleVisible(false);
  }, []);

  useEffect(() => {
    if (!hasPermission(CONTATO, "access_crisp")) {
      return;
    }
    const crispWebsiteId = resolveCrispWebsiteId();
    if (crispWebsiteId.length === 0) {
      return;
    }
    const crispWindow = window as CrispWindow;
    crispWindow.$crisp = crispWindow.$crisp || [];
    crispWindow.CRISP_WEBSITE_ID = crispWebsiteId;
    let waitCrispReadyId: number | null = null;
    let waitCrispReadyTimeoutId: number | null = null;
    const syncCrispBubbleVisible = (): void => {
      if (!crispWindow.$crisp || typeof crispWindow.$crisp.is !== "function") {
        return;
      }
      try {
        setIsCrispBubbleVisible(crispWindow.$crisp.is("chat:visible"));
      } catch {
        return;
      }
    };
    const applyCrispVisibilityWhenReady = (): void => {
      if (!crispWindow.$crisp || typeof crispWindow.$crisp.push !== "function") {
        return;
      }
      crispWindow.$crisp.push([
        "do",
        crispBubbleDismissedUntilNavRef.current ? "chat:hide" : "chat:show",
      ]);
      if (crispBubbleDismissedUntilNavRef.current) {
        setIsCrispPanelOpen(false);
      }
      syncCrispBubbleVisible();
    };
    const onChatOpened = (): void => {
      setIsCrispPanelOpen(true);
    };
    const onChatClosed = (): void => {
      setIsCrispPanelOpen(false);
    };
    const registerEvents = (): void => {
      if (!crispWindow.$crisp || typeof crispWindow.$crisp.push !== "function") {
        return;
      }
      crispWindow.$crisp.push(["on", "chat:opened", onChatOpened]);
      crispWindow.$crisp.push(["on", "chat:closed", onChatClosed]);
    };
    registerEvents();
    const existingScript = document.getElementById(CRISP_SCRIPT_ID);
    if (!existingScript) {
      const script = document.createElement("script");
      script.id = CRISP_SCRIPT_ID;
      script.src = "https://client.crisp.chat/l.js";
      script.async = true;
      script.addEventListener("load", applyCrispVisibilityWhenReady);
      document.head.appendChild(script);
    } else if (typeof crispWindow.$crisp?.is === "function") {
      applyCrispVisibilityWhenReady();
    } else {
      waitCrispReadyId = window.setInterval(() => {
        if (typeof crispWindow.$crisp?.is === "function") {
          applyCrispVisibilityWhenReady();
          if (waitCrispReadyId !== null) {
            window.clearInterval(waitCrispReadyId);
            waitCrispReadyId = null;
          }
          if (waitCrispReadyTimeoutId !== null) {
            window.clearTimeout(waitCrispReadyTimeoutId);
            waitCrispReadyTimeoutId = null;
          }
        }
      }, 200);
      waitCrispReadyTimeoutId = window.setTimeout(() => {
        if (waitCrispReadyId !== null) {
          window.clearInterval(waitCrispReadyId);
          waitCrispReadyId = null;
        }
        waitCrispReadyTimeoutId = null;
      }, 20000);
    }
    syncCrispBubbleVisible();
    const crispVisibilityPollingId = window.setInterval(
      syncCrispBubbleVisible,
      SUPPORT_CHAT_VISIBILITY_POLL_INTERVAL_IN_MS
    );
    return () => {
      if (crispWindow.$crisp && typeof crispWindow.$crisp.push === "function") {
        crispWindow.$crisp.push(["off", "chat:opened"]);
        crispWindow.$crisp.push(["off", "chat:closed"]);
      }
      if (waitCrispReadyId !== null) {
        window.clearInterval(waitCrispReadyId);
      }
      if (waitCrispReadyTimeoutId !== null) {
        window.clearTimeout(waitCrispReadyTimeoutId);
      }
      window.clearInterval(crispVisibilityPollingId);
    };
  }, [hasPermission]);

  useEffect(() => {
    if (!hasPermission(CONTATO, "access_crisp")) {
      return;
    }
    crispBubbleDismissedUntilNavRef.current = false;
    const crispWindow = window as CrispWindow;
    if (crispWindow.$crisp && typeof crispWindow.$crisp.push === "function") {
      crispWindow.$crisp.push(["do", "chat:show"]);
    }
    if (crispWindow.$crisp && typeof crispWindow.$crisp.is === "function") {
      try {
        setIsCrispBubbleVisible(crispWindow.$crisp.is("chat:visible"));
      } catch {
        return;
      }
    }
  }, [hasPermission, location.pathname]);

  const list: MenuItem[] = [
    {
      key: "dashboard",
      name: "Dashboard",
      icon: <AiOutlineHome />,
      to: "/",
      permission: true,
    },
    {
      key: "monitoring",
      name: "Monitoramento",
      icon: <AiOutlineDesktop />,
      to: "/monitoring",
      permission: hasPermission(MONITORAMENTO),
      speedmob: speedmob,
    },
    {
      key: "clientes",
      name: "Clientes",
      icon: <AiOutlineTeam />,
      to: "",
      permission: hasPermission(CLIENTE),
      children: [
        {
          key: "clientes-1",
          name: "Lista de pessoa física",
          to: "/client/list",
          permission: hasPermission(CLIENTE, "listar"),
          children: [],
        },
        {
          key: "clientes-2",
          name: "Lista de pessoa jurídica",
          to: "/client/legalPerson",
          permission: hasPermission(CLIENTE, "listar"),
          children: [],
          speedmob: speedmob,
        },
        {
          key: "exclusion-client",
          name: "Solicitação de exclusão da conta",
          to: "/client/solicitations-exclusion",
          permission: hasPermission(CLIENTE, "solicitacao_exclusao_conta"),
          children: [],
        },
      ],
    },
    {
      key: "motoristas",
      name: "Motoristas",
      icon: <AiOutlineUser />,
      to: "",
      permission: hasPermission(MOTORISTA),
      children: [
        {
          key: "motoristas-1",
          name: "Lista",
          to: "/driver/list",
          permission: hasPermission(MOTORISTA, "listar"),
          children: [],
        },
        {
          key: "cadastro-motorista",
          name: "Cadastro de Motorista",
          to: "/driver/signup",
          permission: hasPermission(MOTORISTA, "listar"),
          children: [],
        },
        {
          key: "cars-pending",
          name: "Solicitação de mudança de veículos",
          to: "/car/pending",
          permission: hasPermission(MOTORISTA, "change_vehicle"),
          children: [],
        },
        {
          key: "request-documents",
          name: "Solicitar documentos",
          to: "/driver/request-documents",
          permission: hasPermission(MOTORISTA, "listar"),
          children: [],
        },
        {
          key: "exclusion-driver",
          name: "Solicitação de exclusão da conta",
          to: "/driver/solicitations-exclusion",
          permission: hasPermission(MOTORISTA, "solicitacao_exclusao_conta"),
          children: [],
        },
      ],
    },
    {
      key: "viagem",
      name: "Viagens",
      icon: <AiOutlineDashboard />,
      to: "",
      permission: hasPermission(VIAGEM),
      children: [
        {
          key: "viagem-1",
          name: "Lista",
          to: "/trip/list/0",
          permission: hasPermission(VIAGEM, "listar"),
          children: [],
        },
      ],
    },
    {
      key: "delivery",
      name: "Delivery",
      icon: <AiOutlineDashboard />,
      to: "",
      permission: hasPermission(DELIVERY),
      children: [
        {
          key: "delivery-monitoring",
          name: "Monitoramento",
          to: "/delivery/monitoring",
          permission: hasPermission(DELIVERY),
          children: [],
        },
        {
          key: "delivery_config",
          name: "Configurações",
          to: "",
          permission: hasPermission(DELIVERY),
          children: [
            {
              key: "delivery_sections",
              name: "Seções",
              to: "/delivery/config/sections",
              permission: hasPermission(DELIVERY, "gerenciar_secao_delivery"),
              children: [],
            },
            {
              key: "categories-of-establishments",
              name: "Categorias de estabelecimentos",
              to: "/delivery/config/establisments",
              permission: hasPermission(DELIVERY),
              children: [],
            },
            {
              key: "financial managment",
              name: "Gestão Financeira",
              to: "/delivery/financial",
              permission: hasPermission(CLIENTE, "listar"),
              children: [],
            },
            {
              key: "manage-delivery-zone",
              name: "Gerenciar Zona de Entrega",
              to: "/delivery/config/zone-delivery",
              permission: hasPermission(DELIVERY, "gerenciar_zona"),
              children: [],
            },
            {
              key: "delivery-accessories",
              name: "Acessórios de entrega",
              to: "/delivery/config/deliveryAccessories",
              permission: hasPermission(DELIVERY, "gerenciar_cobranca"),
              children: [],
            },
            {
              key: "delivery-general-config",
              name: "Configurações Gerais",
              to: "/delivery/config",
              permission: hasPermission(DELIVERY),
              children: [],
            },
            {
              key: "delivery-configuration",
              name: "Configuração Delivery",
              to: "/delivery/deliveryConfiguration",
              permission: hasPermission(DELIVERY),
              children: [],
            },
            {
              key: "asaas-configuration",
              name: "Configuração do Token ASAAS",
              to: "/delivery/config/asaas",
              permission: hasPermission(DELIVERY, "gerenciar_cobranca"),
              children: [],
            },
          ],
        },
        {
          key: "register-establishments",
          name: "Cadastro de estabelecimentos",
          to: "/delivery/registerEstablishments",
          permission: hasPermission(DELIVERY, "liberar_empresa"),
          children: [],
        },
        {
          key: "delivery_call_config",
          name: "Configurações do chamado",
          to: "/delivery/config/configCall",
          permission: hasPermission(DELIVERY, "gerenciar_cobranca"),
          children: [],
        },
      ],
    },
    {
      key: "financial",
      name: "Financeiro",
      icon: <AiOutlineDollar />,
      to: "",
      permission: hasPermission(FINANCEIRO),
      children: [
        {
          key: "financial-1",
          name: "Produção do motorista",
          to: "/financial/report-production-driver/0",
          permission: hasPermission(FINANCEIRO, FINANCEIRO_PRODUCAO_MOTORISTA),
          children: [],
        },
        {
          key: "financial-2",
          name: "Taxa de Cancelamento",
          to: "/financial/cancellation-fee",
          permission: hasPermission(FINANCEIRO, FINANCEIRO_TAXA_CANCELAMENTO),
          children: [],
        },
        {
          key: "financial-3",
          name: "Lançamento financeiro",
          to: "/financial/charge",
          permission: hasPermission(FINANCEIRO, FINANCEIRO_LANCAMENTO_FINANCEIRO),
          children: [],
        },
        {
          key: "financial-4",
          name: "Compra de crédito",
          to: "/financial/prepaid",
          permission: hasPermission(FINANCEIRO, FINANCEIRO_COMPRA_CREDITO),
          children: [],
        },
        {
          key: "financial-5",
          name: "Gestão de Comissão",
          to: "/financial/commision",
          permission: hasPermission(FINANCEIRO, FINANCEIRO_GESTAO_MONETIZACAO),
          children: [],
        },
        {
          key: "financial-6",
          name: "Solicitações de Transferências",
          to: "/financial/list",
          permission: hasPermission(FINANCEIRO, FINANCEIRO_SOLICITACOES_TRANSFERENCIA),
          children: [],
        },
        {
          key: "financial-7",
          name: "Relatórios",
          to: "/financial/reports",
          permission: hasPermission(FINANCEIRO, FINANCEIRO_RELATORIOS),
          children: [],
        },
        {
          key: "financial-8",
          name: "Dashboard Adquirente",
          to: "/financial/dashboard",
          permission: hasPermission(FINANCEIRO, FINANCEIRO_EXIBIR_DASHBOARD_ADQUIRENTE),
          children: [
            {
              key: "financial-8-1",
              name: "Visão Geral",
              to: "/financial/dashboard",
              permission: hasPermission(FINANCEIRO, FINANCEIRO_EXIBIR_DASHBOARD_ADQUIRENTE),
              children: [],
            },
            {
              key: "financial-8-2",
              name: "Transações",
              to: "/financial/dashboard?tab=transacoes",
              permission: hasPermission(FINANCEIRO, FINANCEIRO_EXIBIR_DASHBOARD_ADQUIRENTE),
              children: [],
            },
            {
              key: "financial-8-4",
              name: "Relatórios",
              to: "/financial/dashboard?tab=relatorios",
              permission: hasPermission(FINANCEIRO, FINANCEIRO_EXIBIR_DASHBOARD_ADQUIRENTE),
              children: [],
            },
          ],
        },
      ],
    },
    {
      key: "message",
      name: "Mensagem",
      icon: <AiOutlineMail />,
      to: "",
      permission: hasPermission(MENSAGEM),
      speedmob: speedmob,
      children: [
        {
          key: "message-1",
          name: "Notificação",
          to: "/message/Notification",
          permission: hasPermission(MENSAGEM, "mensagem_usuario"),
          children: [],
        },
        {
          key: "message-2",
          name: "Notificações de aniversário",
          to: "/message/birthdayNotification",
          permission: hasPermission(MENSAGEM, "notification_birthday"),
          children: [],
        },
      ],
    },
    {
      key: "talkToUs",
      name: "Fale conosco",
      icon: <AiOutlineMessage />,
      to: "",
      permission: hasPermission(VIAGEM),
      children: [
        {
          key: "talkToUs-1",
          name: "Cliente",
          to: "/pages/TalkToUs/Client",
          permission: true,
          children: [],
        },
        {
          key: "talkToUs-2",
          name: "Viagens",
          to: "/pages/TalkToUs/Trip",
          permission: true,
          children: [],
        },
      ],
    },
    {
      key: "report",
      name: "Relatórios",
      icon: <AiOutlineSolution />,
      to: "",
      permission: hasPermission(FINANCEIRO),
      children: [
        {
          key: "report-1",
          name: "Gerar",
          to: "/report/create",
          permission: hasPermission(FINANCEIRO, FINANCEIRO_RELATORIO_GERAL_SINTETICO),
          children: [],
        },
        {
          key: "report-2",
          name: "Listagem",
          to: "/report/list",
          permission: hasPermission(FINANCEIRO, FINANCEIRO_RELATORIO_GERAL_SINTETICO),
          children: [],
        },
      ],
    },
    {
      key: "callGroup",
      name: "Grupos de chamados",
      icon: <MdGroups2 />,
      to: "/callGroups",
      permission: hasPermission(CONFIGURACAO, "grupo_chamado"),
      children: [
        {
          key: "callGroupList",
          name: "Listagem",
          to: "/callGroups/listCallGroups",
          permission: hasPermission(CONFIGURACAO, "grupo_chamado"),
        },
        {
          key: "callGroupLinkedDrivers",
          name: "Motoristas Vinculados",
          to: "/callGroups/linkedDrivers",
          permission: hasPermission(CONFIGURACAO, "grupo_chamado"),
        },
      ],
    },
    {
      key: "notifications-admins",
      name: "Notificações Admins",
      icon: <AiFillNotification />,
      to: "/config/notifications-admin",
      permission: hasPermission(CONFIGURACAO),
    },
    {
      key: "advanced",
      name: "Avançadas",
      icon: <AiOutlineBulb />,
      to: "",
      permission: true,
      children: [
        {
          key: "config",
          name: "Configurações",
          to: "",
          permission: hasPermission(CONFIGURACAO),
          children: [
            {
              key: "config-city",
              name: "Áreas de Cidade",
              to: "",
              permission: hasPermission(CIDADE, CIDADE_ADICIONAR_AREA) || hasPermission(CIDADE, CIDADE_EDITAR_AREA),
              children: [
                {
                  key: "add-city",
                  name: "Adicionar Cidade",
                  to: "/config/areasCity/addCity",
                  permission: hasPermission(CIDADE, CIDADE_ADICIONAR_AREA),
                  children: [],
                },
                {
                  key: "edit-city",
                  name: "Editar Cidade",
                  to: "/config/areasCity/editCity",
                  permission: hasPermission(CIDADE, CIDADE_EDITAR_AREA),
                  children: [],
                },
              ],
            },
            {
              key: "admin",
              name: "Administrador",
              to: "",
              permission: hasPermission(CONFIGURACAO, "gerenciar_perfil"),
              children: [
                {
                  key: "admin-2",
                  name: "Perfis",
                  to: "/config/admin/profile",
                  permission: true,
                  children: [],
                },
                {
                  key: "admin-3",
                  name: "Usuários",
                  to: "/config/admin/createUser/",
                  permission: true,
                  children: [],
                },
              ],
            },
            {
              key: "acquirer",
              name: "Adquirente global",
              to: "/config/acquirer",
              permission: hasPermission(CONFIGURACAO, "gerenciar_adquirentes"),
              children: [],
            },
            {
              key: "confirmation_code",
              name: "Confirmação de Código",
              to: "/config/confirmationCode",
              permission: hasPermission(
                CONFIGURACAO,
                "gerenciar_codigos_confirmacao"
              ),
              children: [],
            },
            {
              key: "acquirerByCity",
              name: "Adquirente por cidade",
              to: "/config/acquirerByCity",
              permission: hasPermission(CONFIGURACAO, "gerenciar_adquirentes"),
              children: [],
            },
            {
              key: "whatsapp",
              name: "Whatsapp",
              to: "",
              permission: hasPermission(WHATSAPP),
              speedmob: speedmob,
              children: [
                {
                  key: "whatsapp-session",
                  name: "Conectar whatsapp",
                  to: "/config/whatsapp-session",
                  permission: hasPermission(WHATSAPP, 'acessar_sessao_whatsapp'),
                  children: [],
                },
                {
                  key: "keys-whatsapp",
                  name: "Chaves WhatsApp",
                  to: "/chaves-whatsapp",
                  permission: hasPermission(WHATSAPP, 'acessar_chaves_whatsapp'),
                  children: [],
                },
                {
                  key: "whatsapp-scheduled-trip",
                  name: "Notificações de viagem (WhatsApp)",
                  to: "/config/whatsapp-scheduled-trip-notifications",
                  permission: hasPermission(WHATSAPP, ACESSAR_GRUPO_WHATSAPP_VIAGEM_AGENDADA),
                  children: [],
                },
              ],
            },

            {
              key: "callManagement",
              name: "Chamado",
              to: "/config/callManagement",
              permission: hasPermission(CONFIGURACAO, "gerenciar_chamado"),
              children: [],
            },
            {
              key: "MethodsPayments",
              name: "Formas de Pagamentos",
              to: "/config/methodPayments",
              permission: hasPermission(
                CONFIGURACAO,
                "gerenciar_formas_pagamento"
              ),
              children: [],
            },
            {
              key: "keysapp",
              name: "Chaves do app",
              to: "/config/keysApp",
              permission: hasPermission(CONFIGURACAO, "config_app"),
              children: [],
            },
            {
              key: "logsMongo",
              name: "Ver Logs do Mongo",
              to: "/config/logsMongo",
              permission: hasPermission(CONFIGURACAO, "config_app"),
              children: [],
            },
            {
              key: "radius",
              name: "Raio de chamado por cidade",
              to: "/config/radius",
              permission: hasPermission(CONFIGURACAO, "raio_de_chamado"),
              children: [],
            },
            {
              key: "byCity",
              name: "Por cidade",
              to: "/config/configByCities",
              permission: hasPermission(CONFIGURACAO, "cidade"),
              children: [],
            },
            {
              key: "manage-toll",
              name: "Gerenciar Pedágio",
              to: "/config/manage-toll",
              permission: hasPermission(CONFIGURACAO, "gerenciar_pedagios"),
              children: [],
            },
            {
              key: "terms",
              name: "Termos",
              to: "/config/terms",
              permission: hasPermission(CONFIGURACAO, "termos"),
              children: [],
            },
            {
              key: "configApp",
              name: "Configurações de apps",
              to: "/config/appConfig",
              permission: hasPermission(VERSAO, "versao"),
              children: [],
            },
            {
              key: "versions-from-config",
              name: "Versões",
              to: "/settings/versions",
              permission: hasPermission(VERSAO, "versao"),
              children: [],
            },
            {
              key: "configAppPartner",
              name: "Configurações de apps parceiros",
              to: "/config/config-app-partner",
              permission:
                import.meta.env.APP_PARTNER === "true"
                  ? hasPermission(CONFIGURACAO, "visualize_config_app_partner")
                  : false,
              children: [],
            },
            {
              key: "list_phones",
              name: "Lista telefonica",
              to: "/config/list-phones-general",
              permission: hasPermission(CONFIGURACAO, "visualize_list_contacts"),
              children: [],
            },
            {
              key: "firebase-verification",
              name: "Verificação Firebase",
              to: "/config/FirebaseVerification",
              permission: hasPermission(CONFIGURACAO, "gerenciar_perfil"),
              children: [],
            },
            {
              key: "config-smtp",
              name: "Configurações de serviço SMTP",
              to: "/config/smtp",
              permission: hasPermission(CONFIGURACAO, "config_service_smtp"),
              children: [],
            },
            {
              key: "pendencyDriver",
              name: "Penalidade de ações do motorista",
              to: "/config/pendencyDriver",
              permission: hasPermission(CONFIGURACAO, "penalty_for_driver"),
              children: [],
            },
            {
              key: "reasonsForCancellations",
              name: "Motivos de cancelamento",
              to: "/config/reasonCancellation",
              permission: hasPermission(
                CONFIGURACAO,
                "gerenciar_tipos_cancelamento"
              ),
              children: [],
            },
            {
              key: "additionalSettings",
              name: "Configurações adicionais",
              to: "/config/additionalSettings",
              permission: hasPermission(CONFIGURACAO, "additional_config"),
              children: [],
            },
            {
              key: "confis-externals-globals",
              name: "Serviços Externos Globais",
              to: "/config/services-externals-globals",
              permission: hasPermission(CONFIGURACAO, "external_services"),
              children: [],
            },
            {
              key: "confis-externals-by-city",
              name: "Serviços Externos Por Cidade",
              to: "/config/services-externals-by-city",
              permission: hasPermission(CONFIGURACAO, "external_services"),
              children: [],
            },
            {
              key: "confis-externals-by-webhook",
              name: "Serviços Externos Webhook",
              to: "/config/services-externals-webhook",
              permission: hasPermission(WEBHOOKS, "listar_webhooks"),
              children: [],
            },
            {
              key: "usagePolicy",
              name: "Política de uso do aplicativo",
              to: "/config/usagePolicy",
              permission: hasPermission(CONFIGURACAO, POLITICA_USO_APP),
              children: [],
            },
            {
              key: "messageDriverChatbot",
              name: "Mensagens do chat - Motorista",
              to: "/config/chatbot",
              permission: hasPermission(CONFIGURACAO, "gerenciar_perfil"),
              children: [],
            },
            {
              key: "modulesActives",
              name: "Módulos Ativos",
              to: "/config/modulesActives",
              permission: hasPermission(CONFIGURACAO, "config_app"),
              children: [],
            },
            {
              key: "configsRegister",
              name: "Configurações do Cadastro",
              to: "",
              permission: hasAnySubmenuPermission(hasPermission, CONFIGURACAO, CONFIGS_REGISTER_SUBMENU_PERMISSIONS),
              children: [
                {
                  key: "config-register-driver",
                  name: "Config. Tela de Cadastro Motorista",
                  to: "/config/configs-register/config-register-driver",
                  permission: hasPermission(CONFIGURACAO, CONFIGURACAO_GERENCIAR_CADASTRO_APP),
                  children: [],
                },
                {
                  key: "documents-by-category",
                  name: "Adicionar Documentos Por Categoria",
                  to: "/config/configs-register/documents-by-category",
                  permission: hasPermission(CONFIGURACAO, CONFIGURACAO_CATEGORIA_CADASTRO),
                  children: [],
                },
                {
                  key: "link-documents-client",
                  name: "Vincular Documento No Cadastro Do Cliente",
                  to: "/config/configs-register/link-documents-client",
                  permission: hasPermission(CONFIGURACAO, CONFIGURACAO_GERENCIAR_DOCUMENTO),
                  children: [],
                },
                {
                  key: "documents-app",
                  name: "Documentos Do App",
                  to: "/config/configs-register/documents-app",
                  permission: hasPermission(CONFIGURACAO, CONFIGURACAO_DOCUMENTOS_APP),
                  children: [],
                },
              ],
            },
            {
              key: "credentials-integration-external",
              name: "Credenciais de integração externa",
              to: "/config/credentials-integration-external",
              permission: hasPermission(CONFIGURACAO, "config_app"),
              children: [],
            },
            {
              key: "import",
              name: "Importações e Definições",
              to: "",
              permission: canAccessImportSettings,
              children: [
                {
                  key: "import-clients",
                  name: "Clientes",
                  to: "/setting/importClient",
                  permission: canImportClients,
                  children: [],
                },
                {
                  key: "import-drivers",
                  name: "Motoristas",
                  to: "/setting/importDriver",
                  permission: canImportDrivers,
                  children: [],
                },
                {
                  key: "import-drivers-blocked",
                  name: "Bloqueio em massa de Prestadores",
                  to: "/setting/importDriversBlocked",
                  permission: canBulkBlockDrivers,
                  children: [],
                },
                {
                  key: "import-drivers-unblocked",
                  name: "Desbloqueio em massa de Prestadores por CPF",
                  to: "/setting/importDriversUnblocked",
                  permission: canBulkUnblockDrivers,
                  children: [],
                },
                {
                  key: "reset-balance",
                  name: "Zerar Saldo dos Motoristas",
                  to: "",
                  permission: canResetDriverBalance,
                  onClick: handleResetBalance,
                  children: [],
                },
                {
                  key: "reset-rating",
                  name: "Zerar Nota dos Motoristas",
                  to: "",
                  permission: canResetDriverRating,
                  onClick: handleResetRating,
                  children: [],
                },
              ],
            },
          ],
        },
        {
          key: "deliveryItens",
          name: "Entrega",
          to: "",
          permission: hasPermission(CONFIGURACAO),
          children: [
            {
              key: "items",
              name: "Gerenciar Itens",
              to: "/simpledelivery/items",
              permission: true, //hasPermission(ENTREGA, "gerenciar_itens"),
              children: [],
            },
            {
              key: "suggestion-text",
              name: "Sugestão de Texto",
              to: "/simpledelivery/suggestion-text",
              permission: hasPermission(ENTREGA, "sugestao_texto"),
              children: [],
            },
          ],
        },
        {
          key: "tariffsItems",
          name: "Tarifas",
          to: "",
          permission: hasPermission(CONFIGURACAO),
          children: [
            {
              key: "typesTravels",
              name: "Tipos de Viagem",
              to: "/config/rates",
              permission: hasPermission(TARIFAS, "tarifa_listar"),
              children: [],
            },
            {
              key: "typesServices",
              name: "Tipos de Serviços",
              to: "/config/services",
              permission: hasPermission(TARIFAS, "tarifa_listar"),
              children: [],
            },
            {
              key: "tariffTrigger",
              name: "Gatilho de Tarifa",
              to: "/config/trigger",
              permission: hasPermission(TARIFAS, "tarifa_listar"),
              children: [],
            },
            {
              key: "flagTariff",
              name: "Bandeira de Tarifa",
              to: "/config/triggerLabel",
              permission: hasPermission(TARIFAS, "tarifa_listar"),
              children: [],
            },
            {
              key: "dynamicPerArea",
              name: "Dinâmica por Área",
              to: "/config/dynamicByArea",
              permission: hasPermission(TARIFAS, "tarifa_listar"),
              children: [],
            },
          ],
        },
        {
          key: "partners",
          name: "Parceiros",
          to: "",
          permission: true,
          children: [
            {
              key: "listPartner",
              name: "Listagem",
              to: "/partner/listPartner",
              permission: true,
              children: [],
            },
            {
              key: "messagePartner",
              name: "Mensagens da Ouvidoria",
              to: "/partner/messagePartner",
              permission: true,
              children: [],
            },
          ],
        },
        {
          key: "promotion",
          name: "Promoções",
          to: "",
          permission: hasPermission(PROMOCAO),
          children: [
            {
              key: "promotion1",
              name: "Cupons",
              to: "/promotion/listCupom",
              permission: hasPermission(PROMOCAO, "listar_cupom"),
              children: [],
            },
            {
              key: "promotion2",
              name: "Voucher",
              to: "/promotion/voucherList",
              permission: hasPermission(PROMOCAO, "inserir_cupom"),
              children: [],
            },
            {
              key: "promotion3",
              name: "Promoções por Viagem",
              to: "/promotion/saleTrip",
              permission: hasPermission(PROMOCAO, "inserir_cupom"),
              children: [],
            },
          ],
        },
        {
          key: "manager",
          name: "Gestor",
          to: "",
          permission: hasPermission(GESTOR),
          children: [
            {
              key: "manager-1",
              name: "Lista de Gestores",
              to: "/manager",
              permission: true,
              children: [],
            },
            {
              key: "manager-2",
              name: "Motoristas por Gestor",
              to: "/manager/drivers",
              permission: true,
              children: [],
            },
          ],
        },
        {
          key: "central",
          name: "Central",
          to: "",
          permission: hasAnySubmenuPermission(hasPermission, CENTRAL, CENTRAL_SUBMENU_PERMISSIONS),
          children: [
            {
              key: "central-list",
              name: "Listagem",
              to: "/central",
              permission: hasPermission(CENTRAL, CENTRAL_LISTAGEM),
              children: [],
            },
            {
              key: "central-users",
              name: "Listagem de usuários",
              to: "/central/listCustomer",
              permission: hasPermission(CENTRAL, CENTRAL_USUARIOS),
              children: [],
            },
            {
              key: "central-neighborhoods",
              name: "Bairros",
              to: "/central/neighborhoods",
              permission: hasPermission(CENTRAL, CENTRAL_BAIRROS),
              children: [],
            },
            {
              key: "central-config",
              name: "Configurações",
              to: "/central/setting",
              permission: hasPermission(CENTRAL, CENTRAL_CONFIGURACOES),
              children: [],
            },
          ],
        },
        {
          key: "frete",
          name: "Frete",
          to: "",
          permission: hasPermission(FRETE),
          children: [
            {
              key: "register-item",
              name: "Cadastro de Item",
              to: "/frete/register-item",
              permission: hasPermission(FRETE, "cadastro_item"),
              children: [],
            },
            {
              key: "list-itens-frete",
              name: "Listagem de Itens",
              to: "/frete/list-itens",
              permission: hasPermission(FRETE, "listagem_item"),
              children: [],
            },
            {
              key: "services-extras",
              name: "Serviços Extras",
              to: "/frete/services-extras",
              permission: hasPermission(FRETE, "acessibilidade_carga"),
              children: [],
            },
            {
              key: "load-accessibility",
              name: "Acessibilidade Carga",
              to: "/frete/load-accessibility",
              permission: hasPermission(FRETE, "acessibilidade_viagem"),
              children: [],
            },
          ],
        },
        {
          key: "publicity",
          name: "Publicidade",
          to: "",
          permission: hasPermission(CONFIGURACAO),
          children: [
            {
              key: "listPublicity",
              name: "Listar Publicidade",
              to: "/marketing/listPublicidade",
              permission: hasPermission(PUBLICIDADE, "inserir_publicidade"),
              children: [],
            },
            {
              key: "linkMarketingExternal",
              name: "Link Para Menu Externo",
              to: "/marketing/menuLinkExternal",
              permission: hasPermission(PUBLICIDADE, "link_menu_externo"),
              children: [],
            },
            {
              key: "publicityAppList",
              name: "Lista de Publicidade App Pro",
              to: "/marketing/publicidadeAppList",
              permission: hasPermission(PUBLICIDADE, "link_menu_externo"),
              children: [],
            },
            {
              key: "publicityApp",
              name: "Inserir Publicidade App Pro",
              to: "/marketing/publicidadeApp",
              permission: hasPermission(PUBLICIDADE, "link_menu_externo"),
              children: [],
            },
          ],
        },
        {
          key: "routes",
          name: "Rotas",
          to: "",
          permission: hasPermission(ROTA),
          children: [
            {
              key: "manageItems",
              name: "Gerenciar Itens",
              to: "/route/items",
              permission: hasPermission(ROTA, "gerenciar_item_rotas"),
              children: [],
            },
            {
              key: "routeRegister",
              name: "Cadastrar",
              to: "/route/routeRegister",
              permission: hasPermission(ROTA, "inserir"),
              children: [],
            },
            {
              key: "routeList",
              name: "Listagem",
              to: "/route/routeList",
              permission: hasPermission(ROTA, "listar"),
              children: [],
            },
            {
              key: "releaseDrivers",
              name: "Liberar Motoristas",
              to: "/route/releaseDrivers",
              permission: hasPermission(ROTA, "liberar"),
              children: [],
            },
            {
              key: "promotionalBanner",
              name: "Banners",
              to: "/route/promotionalBanner",
              permission: hasPermission(ROTA),
              children: [],
            },
          ],
        },
        {
          key: "maps",
          name: "Mapas",
          to: "",
          permission: hasPermission(MAPA),
          children: [
            {
              key: "gerencyAddress",
              name: "Gerenciar Endereços",
              to: "",
              permission: hasPermission(MAPA, "gerenciar_enderecos_mapas"),
              children: [
                {
                  key: "registerLocal",
                  name: "Cadastrar Locais",
                  to: "/setting/address",
                  permission: hasPermission(MAPA, "gerenciar_enderecos_mapas"),
                  children: [],
                },
                {
                  key: "addressIrregular",
                  name: "Endereços Irregulares",
                  to: "/setting/addressblacklist",
                  permission: hasPermission(MAPA, "gerenciar_enderecos_mapas"),
                  children: [],
                },
                {
                  key: "addressCache",
                  name: "Endereços Em Cache",
                  to: "/setting/cacheAddress",
                  permission: hasPermission(MAPA, "gerenciar_enderecos_mapas"),
                  children: [],
                },
              ],
            },
            {
              key: "configMaps",
              name: "Configurações Gerais",
              to: "/mapSetting/configMaps",
              permission: hasPermission(
                MAPA,
                "visualizar_configuracoes_gerais"
              ),
              children: [],
            },
            {
              key: "configCity",
              name: "Configurações Por Cidade",
              to: "/mapSetting/configbycity",
              permission: hasPermission(
                MAPA,
                "visualizar_conf_credenciais_cidade"
              ),
              children: [],
            },
            {
              key: "testsServiceMaps",
              name: "Teste Serviço De Mapa",
              to: "/mapSetting/tests",
              permission: hasPermission(MAPA, "teste_servico_mapas"),
              children: [],
            },
            {
              key: "routesOptimization",
              name: "Otimização De Rota",
              to: "/mapSetting/routeOptimization",
              permission: hasPermission(MAPA, "visualizar_otimizacao_rotas"),
              children: [],
            },
            {
              key: "webmap-key-management",
              name: "Gerenciar Chaves De Mapa Web",
              to: "/mapSetting/keys",
              permission: hasPermission(MAPA, "visualzar_gerenciar_chaves_web"),
              children: [],
            },
            {
              key: "mapSequencer",
              name: "Sequenciador De Mapas",
              to: "/mapSetting/mapSequencer",
              permission: hasPermission(MAPA, "sequenciador_mapas"),
              children: [],
            },
            {
              key: "riskArea",
              name: "Area De Risco",
              to: "/mapSetting/riskArea",
              permission: hasPermission(MAPA, "areas_riscos_visualizar"),
              children: [],
            },
            {
              key: "heatMaps",
              name: "Áreas De Calor Do Mapa",
              to: "/mapSetting/heatMap",
              permission: hasPermission(MAPA, "areas_de_calor"),
              children: [],
            },
             {
              key: "monitoringArea",
              name: "Área de Monitoramento",
              to: "/mapSetting/monitoringArea",
              permission: hasPermission(MAPA),
              children: [],
            },
          ],
        },
        {
          key: "configs-layouts",
          name: "Configurações de layouts",
          to: "/settings/config-layouts",
          permission: hasPermission(CONFIGURACAO, "configuracoes_layout"),
          children: [],
        },
        {
          key: "versions",
          name: "Versões",
          to: "/settings/versions",
          permission: hasPermission(VERSAO, "versao"),
          children: [],
        },

      ],
    },
  ];

  const sortedList = list.map((item) => {
    if (item.key === "advanced" && Array.isArray(item.children)) {
      const sortedChildren = [...item.children].map((child) => {
        if (child.key === "config" && Array.isArray(child.children)) {
          return {
            ...child,
            children: [...child.children].sort((a, b) =>
              a.name.localeCompare(b.name, "pt", { sensitivity: "base" })
            ),
          };
        }
        return child;
      });

      sortedChildren.sort((a, b) =>
        a.name.localeCompare(b.name, "pt", { sensitivity: "base" })
      );

      return {
        ...item,
        children: sortedChildren,
      };
    }

    return item;
  });

  return (
    <>
      <ChangePassword
        isModalVisible={isModalVisible}
        setIsModalVisible={setIsModalVisible}
      />
      <MenuAnt
        className="menu-mobile"
        theme="dark"
        mode="inline"
        defaultSelectedKeys={["1"]}
      >
        {sortedList
          .filter((item) => {
            if (item?.speedmob == "true") {
              return item.permission && !item?.speedmob;
            }
            return item.permission;
          })
          .map((item) => {
            if (item.children) {
              return (
                <SubMenuStyle key={item.key} icon={item.icon} title={t(item.name)}>
                  {item.children
                    .filter((children: any) => {
                      if (item?.speedmob == "true") {
                        return children.permission && !children?.speedmob;
                      }
                      return children.permission;
                    })
                    .map((children) => {
                      if (children.children && children.children.length > 0) {
                        return (
                          <SubMenuStyle
                            key={children.key}
                            title={t(children.name)}
                          >
                            {children.children
                              .filter((subChildren) => subChildren.permission)
                              .map((subChildren) => {
                                if (
                                  subChildren.children &&
                                  subChildren.children.length > 0
                                ) {
                                  return (
                                    <SubMenuStyle
                                      key={subChildren.key}
                                      title={t(subChildren.name)}
                                    >
                                      {subChildren.children
                                        .filter(
                                          (sub2Children) =>
                                            sub2Children.permission
                                        )
                                        .map((sub2Children) => (
                                          <MenuAnt.Item
                                            key={sub2Children.key}
                                            onClick={
                                              sub2Children.onClick ??
                                              handleCloseMenuIfMobile
                                            }
                                          >
                                            <Link to={sub2Children.to}>
                                              {t(sub2Children.name)}
                                            </Link>
                                          </MenuAnt.Item>
                                        ))}
                                    </SubMenuStyle>
                                  );
                                }
                                return (
                                  <MenuAnt.Item
                                    key={subChildren.key}
                                    onClick={
                                      subChildren.onClick ??
                                      handleCloseMenuIfMobile
                                    }
                                  >
                                    <Link to={subChildren.to}>
                                      {t(subChildren.name)}
                                    </Link>
                                  </MenuAnt.Item>
                                );
                              })}
                          </SubMenuStyle>
                        );
                      }
                      return (
                        <MenuAnt.Item
                          key={children.key}
                          onClick={children.onClick ?? handleCloseMenuIfMobile}
                        >
                          <Link to={children.to}>{t(children.name)}</Link>
                        </MenuAnt.Item>
                      );
                    })}
                </SubMenuStyle>
              );
            }
            return (
              <MenuAnt.Item
                key={item.key}
                icon={item.icon}
                onClick={handleCloseMenuIfMobile}
              >
                <Link to={item.to}>{t(item.name)}</Link>
              </MenuAnt.Item>
            );
          })}

        {hasPermission(CONFIGURACAO, "gerenciar_perfil") && (
          <MenuAnt.Item
            key=""
            onClick={() => setIsModalVisible(true)}
            icon={<AiOutlineLock />}
          >
            {t("Alterar senha")}
          </MenuAnt.Item>
        )}
        <MenuAnt.Item
          key="clear-cache"
          onClick={handleClearCache}
          icon={<AiOutlineClear />}
        >
          {t("Limpar Cache")}
        </MenuAnt.Item>
        <MenuAnt.Item
          key="logout"
          onClick={() => {
            handleLogout();
            history.push("/");
          }}
          icon={<AiOutlineLogout />}
        >
          {t("Sair")}
        </MenuAnt.Item>
      </MenuAnt>
      {hasPermission(CONTATO, "access_crisp") &&
        isCrispBubbleVisible &&
        !isCrispPanelOpen && (
        <CrispChatCloseFab
          type="button"
          aria-label="Ocultar bubble do chat de suporte"
          onClick={handleCloseCrispChat}
        >
          <AiOutlineClose aria-hidden />
        </CrispChatCloseFab>
      )}
    </>
  );
};

export default ListMenu;
