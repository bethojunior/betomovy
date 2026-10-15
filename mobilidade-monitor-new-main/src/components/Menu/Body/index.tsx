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
  const { language, setLanguage, t } = useLanguage();
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
        const key = segment.toLowerCase();
        const translated = translations[key];
        return translated !== undefined
          ? translated
          : segment.charAt(0).toUpperCase() + segment.slice(1);
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
    <Container>
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
          <Logo
            className="profile-user"
            style={{
              backgroundImage: `url("${
                import.meta.env.LOGO_APP
              }?v=${new Date().getTime()}"), 
               url("${
                 import.meta.env.S3_LINK
               }default.jpg?v=${new Date().getTime()}")`,
            }}
          />
          <User className="user-data">
            <div>{t("Usuário:")} {responseDataUser?.name}</div>
            <div>{t("Perfil:")} {responseDataUser?.role?.name}</div>
            <div>{new Date().toLocaleString()}</div>
          </User>
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
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                backgroundColor: "#f5f5f5",
                borderRadius: 20,
                padding: "2px 4px",
                border: "1px solid #d9d9d9",
                gap: 4,
                fontSize: 12,
                fontWeight: 600,
                userSelect: "none",
              }}
            >
              <button
                type="button"
                onClick={() => setLanguage("pt")}
                style={{
                  border: "none",
                  background: language === "pt" ? "#1890ff" : "transparent",
                  color: language === "pt" ? "#fff" : "#595959",
                  borderRadius: 16,
                  padding: "3px 8px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                  fontWeight: 600,
                  fontSize: 12,
                  transition: "all 0.2s ease-in-out",
                  boxShadow: language === "pt" ? "0 2px 4px rgba(24,144,255,0.3)" : "none",
                }}
                title="Português (Brasil)"
              >
                <span>🇧🇷</span>
                <span>PT</span>
              </button>
              <button
                type="button"
                onClick={() => setLanguage("en")}
                style={{
                  border: "none",
                  background: language === "en" ? "#1890ff" : "transparent",
                  color: language === "en" ? "#fff" : "#595959",
                  borderRadius: 16,
                  padding: "3px 8px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                  fontWeight: 600,
                  fontSize: 12,
                  transition: "all 0.2s ease-in-out",
                  boxShadow: language === "en" ? "0 2px 4px rgba(24,144,255,0.3)" : "none",
                }}
                title="English (United States)"
              >
                <span>🇺🇸</span>
                <span>EN</span>
              </button>
            </div>
            <SelectAndButtonNotification />
          </div>
        </HeaderLayout>
        <Content
          id="main-scroll-content"
          style={{
            height: "calc(100vh - 64px)",
            padding: "1vw",
            overflowY: "auto",
            overflowX: "hidden",
          }}
        >
          {children}
        </Content>
      </Layout>
    </Container>
  );
};

export default Menu;
