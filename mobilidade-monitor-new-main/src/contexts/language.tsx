import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type LanguageType = "pt" | "en";

export interface LanguageContextData {
  language: LanguageType;
  setLanguage: (lang: LanguageType) => void;
  isBrazilActive: boolean;
  setIsBrazilActive: (active: boolean) => void;
  t: (text: string, fallback?: string) => string;
}

const translations: Record<LanguageType, Record<string, string>> = {
  pt: {
    // Header & User
    "Usuário:": "Usuário:",
    "Perfil:": "Perfil:",
    "Visualizar faturas": "Visualizar faturas",
    "Cidade não encontrada": "Cidade não encontrada",
    "Buscar cidade": "Buscar cidade",
    "Cidades Ativas": "Cidades Ativas",
    "Idioma": "Idioma",
    "Brasil": "Brasil",
    "Estados Unidos": "Estados Unidos",
    "Alterar senha": "Alterar senha",
    "Limpar Cache": "Limpar Cache",
    "Sair": "Sair",
    "Sim": "Sim",
    "Não": "Não",
    "Cuidado!": "Cuidado!",
    "Atenção": "Atenção",
    "Sucesso": "Sucesso",
    "Erro": "Erro",

    // Navigation Main Items
    "Dashboard": "Dashboard",
    "Monitoramento": "Monitoramento",
    "Clientes": "Clientes",
    "Motoristas": "Motoristas",
    "Viagens": "Viagens",
    "Delivery": "Delivery",
    "Financeiro": "Financeiro",
    "Mensagem": "Mensagem",
    "Fale conosco": "Fale conosco",
    "Relatórios": "Relatórios",
    "Grupos de chamados": "Grupos de chamados",
    "Notificações Admins": "Notificações Admins",
    "Avançadas": "Avançadas",

    // Clients Submenu
    "Lista de pessoa física": "Lista de pessoa física",
    "Lista de pessoa jurídica": "Lista de pessoa jurídica",
    "Solicitação de exclusão da conta": "Solicitação de exclusão da conta",

    // Drivers Submenu
    "Lista": "Lista",
    "Cadastro de Motorista": "Cadastro de Motorista",
    "Solicitação de mudança de veículos": "Solicitação de mudança de veículos",
    "Solicitar documentos": "Solicitar documentos",

    // Delivery Submenu
    "Configurações": "Configurações",
    "Seções": "Seções",
    "Categorias de estabelecimentos": "Categorias de estabelecimentos",
    "Gestão Financeira": "Gestão Financeira",
    "Gerenciar Zona de Entrega": "Gerenciar Zona de Entrega",
    "Acessórios de entrega": "Acessórios de entrega",
    "Configurações Gerais": "Configurações Gerais",
    "Configuração Delivery": "Configuração Delivery",
    "Configuração do Token ASAAS": "Configuração do Token ASAAS",
    "Cadastro de estabelecimentos": "Cadastro de estabelecimentos",
    "Configurações do chamado": "Configurações do chamado",

    // Financial Submenu
    "Produção do motorista": "Produção do motorista",
    "Taxa de Cancelamento": "Taxa de Cancelamento",
    "Lançamento financeiro": "Lançamento financeiro",
    "Compra de crédito": "Compra de crédito",
    "Gestão de Comissão": "Gestão de Comissão",
    "Solicitações de Transferências": "Solicitações de Transferências",
    "Dashboard Adquirente": "Dashboard Adquirente",
    "Visão Geral": "Visão Geral",
    "Transações": "Transações",

    // Message Submenu
    "Notificação": "Notificação",
    "Notificações de aniversário": "Notificações de aniversário",

    // Contact Submenu
    "Cliente": "Cliente",

    // Report Submenu
    "Gerar": "Gerar",
    "Listagem": "Listagem",

    // Call Groups
    "Motoristas Vinculados": "Motoristas Vinculados",

    // Settings / Advanced
    "Áreas de Cidade": "Áreas de Cidade",
    "Adicionar Cidade": "Adicionar Cidade",
    "Editar Cidade": "Editar Cidade",
    "Administrador": "Administrador",
    "Perfis": "Perfis",
    "Usuários": "Usuários",
    "Adquirente global": "Adquirente global",
    "Confirmação de Código": "Confirmação de Código",
    "Adquirente por cidade": "Adquirente por cidade",
    "Whatsapp": "Whatsapp",
    "Conectar whatsapp": "Conectar whatsapp",
    "Chaves WhatsApp": "Chaves WhatsApp",
    "Notificações de viagem (WhatsApp)": "Notificações de viagem (WhatsApp)",
    "Chamado": "Chamado",
    "Formas de Pagamentos": "Formas de Pagamentos",
    "Chaves do app": "Chaves do app",
    "Ver Logs do Mongo": "Ver Logs do Mongo",
    "Raio de chamado por cidade": "Raio de chamado por cidade",
    "Por cidade": "Por cidade",
    "Gerenciar Pedágio": "Gerenciar Pedágio",
    "Termos": "Termos",
    "Configurações de apps": "Configurações de apps",
    "Versões": "Versões",
    "Configurações de apps parceiros": "Configurações de apps parceiros",
    "Lista telefonica": "Lista telefonica",
    "Verificação Firebase": "Verificação Firebase",
    "Configurações de serviço SMTP": "Configurações de serviço SMTP",
    "Penalidade de ações do motorista": "Penalidade de ações do motorista",
    "Motivos de cancelamento": "Motivos de cancelamento",
    "Configurações adicionais": "Configurações adicionais",
    "Serviços Externos Globais": "Serviços Externos Globais",
    "Serviços Externos Por Cidade": "Serviços Externos Por Cidade",
    "Serviços Externos Webhook": "Serviços Externos Webhook",
    "Política de uso do aplicativo": "Política de uso do aplicativo",
    "Mensagens do chat - Motorista": "Mensagens do chat - Motorista",
    "Módulos Ativos": "Módulos Ativos",
    "Configurações do Cadastro": "Configurações do Cadastro",
    "Config. Tela de Cadastro Motorista": "Config. Tela de Cadastro Motorista",
    "Adicionar Documentos Por Categoria": "Adicionar Documentos Por Categoria",
    "Vincular Documento No Cadastro Do Cliente": "Vincular Documento No Cadastro Do Cliente",
    "Documentos Do App": "Documentos Do App",
    "Credenciais de integração externa": "Credenciais de integração externa",
    "Importações e Definições": "Importações e Definições",
    "Bloqueio em massa de Prestadores": "Bloqueio em massa de Prestadores",
    "Desbloqueio em massa de Prestadores por CPF": "Desbloqueio em massa de Prestadores por CPF",
    "Zerar Saldo dos Motoristas": "Zerar Saldo dos Motoristas",
    "Zerar Nota dos Motoristas": "Zerar Nota dos Motoristas",
    "Entrega": "Entrega",
    "Gerenciar Itens": "Gerenciar Itens",
    "Sugestão de Texto": "Sugestão de Texto",
    "Tarifas": "Tarifas",
    "Tipos de Viagem": "Tipos de Viagem",
    "Tipos de Serviços": "Tipos de Serviços",
    "Gatilho de Tarifa": "Gatilho de Tarifa",
    "Bandeira de Tarifa": "Bandeira de Tarifa",
    "Dinâmica por Área": "Dinâmica por Área",
    "Parceiros": "Parceiros",
    "Mensagens da Ouvidoria": "Mensagens da Ouvidoria",
    "Promoções": "Promoções",
    "Cupons": "Cupons",
    "Voucher": "Voucher",
    "Promoções por Viagem": "Promoções por Viagem",
    "Gestor": "Gestor",
    "Lista de Gestores": "Lista de Gestores",
    "Motoristas por Gestor": "Motoristas por Gestor",
    "Central": "Central",
    "Listagem de usuários": "Listagem de usuários",
    "Bairros": "Bairros",
    "Frete": "Frete",
    "Cadastro de Item": "Cadastro de Item",
    "Listagem de Itens": "Listagem de Itens",
    "Serviços Extras": "Serviços Extras",
    "Acessibilidade Carga": "Acessibilidade Carga",
    "Publicidade": "Publicidade",
    "Listar Publicidade": "Listar Publicidade",
    "Link Para Menu Externo": "Link Para Menu Externo",
    "Lista de Publicidade App Pro": "Lista de Publicidade App Pro",
    "Inserir Publicidade App Pro": "Inserir Publicidade App Pro",
    "Rotas": "Rotas",
    "Cadastrar": "Cadastrar",
    "Liberar Motoristas": "Liberar Motoristas",
    "Banners": "Banners",
    "Mapas": "Mapas",
    "Gerenciar Endereços": "Gerenciar Endereços",
    "Cadastrar Locais": "Cadastrar Locais",
    "Endereços Irregulares": "Endereços Irregulares",
    "Endereços Em Cache": "Endereços Em Cache",
    "Configurações Por Cidade": "Configurações Por Cidade",
    "Teste Serviço De Mapa": "Teste Serviço De Mapa",
    "Otimização De Rota": "Otimização De Rota",
    "Gerenciar Chaves De Mapa Web": "Gerenciar Chaves De Mapa Web",
    "Sequenciador De Mapas": "Sequenciador De Mapas",
    "Area De Risco": "Area De Risco",
    "Áreas De Calor Do Mapa": "Áreas De Calor Do Mapa",
    "Área de Monitoramento": "Área de Monitoramento",
    "Configurações de layouts": "Configurações de layouts",

    // Dashboard Operacional
    "Dashboard Operacional": "Dashboard Operacional",
    "Métricas de frota, status de viagens e faturamento consolidado em tempo real": "Métricas de frota, status de viagens e faturamento consolidado em tempo real",
    "Ao vivo": "Ao vivo",
    "Atualizar Dados": "Atualizar Dados",
    "Atualizando...": "Atualizando...",
    "Viagens Hoje": "Viagens Hoje",
    "Corridas concluídas hoje": "Corridas concluídas hoje",
    "Faturamento Hoje": "Faturamento Hoje",
    "Receita bruta acumulada hoje": "Receita bruta acumulada hoje",
    "Ticket Médio Hoje": "Ticket Médio Hoje",
    "Valor médio por viagem concluída": "Valor médio por viagem concluída",
    "Veículos Ativos": "Veículos Ativos",
    "veículos registrados na frota": "veículos registrados na frota",
    "Tipos de Motorista & Frota": "Tipos de Motorista & Frota",
    "Distribuição de veículos por modalidade de atendimento": "Distribuição de veículos por modalidade de atendimento",
    "categoria": "categoria",
    "categorias": "categorias",
    "Ativos": "Ativos",
    "Fila": "Fila",
    "Pendentes": "Pendentes",
    "Formas de Pagamento": "Formas de Pagamento",
    "Corridas": "Corridas",
    "Dinheiro": "Dinheiro",
    "Voucher": "Voucher",
    "Cartão": "Cartão",
    "Em Dinheiro": "Em Dinheiro",
    "Em Voucher": "Em Voucher",
    "Em Cartão": "Em Cartão",
    "Status das Viagens": "Status das Viagens",
    "Operacional": "Operacional",
    "Aceitas": "Aceitas",
    "Finalizadas": "Finalizadas",
    "Total de Viagens": "Total de Viagens",
    "Viagens Canceladas": "Viagens Canceladas",
    "Desistências": "Desistências",
    "Pelo Motorista": "Pelo Motorista",
    "Pelo Passageiro": "Pelo Passageiro",
    "Pelo Cliente": "Pelo Passageiro",
    "Total Cancelamentos": "Total Cancelamentos",
    "Top Motoristas": "Top Motoristas",
    "Top Passageiros": "Top Passageiros",
    "Top Clientes": "Top Passageiros",
    "Hoje": "Hoje",
    "Este Mês": "Este Mês",
    "Geral": "Geral",
    "Parabéns": "Parabéns",
    "Total": "Total",
    "viagem": "viagem",
    "viagens": "viagens",
    "Nenhuma corrida computada no momento": "Nenhuma corrida computada no momento",
    "Nenhuma viagem registrada no período": "Nenhuma viagem registrada no período",
    "Nenhum cancelamento computado": "Nenhum cancelamento computado",
    "Nenhum motorista ranqueado no período selecionado.": "Nenhum motorista ranqueado no período selecionado.",
    "Nenhum cliente ranqueado no período selecionado.": "Nenhum passageiro ranqueado no período selecionado.",
    "Nenhum passageiro ranqueado no período selecionado.": "Nenhum passageiro ranqueado no período selecionado.",
    "Carregando ranking...": "Carregando ranking...",
    "Carregando mais motoristas...": "Carregando mais motoristas...",
    "Carregando mais clientes...": "Carregando mais passageiros...",
    "Carregando mais passageiros...": "Carregando mais passageiros...",
    "Fim dos registros para este filtro.": "Fim dos registros para este filtro.",
    "Modalidade de Corrida": "Modalidade de Corrida",
    "Total de veículos:": "Total de veículos:",
    "Aguardando": "Aguardando",
    "Bloqueados": "Bloqueados",
    "Métricas de Clientes & Passageiros": "Métricas de Clientes & Passageiros",
    "Visão consolidada da base de passageiros registrados": "Visão consolidada da base de passageiros registrados",
    "Total de Clientes": "Total de Passageiros",
    "Clientes Ativos": "Passageiros Ativos",
    "Clientes Pendentes": "Passageiros Pendentes",
    "Clientes Bloqueados": "Passageiros Bloqueados",
    "Méd.": "Méd.",
  },
  en: {
    // Header & User
    "Usuário:": "User:",
    "Perfil:": "Role:",
    "Visualizar faturas": "View Invoices",
    "Cidade não encontrada": "City not found",
    "Buscar cidade": "Search city",
    "Cidades Ativas": "Active Cities",
    "Idioma": "Language",
    "Brasil": "Brazil",
    "Estados Unidos": "United States",
    "Alterar senha": "Change password",
    "Limpar Cache": "Clear Cache",
    "Sair": "Logout",
    "Sim": "Yes",
    "Não": "No",
    "Cuidado!": "Warning!",
    "Atenção": "Attention",
    "Sucesso": "Success",
    "Erro": "Error",

    // Navigation Main Items
    "Dashboard": "Dashboard",
    "Monitoramento": "Monitoring",
    "Clientes": "Clients",
    "Motoristas": "Drivers",
    "Viagens": "Trips",
    "Delivery": "Delivery",
    "Financeiro": "Financial",
    "Mensagem": "Messages",
    "Fale conosco": "Contact Us",
    "Relatórios": "Reports",
    "Grupos de chamados": "Call Groups",
    "Notificações Admins": "Admin Notifications",
    "Avançadas": "Advanced",

    // Clients Submenu
    "Lista de pessoa física": "Individual Clients",
    "Lista de pessoa jurídica": "Corporate Clients",
    "Solicitação de exclusão da conta": "Account Deletion Requests",

    // Drivers Submenu
    "Lista": "List",
    "Cadastro de Motorista": "Driver Registration",
    "Solicitação de mudança de veículos": "Vehicle Change Requests",
    "Solicitar documentos": "Request Documents",

    // Delivery Submenu
    "Configurações": "Settings",
    "Seções": "Sections",
    "Categorias de estabelecimentos": "Establishment Categories",
    "Gestão Financeira": "Financial Management",
    "Gerenciar Zona de Entrega": "Manage Delivery Zone",
    "Acessórios de entrega": "Delivery Accessories",
    "Configurações Gerais": "General Settings",
    "Configuração Delivery": "Delivery Configuration",
    "Configuração do Token ASAAS": "ASAAS Token Configuration",
    "Cadastro de estabelecimentos": "Establishment Registration",
    "Configurações do chamado": "Call Settings",

    // Financial Submenu
    "Produção do motorista": "Driver Production",
    "Taxa de Cancelamento": "Cancellation Fee",
    "Lançamento financeiro": "Financial Entry",
    "Compra de crédito": "Buy Credits",
    "Gestão de Comissão": "Commission Management",
    "Solicitações de Transferências": "Transfer Requests",
    "Dashboard Adquirente": "Acquirer Dashboard",
    "Visão Geral": "Overview",
    "Transações": "Transactions",

    // Message Submenu
    "Notificação": "Notification",
    "Notificações de aniversário": "Birthday Notifications",

    // Contact Submenu
    "Cliente": "Client",

    // Report Submenu
    "Gerar": "Generate",
    "Listagem": "List",

    // Call Groups
    "Motoristas Vinculados": "Linked Drivers",

    // Settings / Advanced
    "Áreas de Cidade": "City Areas",
    "Adicionar Cidade": "Add City",
    "Editar Cidade": "Edit City",
    "Administrador": "Administrator",
    "Perfis": "Profiles",
    "Usuários": "Users",
    "Adquirente global": "Global Acquirer",
    "Confirmação de Código": "Code Confirmation",
    "Adquirente por cidade": "Acquirer by City",
    "Whatsapp": "WhatsApp",
    "Conectar whatsapp": "Connect WhatsApp",
    "Chaves WhatsApp": "WhatsApp Keys",
    "Notificações de viagem (WhatsApp)": "Trip Notifications (WhatsApp)",
    "Chamado": "Calls",
    "Formas de Pagamentos": "Payment Methods",
    "Chaves do app": "App Keys",
    "Ver Logs do Mongo": "View Mongo Logs",
    "Raio de chamado por cidade": "Call Radius by City",
    "Por cidade": "By City",
    "Gerenciar Pedágio": "Manage Tolls",
    "Termos": "Terms",
    "Configurações de apps": "App Settings",
    "Versões": "Versions",
    "Configurações de apps parceiros": "Partner App Settings",
    "Lista telefonica": "Phone List",
    "Verificação Firebase": "Firebase Verification",
    "Configurações de serviço SMTP": "SMTP Service Settings",
    "Penalidade de ações do motorista": "Driver Action Penalties",
    "Motivos de cancelamento": "Cancellation Reasons",
    "Configurações adicionais": "Additional Settings",
    "Serviços Externos Globais": "Global External Services",
    "Serviços Externos Por Cidade": "External Services By City",
    "Serviços Externos Webhook": "Webhook External Services",
    "Política de uso do aplicativo": "App Usage Policy",
    "Mensagens do chat - Motorista": "Driver Chat Messages",
    "Módulos Ativos": "Active Modules",
    "Configurações do Cadastro": "Registration Settings",
    "Config. Tela de Cadastro Motorista": "Driver Signup Screen Config",
    "Adicionar Documentos Por Categoria": "Add Documents By Category",
    "Vincular Documento No Cadastro Do Cliente": "Link Document to Client",
    "Documentos Do App": "App Documents",
    "Credenciais de integração externa": "External Integration Credentials",
    "Importações e Definições": "Imports & Settings",
    "Bloqueio em massa de Prestadores": "Bulk Provider Blocking",
    "Desbloqueio em massa de Prestadores por CPF": "Bulk Provider Unblocking",
    "Zerar Saldo dos Motoristas": "Reset Driver Balances",
    "Zerar Nota dos Motoristas": "Reset Driver Ratings",
    "Entrega": "Delivery",
    "Gerenciar Itens": "Manage Items",
    "Sugestão de Texto": "Text Suggestions",
    "Tarifas": "Tariffs",
    "Tipos de Viagem": "Trip Types",
    "Tipos de Serviços": "Service Types",
    "Gatilho de Tarifa": "Tariff Trigger",
    "Bandeira de Tarifa": "Tariff Flag",
    "Dinâmica por Área": "Surge Pricing by Area",
    "Parceiros": "Partners",
    "Mensagens da Ouvidoria": "Ombudsman Messages",
    "Promoções": "Promotions",
    "Cupons": "Coupons",
    "Voucher": "Voucher",
    "Promoções por Viagem": "Promotions by Trip",
    "Gestor": "Manager",
    "Lista de Gestores": "Manager List",
    "Motoristas por Gestor": "Drivers by Manager",
    "Central": "Central",
    "Listagem de usuários": "User List",
    "Bairros": "Neighborhoods",
    "Frete": "Freight",
    "Cadastro de Item": "Item Registration",
    "Listagem de Itens": "Item List",
    "Serviços Extras": "Extra Services",
    "Acessibilidade Carga": "Cargo Accessibility",
    "Publicidade": "Advertising",
    "Listar Publicidade": "List Ads",
    "Link Para Menu Externo": "Link to External Menu",
    "Lista de Publicidade App Pro": "App Pro Ad List",
    "Inserir Publicidade App Pro": "Insert App Pro Ad",
    "Rotas": "Routes",
    "Cadastrar": "Register",
    "Liberar Motoristas": "Release Drivers",
    "Banners": "Banners",
    "Mapas": "Maps",
    "Gerenciar Endereços": "Manage Addresses",
    "Cadastrar Locais": "Register Locations",
    "Endereços Irregulares": "Irregular Addresses",
    "Endereços Em Cache": "Cached Addresses",
    "Configurações Por Cidade": "Settings by City",
    "Teste Serviço De Mapa": "Map Service Test",
    "Otimização De Rota": "Route Optimization",
    "Gerenciar Chaves De Mapa Web": "Manage Web Map Keys",
    "Sequenciador De Mapas": "Map Sequencer",
    "Area De Risco": "Risk Area",
    "Áreas De Calor Do Mapa": "Map Heatmaps",
    "Área de Monitoramento": "Monitoring Area",
    "Configurações de layouts": "Layout Settings",

    // Operational Dashboard (English)
    "Dashboard Operacional": "Operational Dashboard",
    "Métricas de frota, status de viagens e faturamento consolidado em tempo real": "Fleet metrics, trip status and consolidated revenue in real time",
    "Ao vivo": "Live",
    "Atualizar Dados": "Refresh Data",
    "Atualizando...": "Refreshing...",
    "Viagens Hoje": "Today's Trips",
    "Corridas concluídas hoje": "Completed rides today",
    "Faturamento Hoje": "Today's Revenue",
    "Receita bruta acumulada hoje": "Gross accumulated revenue today",
    "Ticket Médio Hoje": "Average Ticket Today",
    "Valor médio por viagem concluída": "Average value per completed trip",
    "Veículos Ativos": "Active Vehicles",
    "veículos registrados na frota": "vehicles registered in fleet",
    "Tipos de Motorista & Frota": "Driver Types & Fleet",
    "Distribuição de veículos por modalidade de atendimento": "Vehicle distribution by service modality",
    "categoria": "category",
    "categorias": "categories",
    "Ativos": "Active",
    "Fila": "Queue",
    "Pendentes": "Pending",
    "Formas de Pagamento": "Payment Methods",
    "Corridas": "Rides",
    "Dinheiro": "Cash",
    "Voucher": "Voucher",
    "Cartão": "Credit Card",
    "Em Dinheiro": "Cash",
    "Em Voucher": "Voucher",
    "Em Cartão": "Credit Card",
    "Status das Viagens": "Trip Status",
    "Operacional": "Operations",
    "Aceitas": "Accepted",
    "Finalizadas": "Finished",
    "Total de Viagens": "Total Trips",
    "Viagens Canceladas": "Canceled Trips",
    "Desistências": "Cancellations",
    "Pelo Motorista": "By Driver",
    "Pelo Passageiro": "By Passenger",
    "Pelo Cliente": "By Passenger",
    "Total Cancelamentos": "Total Cancellations",
    "Top Motoristas": "Top Drivers",
    "Top Passageiros": "Top Passengers",
    "Top Clientes": "Top Passengers",
    "Hoje": "Today",
    "Este Mês": "This Month",
    "Geral": "All Time",
    "Parabéns": "Celebrate",
    "Total": "Total",
    "viagem": "trip",
    "viagens": "trips",
    "Nenhuma corrida computada no momento": "No rides computed at the moment",
    "Nenhuma viagem registrada no período": "No trips recorded in the period",
    "Nenhum cancelamento computado": "No cancellations computed",
    "Nenhum motorista ranqueado no período selecionado.": "No drivers ranked in selected period.",
    "Nenhum cliente ranqueado no período selecionado.": "No passengers ranked in selected period.",
    "Nenhum passageiro ranqueado no período selecionado.": "No passengers ranked in selected period.",
    "Carregando ranking...": "Loading ranking...",
    "Carregando mais motoristas...": "Loading more drivers...",
    "Carregando mais clientes...": "Loading more passengers...",
    "Carregando mais passageiros...": "Loading more passengers...",
    "Fim dos registros para este filtro.": "End of records for this filter.",
    "Modalidade de Corrida": "Service Modality",
    "Total de veículos:": "Total vehicles:",
    "Aguardando": "Waiting",
    "Bloqueados": "Blocked",
    "Métricas de Clientes & Passageiros": "Passengers & Clients Metrics",
    "Visão consolidada da base de passageiros registrados": "Consolidated view of registered passengers",
    "Total de Clientes": "Total Passengers",
    "Clientes Ativos": "Active Passengers",
    "Clientes Pendentes": "Pending Passengers",
    "Clientes Bloqueados": "Blocked Passengers",
    "Méd.": "Avg.",
  },
};

