import {shade} from 'polished';
import {MotiView} from 'moti';
import styled, {css} from 'styled-components/native';
import themeCss from '../../styles/theme';
import {RFValue} from 'react-native-responsive-fontsize';
import {SafeAreaView} from 'react-native-safe-area-context';

interface PropsSubtitle {
  recalculed?: boolean;
}
interface PropsButtonText {
  pressed?: boolean;
}
export const Container = styled(SafeAreaView)`
  align-items: center;
  padding-bottom: ${RFValue(20)}px;
`;

export const Header = styled.View`
  flex-direction: row-reverse;
  width: 100%;
`;

export const ButtonBack = styled.TouchableOpacity`
  margin: ${RFValue(10)}px ${RFValue(15)}px 0;
  max-width: 8%;
`;

export const ContainerPrice = styled.View`
  width: 100%;
  align-items: center;
  justify-content: center;

  margin-top: ${RFValue(20)}px;

  padding: 0px ${({theme}) => theme.spacing.large}px;
`;

export const RoutesImage = styled.Image`
  width: ${RFValue(90)}px;
  height: ${RFValue(90)}px;
  margin: ${RFValue(10)}px 0;
`;

export const Content = styled.View`
  width: 100%;
  align-items: center;
  justify-content: center;
  margin-top: ${RFValue(20)}px;
  padding: 0 ${RFValue(30)}px;
`;

export const ScrollAddress = styled.ScrollView`
  width: 100%;
  max-height: ${RFValue(180)}px;
`;
export const Title = styled.Text`
  margin: ${RFValue(5)}px 0;
  font-size: ${({theme}) => theme.fontSizes.medium}px;
  color: ${({theme}) => theme.colors.white};
  font-family: MavenPro_600SemiBold;
`;

export const TitleSmall = styled.Text`
  margin: ${RFValue(5)}px 0;
  font-size: ${({theme}) => theme.fontSizes.large}px;
  color: ${({theme}) => theme.colors.white};
  font-family: MavenPro_400Regular;
`;

export const ContainerRow = styled.View`
  flex-direction: row;
  align-items: center;
  width: 100%;
`;

export const SubTitle = styled.Text<PropsSubtitle>`
  width: 90%;
  text-align: center;
  font-size: ${({theme}) => theme.fontSizes.medium}px;
  font-family: MavenPro_400Regular;
  color: ${({theme}) => theme.colors.white};
  ${({recalculed, theme}) =>
    recalculed &&
    css`
      color: ${theme.colors.primary};
      margin-top: ${RFValue(10)}px;
    `}
`;

export const TripValue = styled.Text`
  font-size: ${({theme}) => theme.fontSizes.xslarge}px;
  font-family: MavenPro_600SemiBold;
  color: ${({theme}) => theme.colors.white};
`;

export const DriverInfoContainer = styled.View`
  align-items: center;
  margin-bottom: ${RFValue(10)}px;
`;

export const DriverProfilePicture = styled.Image`
  width: ${RFValue(80)}px;
  height: ${RFValue(80)}px;
  border-radius: ${RFValue(50)}px;
`;

export const DriverRatingContainer = styled.View`
  flex-direction: row;
  bottom: 0;
  position: absolute;
  background-color: ${({theme}) => theme.colors.white};
  align-items: center;
  justify-content: center;
  width: ${RFValue(68)}px;
  elevation: 1;
  border-radius: ${RFValue(10)}px;
`;

export const DriverRating = styled.Text`
  margin-right: ${RFValue(4)}px;
  color: ${({theme}) => theme.colors.secondary};
  font-family: MavenPro_400Regular;
`;

export const CommentBox = styled.TextInput`
  border: ${RFValue(2)}px solid;
  height: ${RFValue(40)}px;
  border-color: ${({theme}) => theme.colors.primary};
  color: ${({theme}) => theme.colors.secondary};
  margin: ${RFValue(8)}px 0;
  width: 60%;
  border-radius: ${RFValue(4)}px;
  padding: ${RFValue(2)}px ${RFValue(6)}px;
`;

export const SendEvaluationButton = styled.Pressable`
  align-items: center;
  justify-content: center;
  margin-top: ${RFValue(8)}px;
  width: 100%;
  padding: ${RFValue(10)}px 0;
  border-radius: ${RFValue(10)}px;
`;

export const ContainerButton = styled.View`
  border-bottom-color: ${({theme}) => theme.colors.grayLight};
  border-bottom-width: ${RFValue(0.5)}px;
  align-items: center;
  width: 100%;
  justify-content: center;
  padding: 0 0 ${RFValue(5)}px 0;
`;

export const SendEvaluationButtonText = styled.Text<PropsButtonText>`
  color: ${({theme}) => theme.colors.white};
  font-size: ${({theme}) => theme.fontSizes.medium}px;
  font-family: MavenPro_400Regular;
`;

export const ContainerText = styled.View`
  width: 100%;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  margin-top: ${RFValue(10)}px;
`;

