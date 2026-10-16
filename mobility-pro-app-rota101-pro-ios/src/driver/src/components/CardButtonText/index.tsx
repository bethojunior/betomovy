import React from 'react';
import { ButtonSend, TextCard, LogoContainer, ContentContainer } from './styles';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';

interface Props {
  text: string;
  onPress?: () => void;
  appType?: 'waze' | 'google';
}

export const CardButtonText = ({ text, onPress, appType }: Props) => {
  const renderLogo = () => {
    if (appType === 'waze') {
      return (
        <LogoContainer>
          <FontAwesome5 name="waze" size={26} color="#fff" />
        </LogoContainer>
      );
    }
    if (appType === 'google') {
      return (
        <LogoContainer>
          <FontAwesome5 name="map-marked-alt" size={24} color="#fff" />
        </LogoContainer>
      );
    }
    return null;
  };

  return (
    <ButtonSend activeOpacity={0.8} onPress={onPress} appType={appType}>
      <ContentContainer>
        {renderLogo()}
        <TextCard appType={appType}>{text || ''}</TextCard>
      </ContentContainer>
    </ButtonSend>
  );
};
