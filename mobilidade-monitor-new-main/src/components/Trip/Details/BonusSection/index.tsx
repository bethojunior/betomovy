import { FC } from 'react'
import Mask from '../../../../services/Mask'
import { BonusSectionProps, RewardCampaignTripItem } from './types'
import {
  BonusCard,
  BonusEmpty,
  BonusHeader,
  BonusItem,
  BonusLabel,
  BonusList,
  BonusValue
} from './styles'

interface BonusRow {
  key: string
  label: string
  value: number
}

const LONG_DISTANCE_PRICE_LABEL = 'Bônus corrida longa distância'

const formatCampaignLabel = ({ rewardTripType, discountCouponCode }: RewardCampaignTripItem): string =>
  discountCouponCode ? `${rewardTripType} (${discountCouponCode})` : rewardTripType

const buildBonusRows = ({
  rewardTripLongDistance,
  rewardCampaignTrip,
  tripLongDistance
}: BonusSectionProps): BonusRow[] => {
  const longDistanceRewardRow: BonusRow[] = rewardTripLongDistance
    ? [
        {
          key: 'long-distance-reward',
          label: rewardTripLongDistance.rewardTripType,
          value: rewardTripLongDistance.value
        }
      ]
    : []

  const longDistancePriceRow: BonusRow[] = tripLongDistance
    ? [
        {
          key: 'long-distance-price',
          label: LONG_DISTANCE_PRICE_LABEL,
          value: tripLongDistance.value
        }
      ]
    : []

  const campaignRows: BonusRow[] = (rewardCampaignTrip || []).map((item) => ({
    key: `campaign-${item.id}`,
    label: formatCampaignLabel(item),
    value: item.value
  }))

  return [...longDistanceRewardRow, ...longDistancePriceRow, ...campaignRows]
}

const BonusSection: FC<BonusSectionProps> = ({
  rewardTripLongDistance,
  rewardCampaignTrip,
  tripLongDistance
}) => {
  const bonusRows = buildBonusRows({ rewardTripLongDistance, rewardCampaignTrip, tripLongDistance })

  return (
    <BonusCard>
      <BonusHeader>Bônus gerados ao motorista</BonusHeader>
      {bonusRows.length === 0 ? (
        <BonusEmpty>Nenhum bônus gerado nesta corrida</BonusEmpty>
      ) : (
        <BonusList>
          {bonusRows.map((bonus) => (
            <BonusItem key={bonus.key}>
              <BonusLabel>{bonus.label}</BonusLabel>
              <BonusValue>+ {Mask.setMaskMoneyNumber(Number(bonus.value))}</BonusValue>
            </BonusItem>
          ))}
        </BonusList>
      )}
    </BonusCard>
  )
}

export default BonusSection
