export interface RawConfigItem {
  key?: string;
  value?: string | number | null;
  description?: string | null;
  inputTypePro?: string | null;
  type?: string | null;
  config?: RawConfigItem[];
}

export interface NormalizedConfigItem {
  key: string;
  value: string;
  description: string;
  inputTypePro?: string;
}

export interface NormalizedCategory {
  type: string;
  config: NormalizedConfigItem[];
}

export const CONFIG_METADATA: Record<string, { category: string; label: string; inputType?: string }> = {
  // Mapas & Rotas
  google_api_key: { category: "MAPS", label: "Chave API do Google Maps (Web / Frontend)" },
  google_api_key_backend: { category: "MAPS", label: "Chave API do Google Maps (Backend / Servidor)" },
  mapbox_access_token: { category: "MAPS", label: "Token de Acesso Mapbox (Aplicativo Mobile)" },
  mapbox_access_token_monitor: { category: "MAPS", label: "Token de Acesso Mapbox (Painel Web Monitor)" },
  mapbox_access_token_mobility_lite: { category: "MAPS", label: "Token de Acesso Mapbox (Mobility Lite)" },
  here_api_key: { category: "MAPS", label: "Chave de API HERE Technologies" },
  here_app_id: { category: "MAPS", label: "App ID da HERE Technologies" },
  here_code_id: { category: "MAPS", label: "App Code da HERE Technologies" },
  default_maps_api: { category: "MAPS", label: "Provedor Padrão de Mapas (google / mapbox / here)" },
  lite_map_option: { category: "MAPS", label: "Modo Lite de Mapas (Economia de Dados)", inputType: "boolean" },
  service_priority_searching: { category: "MAPS", label: "Prioridade do Serviço de Busca de Endereços" },
  service_priority_direction: { category: "MAPS", label: "Prioridade do Serviço de Cálculo de Rotas" },
  service_priority_geocoding: { category: "MAPS", label: "Prioridade do Serviço de Geocodificação" },
  enable_custom_mode_of_map_services: { category: "MAPS", label: "Habilitar Modo Personalizado de Provedores de Mapa", inputType: "boolean" },
  load_route_automatically: { category: "MAPS", label: "Carregar Rota Automaticamente no Trajeto", inputType: "boolean" },
  route_optimization_google: { category: "MAPS", label: "Otimização de Rota com Google Maps", inputType: "boolean" },
  route_optimization_mapbox: { category: "MAPS", label: "Otimização de Rota com Mapbox", inputType: "boolean" },
  route_optimization_here: { category: "MAPS", label: "Otimização de Rota com HERE", inputType: "boolean" },
  enable_freedirections: { category: "MAPS", label: "Habilitar Rotas Gratuitas (Free Directions)", inputType: "boolean" },
  enable_map_dark_driver: { category: "MAPS", label: "Habilitar Mapa Noturno (Dark) no App do Motorista", inputType: "boolean" },
  map_api_for_address_cache: { category: "MAPS", label: "Provedor de Mapa para Cache de Endereços" },
  radius_places_cache: { category: "MAPS", label: "Raio de Busca para Cache de Locais (metros)" },
  max_quantity_customer_places: { category: "MAPS", label: "Quantidade Máxima de Locais Salvos pelo Passageiro" },
  minimum_number_cached_addresses: { category: "MAPS", label: "Número Mínimo de Endereços no Cache" },
  order_type_cache_address: { category: "MAPS", label: "Ordem de Consulta no Cache de Endereços" },
  enable_address_cache_fb704: { category: "MAPS", label: "Habilitar Cache de Endereços Externo (FB704)", inputType: "boolean" },
  url_address_cache_fb704: { category: "MAPS", label: "URL da API do Cache de Endereços FB704" },
  keysearch_address_cache_fb704: { category: "MAPS", label: "Chave de Busca do Cache FB704" },
  keyreadwrite_address_cache_fb704: { category: "MAPS", label: "Chave de Leitura/Escrita do Cache FB704" },
  map_vehicle_icon_link: { category: "MAPS", label: "URL do Ícone Personalizado de Veículo no Mapa" },

  // Gateways & Pagamento
  mp_public_key: { category: "PAGAMENTOS", label: "Mercado Pago - Chave Pública (Public Key)" },
  mp_access_token: { category: "PAGAMENTOS", label: "Mercado Pago - Token de Acesso (Access Token)" },
  disable_mercado_pago_app: { category: "PAGAMENTOS", label: "Desativar Mercado Pago no Aplicativo", inputType: "boolean" },
  paypal_client_id: { category: "PAGAMENTOS", label: "PayPal - Client ID" },
  paypal_secret: { category: "PAGAMENTOS", label: "PayPal - Secret Key" },
  cielo_merchant_id: { category: "PAGAMENTOS", label: "Cielo - Merchant ID" },
  cielo_merchant_key: { category: "PAGAMENTOS", label: "Cielo - Merchant Key" },
  recebeaqui_client_token: { category: "PAGAMENTOS", label: "RecebeAqui - Token do Cliente" },
  financial_intermediary_id: { category: "PAGAMENTOS", label: "ID do Intermediador Financeiro Principal" },
  show_boleto_asaas: { category: "PAGAMENTOS", label: "Exibir Opção de Boleto Asaas", inputType: "boolean" },
  minimum_value_for_pix: { category: "PAGAMENTOS", label: "Valor Mínimo para Pagamento via PIX (R$)" },
  enable_pix_trip_end_ipag: { category: "PAGAMENTOS", label: "Habilitar PIX no Fim da Viagem via iPag", inputType: "boolean" },
  enable_birth_date_payment_card_register: { category: "PAGAMENTOS", label: "Exigir Data de Nascimento no Cadastro de Cartão", inputType: "boolean" },
  enable_voucher_payment_type_inDriver_trip: { category: "PAGAMENTOS", label: "Habilitar Voucher em Viagens InDriver / Negociadas", inputType: "boolean" },
  enable_card_payment_type_inDriver_trip: { category: "PAGAMENTOS", label: "Habilitar Cartão em Viagens InDriver / Negociadas", inputType: "boolean" },
  enable_driver_split_payment: { category: "PAGAMENTOS", label: "Habilitar Divisão Automática de Pagamento (Split)", inputType: "boolean" },
  enable_pre_paid_commission_charging_per_period: { category: "PAGAMENTOS", label: "Cobrança Pré-paga de Comissão por Período", inputType: "boolean" },
  "enable_pre-paid_commission_charging_per_period": { category: "PAGAMENTOS", label: "Cobrança Pré-paga de Comissão por Período", inputType: "boolean" },
  only_prepaid_per_period: { category: "PAGAMENTOS", label: "Aceitar Somente Corridas Pré-pagas por Período", inputType: "boolean" },
  enable_credit_prepaid: { category: "PAGAMENTOS", label: "Habilitar Sistema de Créditos Pré-pagos", inputType: "boolean" },
  call_driver_without_credit: { category: "PAGAMENTOS", label: "Permitir Chamar Motorista Sem Saldo de Créditos", inputType: "boolean" },
  minimum_value_for_withdraw: { category: "PAGAMENTOS", label: "Valor Mínimo para Saque de Motoristas (R$)" },
  minimum_value_for_partner_withdraw: { category: "PAGAMENTOS", label: "Valor Mínimo para Saque de Parceiros (R$)" },
  max_amount_for_receipt_in_vehicle: { category: "PAGAMENTOS", label: "Valor Máximo para Recebimento em Dinheiro no Carro" },
  cancellation_fee: { category: "PAGAMENTOS", label: "Taxa Geral de Cancelamento de Viagem (R$)" },
  customer_cancellation_fee: { category: "PAGAMENTOS", label: "Taxa de Cancelamento Cobrada do Passageiro (R$)" },
  customer_partner_cancellation_fee: { category: "PAGAMENTOS", label: "Taxa de Cancelamento de Passageiro Corporativo/Parceiro (R$)" },
  driver_percentage_trip_value: { category: "PAGAMENTOS", label: "Porcentagem da Corrida Repassada ao Motorista (%)" },
  driver_percentage_customer_trip_value: { category: "PAGAMENTOS", label: "Porcentagem de Viagem de Cliente Particular ao Motorista (%)" },
  employee_commission_voucher_payment: { category: "PAGAMENTOS", label: "Comissão de Funcionário em Pagamento com Voucher (%)" },
  employee_commission_money_in_car: { category: "PAGAMENTOS", label: "Comissão de Funcionário em Pagamento em Dinheiro (%)" },
  establishment_commission_money_in_car: { category: "PAGAMENTOS", label: "Comissão do Estabelecimento em Pagamento em Dinheiro (%)" },
  customer_partner_commission_money_in_car: { category: "PAGAMENTOS", label: "Comissão do Cliente Parceiro em Pagamento em Dinheiro (%)" },
  billing_date: { category: "PAGAMENTOS", label: "Dia do Mês para Fechamento de Faturas/Cobrança" },
  enable_buy_voucher: { category: "PAGAMENTOS", label: "Habilitar Compra de Vouchers pelos Usuários", inputType: "boolean" },
  "enable-button-bills-menu": { category: "PAGAMENTOS", label: "Exibir Botão de Faturas no Menu do Aplicativo", inputType: "boolean" },
  monetization_enabled: { category: "PAGAMENTOS", label: "Habilitar Sistema de Monetização Global", inputType: "boolean" },
  application_currency: { category: "PAGAMENTOS", label: "Símbolo da Moeda Padrão (ex: R$, BRL)" },

  // Firebase & Push
  firebase_api_key: { category: "FIREBASE", label: "Chave API do Firebase (Web API Key)" },
  cloud_firestore: { category: "FIREBASE", label: "Nome do Banco de Dados / Projeto Cloud Firestore" },
  firebase_cloud_firestore_key: { category: "FIREBASE", label: "Chave de Acesso / Token do Cloud Firestore" },
  google_service_account_json: { category: "FIREBASE", label: "Credenciais de Serviço Google (FCM v1 Push JSON)" },
  title_end_blacklist_push: { category: "FIREBASE", label: "Título do Push ao Remover da Blacklist" },
  body_end_blacklist_push: { category: "FIREBASE", label: "Mensagem do Push ao Remover da Blacklist" },
  title_start_blacklist_push: { category: "FIREBASE", label: "Título do Push ao Entrar na Blacklist" },
  body_start_blacklist_push: { category: "FIREBASE", label: "Mensagem do Push ao Entrar na Blacklist" },

  // WhatsApp & Atendimento
  enable_whatsapp_central: { category: "WHATSAPP", label: "Habilitar Central WhatsApp de Atendimento", inputType: "boolean" },
  enable_anti_uber_central: { category: "WHATSAPP", label: "Habilitar Filtro Anti-Uber na Central WhatsApp", inputType: "boolean" },
  enable_whatsapp_group_central: { category: "WHATSAPP", label: "Disparo Automático de Mensagens para Grupo de WhatsApp", inputType: "boolean" },
  whatsapp_message_client: { category: "WHATSAPP", label: "Mensagem Padrão de WhatsApp para o Passageiro" },
  whatsapp_message_driver: { category: "WHATSAPP", label: "Mensagem Padrão de WhatsApp para o Motorista" },
  whatsapp_parabens_driver_message: { category: "WHATSAPP", label: "Mensagem de WhatsApp: Aprovação do Motorista" },
  whatsapp_parabens_client_message: { category: "WHATSAPP", label: "Mensagem de WhatsApp: Boas-vindas ao Passageiro" },
  whatsapp_zafira_validated_driver_message: { category: "WHATSAPP", label: "Mensagem de WhatsApp: Motorista Validado pela Zafira" },
  whatsapp_zafira_validated_client_message: { category: "WHATSAPP", label: "Mensagem de WhatsApp: Passageiro Validado pela Zafira" },
  text_whatsapp_trip_list_unanswered_support: { category: "WHATSAPP", label: "Mensagem WhatsApp para Suporte com Resposta Pendente" },

  // Socket & Tempo Real
  enable_realtime_socket: { category: "SOCKET", label: "Habilitar Servidor Socket em Tempo Real", inputType: "boolean" },
  enable_chat_webSocket: { category: "SOCKET", label: "Habilitar Chat via WebSocket entre Passageiro e Motorista", inputType: "boolean" },
  enable_trip_call_by_mongo: { category: "SOCKET", label: "Habilitar Fila de Chamadas de Corrida via MongoDB", inputType: "boolean" },
  enable_redis: { category: "SOCKET", label: "Habilitar Conexão com Servidor Redis", inputType: "boolean" },
  url_redis: { category: "SOCKET", label: "Host / URL de Conexão com Redis" },
  password_redis: { category: "SOCKET", label: "Senha de Conexão com Redis" },
  enable_redis_into_driver_called: { category: "SOCKET", label: "Armazenar Fila de Motoristas Notificados no Redis", inputType: "boolean" },
  pulse_group: { category: "SOCKET", label: "ID do Grupo de Monitoramento Pulse" },

  // Delivery
  delivery_platform_name: { category: "DELIVERY", label: "Nome da Plataforma de Entregas / Delivery" },
  delivery_support_email: { category: "DELIVERY", label: "E-mail de Suporte do Módulo Delivery" },
  delivery_support_phone: { category: "DELIVERY", label: "Telefone / WhatsApp de Suporte do Delivery" },
  type_of_delivery_area: { category: "DELIVERY", label: "Tipo de Delimitação de Área do Delivery" },
  name_establishment_delivery: { category: "DELIVERY", label: "Nome Padrão de Estabelecimento Delivery" },
  enable_delivery_confirmation_code: { category: "DELIVERY", label: "Exigir Código de Confirmação na Conclusão da Entrega", inputType: "boolean" },
  disable_phone_login_delivery: { category: "DELIVERY", label: "Desativar Login por Telefone no Módulo Delivery", inputType: "boolean" },

  // SMS
  sms_after_finish_trip_to_customer: { category: "SMS", label: "Enviar SMS ao Passageiro ao Finalizar a Viagem", inputType: "boolean" },
  sms_to_customer_in_driver_arrival_money_in_car: { category: "SMS", label: "SMS de Chegada do Motorista para Corridas em Dinheiro", inputType: "boolean" },
  sms_to_customer_in_driver_arrival: { category: "SMS", label: "Enviar SMS ao Passageiro Avisando que o Motorista Chegou", inputType: "boolean" },
  customer_register_sms_confirmation_code: { category: "SMS", label: "Exigir Código por SMS no Cadastro do Passageiro", inputType: "boolean" },
  code_phone_country: { category: "SMS", label: "Código Telefônico do País Padrão (ex: 55)" },

  // Email
  welcome_email_subject: { category: "EMAIL", label: "Assunto do E-mail de Boas-vindas" },
  welcome_email_title: { category: "EMAIL", label: "Título do E-mail de Boas-vindas" },
  welcome_email_message: { category: "EMAIL", label: "Mensagem do E-mail de Boas-vindas" },
  withdraw_email_subject: { category: "EMAIL", label: "Assunto do E-mail de Solicitação de Saque" },
  withdraw_email_title: { category: "EMAIL", label: "Título do E-mail de Solicitação de Saque" },
  withdraw_email_message: { category: "EMAIL", label: "Mensagem do E-mail de Solicitação de Saque" },
  email_to_send_request_withdraw: { category: "EMAIL", label: "E-mail da Administração para Receber Pedidos de Saque" },
  recovery_password_email: { category: "EMAIL", label: "Template de E-mail para Recuperação de Senha" },
  recovery_password_email_subject: { category: "EMAIL", label: "Assunto do E-mail de Recuperação de Senha" },
  recovery_password_message: { category: "EMAIL", label: "Corpo da Mensagem de Recuperação de Senha" },
  email_to_talk_us: { category: "EMAIL", label: "E-mail de Destino do Formulário Fale Conosco" },
  title_to_talk_us_email: { category: "EMAIL", label: "Título Padrão das Mensagens do Fale Conosco" },
  message_to_talk_us_email: { category: "EMAIL", label: "Mensagem Padrão do Formulário Fale Conosco" },

  // Sons & Alertas
  soundCallTrip: { category: "SONS", label: "URL do Áudio: Nova Corrida Padrão (Motorista)", inputType: "audio" },
  soundCallTripScheduled: { category: "SONS", label: "URL do Áudio: Corrida Agendada (Motorista)", inputType: "audio" },
  soundCallTripInDriver: { category: "SONS", label: "URL do Áudio: Proposta de Corrida por Oferta / InDriver", inputType: "audio" },
  soundCallTripServices: { category: "SONS", label: "URL do Áudio: Chamado de Serviços Especiais", inputType: "audio" },
  soundCallAlertSchedule: { category: "SONS", label: "URL do Áudio: Alerta de Viagem Agendada Próxima", inputType: "audio" },
  soundCallOnline: { category: "SONS", label: "URL do Áudio: Motorista Ficou Online", inputType: "audio" },
  soundCallOffline: { category: "SONS", label: "URL do Áudio: Motorista Ficou Offline", inputType: "audio" },
  enable_sound_initial_app_driver: { category: "SONS", label: "Tocar Som de Abertura no App do Motorista", inputType: "boolean" },

  // Regras de Viagem
  time_in_seconds_to_call_driver: { category: "VIAGENS", label: "Tempo para o Motorista Aceitar a Corrida (segundos)" },
  time_in_seconds_to_pass_driver_call: { category: "VIAGENS", label: "Tempo para Passar a Corrida para o Próximo Motorista (segundos)" },
  time_to_notify_driver_trip_scheduled: { category: "VIAGENS", label: "Antecedência para Notificar Corrida Agendada (minutos)" },
  time_to_call_driver_trip_scheduled_in_seconds: { category: "VIAGENS", label: "Tempo de Chamada para Viagem Agendada (segundos)" },
  time_to_cancel_trip_bid_in_seconds: { category: "VIAGENS", label: "Tempo Limite para Cancelar Lance de Corrida (segundos)" },
  time_to_turn_off_lazy_driver: { category: "VIAGENS", label: "Tempo de Inatividade para Desconectar Motorista (minutos)" },
  time_to_clear_driver_penalties: { category: "VIAGENS", label: "Tempo para Zerar Penalidades do Motorista (dias)" },
  not_answered_limit_to_turn_off_driver: { category: "VIAGENS", label: "Limite de Chamadas Recusadas Seguidas para Desconectar" },
  limit_drivers_called_in_trip: { category: "VIAGENS", label: "Número Máximo de Motoristas Notificados por Corrida" },
  limit_drivers_called_greater_radius: { category: "VIAGENS", label: "Limite de Motoristas Notificados no Raio Maior" },
  max_renew_list: { category: "VIAGENS", label: "Máximo de Renovações da Fila de Procura" },
  max_renew_all_drivers_list: { category: "VIAGENS", label: "Máximo de Renovações Globais da Lista de Motoristas" },
  limit_trip_for_rating_average: { category: "VIAGENS", label: "Quantidade Mínima de Viagens para Calcular Avaliação" },
  scheduled_trip_interval: { category: "VIAGENS", label: "Intervalo Mínimo entre Viagens Agendadas (minutos)" },
  fast_finger_call: { category: "VIAGENS", label: "Modo Dedo Rápido (Primeiro motorista que aceitar leva)", inputType: "boolean" },
  show_drivers_close: { category: "VIAGENS", label: "Exibir Motoristas Próximos no Mapa do Passageiro", inputType: "boolean" },
  show_more_calcs_driver: { category: "VIAGENS", label: "Exibir Detalhamento de Cálculos no App do Motorista", inputType: "boolean" },
  travel_only_by_offer: { category: "VIAGENS", label: "Operar Apenas por Oferta / Negociação de Valor", inputType: "boolean" },
  enable_floating_price_recalculation: { category: "VIAGENS", label: "Recálculo Flutuante de Preço em Tempo Real", inputType: "boolean" },
  enable_taximeter: { category: "VIAGENS", label: "Habilitar Taxímetro em Tempo Real no App", inputType: "boolean" },
  enable_open_price_trip: { category: "VIAGENS", label: "Permitir Corrida com Valor Aberto", inputType: "boolean" },
  enable_tip_race: { category: "VIAGENS", label: "Permitir que o Passageiro Adicione Gorjeta", inputType: "boolean" },
  enable_driver_leveling: { category: "VIAGENS", label: "Habilitar Nivelamento de Categorias de Motoristas", inputType: "boolean" },
  enable_route_in_progress_for_purchase: { category: "VIAGENS", label: "Permitir Paradas de Compras durante a Viagem", inputType: "boolean" },
  end_trip_only_by_central: { category: "VIAGENS", label: "Permitir Finalizar Corridas Somente pela Central", inputType: "boolean" },
  enable_favorite_driver_with_referral_link: { category: "VIAGENS", label: "Habilitar Motorista Favorito via Link de Indicação", inputType: "boolean" },
  enable_favorite_driver_central: { category: "VIAGENS", label: "Permitir que a Central Escolha Motorista Favorito", inputType: "boolean" },
  enable_favorite_customer_and_driver: { category: "VIAGENS", label: "Habilitar Favoritos Mútuos entre Cliente e Motorista", inputType: "boolean" },
  enable_only_client_accept_offer: { category: "VIAGENS", label: "Somente o Passageiro Pode Aceitar a Oferta da Corrida", inputType: "boolean" },
  title_trip_types: { category: "VIAGENS", label: "Título da Seção de Categorias de Veículos" },
  description_trip_types: { category: "VIAGENS", label: "Descrição da Seção de Categorias de Veículos" },
  text_the_end_trip_with_bonus: { category: "VIAGENS", label: "Mensagem de Fim de Viagem com Bônus Atribuído" },
  text_name_driver_custom: { category: "VIAGENS", label: "Rótulo Personalizado para 'Motorista' no App" },
  text_checkbox_select_app: { category: "VIAGENS", label: "Texto de Seleção de Modalidade no Aplicativo" },
  "interval-to-get-trips": { category: "VIAGENS", label: "Intervalo de Consulta de Corridas no App (segundos)" },
  block_trip: { category: "VIAGENS", label: "Bloqueio Emergencial de Novas Solicitações de Viagem", inputType: "boolean" },
  appSharingCustomerMessage: { category: "VIAGENS", label: "Mensagem de Compartilhamento do Passageiro" },
  appSharingDriverMessage: { category: "VIAGENS", label: "Mensagem de Compartilhamento do Motorista" },
  message_new_freight_trip_indrive: { category: "VIAGENS", label: "Mensagem de Nova Corrida de Frete (InDrive)" },
  message_accepted_freight_trip_indrive: { category: "VIAGENS", label: "Mensagem de Frete Aceito (InDrive)" },

  // Aplicativo & Sistema
  app_title: { category: "SISTEMA", label: "Nome / Título Oficial do Aplicativo" },
  title_for_home: { category: "SISTEMA", label: "Título Principal da Tela Inicial do App" },
  lbl_powered_by: { category: "SISTEMA", label: "Texto 'Desenvolvido por' / Powered By no Rodapé" },
  logo_default: { category: "SISTEMA", label: "URL da Imagem da Logo Padrão do Sistema" },
  application_timezone: { category: "SISTEMA", label: "Fuso Horário Oficial (ex: America/Sao_Paulo)" },
  driver_terms_of_use: { category: "SISTEMA", label: "URL do Termo de Uso e Privacidade do Motorista" },
  customer_terms_of_use: { category: "SISTEMA", label: "URL do Termo de Uso e Privacidade do Passageiro" },
  support_help_code: { category: "SISTEMA", label: "Código do Canal de Ajuda / Suporte" },
  support_help_phone: { category: "SISTEMA", label: "Telefone Principal da Central de Suporte" },
  promotional_image_customer_register: { category: "SISTEMA", label: "URL do Banner Promocional no Cadastro do Passageiro" },
  link_customer_pre_register: { category: "SISTEMA", label: "Link Web para Pré-cadastro de Passageiros" },
  link_driver_pre_register: { category: "SISTEMA", label: "Link Web para Pré-cadastro de Motoristas" },
  link_manager_indication: { category: "SISTEMA", label: "Link de Indicação de Gestores / Franqueados" },
  trip_sharing_link: { category: "SISTEMA", label: "URL Base para Compartilhamento de Corrida em Tempo Real" },
  link_storage_pictures: { category: "SISTEMA", label: "URL Base do Servidor de Armazenamento de Fotos (S3)" },
  url_redirect_app_play_store: { category: "SISTEMA", label: "Link de Download na Google Play Store" },
  url_redirect_app_app_store: { category: "SISTEMA", label: "Link de Download na Apple App Store" },
  power_bi_url: { category: "SISTEMA", label: "URL do Dashboard Integrado Microsoft Power BI" },
  seumilto_token_name: { category: "SISTEMA", label: "Nome do Token da Integração Seu Milto" },
  seumilto_token: { category: "SISTEMA", label: "Chave / Token de Integração Seu Milto" },
  cpfcnpj_api_token: { category: "SISTEMA", label: "Token da API de Validação de CPF e CNPJ" },
  allowed_genres: { category: "SISTEMA", label: "Gêneros Permitidos para Cadastro (ex: M, F, O)" },
  not_allowed_gender_message: { category: "SISTEMA", label: "Mensagem Exibida para Gênero Não Permitido" },
  block_customer_driver: { category: "SISTEMA", label: "Bloquear Passageiro de Cadastrar como Motorista na Mesma Conta", inputType: "boolean" },
  customer_signup_as_partner: { category: "SISTEMA", label: "Permitir que o Passageiro se Cadastre como Parceiro Comercial", inputType: "boolean" },
  customer_register_unblocked: { category: "SISTEMA", label: "Aprovação Automática no Cadastro de Passageiros", inputType: "boolean" },
  driver_register_unblocked: { category: "SISTEMA", label: "Aprovação Automática no Cadastro de Motoristas", inputType: "boolean" },
  dependent_register_unblocked: { category: "SISTEMA", label: "Aprovação Automática no Cadastro de Dependentes", inputType: "boolean" },
  enable_dependent: { category: "SISTEMA", label: "Habilitar Módulo de Dependentes Familiares no App", inputType: "boolean" },
  driver_profile_image_init_pending: { category: "SISTEMA", label: "Exigir Validação Manual da Foto de Perfil do Motorista", inputType: "boolean" },
  default_import_password: { category: "SISTEMA", label: "Senha Padrão para Usuários Importados em Massa" },
  enable_driver_open_gallery: { category: "SISTEMA", label: "Permitir que o Motorista Envie Fotos da Galeria do Celular", inputType: "boolean" },
  enable_customer_open_gallery: { category: "SISTEMA", label: "Permitir que o Passageiro Envie Fotos da Galeria do Celular", inputType: "boolean" },
  enable_mobility_app: { category: "SISTEMA", label: "Habilitar Modalidade de Mobilidade Urbana no Aplicativo", inputType: "boolean" },
  enable_freight_app: { category: "SISTEMA", label: "Habilitar Modalidade de Cargas e Fretes no Aplicativo", inputType: "boolean" },
  enable_share_trip_app: { category: "SISTEMA", label: "Habilitar Botão de Compartilhar Corrida no Aplicativo", inputType: "boolean" },
  enable_account_menu: { category: "SISTEMA", label: "Exibir Menu Minha Conta no Aplicativo", inputType: "boolean" },
  enable_route_corporate: { category: "SISTEMA", label: "Habilitar Módulo de Rotas Corporativas para Empresas", inputType: "boolean" },
  enable_driver_v2: { category: "SISTEMA", label: "Habilitar Aplicativo do Motorista Versão 2.0", inputType: "boolean" },
  enable_client_v2: { category: "SISTEMA", label: "Habilitar Aplicativo do Passageiro Versão 2.0", inputType: "boolean" },
  enable_facebook_login: { category: "SISTEMA", label: "Habilitar Login Social com Facebook", inputType: "boolean" },
  enable_google_login: { category: "SISTEMA", label: "Habilitar Login Social com Google", inputType: "boolean" },
  enable_security_button_options: { category: "SISTEMA", label: "Habilitar Opções do Botão de Segurança no App", inputType: "boolean" },
  enable_button_panic_by_city: { category: "SISTEMA", label: "Habilitar Botão de Pânico Configurado por Cidade", inputType: "boolean" },
  enable_alert_photo_panic: { category: "SISTEMA", label: "Capturar Foto Automaticamente ao Acionar o Botão de Pânico", inputType: "boolean" },
  number_request_avaliation_photo_for_block_driver: { category: "SISTEMA", label: "Tentativas de Reconhecimento Facial Falhas para Bloquear Motorista" },
  requirement_filds_on_register: { category: "SISTEMA", label: "Campos Obrigatórios Exigidos no Formulário de Cadastro" },
  enable_social_network: { category: "SISTEMA", label: "Exibir Redes Sociais no Aplicativo", inputType: "boolean" },
  enable_social_networks_on_monitor: { category: "SISTEMA", label: "Exibir Redes Sociais no Painel Monitor Web", inputType: "boolean" },
  enable_account_deletion_request: { category: "SISTEMA", label: "Permitir Solicitação de Exclusão de Conta Diretamente no App", inputType: "boolean" },
  enable_operation_manual_and_youtube_channel: { category: "SISTEMA", label: "Exibir Manual de Operação e Canal do YouTube", inputType: "boolean" },
  enable_new_site_page: { category: "SISTEMA", label: "Habilitar Nova Página Inicial do Site Institucional", inputType: "boolean" },
  hide_information_client_and_driver: { category: "SISTEMA", label: "Ocultar Informações Pessoais Sensíveis entre Cliente e Motorista", inputType: "boolean" },
  enable_publicity: { category: "SISTEMA", label: "Habilitar Banners de Publicidade no Aplicativo", inputType: "boolean" },
  enable_document_validation_confiance_bank: { category: "SISTEMA", label: "Habilitar Validação de Documentos via Confiance Bank", inputType: "boolean" },
  how_many_times_alert_will_be_shown: { category: "SISTEMA", label: "Quantas Vezes o Alerta de Novidades Será Exibido" },
  enable_transform_km_for_mi: { category: "SISTEMA", label: "Converter Quilômetros (KM) para Milhas (MI)", inputType: "boolean" },
  tittle_document_name: { category: "SISTEMA", label: "Nome do Documento Solicitado no Cadastro (ex: CNH, RG)" },
  description_registration: { category: "SISTEMA", label: "Instruções Explicativas na Tela de Cadastro" },
};

