import { FC, useEffect } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { setDocumentTitle } from "../utils/documentTitle";
import Dashboard from "../pages/Dashboard";
import Menu from "../components/Menu/Body";
import Monitoring from "../pages/Monitoring";
import ClientList from "../pages/Client/Physical";
import SolicitationChangeCar from "../pages/Driver/SolicitationChangeCar";
import { StateMenuOptionsProvider } from "../contexts/stateMenuOptions";
import { NotificationContextProvider } from "../contexts/notification";
import SignupDriver from "../pages/Driver/Signup";
import ListDrivers from "../pages/Driver/List";
import RequestDocuments from "../pages/Driver/RequestDocuments";
import SolicitationsExclusionDriverList from "../pages/Driver/SolicitationExclusion";
import DetailsTrip from "../pages/Trip/Details";
import ListTrip from "../pages/Trip/List";
import LegalPerson from "../pages/Client/Legal";
import DriverProduction from "../pages/Financial/DriverProduction";
import CancellationFee from "../pages/Financial/CancellationFee";
import { CommissionManagement } from "../pages/Financial/CommissionManagement";
import ReportCreate from "../pages/Report/Create";
import ReportList from "../pages/Report/List";
import UserProfile from "../pages/Advanced/Configs/Admin/UserProfile/List";
import UserRegistration from "../pages/Advanced/Configs/Admin/UserRegistration/List";
import Acquirer from "../pages/Advanced/Configs/Acquirer";
import KeysApp from "../pages/Advanced/Configs/KeysApp";
import TalkToUsClient from "../pages/TalkToUs/Client";
import AcquirerByCity from "../pages/Advanced/Configs/AcquirerByCity";
import ConfigByCities from "../pages/Advanced/Configs/ConfigByCities";
import TalkToUsTrip from "../pages/TalkToUs/Trip";
import BirthdayNotification from "../pages/Message/BirthdayNotification";
import PendencyDriver from "../pages/Advanced/Configs/PendencyDriver";
import AppDocuments from "../pages/Advanced/Configs/AppDocuments";
import CallManagement from "../pages/Advanced/Configs/CallManagement";
import UsagePolicy from "../pages/Advanced/Configs/UsagePolicy";
import ReassonsCancellation from "../pages/Advanced/Configs/ReasonsForCancellations";
import SolicitationsExclusionUserList from "../pages/Client/SolicitationExclusion";
import ConfirmationCode from "../pages/Advanced/Configs/ConfirmationCode";
import MethodsPayments from "../pages/Advanced/Configs/MethodsPayments";
import CallRadius from "../pages/Advanced/Configs/CallRadius";
import AdditionalSettings from "../pages/Advanced/Configs/AdditionalSettings";
import Terms from "../pages/Advanced/Configs/Terms";
import Notification from "../pages/Message/Notification";
import { UsersList } from "../pages/Central/UsersList";
import { TypesTravels } from "../pages/Advanced/Configs/Tariffs/TypesTravels";
import { TariffTrigger } from "../pages/Advanced/Configs/Tariffs/TariffTrigger";
import { TariffFlag } from "../pages/Advanced/Configs/Tariffs/TariffFlag";
import { DynamicPerArea } from "../pages/Advanced/Configs/Tariffs/DynamicPerArea";
import ListPartner from "../pages/Advanced/Partners/ListPartner";
import MessagePartner from "../pages/Advanced/Partners/MessagePartner";
import { Coupon } from "../pages/Advanced/Promotions/Coupon";
import { Voucher } from "../pages/Advanced/Promotions/Voucher";
import ManagerList from "../components/Advanced/Manager/ManagerList";
import DriversByManager from "../components/Advanced/Manager/DriversByManager";
import SignupManager from "../components/Advanced/Manager/SignupManager";
import TripPromotions from "../pages/Advanced/Promotions/TripPromotions";
import { FinancialCharge } from "../pages/Financial/Charge";
import { BuyCredit } from "../pages/Financial/BuyCredit";
import { TripProvider } from "../contexts/trip";
import { DriverProvider } from "../contexts/driver";
import { Neighborhoods } from "../pages/Central/Neighborhoods";
import { Config } from "../pages/Central/Config";
import { ListCentral } from "../pages/Central/List";
import { TransferRequests } from "../pages/Financial/TransferRequests";
import { DashboardFinancial } from "../pages/Financial/DashboardFinancial";
import { ReportsFinancial } from "../pages/Financial/ReportsFinancial";
import { LinkExtern } from "../pages/Advanced/Publicity/LinkExtern";
import { ListPublicity } from "../pages/Advanced/Publicity/ListPublicity";
import { InsertPublicity } from "../pages/Advanced/Publicity/InsertPublicity";
import { ConfigMaps } from "../pages/Advanced/Maps/ConfigMaps";
import { ConfigCity } from "../pages/Advanced/Maps/ConfigCity";
import { TestServiceMaps } from "../pages/Advanced/Maps/TestsServiceMaps";
import { RouteOptimization } from "../pages/Advanced/Maps/RouteOptimization";
import { WebmapKeyManagment } from "../pages/Advanced/Maps/WebmapKeyManagment";
import { MapSequencer } from "../pages/Advanced/Maps/MapSequencer";
import { RiskArea } from "../pages/Advanced/Maps/RiskArea";
import { HeatMap } from "../pages/Advanced/Maps/HeatMap";
import { RegisterLocal } from "../pages/Advanced/Maps/GerencyAddress/RegisterLocal";
import { AddressIrregular } from "../pages/Advanced/Maps/GerencyAddress/AddressIrregular";
import { AddressCache } from "../pages/Advanced/Maps/GerencyAddress/AddressCache";
import { ConfigApp } from "../pages/Advanced/Configs/ConfigApp";
import { ConfigsAppPartner } from "../pages/Advanced/Configs/ConfigsAppPartner";
import { MessagesChatDriver } from "../pages/Advanced/Configs/MessagesChatDriver";
import { Versions } from "../pages/Advanced/Versions";
import { PermissionRouteGuard } from "../components/PermissionRouteGuard";
import Simpledelivery from "../components/Advanced/Route/SimpleDelivery";
import RouteRegister from "../components/Advanced/Route/RouteRegister";
import RouteEdit from "../components/Advanced/Route/RouteEdit";
import RouteList from "../components/Advanced/Route/RouteList";
import ReleaseDrivers from "../components/Advanced/Route/ReleaseDrivers";
import PromotionalBanner from "../components/Advanced/Route/PromotionalBanner";
import { AddCity } from "../pages/Advanced/Configs/AreasCity/AddCity";
import { EditCity } from "../pages/Advanced/Configs/AreasCity/EditCity";
import { ServicesApps } from "../pages/Advanced/Configs/Tariffs/ServicesApps";
import { ConfigLayout } from "../components/Advanced/Config/ConfigLayout";
import FirebaseVerification from "../pages/Advanced/Configs/FirebaseVerification";
import { ConfigServiceSMTP } from "../pages/Advanced/Configs/ConfigServiceSMTP";
import { ManageToll } from "../pages/Advanced/Configs/ManageToll";
import { ConfigRegisterDriver } from "../pages/Advanced/Configs/ConfigsRegister/ConfigRegisterDriver";
import { AddDocumentsByCategory } from "../pages/Advanced/Configs/ConfigsRegister/AddDocumentsByCategory";
import { DocumentsApp } from "../pages/Advanced/Configs/ConfigsRegister/DocumentsApp";
import ImportDriver from "../components/Advanced/Config/ImportDriver";
import ImportClient from "../components/Advanced/Config/ImportClient";
import { LinkDocumentClient } from "../pages/Advanced/Configs/ConfigsRegister/LinkDocumentClient";

