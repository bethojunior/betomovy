import { ReactNode } from 'react';
import {
  ContentButtons,
  ContentPage,
  ContentPageScroll,
  ContentPermission,
  Description,
  PermissionButton,
  SkipButton,
  SkipText,
  Title,
} from '../styles';

interface PermissionStepProps {
  width: number;
  icon: ReactNode;
  title: string;
  descriptions: string[];
  buttonTitle: string;
  onPress: () => void;
  loading?: boolean;
  secondaryTitle?: string;
  onSecondaryPress?: () => void;
}

export function PermissionStep({
  width,
  icon,
  title,
  descriptions,
  buttonTitle,
  onPress,
  loading,
  secondaryTitle,
  onSecondaryPress,
}: PermissionStepProps) {
  return (
    <ContentPage style={{ width }}>
      <ContentPageScroll>
        <ContentPermission>
          {icon}
          <Title>{title}</Title>
          {descriptions.map((description) => (
            <Description key={description}>{description}</Description>
          ))}
          <ContentButtons>
            <PermissionButton
              title={buttonTitle}
              onPress={onPress}
              loading={loading}
              enabled={!loading}
            />
          </ContentButtons>
          {secondaryTitle && onSecondaryPress ? (
            <SkipButton onPress={onSecondaryPress} disabled={loading}>
              <SkipText>{secondaryTitle}</SkipText>
            </SkipButton>
          ) : null}
        </ContentPermission>
      </ContentPageScroll>
    </ContentPage>
  );
}
