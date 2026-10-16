import AntDesign from '@expo/vector-icons/AntDesign';
import { View, Text } from "react-native"
import { translate } from "~/client/locales"
import Helper from "~/client/utils/Helper"
import { BonusContainer, BonusIconCircle } from "./styles"

export const BonusRewardCard = ({
  typeMoney,
  tripAccepted,
  textBonusFinishTrip
}) => {
  return (
    <BonusContainer>
      <View style={{ flex: 1 }}>
        <Text style={{ color: '#166534', fontSize: 12, fontWeight: '600', textTransform: 'uppercase' }}>
          {translate('finishTrip.bonus_text')}
        </Text>
        <Text style={{ color: '#15803d', fontSize: 20, fontWeight: 'bold' }}>
          + {typeMoney} {Helper.maskMoney(Number(tripAccepted?.rewardTrip?.value))}
        </Text>
        <Text style={{ color: '#166534', fontSize: 11, marginTop: 2 }}>
          {textBonusFinishTrip?.value}
        </Text>
      </View>
      <BonusIconCircle>
        <AntDesign name="gift" size={20} color="#fff" />
      </BonusIconCircle>
    </BonusContainer>
  )
}