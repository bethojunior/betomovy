import { FC } from 'react';
import { FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import { RFValue } from 'react-native-responsive-fontsize';
import { useTheme } from 'styled-components/native';
import { EarningsCardProps } from './types';
import {
  Card,
  Divider,
  HeaderRow,
  Row,
  RowLabel,
  RowValue,
  Title,
  TotalLabel,
  TotalValue,
  ViewFullCalculationButton,
  ViewFullCalculationLeft,
  ViewFullCalculationText,
} from './styles';

export const EarningsCard: FC<EarningsCardProps> = ({
  title,
  rows,
  totalLabel,
  totalValueLabel,
  viewFullCalculationLabel,
  onViewFullCalculation,
}) => {
  const theme = useTheme();

  return (
    <Card>
      <HeaderRow>
        <FontAwesome5 name="wallet" size={RFValue(14)} color={theme.colors.secondary} />
        <Title>{title}</Title>
      </HeaderRow>

      {rows.map((row) => (
        <Row key={row.label}>
          <RowLabel>{row.label}</RowLabel>
          <RowValue>{row.valueLabel}</RowValue>
        </Row>
      ))}

      <Divider />

      <Row>
        <TotalLabel>{totalLabel}</TotalLabel>
        <TotalValue>{totalValueLabel}</TotalValue>
      </Row>

      <ViewFullCalculationButton onPress={onViewFullCalculation}>
        <MaterialCommunityIcons name="calculator-variant-outline" size={RFValue(16)} color={theme.colors.primaryText} />
        <ViewFullCalculationText>{viewFullCalculationLabel}</ViewFullCalculationText>
        <FontAwesome5 name="chevron-right" size={RFValue(12)} color={theme.colors.primaryText} />
      </ViewFullCalculationButton>
    </Card>
  );
};
