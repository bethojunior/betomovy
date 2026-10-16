import {useTheme} from 'styled-components/native';
import Ionicons from '@expo/vector-icons/Ionicons';
import {getModuleIcon} from '../../../../components/BottomTabBar/moduleIcons';

interface ModuleFallbackImageProps {
  moduleName: string;
  size: number;
}

/** Ícone exibido no grid "Serviços" quando o módulo não tem logo cadastrada — mesmo mapa do footer. */
export function ModuleFallbackImage({moduleName, size}: ModuleFallbackImageProps) {
  const {colors} = useTheme();

  return <Ionicons name={getModuleIcon(moduleName)} size={size} color={colors.primary} />;
}
