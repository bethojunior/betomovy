import type {IoniconName} from '../../types/ionicons';

/**
 * Ícone (Ionicons) representando cada módulo no atalho "coringa" do footer.
 * Lista de módulos confirmada em appModules (banco hmlqa): Mobilidade (não
 * entra aqui, já é o app atual), Delivery, Serviços (ex-GetLight), Frete,
 * Rotas. Central e InDriver foram removidos de appModules — nenhum tinha
 * Screen de destino.
 */
const MODULE_ICONS: Record<string, IoniconName> = {
  Delivery: 'fast-food',
  'Serviços': 'construct',
  Frete: 'cube',
  Rotas: 'bus',
};

const DEFAULT_MODULE_ICON: IoniconName = 'apps';

export function getModuleIcon(moduleName: string): IoniconName {
  return MODULE_ICONS[moduleName] ?? DEFAULT_MODULE_ICON;
}
