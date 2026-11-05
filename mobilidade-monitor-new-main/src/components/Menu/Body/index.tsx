import { createElement, useState, useContext, useRef, useEffect } from "react";
//@ts-ignore
import { Layout, Menu as MenuAnt } from "antd";
import { AiOutlineMenuFold, AiOutlineMenuUnfold } from "react-icons/ai";
import ListMenu from "../Items";
import AuthContext from "../../../contexts/auth";
import {
  Container,
  HeadSider,
  Logo,
  User,
  HeaderLayout,
  SiderMenu,
  TitleMenu,
  HeaderSection,
  PaymentButton,
  CloseButton,
} from "./styles";
import SelectAndButtonNotification from "../../Notification/CitiesAndNotifications";
import Utils from "../../../utils/Utils";
import api from "../../../services/api";
import { openBillingPortal } from "../../../utils/billing";
import { TbPigMoney } from "react-icons/tb";
import Preload from "../../Utils/Preload";
import pathLogoMovy from "../../../assets/logo-movy-transparent.png";
import { AxiosError } from "axios";
import swal from "sweetalert";
import { CloseOutlined } from "@ant-design/icons";
import { setDocumentTitle } from "../../../utils/documentTitle";
import { useLocation } from "react-router-dom";
import { breadCrumble } from "../../../utils/translation/breadCrumble";
import { useLanguage } from "../../../contexts/language";

const { Content } = Layout;

interface MenuProps {
  titlePage: string;
  children: JSX.Element;
}

interface KeyProps {
  key: string;
  value: string;
  description: string;
}

interface GroupKeysProps {
  type: string;
  config: KeyProps[];
}

