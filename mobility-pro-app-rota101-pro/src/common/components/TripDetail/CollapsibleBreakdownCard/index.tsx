import { FC, useState } from 'react';
import { FontAwesome5 } from '@expo/vector-icons';
import { RFValue } from 'react-native-responsive-fontsize';
import { useTheme } from 'styled-components/native';
import { CollapsibleBreakdownCardProps } from './types';
import {
  Caption,
  Card,
  Content,
  Disclaimer,
  Divider,
  HeaderRow,
  Row,
  RowLabel,
  RowValue,
  Title,
  TotalLabel,
  TotalValue,
} from './styles';

export const CollapsibleBreakdownCard: FC<CollapsibleBreakdownCardProps> = ({
  icon,
  title,
  rows,
  totalLabel,
  totalValueLabel,
  totalValueColor,
  defaultExpanded = true,
  totalPosition = 'bottom',
  caption,
  disclaimer,
}) => {
  const theme = useTheme();
  const [expanded, setExpanded] = useState(defaultExpanded);

  const totalRow = (
    <Row>
      <TotalLabel>{totalLabel}</TotalLabel>
      <TotalValue color={totalValueColor ?? theme.colors.secondary}>{totalValueLabel}</TotalValue>
    </Row>
  );

  return (
    <Card>
      <HeaderRow activeOpacity={0.7} onPress={() => setExpanded(!expanded)}>
        <FontAwesome5 name={icon} size={RFValue(14)} color={theme.colors.secondary} />
        <Title>{title}</Title>
        <FontAwesome5
          name={expanded ? 'chevron-up' : 'chevron-down'}
          size={RFValue(12)}
          color={theme.colors.grayLight}
        />
      </HeaderRow>

      {caption && <Caption>{caption}</Caption>}

      {expanded && (
        <Content>
          {totalPosition === 'top' && (
            <>
              {totalRow}
              <Divider />
            </>
          )}

          {rows.map((row) => (
            <Row key={row.label}>
              <RowLabel>{row.label}</RowLabel>
              <RowValue color={row.valueColor}>{row.valueLabel}</RowValue>
            </Row>
          ))}

          {totalPosition === 'bottom' && (
            <>
              <Divider />
              {totalRow}
            </>
          )}

          {disclaimer && <Disclaimer>{disclaimer}</Disclaimer>}
        </Content>
      )}
    </Card>
  );
};
