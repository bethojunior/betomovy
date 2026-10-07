import { Clipboard, TouchableOpacity } from 'react-native';
import { FontAwesome5, MaterialIcons } from '@expo/vector-icons';
import { RFValue } from 'react-native-responsive-fontsize';
import { useTheme } from 'styled-components/native';

import { translate } from '../../../../client/locales';
import { CopyIcon } from '../CopyIcon';
import { moneyMask } from '../../utils/money';
import { LastTransactionProps } from '../../context/bank/types';
import { groupTransactions } from './groupTransactions';
import { TransactionListProps } from './types';
import {
  DateText,
  Divider,
  EmptyText,
  GroupCard,
  HeaderRow,
  HeaderTextGroup,
  ListWrapper,
  PaymentBadge,
  PaymentBadgeText,
  StandaloneIcon,
  StandaloneRow,
  StandaloneTextGroup,
  StandaloneTitle,
  SubDescription,
  SubIcon,
  SubRow,
  SubValue,
  TripRefLabel,
  TripRefRow,
} from './styles';

const isCommission = (item: LastTransactionProps) => (item.summary || '').toLowerCase().includes('comiss');

// o backend prefixa +/- em alguns endpoints e não em outros — normaliza sempre pro mesmo formato
const parseValue = (value?: string) => Math.abs(parseFloat((value || '0').replace(/^[+-]/, '')) || 0);

function paymentBadgeColors(theme: any, paymentFormName?: string | null) {
  if ((paymentFormName || '').toLowerCase().includes('dinheiro')) {
    return { background: theme.colors.background_greenLight, text: theme.colors.border_green };
  }
  if ((paymentFormName || '').toLowerCase().includes('cart')) {
    return { background: theme.colors.blueLight, text: theme.colors.blue };
  }
  return { background: theme.colors.background_white_light, text: theme.colors.text_gray };
}

export function TransactionList({ transactions }: TransactionListProps) {
  const theme = useTheme();
  const groups = groupTransactions(transactions);

  if (!groups.length) {
    return <EmptyText>{translate('account.not_movement')}</EmptyText>;
  }

  return (
    <ListWrapper>
      {groups.map((group, groupIndex) => {
        if (!group.tripReference) {
          const item = group.items[0];
          const isCredit = item.flow === 'entrada';
          const color = isCredit ? theme.colors.on : theme.colors.red;

          return (
            <GroupCard key={`${item.date}-${item.summary}-${groupIndex}`}>
              <StandaloneRow>
                <StandaloneIcon>
                  <MaterialIcons name="attach-money" size={RFValue(18)} color={color} />
                </StandaloneIcon>
                <StandaloneTextGroup>
                  <StandaloneTitle numberOfLines={1}>{item.summary}</StandaloneTitle>
                  <DateText>{item.date}{!!item.observation && ` · ${item.observation}`}</DateText>
                </StandaloneTextGroup>
                <SubValue color={color}>
                  {isCredit ? '+' : '-'} R$ {moneyMask(parseValue(item.value))}
                </SubValue>
              </StandaloneRow>
            </GroupCard>
          );
        }

        const badgeColors = paymentBadgeColors(theme, group.paymentFormName);

        return (
          <GroupCard key={group.tripReference}>
            <HeaderRow>
              <HeaderTextGroup>
                <DateText>{group.date}</DateText>
                <TripRefRow>
                  <TripRefLabel numberOfLines={1}>
                    {translate('driver_extract.trip_reference')}: {group.tripReference}
                  </TripRefLabel>
                  <TouchableOpacity
                    activeOpacity={0.7}
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                    onPress={() => Clipboard.setString(group.tripReference ?? '')}
                  >
                    <CopyIcon size={RFValue(13)} color={theme.colors.grayLight} />
                  </TouchableOpacity>
                </TripRefRow>
              </HeaderTextGroup>

              {!!group.paymentFormName && (
                <PaymentBadge background={badgeColors.background}>
                  <PaymentBadgeText color={badgeColors.text}>{group.paymentFormName}</PaymentBadgeText>
                </PaymentBadge>
              )}
            </HeaderRow>

            <Divider />

            {group.items.map((item, index) => {
              const commission = isCommission(item);
              const isCredit = item.flow === 'entrada';
              const valueColor = isCredit ? theme.colors.on : theme.colors.red;
              const iconColor = commission ? theme.colors.grayLight : valueColor;
              const icon = commission ? 'cog' : isCredit ? 'plus' : 'minus';

              return (
                <SubRow key={`${group.tripReference}-${index}`}>
                  <SubIcon>
                    <FontAwesome5 name={icon} size={RFValue(12)} color={iconColor} />
                  </SubIcon>
                  <SubDescription numberOfLines={1}>{item.summary}</SubDescription>
                  <SubValue color={valueColor}>
                    {isCredit ? '+' : '-'} R$ {moneyMask(parseValue(item.value))}
                  </SubValue>
                </SubRow>
              );
            })}
          </GroupCard>
        );
      })}
    </ListWrapper>
  );
}