const Menu = ({ children, titlePage }: MenuProps) => {
  const { language, setLanguage, isBrazilActive, setIsBrazilActive, t } = useLanguage();
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [loading, setLoading] = useState(false);
  const location = useLocation();

  const [showButtonPay, setShowButtonPay] = useState(false);
  const [billStatusLoaded, setBillStatusLoaded] = useState(false);
  const [buttonPay, setButtonPay] = useState({
    color: "#eed202",
    text: "Visualizar faturas",
  });

  const path = location.pathname;

  const createBreadcrumbTitle = () => {
    const segments = path.substring(1).split("/");

    if (segments.length === 0 || segments[0] === "") {
      return titlePage;
    }

    const translations = breadCrumble() as { [key: string]: string };
    const translatedTitle = translations[titlePage.toLowerCase()] || titlePage;

    const translatedSegments = segments
      .map((segment) => {
        if (segment == null || segment === "") return "";
        const key = String(segment).toLowerCase();
        const translated = translations[key];
        return translated !== undefined
          ? translated
          : String(segment).charAt(0).toUpperCase() + String(segment).slice(1);
      })
      .filter(Boolean);

    const lastSegmentTranslated =
      translatedSegments[translatedSegments.length - 1];

    if (
      lastSegmentTranslated === translatedTitle ||
      translatedSegments.includes(translatedTitle)
    ) {
      return translatedSegments.join(" - ");
    }

    return translatedSegments.length > 0
      ? `${translatedSegments.join(" - ")} - ${translatedTitle}`
      : translatedTitle;
  };

  const pageTitle =
    titlePage === "Monitor" ? createBreadcrumbTitle() : createBreadcrumbTitle();

  useEffect(() => {
    setDocumentTitle(`Monitor - ${pageTitle}`);
  }, [pageTitle]);

  const { responseDataUser } = useContext(AuthContext);

  const siderRef = useRef<HTMLDivElement>(null);
  const headSiderRef = useRef<HTMLDivElement>(null);

  const openPaymentDebt = async () => {
    setLoading(true);
    await openBillingPortal();
    setLoading(false);
  };

  const billStatusColor = (statusId: number): string => {
    switch (statusId) {
      case 4: return "#ed4337"; // vencido
      case 3: return "#eed202"; // pendente
      case 2: return "#eed202"; // pendente
      case 1: return "#4bb543"; // em dia
      default: return "#eed202";
    }
  };

  const getStatusBill = async () => {
    try {
      const { data } = await api.get(
        `admin/bills/${import.meta.env.PROJECT_NAME}`
      );
      if (!data.status) return;
      const { response } = data;

      if (response?.original) {
        setButtonPay({ color: billStatusColor(4), text: "Visualizar faturas" });
        const error = response.original?.response?.errors;
        return swal({
          title:
            error?.length > 0
              ? error[0]
              : "Identificamos alguns problemas com suas faturas",
          text: "Entrar em contato com o suporte",
          icon: "warning",
          buttons: ["Não", "Sim"],
        }).then((isAccept: boolean) => {
          if (isAccept) {
            window.location.href =
              "https://api.whatsapp.com/send?phone=55859677-7458&text=Olá, preciso de apoio do setor financeiro.";
          }
        });
      }

      setButtonPay({
        color: billStatusColor(response.status_id),
        text: response?.status_message || "Visualizar faturas",
      });
    } catch (error) {
      const axiosError = error as AxiosError;
      console.log(axiosError?.request);
    } finally {
      setBillStatusLoaded(true);
    }
  };

  const getKeysConfig = async () => {
    try {
      setLoading(true);

      const storedKeys = localStorage.getItem("keysApp");
      let keys: GroupKeysProps[] = [];

      if (storedKeys && storedKeys !== "undefined" && storedKeys !== "null") {
        try {
          const parsed = JSON.parse(storedKeys);
          if (Array.isArray(parsed)) {
            keys = parsed;
          }
        } catch {
          localStorage.removeItem("keysApp");
        }
      }

      if (keys.length === 0) {
        const responseConfigs = await api.get("config");
        if (!responseConfigs?.data?.status && !responseConfigs?.status) return;
        const resList = responseConfigs.data?.response ?? responseConfigs.data?.data ?? [];
        if (Array.isArray(resList)) {
          keys = resList;
          localStorage.setItem("keysApp", JSON.stringify(keys));
        }
      }

      if (!Array.isArray(keys)) return;

      const manager = keys.find((res) => res.type === "GESTOR");
      if (!manager) return;

      const billsButton = manager.config.find(
        (item) => item.key === "enable-button-bills-menu"
      );

      const isEnabled = billsButton?.value === "1";
      setShowButtonPay(isEnabled);

      // Sempre busca o status real, independente de ter vindo do cache
      if (isEnabled) {
        getStatusBill();
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getKeysConfig();
  }, []);

  useEffect(() => {
    if (Utils.isMobile()) {
      return setIsMobile(true);
    }
    return setIsMobile(false);
  }, []);

  return (
    <Container hasSider>
      <Preload visible={loading} />
      <SiderMenu
        menumobile={isMobile}
        width={isMobile ? "100%" : 300}
        ref={siderRef}
        trigger={null}
        collapsible
        collapsed={collapsed}
      >
        {isMobile && (
          <CloseButton
            type="text"
            icon={<CloseOutlined />}
            onClick={() => setCollapsed(true)}
            aria-label="Fechar menu"
          />
        )}
        <HeadSider
          ref={headSiderRef}
          collapsed={collapsed}
          menuMobile={isMobile}
        >
          <div className="brand-logo-wrap">
            <img src={pathLogoMovy} alt="MOVY" className="movy-brand-logo" />
          </div>
          {!collapsed && (
            <User className="user-data">
              <div className="user-name">{responseDataUser?.name || "Administrador MOVY"}</div>
              <div className="user-role">{responseDataUser?.role?.name || "Gestão Corporativa"}</div>
            </User>
          )}
          <PaymentButton
            onClick={openPaymentDebt}
            style={{
              display: showButtonPay && billStatusLoaded ? "" : "none",
              backgroundColor: buttonPay.color,
            }}
          >
            {collapsed ? <TbPigMoney size={20} /> : t(buttonPay.text)}
          </PaymentButton>
        </HeadSider>
        <ListMenu isMobile={isMobile} setCollapsed={setCollapsed} />
      </SiderMenu>
      <Layout>
        <HeaderLayout>
          <HeaderSection>
            {createElement(
              collapsed ? AiOutlineMenuUnfold : AiOutlineMenuFold,
              {
                className: "trigger",
                onClick: () => {
                  setCollapsed((state) => !state);
                },
              }
            )}
            <TitleMenu level={4}>{t(titlePage)}</TitleMenu>
          </HeaderSection>
          <div style={{ display: "flex", alignItems: "center", gap: 16, height: "100%" }}>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                backgroundColor: "rgba(255, 255, 255, 0.08)",
                borderRadius: 20,
                padding: "2px",
                border: "1px solid rgba(255, 255, 255, 0.15)",
                gap: 2,
                height: 32,
                userSelect: "none",
                boxSizing: "border-box",
              }}
            >
              {isBrazilActive && (
                <button
                  type="button"
                  onClick={() => setLanguage("pt")}
                  style={{
                    border: "none",
                    background: language === "pt" ? "#0284c7" : "transparent",
                    color: language === "pt" ? "#FFFFFF" : "#94a3b8",
                    borderRadius: 16,
                    padding: "0 10px",
                    height: 26,
                    lineHeight: "26px",
                    cursor: "pointer",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 5,
                    fontWeight: 700,
                    fontSize: 11,
                    letterSpacing: "0.5px",
                    transition: "all 0.2s ease",
                    boxShadow: language === "pt" ? "0 2px 6px rgba(2, 132, 199, 0.4)" : "none",
                  }}
                  title="Português (Brasil)"
                >
                  <span>🇧🇷</span>
                  <span>PT</span>
                </button>
              )}
              <button
                type="button"
                onClick={() => setLanguage("en")}
                style={{
                  border: "none",
                  background: language === "en" ? "#0284c7" : "transparent",
                  color: language === "en" ? "#FFFFFF" : "#94a3b8",
                  borderRadius: 16,
                  padding: "0 10px",
                  height: 26,
                  lineHeight: "26px",
                  cursor: "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 5,
                  fontWeight: 700,
                  fontSize: 11,
                  letterSpacing: "0.5px",
                  transition: "all 0.2s ease",
                  boxShadow: language === "en" ? "0 2px 6px rgba(2, 132, 199, 0.4)" : "none",
                }}
                title="English (United States)"
              >
                <span>🇺🇸</span>
                <span>EN</span>
              </button>

              {/* Botão admin para ativar/desativar Brasil */}
              <button
                type="button"
                onClick={() => {
                  const newState = !isBrazilActive;
                  setIsBrazilActive(newState);
                }}
                style={{
                  border: "none",
                  background: isBrazilActive ? "rgba(34, 197, 94, 0.2)" : "rgba(239, 68, 68, 0.2)",
                  color: isBrazilActive ? "#4ade80" : "#f87171",
                  borderRadius: 16,
                  padding: "0 8px",
                  height: 26,
                  lineHeight: "26px",
                  cursor: "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 3,
                  fontWeight: 600,
                  fontSize: 10,
                  transition: "all 0.2s ease",
                }}
                title={isBrazilActive ? "Admin: Desativar idioma Brasil" : "Admin: Ativar idioma Brasil"}
              >
                <span>🇧🇷</span>
                <span>{isBrazilActive ? "ON" : "OFF"}</span>
              </button>
            </div>
            <SelectAndButtonNotification />
          </div>
        </HeaderLayout>
        <Content
          id="main-scroll-content"
          style={{
            height: "calc(100vh - 64px)",
            padding: "1.25rem",
            overflowY: "auto",
            overflowX: "hidden",
            boxSizing: "border-box",
            width: "100%",
          }}
        >
          {children}
        </Content>
      </Layout>
    </Container>
  );
};

export default Menu;
