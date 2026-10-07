import {RFValue} from 'react-native-responsive-fontsize';
import {useTheme} from 'styled-components/native';
import Ionicons from '@expo/vector-icons/Ionicons';
import {TypingText} from '../TypingText';
import {
  Container,
  Divider,
  MicButton,
  SearchButton,
  SearchPlaceholder,
} from './styles';
import {DestinationSearchBarProps} from './types';

export function DestinationSearchBar({
  placeholder,
  onSearchPress,
  onMicPress,
  micPulse,
}: DestinationSearchBarProps) {
  const {colors} = useTheme();

  return (
    <Container>
      <SearchButton onPress={onSearchPress} activeOpacity={0.8}>
        <Ionicons name="search" size={RFValue(20)} color={colors.secondary} />
        <SearchPlaceholder>
          <TypingText text={placeholder} />
        </SearchPlaceholder>
      </SearchButton>

      <Divider />

      <MicButton onPress={onMicPress} activeOpacity={0.9}>
        {micPulse}
        <Ionicons name="mic" size={RFValue(22)} color={colors.secondary} />
      </MicButton>
    </Container>
  );
}
