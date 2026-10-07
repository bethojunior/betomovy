import { ReactNode } from 'react';
import {
  ContentButtonsLocalizationSpeedMob,
  ContentLocalizationSpeedMob,
  ContentPage,
  ContentPageScroll,
  DescriptionLocalizationSpeedMob,
  ButtonLocalizationSpeedMob,
  TitleLocalizationSpeedMob,
} from '../styles';

interface PermissionStepProps {
  width: number;
  icon: ReactNode;
  title: string;
  descriptions: string[];
  buttonTitle: string;
  onPress: () => void;
  loading?: boolean;
}

export function PermissionStep({
  width,
  icon,
  title,
  descriptions,
  buttonTitle,
  onPress,
  loading,
}: PermissionStepProps) {
  return (
    <ContentPage style={{ width }}>
      <ContentPageScroll>
        <ContentLocalizationSpeedMob>
          {icon}
          <TitleLocalizationSpeedMob>{title}</TitleLocalizationSpeedMob>
          {descriptions.map(description => (
            <DescriptionLocalizationSpeedMob key={description}>
              {description}
            </DescriptionLocalizationSpeedMob>
          ))}
          <ContentButtonsLocalizationSpeedMob>
            <ButtonLocalizationSpeedMob
              title={buttonTitle}
              onPress={onPress}
              loading={loading}
              enabled={!loading}
            />
          </ContentButtonsLocalizationSpeedMob>
        </ContentLocalizationSpeedMob>
      </ContentPageScroll>
    </ContentPage>
  );
}
