import { useState } from 'react';
import { Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { FontAwesome5, Ionicons } from '@expo/vector-icons';
import { RFValue } from 'react-native-responsive-fontsize';
import { useTheme } from 'styled-components/native';

import { translate } from '../../../../client/locales';
import Helper from '../../utils/Helper';
import { getEstimatedTripTimeInMinutes } from '../../utils/FormatDate';
import { calculateFeeValue, getCustomerTaxRows, getDeductedTaxRows } from '../../utils/fare';
import { useAuth } from '../../../../context/auth';
import HelpMethodModal from '../../components/HelpMethodModal';
import { EarningsRow } from '../../components/TripDetail/EarningsCard/types';
import { CollapsibleBreakdownCard } from '../../components/TripDetail/CollapsibleBreakdownCard';
import { NetValueCard } from '../../components/TripDetail/NetValueCard';
import { ReportProblemButton } from '../../../../common/components/TripDetail/ReportProblemButton';

import {
  Container,
  Content,
  Header,
  HeaderButton,
  HeaderTitle,
  InfoNoteRow,
  InfoNoteText,
} from './styles';
import { TripCalculationDetailsRouteParams } from './types';

export const TripCalculationDetails = ({ route }: any) => {
  const { tripReference, detailsTrip }: TripCalculationDetailsRouteParams = route.params;
  const navigation = useNavigation();
  const theme = useTheme();
  const { cityConfig, generalSettings } = useAuth();
  const [modalMessage, setModalMessage] = useState(false);

  const fare = detailsTrip.fare;
  const financialBreakdown = detailsTrip.financialBreakdown;
  const isMileageEnabled = Helper.generalSettingsActive(generalSettings, 'enable_transform_km_for_mi');

  const formatMoney = (value?: number | string) => `${cityConfig?.typeMoney}${Helper.maskMoney(Number(value ?? 0))}`;

  const feeBase =
    parseFloat(fare?.base_price ?? '0') +
    parseFloat(fare?.km_price ?? '0') * parseFloat(detailsTrip.distance ?? '0') +
    parseFloat(fare?.minute_price ?? '0') * getEstimatedTripTimeInMinutes(detailsTrip);

  const priceRows: EarningsRow[] = [
    {
      label: translate('myTravels.base_price'),
      valueLabel: formatMoney(fare?.base_price),
    },
    {
      label: `${translate(isMileageEnabled ? 'myTravels.mi_price' : 'myTravels.km_price')} (${formatMoney(
        fare?.km_price,
      )} x ${Helper.kmToMiles(parseFloat(detailsTrip.distance ?? '0').toFixed(3), isMileageEnabled)})`,
      valueLabel: formatMoney(parseFloat(fare?.km_price ?? '0') * parseFloat(detailsTrip.distance ?? '0')),
    },
    {
      label: `${translate('myTravels.minute_price')} (${formatMoney(fare?.minute_price)} x ${getEstimatedTripTimeInMinutes(detailsTrip).toFixed(0)})`,
      valueLabel: formatMoney(parseFloat(fare?.minute_price ?? '0') * getEstimatedTripTimeInMinutes(detailsTrip)),
    },
    {
      label: translate('myTravels.dynamics_flags_triggers'),
      valueLabel: detailsTrip.multiplierDynamic ? String(detailsTrip.multiplierDynamic) : '0',
    },
    {
      label: translate('myTravels.value_min'),
      valueLabel: formatMoney(parseFloat(fare?.min_price ?? '0') * parseFloat(String(detailsTrip.multiplierDynamic ?? 1))),
    },
    {
      label: translate('myTravels.waypoints'),
      valueLabel: formatMoney(parseFloat(fare?.waypoint_price ?? '0') * (detailsTrip.tripWayPoints?.length ?? 0)),
    },
    ...(() => {
      const taxPrice = calculateFeeValue(fare?.tax_price, fare?.tax_price_type, feeBase);
      return taxPrice > 0
        ? [{ label: fare?.tax_price_description || translate('myTravels.tax_price'), valueLabel: formatMoney(taxPrice) }]
        : [];
    })(),
    ...(() => {
      const anotherFee = calculateFeeValue(fare?.another_fee, fare?.another_fee_type, feeBase);
      return anotherFee > 0
        ? [{ label: fare?.another_fee_description || translate('myTravels.additional_value'), valueLabel: formatMoney(anotherFee) }]
        : [];
    })(),
    ...getCustomerTaxRows(detailsTrip.taxes, feeBase)
      .filter(tax => tax.value > 0)
      .map(tax => ({
        label: tax.label,
        valueLabel: formatMoney(tax.value),
      })),
    ...(Number(detailsTrip.tripLongDistanceValue?.value ?? 0) > 0
      ? [{ label: translate('myTravels.long_distance_price'), valueLabel: formatMoney(detailsTrip.tripLongDistanceValue?.value) }]
      : []),
    ...(parseFloat(fare?.additional_value_after_km ?? '0') > 0
      ? [{ label: translate('myTravels.additional_distance_value'), valueLabel: formatMoney(fare?.additional_value_after_km) }]
      : []),
  ];

  const deductionRows: EarningsRow[] = financialBreakdown
    ? [
      {
        label: financialBreakdown.appFeePercentage
          ? `${translate('myTravels.app_commission')} (${financialBreakdown.appFeePercentage}%)`
          : translate('myTravels.app_commission'),
        valueLabel: `- ${formatMoney(financialBreakdown.appFee)}`,
        valueColor: theme.colors.red,
      },
      ...(financialBreakdown.anotherFee + financialBreakdown.paymentFormFee > 0
        ? [
          {
            label: translate('myTravels.other_platform_fees'),
            valueLabel: `- ${formatMoney(financialBreakdown.anotherFee + financialBreakdown.paymentFormFee)}`,
            valueColor: theme.colors.red,
          },
        ]
        : []),
      ...(financialBreakdown.cancellationFee > 0
        ? [
          {
            label: translate('myTravels.cancellation_fee'),
            valueLabel: `- ${formatMoney(financialBreakdown.cancellationFee)}`,
            valueColor: theme.colors.red,
          },
        ]
        : []),
      ...getDeductedTaxRows(detailsTrip.taxes, Number(detailsTrip.price ?? 0))
        .filter(tax => tax.value > 0)
        .map(tax => ({
          label: tax.label,
          valueLabel: `- ${formatMoney(tax.value)}`,
          valueColor: theme.colors.red,
        })),
    ]
    : [];

  const totalDeductions = financialBreakdown
    ? financialBreakdown.appFee + financialBreakdown.anotherFee + financialBreakdown.paymentFormFee + financialBreakdown.cancellationFee + financialBreakdown.dynamicTax
    : 0;

  return (
    <Container>
      <Header>
        <HeaderButton onPress={() => navigation.goBack()}>
          <FontAwesome5 name="arrow-left" size={RFValue(16)} color={theme.colors.secondary} />
        </HeaderButton>

        <HeaderTitle>{translate('myTravels.full_calculation_title')}</HeaderTitle>

        <HeaderButton
          onPress={() =>
            Alert.alert(
              translate('myTravels.calculation_help_title'),
              translate('myTravels.calculation_help_body'),
            )
          }
        >
          <Ionicons name="help-circle-outline" size={RFValue(22)} color={theme.colors.secondary} />
        </HeaderButton>
      </Header>

      <Content>
        <CollapsibleBreakdownCard
          icon="coins"
          title={translate('myTravels.price_breakdown')}
          rows={priceRows}
          totalLabel={translate('myTravels.gross_total_received')}
          totalValueLabel={formatMoney(detailsTrip.price)}
        />

        {financialBreakdown && (
          <CollapsibleBreakdownCard
            icon="percentage"
            title={translate('myTravels.platform_deductions')}
            rows={deductionRows}
            totalLabel={translate('myTravels.total_deductions')}
            totalValueLabel={`- ${formatMoney(totalDeductions)}`}
            totalValueColor={theme.colors.red}
          />
        )}

        {financialBreakdown && (
          <NetValueCard
            label={translate('myTravels.net_value_received')}
            caption={translate('myTravels.net_value_caption')}
            valueLabel={formatMoney(financialBreakdown.netValue)}
          />
        )}

        <InfoNoteRow>
          <Ionicons name="information-circle-outline" size={RFValue(14)} color={theme.colors.text_gray} />
          <InfoNoteText>{translate('myTravels.calculation_info_note')}</InfoNoteText>
        </InfoNoteRow>

        <ReportProblemButton
          label={translate('myTravels.report_problem_this_trip')}
          onPress={() => setModalMessage(true)}
        />
      </Content>

      <HelpMethodModal tripReference={tripReference} visible={modalMessage} setVisible={setModalMessage} />
    </Container>
  );
};
