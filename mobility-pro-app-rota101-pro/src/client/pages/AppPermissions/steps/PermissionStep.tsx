import { ReactNode } from 'react';
import {
  ContentButtons,
  ContentPage,
  ContentPageScroll,
  ContentPermission,
  Description,
  Title,
} from '../styles';
import { Button } from '~/client/components/Button';

interface PermissionStepProps {
  width: number;
  icon: ReactNode;
  title: string;
  descriptions: string[];
  buttonTitle: string;
  onPress: () => void;
  loading?: boolean;
  closeButtonTitle?: string;
  onClose?: () => void;
}

export function PermissionStep({
  width,
  icon,
  title,
  descriptions,
  buttonTitle,
  onPress,
  loading,
  closeButtonTitle,
  onClose,
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
            <Button
              title={buttonTitle}
              onPress={onPress}
              loading={loading}
              enabled={!loading}
            />
            {onClose && (
              <Button title={closeButtonTitle} onPress={onClose} variant="outline" />
            )}
          </ContentButtons>
        </ContentPermission>
      </ContentPageScroll>
    </ContentPage>
  );
}