export function inferCategoryAndType(
  key: string, 
  value: any, 
  description?: string | null,
  typeName?: string | null
) {
  const meta = CONFIG_METADATA[key];
  if (meta) {
    return {
      category: meta.category,
      label: description && description.trim() ? description : meta.label,
      inputType: meta.inputType || (meta.label.toLowerCase().includes("habilitar") ? "boolean" : undefined)
    };
  }

  if (typeName && typeName.trim()) {
    const cleanType = typeName.trim().toUpperCase();
    return {
      category: cleanType,
      label: description && description.trim() ? description : key.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase()),
      inputType: (value === "0" || value === "1") ? "boolean" : undefined
    };
  }

  const lower = key.toLowerCase();
  let category = "SISTEMA";
  let inputType: string | undefined = undefined;

  if (
    lower.startsWith("enable_") || 
    lower.startsWith("enable-") || 
    lower.startsWith("disable_") || 
    lower.startsWith("disable-") || 
    lower.startsWith("block_") || 
    value === "0" || 
    value === "1"
  ) {
    inputType = "boolean";
  }

  if (lower.includes("map") || lower.includes("google") || lower.includes("here") || lower.includes("route")) {
    category = "MAPS";
  } else if (
    lower.includes("pay") || 
    lower.includes("cielo") || 
    lower.includes("pix") || 
    lower.includes("fee") || 
    lower.includes("commission") || 
    lower.includes("withdraw") || 
    lower.includes("price") || 
    lower.includes("voucher") || 
    lower.includes("billing")
  ) {
    category = "PAGAMENTOS";
  } else if (lower.includes("firebase") || lower.includes("firestore") || lower.includes("push")) {
    category = "FIREBASE";
  } else if (lower.includes("whatsapp")) {
    category = "WHATSAPP";
  } else if (lower.includes("socket") || lower.includes("redis") || lower.includes("pulse")) {
    category = "SOCKET";
  } else if (lower.includes("delivery")) {
    category = "DELIVERY";
  } else if (lower.includes("sms")) {
    category = "SMS";
  } else if (lower.includes("mail") || lower.includes("email")) {
    category = "EMAIL";
  } else if (lower.includes("sound") || lower.includes("audio")) {
    category = "SONS";
    inputType = "audio";
  } else if (lower.includes("driver") || lower.includes("trip")) {
    category = "VIAGENS";
  }

  return {
    category,
    label: description && description.trim() ? description : key.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase()),
    inputType
  };
}