import { ModulesActives } from "../pages/Advanced/Configs/ModulesActives";

import api from "../services/api";

import Sections from "../pages/Delivery/Config/Sections";
import Establishments from "../pages/Delivery/Config/Establishments";
import RegisterEstablishments from "../pages/Delivery/RegisterEstablishments";
import { FinancialManagment } from "../pages/Delivery/FinancialManagment";
import { ManageDeliveryZone } from "../pages/Delivery/Config/ManageDeliveryZone";
import DeliveryAccessories from "../pages/Delivery/Config/DeliveryAccessories";
import { ServicesExternalByCity } from "../pages/Advanced/Configs/ServicesExternalByCity";
import { ServicesExternalGlobal } from "../pages/Advanced/Configs/ServicesExternalGlobal";
import ConfigCall from "../pages/Delivery/ConfigCall";
import GeneralConfig from "../pages/Delivery/GeneralConfig";
import DeliveryConfiguration from "../pages/Delivery/DeliveryConfiguration";
import { SuggestionText } from "../pages/Advanced/Delivery/SuggestionText";
import { Items } from "../pages/Advanced/Delivery/Items";
import Session from "../utils/Session";
import LogsMongo from "../pages/Advanced/Configs/LogsMongo";
import { NotificationAdmin } from "../pages/Advanced/Configs/NotificationsAdmin";
import { ListPhonesGeneral } from "../pages/Advanced/Configs/ListPhonesGeneral";
import { ServicesExternalsWebhook } from "../pages/Advanced/Configs/ServicesExternalWebhook";
import KeysWhatsapp from "../pages/ChavesWhatsapp";

