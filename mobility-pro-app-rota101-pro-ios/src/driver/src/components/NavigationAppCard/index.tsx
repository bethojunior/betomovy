import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import {RFValue} from 'react-native-responsive-fontsize';
import Waze from '../../assets/navigationIcons/waze.svg';
import GoogleMaps from '../../assets/navigationIcons/google-maps.svg';
import theme from '../../styles/theme';
import {Card, Description, IconWrapper, TextContent, Title} from './styles';
import {NavigationAppCardProps} from './types';

const APP_ICONS = {
  waze: Waze,
  google: GoogleMaps,
};

export const NavigationAppCard = ({
  appType,
  title,
  description,
  onPress,
}: NavigationAppCardProps) => {
  const Icon = APP_ICONS[appType];

  return (
    <Card activeOpacity={0.8} onPress={onPress}>
      <IconWrapper>
        <Icon width={RFValue(36)} height={RFValue(36)} />
      </IconWrapper>
      <TextContent>
        <Title>{title}</Title>
        {!!description && <Description>{description}</Description>}
      </TextContent>
      <MaterialIcons
        name="chevron-right"
        size={RFValue(22)}
        color={theme.colors.grayLight}
      />
    </Card>
  );
};
