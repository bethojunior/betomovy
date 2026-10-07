import {TouchableOpacity} from 'react-native';
import NotificationButton from '../NotificationButton';
import {AvatarProfile} from '../../../components/AvatarProfile';
import {
  Container,
  GreetingPill,
  GreetingText,
  NotificationButtonWrapper,
  RightActions,
} from './styles';
import {HomeMapHeaderProps} from './types';

export function HomeMapHeader({
  greetingName,
  avatarUri,
  onAvatarPress,
}: HomeMapHeaderProps) {
  return (
    <Container>
      <GreetingPill>
        <GreetingText>{greetingName}</GreetingText>
      </GreetingPill>

      <RightActions>
        <NotificationButtonWrapper>
          <NotificationButton marginR={0} />
        </NotificationButtonWrapper>

        <TouchableOpacity onPress={onAvatarPress} activeOpacity={0.8}>
          <AvatarProfile uri={avatarUri} borderColor="white" showMenuIcon />
        </TouchableOpacity>
      </RightActions>
    </Container>
  );
}