import { RegisterItem } from "../pages/Advanced/Frete/RegisterItem";
import { ListItens } from "../pages/Advanced/Frete/ListItens";
import { ServicesExtras } from "../pages/Advanced/Frete/ServicesExtras";
import { LoadAccessibility } from "../pages/Advanced/Frete/LoadAccessibility";

import { getKeyLocalStorage } from "../utils/Helpers";
import { PublicityApp } from "../pages/Advanced/Publicity/PublicityApp";
import { PublicityAppList } from "../pages/Advanced/Publicity/PublicityAppList";
import { CredentialsIntegrationExternal } from "../pages/Advanced/Configs/CredentialsIntegrationExternal";
import { WhatsappSession } from "../pages/Advanced/Configs/WhatsappSession";
import { ManagementWppScheduledTrip } from "../pages/Advanced/Configs/ManagementWppScheduledTrip";
import DriverFinancial from "../pages/Driver/Financial";
import ImportDriverBlocked from "../components/Advanced/Config/importDriversBlocked";
import ImportDriverUnblocked from "../components/Advanced/Config/importDriversUnblocked";
import { DriverMonitoring } from "../pages/Driver/Monitoring";
import { DeliveryMonitoring } from "../pages/Delivery/Monitoring";
import AsaasConfiguration from "../pages/Delivery/AsaasConfiguration";
import { ListCallGroups } from "../pages/Advanced/Configs/CallGroup/ListCallGroups";
import { LinkedDrivers } from "../pages/Advanced/Configs/CallGroup/LinkedDrivers";
import { MonitoringArea } from "../pages/Advanced/Maps/MonitoringArea";
import { ModalCitiesFully } from "../components/ModalCitiesFully";
import {
  ACESSAR_GRUPO_WHATSAPP_VIAGEM_AGENDADA,
  CENTRAL,
  CENTRAL_BAIRROS,
  CENTRAL_CONFIGURACOES,
  CENTRAL_LISTAGEM,
  CENTRAL_USUARIOS,
  CONFIGURACAO,
  FINANCEIRO,
  POLITICA_USO_APP,
  VERSAO,
  WHATSAPP,
} from "../constants/permissions";
import { appEnv } from "../config/app-env";

