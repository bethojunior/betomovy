import type {IoniconName} from '../../types/ionicons';

export type TabType = 'inicio' | 'viagens' | 'perfil';

export interface ModuleShortcutTab {
  label: string;
  icon: IoniconName;
  isActive: boolean;
  onPress: () => void;
}

export interface BottomTabBarProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  /** Atalho "coringa" pro único módulo extra ativo (Delivery/Frete/Rotas/...). */
  moduleShortcut?: ModuleShortcutTab | null;
}
