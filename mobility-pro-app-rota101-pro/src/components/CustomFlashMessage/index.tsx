import React from 'react';
import {Ionicons} from '@expo/vector-icons';
import {hideMessage} from 'react-native-flash-message';
import {RFValue} from 'react-native-responsive-fontsize';
import theme from '../../client/styles/theme';
import {translate} from '../../client/locales';
import {Card, IconBadge, Content, Title, Description, CloseButton} from './styles';
import {VARIANTS, DEFAULT_VARIANT} from './variants';
import {CustomFlashMessageProps} from './types';

// MessageComponent único do <FlashMessage>: substitui o card padrão da lib.
// Toda a aparência do toast (cor, ícone, texto) fica centralizada aqui + variants.ts
export const CustomFlashMessage: React.FC<CustomFlashMessageProps> = ({message, style}) => {
  const variant = VARIANTS[message?.type] || DEFAULT_VARIANT;
  const hasDescription = !!message?.description;

  return (
    <Card style={style}>
      <IconBadge color={variant.accentColor}>
        <Ionicons name={variant.iconName} size={RFValue(14)} color={theme.colors.white} />
      </IconBadge>
      <Content>
        <Title allowFontScaling={false}>{translate(variant.titleKey)}</Title>
        {hasDescription && (
          <Description allowFontScaling={false}>{message.description}</Description>
        )}
      </Content>
      <CloseButton activeOpacity={0.6} onPress={hideMessage}>
        <Ionicons name="close" size={RFValue(14)} color={theme.colors.text_gray} />
      </CloseButton>
    </Card>
  );
};