export function normalizeKeys(raw: any[]): NormalizedCategory[] {
  if (!Array.isArray(raw)) return [];

  // Check if raw is already grouped (e.g. [ { type: "MAPS", config: [...] } ])
  const isAlreadyGrouped = raw.length > 0 && Array.isArray(raw[0]?.config);

  if (isAlreadyGrouped) {
    return raw.map((cat, catIdx) => {
      const type = cat.type || `cat-${catIdx}`;
      const configs = Array.isArray(cat.config) ? cat.config : [];
      return {
        type,
        config: configs.map((item: any) => {
          const inferred = inferCategoryAndType(item.key, item.value, item.description, item.typeName || cat.type);
          return {
            key: item.key,
            value: item.value !== null && item.value !== undefined ? String(item.value) : "",
            description: inferred.label,
            inputTypePro: item.inputTypePro || inferred.inputType
          };
        })
      };
    });
  }

  // Flat list of keys: group by category
  const categoriesMap: Map<string, NormalizedConfigItem[]> = new Map();
  const categoryOrder = [
    "MAPS",
    "PAGAMENTOS",
    "FIREBASE",
    "WHATSAPP",
    "SOCKET",
    "DELIVERY",
    "SMS",
    "EMAIL",
    "SONS",
    "VIAGENS",
    "SISTEMA"
  ];

  categoryOrder.forEach(cat => categoriesMap.set(cat, []));

  raw.forEach((item: any) => {
    if (!item || !item.key) return;

    const inferred = inferCategoryAndType(item.key, item.value, item.description, item.typeName);
    const catKey = inferred.category;

    if (!categoriesMap.has(catKey)) {
      categoriesMap.set(catKey, []);
    }

    categoriesMap.get(catKey)!.push({
      key: item.key,
      value: item.value !== null && item.value !== undefined ? String(item.value) : "",
      description: inferred.label,
      inputTypePro: item.inputTypePro || inferred.inputType
    });
  });

  const result: NormalizedCategory[] = [];
  categoriesMap.forEach((configs, type) => {
    if (configs.length > 0) {
      result.push({
        type,
        config: configs
      });
    }
  });

  return result;
}