export const Address = styled.Text`
  color: ${({theme}) => theme.colors.white};
  font-size: ${({theme}) => theme.fontSizes.medium}px;

  font-family: MavenPro_400Regular;
  margin-bottom: ${RFValue(10)}px;
`;

export const AddressContent = styled.View`
  flex-direction: row;
  align-items: center;
  padding: 0 ${RFValue(10)}px 0 0;
`;

export const Ball = styled.View<{variant?: 'waypoint'}>`
  background-color: ${({theme, variant}) =>
    variant === 'waypoint' ? theme.colors.marker_waypoint : theme.colors.marker_origin};
  border-radius: ${RFValue(100)}px;
  width: ${RFValue(10)}px;
  height: ${RFValue(10)}px;
  align-self: center;
`;

export const Destiny = styled.Text`
  color: ${({theme}) => theme.colors.white};
  font-size: ${({theme}) => theme.fontSizes.medium}px;

  font-family: MavenPro_400Regular;
`;

export const Square = styled.View`
  background-color: ${({theme}) => theme.colors.marker_destination};
  width: ${RFValue(10)}px;
  height: ${RFValue(10)}px;
  align-self: center;
`;

export const Line = styled.View`
  border-width: ${RFValue(0.8)}px;
  border-color: ${({theme}) => theme.colors.primary};
  flex: 1;
  width: ${RFValue(1)}px;
  align-self: center;
  border-style: dashed;
  min-height: ${RFValue(20)}px;
`;

/**
 * A partir daqui: novo layout da tela de avaliação ao final da viagem
 * (motivo dos nomes não colidirem com os exports acima, usados pela
 * variante de viagem agendada, que não muda no redesign).
 */

export const ResultContainer = styled(SafeAreaView)`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.background_global};
`;

interface ResultScrollProps {
  keyboardHeight?: number;
}

export const ResultScroll = styled.ScrollView.attrs<ResultScrollProps>(({ theme, keyboardHeight = 0 }) => ({
  contentContainerStyle: {
    padding: theme.spacing.large,
    paddingBottom: theme.spacing.large + keyboardHeight,
    gap: theme.spacing.large,
  },
}))<ResultScrollProps>``;

export const CloseButton = styled.TouchableOpacity`
  align-self: flex-end;
  width: ${RFValue(30)}px;
  height: ${RFValue(30)}px;
  border-radius: ${RFValue(15)}px;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme }) => theme.colors.background_global};
`;

export const SuccessIconWrapper = styled.View`
  align-self: center;
  width: ${RFValue(72)}px;
  height: ${RFValue(72)}px;
  border-radius: ${RFValue(36)}px;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme }) => theme.colors.background_greenLight};
`;

export const ResultTitle = styled.Text`
  font-size: ${({ theme }) => theme.fontSizes.xlarge}px;
  font-weight: 700;
  text-align: center;
  color: ${({ theme }) => theme.colors.border_green};
`;

export const Subtitle = styled.Text`
  font-size: ${({ theme }) => theme.fontSizes.smalls}px;
  text-align: center;
  color: ${({ theme }) => theme.colors.grayLight};
`;

export const PriceCard = styled.View`
  align-items: center;
  gap: ${RFValue(4)}px;
  background-color: ${({ theme }) => theme.colors.background_greenLight};
  border-radius: ${({ theme }) => theme.borderRadius.large}px;
  padding: ${({ theme }) => theme.spacing.large}px;
`;

export const PriceLabelRow = styled.View`
  flex-direction: row;
  align-items: center;
  gap: ${RFValue(8)}px;
`;

export const PriceLabel = styled.Text`
  font-size: ${({ theme }) => theme.fontSizes.medium}px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.border_green};
`;

export const PriceValue = styled.Text`
  font-size: ${({ theme }) => theme.fontSizes.xslarge}px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.border_green};
`;

export const AddressCard = styled.View`
  width: 100%;
  background-color: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius.large}px;
  padding: ${({ theme }) => theme.spacing.large}px;
  shadow-color: #000000;
  shadow-offset: 0px ${RFValue(2)}px;
  shadow-opacity: 0.1;
  shadow-radius: ${RFValue(6)}px;
  elevation: 3;
`;

export const AddressCardHeader = styled.View`
  flex-direction: row;
  align-items: center;
  gap: ${RFValue(6)}px;
  margin-bottom: ${({ theme }) => theme.spacing.medium}px;
`;

export const AddressCardHeaderText = styled.Text`
  font-size: ${({ theme }) => theme.fontSizes.smalls}px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.secondary};
`;

export const AddressRow = styled.View`
  flex-direction: column;
  position: relative;
`;

export const TimelineLine = styled.View`
  position: absolute;
  top: ${RFValue(6)}px;
  bottom: ${RFValue(6)}px;
  left: ${RFValue(4)}px;
  width: 2px;
  border-left-width: 2px;
  border-color: ${({ theme }) => theme.colors.border};
  border-style: dashed;
`;

