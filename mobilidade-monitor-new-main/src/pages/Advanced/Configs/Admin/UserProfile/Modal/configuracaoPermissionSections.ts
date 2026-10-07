export const CONFIGURACAO_GROUP_NAME = "configuracao";

export interface UserGroupPermissionRow {
  description: string;
  id: number;
  name: string;
  statusId: number;
  userGroupId: number;
}

interface SectionDefinition {
  key: string;
  names: ReadonlySet<string>;
  title: string;
}

const SECTIONS: readonly SectionDefinition[] = [
  {
    key: "apps-painel",
    title: "Aplicativos, painel e parceiros",
    names: new Set<string>([
      "config_app",
      "visualize_config_app_partner",
      "listar_parceiro",
      "admin_listar",
      "admin_adicionar",
      "gerenciar_perfil",
      "termos",
      "gerenciar_formas_pagamento",
      "politica_uso_app",
    ]),
  },
  {
    key: "tarifas",
    title: "Tarifas, gatilhos e bandeiras",
    names: new Set<string>([
      "tarifas_listar",
      "tarifas_editar",
      "listar_gatilho",
      "inserir_gatilho",
      "listar_bandeira",
      "inserir_bandeira",
      "gerenciar_pedagios",
      "vincular_motorista_chamado",
    ]),
  },
  {
    key: "cidades",
    title: "Cidades, áreas e raio de chamado",
    names: new Set<string>(["cidade", "raio_de_chamado", "gerenciar_endereco"]),
  },
  {
    key: "motoristas",
    title: "Motoristas, documentos e cadastro no app",
    names: new Set<string>([
      "gerenciar_cadastro_app",
      "gerenciar_documento",
      "penalty_for_driver",
      "importar_motorista",
      "bloquear_massa_prestadores",
      "desbloquear_massa_prestadores_cpf",
      "zerar_nota_motorista",
      "zerar_saldo_motorista",
      "categoria_cadastro",
    ]),
  },
  {
    key: "chamados-viagem",
    title: "Chamados, chatbot e tipos de viagem",
    names: new Set<string>([
      "grupo_chamado",
      "gerenciar_chamado",
      "gerenciar_chatbot",
      "criar_chamado_sem_destino",
      "gerenciar_tipos_cancelamento",
    ]),
  },
  {
    key: "importacao-cliente",
    title: "Clientes e importação",
    names: new Set<string>(["importar_cliente"]),
  },
  {
    key: "integracoes",
    title: "Integrações, adquirentes e serviços externos",
    names: new Set<string>([
      "external_services",
      "gerenciar_adquirentes",
      "config_service_smtp",
      "gerenciar_codigos_confirmacao",
      "visualize_list_contacts",
    ]),
  },
  {
    key: "layout-extras",
    title: "Layout, aparência e configurações adicionais",
    names: new Set<string>(["configuracoes_layout", "additional_config"]),
  },
];

const sortByDescription = (
  a: UserGroupPermissionRow,
  b: UserGroupPermissionRow
): number =>
  a.description.localeCompare(b.description, "pt", { sensitivity: "base" });

export interface ConfiguracaoSubsection {
  key: string;
  permissions: UserGroupPermissionRow[];
  title: string;
}

export const groupConfiguracaoPermissions = (
  permissions: UserGroupPermissionRow[]
): ConfiguracaoSubsection[] => {
  const assigned = new Set<number>();
  const result: ConfiguracaoSubsection[] = [];
  for (const section of SECTIONS) {
    const slice = permissions
      .filter((p) => section.names.has(p.name) && !assigned.has(p.id))
      .sort(sortByDescription);
    slice.forEach((p) => assigned.add(p.id));
    if (slice.length > 0) {
      result.push({
        key: section.key,
        title: section.title,
        permissions: slice,
      });
    }
  }
  const rest = permissions
    .filter((p) => !assigned.has(p.id))
    .sort(sortByDescription);
  if (rest.length > 0) {
    result.push({
      key: "demais",
      title: "Demais permissões",
      permissions: rest,
    });
  }
  return result;
};
