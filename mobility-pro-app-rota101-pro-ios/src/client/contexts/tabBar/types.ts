export type TabType = 'inicio' | 'viagens' | 'perfil';

export interface TabBarContextType {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
}

export interface TabBarProviderProps {
  children: React.ReactNode;
}
