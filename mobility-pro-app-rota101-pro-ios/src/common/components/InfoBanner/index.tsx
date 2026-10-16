import { Container, TextGroup, Title, Description } from './styles';
import { IconBadge } from '../IconBadge';
import { InfoBannerProps } from './types';

export function InfoBanner({ icon, title, description, variant = 'neutral' }: InfoBannerProps) {
  return (
    <Container variant={variant}>
      <IconBadge icon={icon} />
      <TextGroup>
        <Title variant={variant}>{title}</Title>
        {!!description && <Description>{description}</Description>}
      </TextGroup>
    </Container>
  );
}
