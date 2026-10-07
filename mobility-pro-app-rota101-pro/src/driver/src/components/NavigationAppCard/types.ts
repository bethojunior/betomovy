export type NavigationAppType = 'waze' | 'google';

export interface NavigationAppCardProps {
  appType: NavigationAppType;
  title: string;
  description?: string;
  onPress?: () => void;
}