const LanguageContext = createContext<LanguageContextData>({} as LanguageContextData);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isBrazilActive, setIsBrazilActiveState] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem("@App:brazil_active");
      if (saved !== null) return saved === "true";
    } catch {}
    return true;
  });

  const [language, setLanguageState] = useState<LanguageType>(() => {
    try {
      const brazilActive = localStorage.getItem("@App:brazil_active") !== "false";
      if (!brazilActive) return "en";
      const saved = localStorage.getItem("@App:language");
      if (saved === "en" || saved === "pt") return saved;
    } catch {}
    return "en"; // Padrão: Inglês (Estados Unidos)
  });

  const setLanguage = (lang: LanguageType) => {
    const activeLang = (!isBrazilActive && lang === "pt") ? "en" : lang;
    try {
      localStorage.setItem("@App:language", activeLang);
    } catch {}
    setLanguageState(activeLang);
  };

  const setIsBrazilActive = (active: boolean) => {
    try {
      localStorage.setItem("@App:brazil_active", String(active));
    } catch {}
    setIsBrazilActiveState(active);
    if (!active) {
      setLanguage("en");
    }
  };

  const t = (text: string, fallback?: string): string => {
    if (!text) return fallback || "";
    const activeLang = (!isBrazilActive && language === "pt") ? "en" : language;
    const langDict = translations[activeLang];
    if (langDict && langDict[text] !== undefined) {
      return langDict[text];
    }
    const clean = text.trim();
    if (langDict && langDict[clean] !== undefined) {
      return langDict[clean];
    }
    return fallback || text;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, isBrazilActive, setIsBrazilActive, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextData => {
  return useContext(LanguageContext);
};

export default LanguageContext;