export const AddressLineItem = styled.View<{ isLast?: boolean }>`
  flex-direction: row;
  margin-bottom: ${({ theme, isLast }) => (isLast ? 0 : theme.spacing.large)}px;
`;

export const MarkerColumn = styled.View`
  width: ${RFValue(10)}px;
  align-items: center;
  padding-top: ${RFValue(2)}px;
  margin-right: ${({ theme }) => theme.spacing.medium}px;
`;

export const AddressText = styled.Text`
  flex: 1;
  font-size: ${({ theme }) => theme.fontSizes.smalls}px;
  color: ${({ theme }) => theme.colors.text_gray};
`;

export const StopsBadge = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  align-self: flex-start;
  gap: ${RFValue(4)}px;
  background-color: ${({ theme }) => theme.colors.background_global};
  border-radius: ${({ theme }) => theme.borderRadius.xxlarge}px;
  padding: ${RFValue(3)}px ${({ theme }) => theme.spacing.medium}px;
`;

export const StopsBadgeText = styled.Text`
  font-size: ${({ theme }) => theme.fontSizes.small}px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text_gray};
`;

export const SectionTitleRow = styled.View`
  flex-direction: row;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.medium}px;
`;

export const SectionTitleDivider = styled.View`
  flex: 1;
  height: 1px;
  background-color: ${({ theme }) => theme.colors.primary};
`;

export const SectionTitleText = styled.Text`
  font-size: ${({ theme }) => theme.fontSizes.large}px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.secondary};
`;

export const SubmitButton = styled.TouchableOpacity<{ disabled?: boolean }>`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: ${RFValue(8)}px;
  background-color: ${({ theme }) => theme.colors.primary};
  border-radius: ${({ theme }) => theme.borderRadius.medium}px;
  padding: ${({ theme }) => theme.spacing.large}px;
  opacity: ${({ disabled }) => (disabled ? 0.6 : 1)};
`;

export const SubmitButtonText = styled.Text`
  font-size: ${({ theme }) => theme.fontSizes.medium}px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.primaryText};
`;

/**
 * Animação de agradecimento exibida após o envio da avaliação, antes de
 * fechar o modal. Ícones vetoriais (nunca emoji) animados via Moti/Reanimated
 * — roda inteira na UI thread, sem travar a JS thread.
 */

const THANK_YOU_STAGE = RFValue(80);
const THANK_YOU_SPARKLE_RADIUS = RFValue(55);
const THANK_YOU_SPARKLE_SIZE = RFValue(28);

export const ThankYouContainer = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.large}px;
  padding: ${({ theme }) => theme.spacing.large}px;
`;

export const ThankYouStarsStage = styled.View`
  width: ${THANK_YOU_STAGE * 2}px;
  height: ${THANK_YOU_STAGE * 2}px;
`;

export const ThankYouGlow = styled(MotiView)`
  position: absolute;
  top: ${THANK_YOU_STAGE - RFValue(55)}px;
  left: ${THANK_YOU_STAGE - RFValue(55)}px;
  width: ${RFValue(110)}px;
  height: ${RFValue(110)}px;
  border-radius: ${RFValue(55)}px;
  background-color: ${({ theme }) => theme.colors.background_greenLight};
`;

export const ThankYouCenterBadge = styled(MotiView)`
  position: absolute;
  top: ${THANK_YOU_STAGE - RFValue(32)}px;
  left: ${THANK_YOU_STAGE - RFValue(32)}px;
  width: ${RFValue(64)}px;
  height: ${RFValue(64)}px;
  align-items: center;
  justify-content: center;
`;

export const ThankYouSparkle = styled(MotiView)<{ angle: number }>`
  position: absolute;
  width: ${THANK_YOU_SPARKLE_SIZE}px;
  height: ${THANK_YOU_SPARKLE_SIZE}px;
  align-items: center;
  justify-content: center;
  top: ${({ angle }) =>
    THANK_YOU_STAGE -
    THANK_YOU_SPARKLE_SIZE / 2 +
    THANK_YOU_SPARKLE_RADIUS * Math.sin((angle * Math.PI) / 180)}px;
  left: ${({ angle }) =>
    THANK_YOU_STAGE -
    THANK_YOU_SPARKLE_SIZE / 2 +
    THANK_YOU_SPARKLE_RADIUS * Math.cos((angle * Math.PI) / 180)}px;
`;

export const ThankYouTitle = styled.Text`
  font-size: ${({ theme }) => theme.fontSizes.xlarge}px;
  font-weight: 700;
  text-align: center;
  color: ${({ theme }) => theme.colors.border_green};
`;

export const ThankYouSubtitle = styled.Text`
  font-size: ${({ theme }) => theme.fontSizes.smalls}px;
  text-align: center;
  color: ${({ theme }) => theme.colors.grayLight};
`;
