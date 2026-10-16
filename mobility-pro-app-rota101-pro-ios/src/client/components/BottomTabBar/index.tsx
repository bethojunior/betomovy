import {RFValue} from 'react-native-responsive-fontsize';
import {useTheme} from 'styled-components/native';
import Ionicons from '@expo/vector-icons/Ionicons';
import AntDesign from '@expo/vector-icons/AntDesign';
import {translate} from '../../locales';
import type {IoniconName} from '../../types/ionicons';
import {Container, Tab, TabText} from './styles';
import {BottomTabBarProps} from './types';

function outlineOf(icon: IoniconName): IoniconName {
  return `${icon}-outline` as IoniconName;
}

export default function BottomTabBar({activeTab, onTabChange, moduleShortcut}: BottomTabBarProps) {
  const {colors} = useTheme();

  const iconColor = (isActive: boolean) => (isActive ? colors.primary : colors.grayLight);

  const isInicio = activeTab === 'inicio';
  const isViagens = activeTab === 'viagens';
  const isPerfil = activeTab === 'perfil';

  return (
    <Container>
      <Tab onPress={() => onTabChange('inicio')} activeOpacity={0.7}>
        <Ionicons name={isInicio ? 'home' : 'home-outline'} size={RFValue(18)} color={iconColor(isInicio)} />
        <TabText isActive={isInicio}>{translate('home.text_tab_home')}</TabText>
      </Tab>

      <Tab onPress={() => onTabChange('viagens')} activeOpacity={0.7}>
        {/* AntDesign: Ionicons não tem um ícone de "histórico" (relógio com seta) de verdade. */}
        <AntDesign name="history" size={RFValue(18)} color={iconColor(isViagens)} />
        <TabText isActive={isViagens}>{translate('home.text_tab_trips')}</TabText>
      </Tab>

      <Tab onPress={() => onTabChange('perfil')} activeOpacity={0.7}>
        <Ionicons name={isPerfil ? 'person' : 'person-outline'} size={RFValue(18)} color={iconColor(isPerfil)} />
        <TabText isActive={isPerfil}>{translate('home.text_tab_profile')}</TabText>
      </Tab>

      {moduleShortcut && (
        <Tab onPress={moduleShortcut.onPress} activeOpacity={0.7}>
          <Ionicons
            name={moduleShortcut.isActive ? moduleShortcut.icon : outlineOf(moduleShortcut.icon)}
            size={RFValue(18)}
            color={iconColor(moduleShortcut.isActive)}
          />
          <TabText isActive={moduleShortcut.isActive}>{moduleShortcut.label}</TabText>
        </Tab>
      )}
    </Container>
  );
}
