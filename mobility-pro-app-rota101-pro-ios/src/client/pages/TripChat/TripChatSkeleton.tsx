import { View } from 'react-native';
import { MotiView } from 'moti';
import { RFValue } from 'react-native-responsive-fontsize';
import styled from 'styled-components/native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import theme from '../../styles/theme';
import { Container as NavBarContent, GoBackButton } from '../../../common/components/TripChatHeader/styles';

const PULSE = {
  from: { opacity: 0.45 },
  animate: { opacity: 1 },
  transition: { type: 'timing', duration: 900, loop: true, repeatReverse: true },
} as const;

const Block = styled(MotiView)<{ w?: number | string; h?: number; radius?: number; mb?: number }>`
  width: ${({ w }) => (typeof w === 'number' ? `${w}px` : (w ?? '100%'))};
  height: ${({ h }) => h ?? 14}px;
  border-radius: ${({ radius }) => radius ?? 8}px;
  background-color: #e0e0e0;
  margin-bottom: ${({ mb }) => mb ?? 0}px;
`;

const BubbleRow = styled.View<{ self: boolean }>`
  flex-direction: row;
  justify-content: ${({ self }) => (self ? 'flex-end' : 'flex-start')};
  padding: 0 ${RFValue(16)}px;
  margin-bottom: ${RFValue(10)}px;
`;

const Bubble = styled(MotiView)<{ w: number }>`
  width: ${({ w }) => w}px;
  height: ${RFValue(36)}px;
  border-radius: ${RFValue(18)}px;
  background-color: #e0e0e0;
`;

const FooterBar = styled(MotiView)`
  flex-direction: row;
  align-items: center;
  background-color: #fff;
  border-radius: 30px;
  padding: ${RFValue(8)}px ${RFValue(14)}px;
  margin: ${RFValue(10)}px;
  border-width: 0.5px;
  border-color: #e8e8e8;
`;

const MicCircle = styled(MotiView)`
  width: ${RFValue(40)}px;
  height: ${RFValue(40)}px;
  border-radius: ${RFValue(20)}px;
  background-color: #e0e0e0;
  margin-left: ${RFValue(8)}px;
`;

const BUBBLES = [
  { self: false, w: RFValue(180) },
  { self: true,  w: RFValue(120) },
  { self: false, w: RFValue(220) },
  { self: true,  w: RFValue(150) },
  { self: false, w: RFValue(100) },
];

export function TripChatSkeleton() {
  const navigation = useNavigation();

  return (
    <View style={{ flex: 1, backgroundColor: '#f7f7f7' }}>
      {/* NavBar skeleton */}
      <NavBarContent>
        <GoBackButton onPress={() => navigation.goBack()} accessibilityLabel="">
          <Ionicons name="arrow-back-outline" size={30} color={theme.colors.primary} />
        </GoBackButton>
        <Block {...PULSE} w={RFValue(100)} h={14} radius={7} />
        <View style={{ width: RFValue(40), marginRight: 10 }} />
      </NavBarContent>

      {/* Switch row skeleton */}
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: RFValue(16), paddingVertical: RFValue(10) }}>
        <Block {...PULSE} w={RFValue(160)} h={12} radius={6} />
        <Block {...PULSE} w={RFValue(42)} h={22} radius={11} />
      </View>

      {/* Message bubbles skeleton */}
      <View style={{ flex: 1, paddingTop: RFValue(12) }}>
        {BUBBLES.map((b, i) => (
          <BubbleRow key={i} self={b.self}>
            <Bubble
              w={b.w}
              from={PULSE.from}
              animate={PULSE.animate}
              transition={{ ...PULSE.transition, delay: i * 80 }}
            />
          </BubbleRow>
        ))}
      </View>

      {/* Footer skeleton */}
      <FooterBar
        from={PULSE.from}
        animate={PULSE.animate}
        transition={PULSE.transition}
      >
        <Block
          {...PULSE}
          w="80%"
          h={RFValue(18)}
          radius={9}
          style={{ flex: 1 }}
        />
        <MicCircle
          from={PULSE.from}
          animate={PULSE.animate}
          transition={PULSE.transition}
        />
      </FooterBar>
    </View>
  );
}