const LoggedRoutes: FC = () => {
  const getUrlBaseNodes = async () => {
    try {
      const responseUrlNodeBase = await api.get("config/link_storage_pictures");

      if (
        responseUrlNodeBase.status &&
        responseUrlNodeBase.data?.response !== undefined &&
        responseUrlNodeBase.data?.response !== null
      ) {
        localStorage.setItem(
          `@MonitorPRO-${appEnv.projectName}:base_url_nodes`,
          JSON.stringify(responseUrlNodeBase.data.response)
        );
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (Session.hasCitySelected()) {
      // Sempre atualiza a base de fotos (evita cache com bucket/URL errados)
      getUrlBaseNodes();
    }
  }, []);

  useEffect(() => {
    setDocumentTitle("Monitor");

    let link = document.querySelector(
      'link[rel="icon"]'
    ) as HTMLLinkElement | null;
    if (!link) {
      link = document.createElement("link") as HTMLLinkElement;
      link.type = "image/x-icon";
      link.rel = "icon";
      link.href = "/favicon.ico";
      document.head.appendChild(link);
    } else {
      link.type = "image/x-icon";
      link.rel = "icon";
      link.href = "/favicon.ico";
    }
  }, []);

  return (
    <>
      <Router>
        <NotificationContextProvider>
          {!Session.hasCitySelected() && <ModalCitiesFully />}
          <Switch>
            <Route path="/central/setting">
              <PermissionRouteGuard
                group={CENTRAL}
                permission={CENTRAL_CONFIGURACOES}
                titlePage="Configurações"
              >
                <Config />
              </PermissionRouteGuard>
            </Route>
            <Route path="/central/neighborhoods">
              <PermissionRouteGuard
                group={CENTRAL}
                permission={CENTRAL_BAIRROS}
                titlePage="Bairros"
              >
                <Neighborhoods />
              </PermissionRouteGuard>
            </Route>
            <Route path="/central/listCustomer">
              <PermissionRouteGuard
                group={CENTRAL}
                permission={CENTRAL_USUARIOS}
                titlePage="Listagem de usuários"
              >
                <UsersList />
              </PermissionRouteGuard>
            </Route>
            <Route path="/central">
              <PermissionRouteGuard
                group={CENTRAL}
                permission={CENTRAL_LISTAGEM}
                titlePage="Central"
              >
                <ListCentral />
              </PermissionRouteGuard>
            </Route>
            <Route path="/config/services">
              <Menu titlePage="Tipos de serviços">
                <ServicesApps />
              </Menu>
            </Route>
            <Route path="/config/rates">
              <Menu titlePage="Tipos de Viagem">
                <TypesTravels />
              </Menu>
            </Route>
            <Route path="/config/trigger">
              <Menu titlePage="Gatilho de Tarifa">
                <TariffTrigger />
              </Menu>
            </Route>
            <Route path="/config/triggerLabel">
              <Menu titlePage="Bandeira de Tarifa">
                <TariffFlag />
              </Menu>
            </Route>
            <Route path="/config/dynamicByArea">
              <Menu titlePage="Dinâmica por Área">
                <DynamicPerArea />
              </Menu>
            </Route>
            <Route path="/partner/listPartner">
              <Menu titlePage="Listagem de Parceiros">
                <ListPartner />
              </Menu>
            </Route>
            <Route path="/partner/messagePartner">
              <Menu titlePage="Mensagens da Ouvidoria">
                <MessagePartner />
              </Menu>
            </Route>
            <Route path="/promotion/listCupom">
              <Menu titlePage="Cupons">
                <Coupon />
              </Menu>
            </Route>
            <Route path="/promotion/voucherList">
              <Menu titlePage="Voucher">
                <Voucher />
              </Menu>
            </Route>
            <Route path="/manager" exact>
              <Menu titlePage="Lista de Gestores">
                <ManagerList />
              </Menu>
            </Route>
            <Route path="/manager/drivers" exact>
              <Menu titlePage="Motoristas por Gestor">
                <DriversByManager />
              </Menu>
            </Route>
            <Route path="/manager/signupmanager" exact>
              <Menu titlePage="Cadastro de motorista">
                <SignupManager />
              </Menu>
            </Route>
            <Route path="/promotion/saleTrip">
              <Menu titlePage="Promoções por viagem">
                <TripPromotions />
              </Menu>
            </Route>
            <Route path="/financial/prepaid">
              <Menu titlePage="Pré-Pago">
                <BuyCredit />
              </Menu>
            </Route>
            <Route path="/financial/commission">
              <PermissionRouteGuard
                group={FINANCEIRO}
                permission="gestao_monetizacao"
                titlePage="Comissão"
              >
                <CommissionManagement />
              </PermissionRouteGuard>
            </Route>
            <Route path="/financial/charge">
              <PermissionRouteGuard
                group={FINANCEIRO}
                permission="lancamento_financeiro"
                titlePage="Cobranças"
              >
                <FinancialCharge />
              </PermissionRouteGuard>
            </Route>
            <Route path="/simpledelivery/items">
              <Menu titlePage="Gerenciar Itens">
                <Items />
              </Menu>
            </Route>
            <Route path="/simpledelivery/suggestion-text">
              <Menu titlePage="Sugestão de Texto">
                <SuggestionText />
              </Menu>
            </Route>
            <Route path="/delivery/financial">
              <Menu titlePage="Gestão Financeira">
                <FinancialManagment />
              </Menu>
            </Route>
            <Route path="/delivery/config" exact>
              <Menu titlePage="Configurações Gerais">
                <GeneralConfig />
              </Menu>
            </Route>
            <Route path="/delivery/deliveryConfiguration" exact>
              <Menu titlePage="Configuração Delivery">
                <DeliveryConfiguration />
              </Menu>
            </Route>
            <Route path="/config/pendencyDriver">
              <PermissionRouteGuard
                group={CONFIGURACAO}
                permission="penalty_for_driver"
                titlePage="Penalidade de ação do motorista"
              >
                <PendencyDriver />
              </PermissionRouteGuard>
            </Route>
            <Route path="/config/reasonCancellation">
              <PermissionRouteGuard
                group={CONFIGURACAO}
                permission="gerenciar_tipos_cancelamento"
                titlePage="Motivos de cancelamento"
              >
                <ReassonsCancellation />
              </PermissionRouteGuard>
            </Route>
            <Route path="/config/usagePolicy">
              <PermissionRouteGuard
                group={CONFIGURACAO}
                permission={POLITICA_USO_APP}
                titlePage="Política de uso do aplicativo"
              >
                <UsagePolicy />
              </PermissionRouteGuard>
            </Route>
            <Route path="/config/chatbot">
              <Menu titlePage="Mensagens automáticas do motorista">
                <MessagesChatDriver />
              </Menu>
            </Route>
            <Route path="/config/modulesActives">
              <Menu titlePage="Módulos ativos">
                <ModulesActives />
              </Menu>
            </Route>
            <Route path="/setting/importClient">
              <PermissionRouteGuard
                group={CONFIGURACAO}
                permission="importar_cliente"
                titlePage="Importação do Cliente"
              >
                <ImportClient />
              </PermissionRouteGuard>
            </Route>
            <Route path="/setting/importDriver">
              <PermissionRouteGuard
                group={CONFIGURACAO}
                permission="importar_motorista"
                titlePage="Importação de Motorista"
              >
                <ImportDriver />
              </PermissionRouteGuard>
            </Route>
            <Route path="/setting/importDriversBlocked">
              <PermissionRouteGuard
                group={CONFIGURACAO}
                permission="bloquear_massa_prestadores"
                titlePage="Bloqueio em massa de Prestador"
              >
                <ImportDriverBlocked />
              </PermissionRouteGuard>
            </Route>
            <Route path="/setting/importDriversUnblocked">
              <PermissionRouteGuard
                group={CONFIGURACAO}
                permission="desbloquear_massa_prestadores_cpf"
                titlePage="Desbloqueio em massa de Prestadores"
              >
                <ImportDriverUnblocked />
              </PermissionRouteGuard>
            </Route>
            <Route path="/config/configs-register/config-register-driver">
              <Menu titlePage="Configuração no cadastro do Prestador">
                <ConfigRegisterDriver />
              </Menu>
            </Route>
            <Route path="/config/configs-register/documents-by-category">
              <Menu titlePage="Documentos por categoria">
                <AddDocumentsByCategory />
              </Menu>
            </Route>
            <Route path="/config/configs-register/link-documents-client">
              <Menu titlePage="Vinculação de Documentos do Cliente">
                <LinkDocumentClient />
              </Menu>
            </Route>
            <Route path="/config/configs-register/documents-app">
              <Menu titlePage="Documentos Do App">
                <DocumentsApp />
              </Menu>
            </Route>
            <Route path="/config/credentials-integration-external">
              <Menu titlePage="Credenciais de integração externa">
                <CredentialsIntegrationExternal />
              </Menu>
            </Route>
            <Route path="/config/radius">
              <Menu titlePage="Raio de chamado">
                <CallRadius />
              </Menu>
            </Route>
            <Route path="/config/configByCities">
              <Menu titlePage="Configuração por cidade">
                <ConfigByCities />
              </Menu>
            </Route>
            <Route path={["/config/manage-toll", "/config/toll"]}>
              <Menu titlePage="Gerenciar Pedágio">
                <ManageToll />
              </Menu>
            </Route>
            <Route path="/config/documentsApp">
              <Menu titlePage="Documentos do app">
                <AppDocuments />
              </Menu>
            </Route>
            <Route path="/config/acquirerByCity">
              <Menu titlePage="Adquirentes por cidade">
                <AcquirerByCity />
              </Menu>
            </Route>
            <Route path="/config/acquirer">
              <Menu titlePage="Adquirentes global">
                <Acquirer />
              </Menu>
            </Route>
            <Route path="/config/admin/profile">
              <Menu titlePage="Perfil de usuário">
                <UserProfile />
              </Menu>
            </Route>
            <Route path="/setting/address">
              <Menu titlePage="Adicionar endereços">
                <RegisterLocal />
              </Menu>
            </Route>
            <Route path="/setting/address">
              <Menu titlePage="Adicionar endereços">
                <RegisterLocal />
              </Menu>
            </Route>
            <Route path="/setting/addressblacklist">
              <Menu titlePage="Endereços irregulares">
                <AddressIrregular />
              </Menu>
            </Route>
            <Route path={["/setting/cacheaddress", "/setting/cacheAddress"]}>
              <Menu titlePage="Endereços em cache">
                <AddressCache />
              </Menu>
            </Route>
            <Route path="/mapSetting/configMaps">
              <Menu titlePage="Configurações de mapas">
                <ConfigMaps />
              </Menu>
            </Route>
            <Route path="/mapSetting/configbycity">
              <Menu titlePage="Configurações de credencias por cidade">
                <ConfigCity />
              </Menu>
            </Route>
            <Route path="/mapSetting/tests">
              <Menu titlePage="Teste De Serviços De Mapa">
                <TestServiceMaps />
              </Menu>
            </Route>
            <Route path="/mapSetting/routeOptimization">
              <Menu titlePage="Otimização De Rota">
                <RouteOptimization />
              </Menu>
            </Route>
            <Route path="/mapSetting/mapSequencer">
              <Menu titlePage="Configurações dos serviços de mapa">
                <MapSequencer />
              </Menu>
            </Route>
            <Route path="/mapSetting/keys">
              <Menu titlePage="Gerenciamento de chaves de mapa web">
                <WebmapKeyManagment />
              </Menu>
            </Route>
            <Route path="/mapSetting/riskArea">
              <Menu titlePage="Área de risco">
                <RiskArea />
              </Menu>
            </Route>
            <Route path="/mapSetting/heatMap">
              <Menu titlePage="Área de risco">
                <HeatMap />
              </Menu>
            </Route>
             <Route path="/mapSetting/monitoringArea">
              <Menu titlePage="Área de Monitoramento">
                <MonitoringArea />
              </Menu>
            </Route>
            <Route path="/report/list">
              <Menu titlePage="Listagem de relatórios">
                <ReportList />
              </Menu>
            </Route>
            <Route path="/report/create">
              <Menu titlePage="Gerar relatórios">
                <ReportCreate />
              </Menu>
            </Route>
            <Route path="/config/notifications-admin">
              <Menu titlePage="Notificações Admin">
                <NotificationAdmin />
              </Menu>
            </Route>
            <Route path="/pages/TalkToUs/Trip">
              <Menu titlePage="Fale conosco viagens">
                <TalkToUsTrip />
              </Menu>
            </Route>
            <Route path="/pages/TalkToUs/Client">
              <Menu titlePage="Fale conosco cliente">
                <TalkToUsClient />
              </Menu>
            </Route>
            <Route path="/message/Notification">
              <Menu titlePage="Notificação">
                <Notification />
              </Menu>
            </Route>
            <Route path="/message/birthdayNotification">
              <Menu titlePage="Notificações de aniversário">
                <BirthdayNotification />
              </Menu>
            </Route>
            <Route path="/financial/cancellation-fee">
              <PermissionRouteGuard
                group={FINANCEIRO}
                permission="taxa_cancelamento"
                titlePage="Taxa de cancelamento"
              >
                <CancellationFee />
              </PermissionRouteGuard>
            </Route>
            <Route path="/financial/report-production-driver/:id">
              <Menu titlePage="Relatório financeiro de produção do motorista">
                <DriverProduction />
              </Menu>
            </Route>
            <Route path="/financial/commision">
              <PermissionRouteGuard
                group={FINANCEIRO}
                permission="gestao_monetizacao"
                titlePage="Comissão"
              >
                <CommissionManagement />
              </PermissionRouteGuard>
            </Route>
            <Route path="/financial/list">
              <Menu titlePage="Solicitações de Transferências">
                <TransferRequests />
              </Menu>
            </Route>
            <Route path="/financial/dashboard">
              <Menu titlePage="Dashboard Adquirente">
                <DashboardFinancial />
              </Menu>
            </Route>
            <Route path="/financial/reports">
              <Menu titlePage="Relatórios">
                <ReportsFinancial />
              </Menu>
            </Route>
            <Route path="/marketing/publicidade">
              <Menu titlePage="Cadastro de publicidade">
                <InsertPublicity />
              </Menu>
            </Route>
            <Route path="/marketing/listPublicidade">
              <Menu titlePage="Listagem de publicidade">
                <ListPublicity />
              </Menu>
            </Route>
            <Route path="/marketing/menuLinkExternal">
              <Menu titlePage="Link para menu externo">
                <LinkExtern />
              </Menu>
            </Route>
            <Route path="/route/items">
              <Menu titlePage="Gerenciar Itens">
                <Simpledelivery />
              </Menu>
            </Route>
            <Route path="/route/routeRegister">
              <Menu titlePage="Cadastrar Rota">
                <RouteRegister />
              </Menu>
            </Route>
            <Route path="/route/routeEdit/:routeId">
              <Menu titlePage="Editar Rota">
                <RouteEdit />
              </Menu>
            </Route>
            <Route path="/route/routeList">
              <Menu titlePage="Listagem de Rotas">
                <RouteList />
              </Menu>
            </Route>
            <Route path="/route/releaseDrivers">
              <Menu titlePage="Liberar Motoristas">
                <ReleaseDrivers />
              </Menu>
            </Route>
            <Route path="/route/promotionalBanner">
              <Menu titlePage="Banners Promocionais">
                <PromotionalBanner />
              </Menu>
            </Route>
            <Route path="/marketing/publicidadeAppList">
              <Menu titlePage="Listagem de publicidade no App">
                <PublicityAppList />
              </Menu>
            </Route>
            <Route path="/marketing/publicidadeApp">
              <Menu titlePage="Cadastro de publicidade no App">
                <PublicityApp />
              </Menu>
            </Route>
            <Route path="/delivery/registerEstablishments">
              <Menu titlePage="Cadastro de estabelecimentos">
                <RegisterEstablishments />
              </Menu>
            </Route>
            <Route path="/delivery/config/deliveryAccessories">
              <Menu titlePage="Acessórios de entrega">
                <DeliveryAccessories />
              </Menu>
            </Route>
            <Route path="/delivery/config/configCall">
              <Menu titlePage="Configurações do chamado">
                <ConfigCall />
              </Menu>
            </Route>
            <Route path="/delivery/config/asaas">
              <Menu titlePage="Configuração do Token ASAAS">
                <AsaasConfiguration />
              </Menu>
            </Route>
            <Route path="/delivery/config/establisments">
              <Menu titlePage="Categorias de estabelecimentos">
                <Establishments />
              </Menu>
            </Route>
            <Route path="/delivery/config/sections">
              <Menu titlePage="Seções">
                <Sections />
              </Menu>
            </Route>
            <Route path="/delivery/monitoring">
              <Menu titlePage="Monitoramento de delivery">
                <DeliveryMonitoring />
              </Menu>
            </Route>
            <Route path="/delivery/config/zone-delivery">
              <Menu titlePage="Gerenciar Zona de Entrega">
                <ManageDeliveryZone />
              </Menu>
            </Route>
            {appEnv.isSpeedmob === "false" ? (
              <Route path="/trip/list/details/:tripReference">
                <Menu titlePage="Detalhes da viagem">
                  <DetailsTrip />
                </Menu>
              </Route>
            ) : (
              ""
            )}
            <Route path="/trip/list/:id">
              <Menu titlePage="Listagem de viagens">
                <ListTrip />
              </Menu>
            </Route>
            <Route path="/driver/list">
              <Menu titlePage="Listagem de motoristas">
                <ListDrivers />
              </Menu>
            </Route>
            <Route path="/driver/signup">
              <Menu titlePage="Cadastro de motorista">
                <SignupDriver />
              </Menu>
            </Route>
            <Route path="/driver/request-documents">
              <Menu titlePage="Solicitar documentos">
                <RequestDocuments />
              </Menu>
            </Route>
            <Route path="/client/solicitations-exclusion">
              <Menu titlePage="Solicitação de Exclusão da Conta - Clientes">
                <SolicitationsExclusionUserList />
              </Menu>
            </Route>
            <Route path="/driver/solicitations-exclusion">
              <Menu titlePage="Solicitação de Exclusão da Conta - Motoristas">
                <SolicitationsExclusionDriverList />
              </Menu>
            </Route>
            <Route path="/car/pending">
              <Menu titlePage="Carros pendentes">
                <SolicitationChangeCar />
              </Menu>
            </Route>
            <Route path="/client/legalPerson">
              <Menu titlePage="Listagem de  pessoa jurídica">
                <LegalPerson />
              </Menu>
            </Route>
            <Route path="/client/list">
              <Menu titlePage="Listagem de clientes">
                <ClientList />
              </Menu>
            </Route>
            <Route path="/frete/register-item">
              <Menu titlePage="Cadastro de Item">
                <RegisterItem />
              </Menu>
            </Route>
            <Route path="/frete/list-itens">
              <Menu titlePage="Listagem de Itens">
                <ListItens />
              </Menu>
            </Route>
            <Route path="/frete/services-extras">
              <Menu titlePage="Serviços Extras">
                <ServicesExtras />
              </Menu>
            </Route>
            <Route path="/frete/load-accessibility">
              <Menu titlePage="Acessibilidade Carga">
                <LoadAccessibility />
              </Menu>
            </Route>
            <Route path="/config/whatsapp-session">
              <Menu titlePage="Whatsapp Session">
                <WhatsappSession />
              </Menu>
            </Route>
            <Route path="/config/whatsapp-scheduled-trip-notifications">
              <PermissionRouteGuard
                group={WHATSAPP}
                permission={ACESSAR_GRUPO_WHATSAPP_VIAGEM_AGENDADA}
                titlePage="Viagem agendada — WhatsApp"
              >
                <ManagementWppScheduledTrip />
              </PermissionRouteGuard>
            </Route>
            <Route path="/config/confirmationCode">
              <Menu titlePage="Código de confirmação">
                <ConfirmationCode />
              </Menu>
            </Route>
            <Route path="/config/areasCity/addCity">
              <Menu titlePage="Adicionar Cidade">
                <AddCity />
              </Menu>
            </Route>
            <Route path="/config/areasCity/editCity">
              <Menu titlePage="Editar Cidade">
                <EditCity />
              </Menu>
            </Route>
            <Route path="/config/terms">
              <Menu titlePage="Termos">
                <Terms />
              </Menu>
            </Route>
            <Route path="/config/appConfig">
              <PermissionRouteGuard
                group={VERSAO}
                permission="versao"
                titlePage="Configurações de aplicações"
              >
                <ConfigApp />
              </PermissionRouteGuard>
            </Route>
            <Route path="/config/config-app-partner">
              <Menu titlePage="Configurações de apps parceiros">
                <ConfigsAppPartner />
              </Menu>
            </Route>
            <Route path="/callGroups/listCallGroups">
              <Menu titlePage="Grupos de Chamados - Listagem">
                <ListCallGroups />
              </Menu>
            </Route>
            <Route path="/callGroups/linkedDrivers">
              <Menu titlePage="Grupos de Chamados - Motoristas Vinculados">
                <LinkedDrivers />
              </Menu>
            </Route>
            <Route path="/config/list-phones-general">
              <Menu titlePage="Lista telefônica (Geral)">
                <ListPhonesGeneral />
              </Menu>
            </Route>
            <Route path={["/config/firebaseVerification", "/config/FirebaseVerification"]}>
              <Menu titlePage="Verificação Firebase">
                <FirebaseVerification />
              </Menu>
            </Route>
            <Route path="/config/smtp">
              <Menu titlePage="Configurações de SMTP">
                <ConfigServiceSMTP />
              </Menu>
            </Route>
            <Route path="/config/admin/profile">
              <Menu titlePage="Perfil de usuário">
                <UserProfile />
              </Menu>
            </Route>
            <Route path={["/config/admin/createUser", "/config/admin/createUser/"]}>
              <Menu titlePage="Usuários">
                <UserRegistration />
              </Menu>
            </Route>
            <Route path="/config/additionalSettings">
              <Menu titlePage="Configurações adicionais">
                <AdditionalSettings />
              </Menu>
            </Route>
            <Route path={["/config/services-externals-globals", "/config/servicesExternal", "/config/services-external"]}>
              <Menu titlePage="Serviços Externos Globais">
                <ServicesExternalGlobal />
              </Menu>
            </Route>
            <Route path={["/config/services-externals-by-city", "/config/servicesExternalByCity"]}>
              <Menu titlePage="Serviços Externos Por Cidade">
                <ServicesExternalByCity />
              </Menu>
            </Route>
            <Route path={["/config/services-externals-webhook", "/config/servicesExternalWebhook"]}>
              <Menu titlePage="Serviços Externos Webhook">
                <ServicesExternalsWebhook />
              </Menu>
            </Route>
            <Route path="/config/callManagement">
              <Menu titlePage="Configurações de chamado">
                <CallManagement />
              </Menu>
            </Route>
            <Route path="/config/methodPayments">
              <Menu titlePage="Métodos de Pagamentos">
                <MethodsPayments />
              </Menu>
            </Route>
            <Route path="/config/keysApp">
              <Menu titlePage="Configurações das chaves do app">
                <KeysApp />
              </Menu>
            </Route>
            <Route path="/config/logsMongo">
              <Menu titlePage="Logs do Mongo">
                <LogsMongo />
              </Menu>
            </Route>
            <Route exact path="/settings/versions">
              <PermissionRouteGuard
                group={VERSAO}
                permission="versao"
                titlePage="Versões"
              >
                <Versions />
              </PermissionRouteGuard>
            </Route>
            <Route path="/chaves-whatsapp">
              <Menu titlePage="Chaves WhatsApp">
                <KeysWhatsapp />
              </Menu>
            </Route>
            <Route path="/settings/config-layouts">
              <PermissionRouteGuard
                group={CONFIGURACAO}
                permission="configuracoes_layout"
                titlePage="Configurações de layouts"
              >
                <ConfigLayout />
              </PermissionRouteGuard>
            </Route>
            <Route path="/monitoring">
              <TripProvider>
                <DriverProvider>
                  <StateMenuOptionsProvider>
                    <Monitoring />
                  </StateMenuOptionsProvider>
                </DriverProvider>
              </TripProvider>
            </Route>
            <Route path="/driver/monitoring/:id" exact>
              <StateMenuOptionsProvider>
                <DriverMonitoring />
              </StateMenuOptionsProvider>
            </Route>
            <Route path="/driver/:id/financial" exact>
              <Menu titlePage="Financeiro do Motorista">
                <DriverFinancial />
              </Menu>
            </Route>
            <Route path="/">
              <Menu titlePage="Dashboard">
                <Dashboard />
              </Menu>
            </Route>
          </Switch>
        </NotificationContextProvider>
      </Router>
    </>
  );
};

export default LoggedRoutes;
