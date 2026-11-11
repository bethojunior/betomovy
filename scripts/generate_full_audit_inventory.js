const fs = require('fs');

const monitorTree = JSON.parse(fs.readFileSync('scripts/parsed_menu_tree.json', 'utf8'));
const routesMap = JSON.parse(fs.readFileSync('scripts/monitor_routes_map.json', 'utf8'));

// Mapa de páginas e botões principais do Monitor
const monitorPagesInventory = [
    {
        category: "1. Dashboard",
        route: "/",
        component: "Dashboard",
        description: "Painel inicial com métricas operacionais em tempo real",
        buttonsAndFeatures: [
            "Card de Corridas ativas em andamento",
            "Card de Motoristas online / ocupados / offline",
            "Card de Passageiros ativos na cidade",
            "Gráficos de evolução de faturamento e chamados",
            "Filtro por período (hoje, 7 dias, 30 dias)",
            "Ranking de motoristas com melhor avaliação",
            "Ranking de passageiros mais frequentes",
            "Atalhos rápidos para monitoramento e corridas"
        ]
    },
    {
        category: "2. Monitoramento",
        route: "/monitoring",
        component: "Monitoring",
        description: "Mapa ao vivo de rastreamento e despacho de veículos",
        buttonsAndFeatures: [
            "Botão 'Lista de motoristas' (abre modal com status e filtro em tempo real)",
            "Botão 'Lista de clientes' (abre modal com listagem direta e busca por nome)",
            "Botão 'Acompanhar motorista' (foco de câmera no veículo selecionado)",
            "Botão 'Área de monitoramento' (abre modal de polígonos/bairros monitorados)",
            "Botão 'Clientes' (menu dropdown de ações de clientes)",
            "Filtro de status de motoristas (Todos, Online, Em corrida, Offline)",
            "Controles de zoom, tela cheia e recentralização no mapa Mapbox",
            "Card flutuante de detalhes do motorista e da corrida ativa",
            "Botão de cancelar corrida ativa com modal de justificativa"
        ]
    },
    {
        category: "3. Clientes",
        route: "/client/physical, /client/legal, /client/solicitationExclusion",
        component: "ClientList, LegalPerson, SolicitationsExclusionUserList",
        description: "Gestão completa de passageiros e contas corporativas",
        buttonsAndFeatures: [
            "Pessoa Física (/client/physical): busca por nome/telefone/CPF, exportação, ver detalhes, bloquear/desbloquear, histórico de corridas",
            "Pessoa Jurídica (/client/legal): cadastro de empresa parceira, saldo corporativo, fatura",
            "Solicitações de exclusão (/client/solicitationExclusion): aprovar/rejeitar exclusão de conta em conformidade com LGPD e Apple"
        ]
    },
    {
        category: "4. Motoristas",
        route: "/driver/signup, /driver/list, /driver/solicitationChangeCar, /driver/requestDocuments, /driver/solicitationExclusion",
        component: "SignupDriver, ListDrivers, SolicitationChangeCar, RequestDocuments, SolicitationsExclusionDriverList",
        description: "Gestão completa da frota de motoristas parceiros",
        buttonsAndFeatures: [
            "Novo (/driver/signup): formulário de cadastro de motorista, dados pessoais, CNH, dados do veículo e categoria",
            "Listagem (/driver/list): tabela de motoristas, filtros por status (Aprovado, Pendente, Bloqueado), botão Ver Perfil, botão Editar, botão Extrato",
            "Alteração de veículo (/driver/solicitationChangeCar): aprovar/rejeitar novas fotos de CRLV e veículo submetidas",
            "Documentos solicitados (/driver/requestDocuments): checklist de documentos pendentes com aprovação ou solicitação de reenvio",
            "Solicitações de exclusão (/driver/solicitationExclusion): moderação de pedidos de encerramento de cadastro de motoristas"
        ]
    },
    {
        category: "5. Viagens",
        route: "/trip/list, /trip/list/:id, /trip/list/details/:tripReference",
        component: "ListTrip, DetailsTrip",
        description: "Histórico e auditoria minuciosa de corridas",
        buttonsAndFeatures: [
            "Tabela de corridas com paginação e busca por referência/passageiro/motorista",
            "Filtro por status (Finalizada, Cancelada pelo motorista, Cancelada pelo cliente, Cancelada pela central)",
            "Filtro por intervalo de datas",
            "Botão 'Visualizar detalhes' da viagem",
            "Detalhamento: traçado GPS percorrido no mapa, pontos de embarque/desembarque",
            "Espelho financeiro da corrida (taxa da plataforma, repasse do motorista, descontos)",
            "Botão de cancelamento de emergência com estorno"
        ]
    },
    {
        category: "6. Delivery",
        route: "/delivery/monitoring, /delivery/config/sections, /delivery/config/establishments, /delivery/registerEstablishments, /delivery/financial, /delivery/config/zone, /delivery/config/accessories, /delivery/configCall, /delivery/generalConfig, /delivery/deliveryConfig, /delivery/asaasConfig",
        component: "DeliveryMonitoring, Establishments, RegisterEstablishments, etc.",
        description: "Módulo completo de entregas e encomendas",
        buttonsAndFeatures: [
            "Monitoramento Delivery: mapa exclusivo de pedidos de entregas",
            "Seções e Categorias de produtos/estabelecimentos",
            "Gestão e Cadastro de Estabelecimentos comerciais",
            "Gestão Financeira e Repasses de entregadores",
            "Zonas e Áreas de entrega por raio/polígono",
            "Acessórios e embalagens de delivery",
            "Configurações gerais de chamados de entregadores",
            "Integração Asaas para cobrança e repasse de delivery"
        ]
    },
    {
        category: "7. Financeiro",
        route: "/financial/report-production-driver/0, /financial/cancellationFee, /financial/charge, /financial/buyCredit, /financial/commission, /financial/transferRequests, /financial/reports, /financial/dashboard",
        component: "DriverProduction, CancellationFee, FinancialCharge, BuyCredit, CommissionManagement, TransferRequests, ReportsFinancial, DashboardFinancial",
        description: "Gestão contábil, saldo de motoristas, taxas e repasses",
        buttonsAndFeatures: [
            "Produção do motorista: demonstrativo de ganhos, filtros de data e botão de exportação",
            "Taxa de cancelamento: tabela de taxas geradas e botão de isenção/estorno",
            "Lançamento financeiro: formulário de débito/crédito manual na conta do motorista",
            "Compra de crédito: recarga de saldo pré-pago de motorista",
            "Gestão de monetização: definição de porcentagem ou taxa fixa da plataforma",
            "Solicitações de transferência: fila de saques PIX/bancários com botão Aprovar / Rejeitar",
            "Relatórios financeiros sintéticos e analíticos",
            "Dashboard do Adquirente: transações de cartão e PIX em tempo real"
        ]
    },
    {
        category: "8. Mensagem",
        route: "/message/notification, /message/birthdayNotification",
        component: "Notification, BirthdayNotification",
        description: "Central de comunicação e push notifications",
        buttonsAndFeatures: [
            "Envio de Notificação Push em massa para Passageiros ou Motoristas",
            "Filtro de público-alvo (todos, ativos nos últimos 30 dias, inativos)",
            "Notificações automáticas de Aniversário com cupom ou mensagem personalizada"
        ]
    },
    {
        category: "9. Fale Conosco",
        route: "/pages/TalkToUs/Client, /pages/TalkToUs/Trip",
        component: "TalkToUsClient, TalkToUsTrip",
        description: "Atendimento e tickets de suporte da plataforma",
        buttonsAndFeatures: [
            "Fale conosco Cliente: listagem de mensagens recebidas, status do chamado e botão responder",
            "Fale conosco Viagem: contestações de valor, itens esquecidos e botão de estorno"
        ]
    },
    {
        category: "10. Relatórios",
        route: "/report/create, /report/list",
        component: "ReportCreate, ReportList",
        description: "Mecanismo de geração e exportação de dados",
        buttonsAndFeatures: [
            "Gerar relatórios: seleção de colunas, filtros por cidade, motorista, cliente, intervalo de datas",
            "Listagem de relatórios: download em CSV/Excel e botão de exclusão de arquivos gerados"
        ]
    },
    {
        category: "11. Grupos de Chamados",
        route: "/callGroups, /callGroups/drivers",
        component: "ListCallGroups, LinkedDrivers",
        description: "Distribuição inteligente de chamados por grupos de motoristas",
        buttonsAndFeatures: [
            "Listagem e criação de grupos de despacho prioritário",
            "Vinculação de motoristas aos grupos com ordenação de fila"
        ]
    },
    {
        category: "12. Notificações Admins",
        route: "/config/notifications-admin",
        component: "NotificationAdmin",
        description: "Configuração de alertas críticos para a equipe gestora",
        buttonsAndFeatures: [
            "Cadastro de e-mails e telefones para receber alertas de pânico (SOS), recusas e erros"
        ]
    },
    {
        category: "13. Avançadas",
        route: "/config/..., /mapSetting/..., /tariff/..., /promotion/...",
        component: "Vários componentes avançados",
        description: "Painel de controle profundo do sistema",
        buttonsAndFeatures: [
            "Tarifas: Tipos de Viagem, Gatilho de Tarifa, Bandeirada, Dinâmica por Área, Serviços de Apps",
            "Mapas: Gerenciamento de Endereços, Endereços em Cache, Otimização de Rotas, Chaves Web, Áreas de Risco, Áreas de Calor, Áreas de Monitoramento",
            "Configurações Gerais: Configuração do App, Credenciais de Integração Externa, Sessão WhatsApp, Raio de Chamado, Gerenciar Pedágios, Termos e Política de Privacidade, Verificação Firebase, Configurações de SMTP, Lista Telefônica",
            "Configurações de Cadastro: Cadastro do Prestador, Documentos por Categoria, Vinculação de Documentos do Cliente, Documentos do App",
            "Parcerias e Promoções: Cupons de Desconto, Vouchers de Viagem, Links de Parcerias",
            "Publicidade: Cadastro e Listagem de Banners e Anúncios dentro do App",
            "Central: Listagem de Centrais, Usuários da Central, Bairros da Central, Configurações da Central",
            "Frete: Cadastro e Listagem de Itens, Serviços Extras, Acessibilidade de Carga",
            "Rotas: Cadastro, Edição, Listagem de Rotas Fixas, Liberação de Motoristas e Banners Promocionais"
        ]
    }
];

fs.writeFileSync('scripts/monitor_pages_inventory.json', JSON.stringify(monitorPagesInventory, null, 2));
console.log('Inventário compilado com sucesso!');
