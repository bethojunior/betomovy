import { FC } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from 'styled-components/native';
import { Avatar } from '../Avatar';
import { TripChatHeaderProps } from './types';
import {
  Container,
  GoBackButton,
  PressableContent,
  TitleColumn,
  Label,
  Title,
  SubtitleContainer,
  CallButtonContainer,
  CallButton,
} from './styles';

const AVATAR_SIZE = 52;

// Shell do header do TripChat, compartilhado entre client e driver — só desenha
// (voltar, foto, rótulo+título, ligar, slot de subtítulo). Cada lado decide o que
// entra no slot e se passa onCallPress; este componente não sabe em qual app está.
export const TripChatHeader: FC<TripChatHeaderProps> = ({
  photoUrl,
  photoAccessibilityLabel,
  label,
  title,
  onGoBack,
  goBackAccessibilityLabel,
  onCallPress,
  callAccessibilityLabel,
  onPress,
  pressAccessibilityLabel,
  children,
}) => {
  const theme = useTheme();

  const content = (
    <>
      <Avatar photoUrl={photoUrl} size={AVATAR_SIZE} accessibilityLabel={photoAccessibilityLabel} />

      <TitleColumn>
        {label && <Label>{label}</Label>}
        <Title numberOfLines={1}>{title}</Title>
        {children && <SubtitleContainer>{children}</SubtitleContainer>}
      </TitleColumn>
    </>
  );

  return (
    <Container>
      <GoBackButton onPress={onGoBack} accessibilityLabel={goBackAccessibilityLabel}>
        <Ionicons name="arrow-back-outline" size={30} color={theme.colors.primary} />
      </GoBackButton>

      {onPress ? (
        <PressableContent
          onPress={onPress}
          activeOpacity={0.7}
          accessibilityLabel={pressAccessibilityLabel}
        >
          {content}
        </PressableContent>
      ) : (
        content
      )}

      {onCallPress && (
        <CallButtonContainer>
          <CallButton onPress={onCallPress} accessibilityLabel={callAccessibilityLabel}>
            <Ionicons name="call" size={20} color={theme.colors.primaryText} />
          </CallButton>
        </CallButtonContainer>
      )}
    </Container>
  );
};
