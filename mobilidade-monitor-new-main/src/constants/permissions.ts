export const CLIENTE = "cliente";
export const MOTORISTA = "motorista";
export const CIDADE = "cidade";
export const CONFIGURACAO = "configuracao";

export const POLITICA_USO_APP = "politica_uso_app";
export const CONTATO = "contato";
export const VIAGEM = "viagem";
export const MARKETING = "marketing";
export const PUBLICIDADE = "publicidade";
export const MENSAGEM = "mensagem";
export const DASHBOARD = "dashboard";
export const MONITORAMENTO = "monitoramento";
export const FINANCEIRO = "financeiro";
export const PARCEIRO = "parceiro";
export const GESTOR = "gestor";
export const CENTRAL = "central";

export const CENTRAL_LISTAGEM = "central_listagem";
export const CENTRAL_USUARIOS = "central_usuarios";
export const CENTRAL_BAIRROS = "central_bairros";
export const CENTRAL_CONFIGURACOES = "central_configuracoes";

export const CENTRAL_SUBMENU_PERMISSIONS = [
  CENTRAL_LISTAGEM,
  CENTRAL_USUARIOS,
  CENTRAL_BAIRROS,
  CENTRAL_CONFIGURACOES,
] as const;

export const hasAnySubmenuPermission = (
  hasPermission: (nameGroup: string, namePermission: string | null) => boolean,
  groupName: string,
  permissionNames: readonly string[]
): boolean => {
  return permissionNames.some((perm) => hasPermission(groupName, perm));
};
export const FRETE = "frete";
export const CADASTRO = "cadastro";
export const TARIFAS = "tarifas";
export const VERSAO = "versao";
export const SUPORTE = "suporte";
export const DELIVERY = "delivery";
export const NOTIFICATION = "notificações";
export const RELATORIO = "relatorio";
export const ROTA = "rota";
export const PROMOCAO = "promocao";
export const ENTREGA = "entrega";
export const MILITAR = "militar";
export const WEBHOOKS = "webhooks";
export const MAPA = 'mapa';
export const TOTEM = 'totem';
export const WHATSAPP = 'whatsapp';
export const ACESSAR_GRUPO_WHATSAPP_VIAGEM_AGENDADA = 'acessar_grupo_whatsapp_viagem_agendada';
export const ZAFIRA = 'zafira';
export const ZAFIRA_VISUALIZAR_VALIDACAO = 'visualizar_validacao';
export const ZAFIRA_VALIDAR_CADASTRO = 'validar_cadastro';

export const MOTORISTA_VISUALIZAR_DADOS_BANCARIOS = 'visualizar_dados_bancarios';
export const MOTORISTA_EDITAR_DADOS_BANCARIOS = 'editar_dados_bancarios';

export const CIDADE_ADICIONAR_AREA = 'adicionar_area';
export const CIDADE_EDITAR_AREA = 'editar_area';

export const FINANCEIRO_PRODUCAO_MOTORISTA = 'producao_motorista';
export const FINANCEIRO_COMPRA_CREDITO = 'compra_credito';
export const FINANCEIRO_SOLICITACOES_TRANSFERENCIA = 'solicitacoes_transferencia';
export const FINANCEIRO_RELATORIOS = 'relatorios_financeiro';
export const FINANCEIRO_TAXA_CANCELAMENTO = 'taxa_cancelamento';
export const FINANCEIRO_LANCAMENTO_FINANCEIRO = 'lancamento_financeiro';
export const FINANCEIRO_GESTAO_MONETIZACAO = 'gestao_monetizacao';
export const FINANCEIRO_EXIBIR_DASHBOARD_ADQUIRENTE = 'exibir_dashboard_adquirente';
export const FINANCEIRO_RELATORIO_GERAL_SINTETICO = 'relatorio_geral_sintetico';
export const FINANCEIRO_GERENCIAR_PREPAGO = 'gerenciar_prepago';

export const CONFIGURACAO_GERENCIAR_CADASTRO_APP = 'gerenciar_cadastro_app';
export const CONFIGURACAO_CATEGORIA_CADASTRO = 'categoria_cadastro';
export const CONFIGURACAO_GERENCIAR_DOCUMENTO = 'gerenciar_documento';
export const CONFIGURACAO_DOCUMENTOS_APP = 'documentos_app';

export const CONFIGS_REGISTER_SUBMENU_PERMISSIONS = [
  CONFIGURACAO_GERENCIAR_CADASTRO_APP,
  CONFIGURACAO_CATEGORIA_CADASTRO,
  CONFIGURACAO_GERENCIAR_DOCUMENTO,
  CONFIGURACAO_DOCUMENTOS_APP,
] as const;