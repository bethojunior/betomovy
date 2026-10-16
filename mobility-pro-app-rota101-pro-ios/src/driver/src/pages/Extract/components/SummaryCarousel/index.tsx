import { useState } from 'react';
import { RFValue } from 'react-native-responsive-fontsize';
import { useTheme } from 'styled-components/native';
import Svg, { Circle } from 'react-native-svg';
import { PagerViewOnPageSelectedEvent } from 'react-native-pager-view';

import { translate } from '../../../../../../client/locales';
import { TrendIcon } from '../../../../components/TrendIcon';
import { moneyMask } from '../../../../utils/money';
import { SummaryCarouselProps } from './types';
import {
  Card,
  Divider,
  Dot,
  DotsRow,
  LegendColumn,
  LegendDot,
  LegendLabel,
  LegendRow,
  LegendTextGroup,
  LegendValue,
  Pager,
  Page,
  RingCardRow,
  SummaryItemRow,
  SummaryLabel,
  SummaryList,
  SummaryValue,
} from './styles';

// piso mínimo de ângulo visível pra fatia não desaparecer quando um lado é quase 100% do total
const MIN_RATIO = 8 / 360;

// resumo Entradas/Saídas em carrossel nativo (react-native-pager-view): 1ª página em lista, 2ª com o anel de proporção
export function SummaryCarousel({ totalCredit, totalDebit }: SummaryCarouselProps) {
  const theme = useTheme();
  const [activeIndex, setActiveIndex] = useState(0);

  const total = totalCredit + totalDebit;
  let creditRatio = total > 0 ? totalCredit / total : 0.5;
  if (totalCredit > 0 && totalDebit > 0) {
    creditRatio = Math.min(Math.max(creditRatio, MIN_RATIO), 1 - MIN_RATIO);
  }

  const ringSize = RFValue(84);
  const strokeWidth = RFValue(10);
  const radius = (ringSize - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const creditLength = circumference * creditRatio;

  const handlePageSelected = (event: PagerViewOnPageSelectedEvent) => {
    setActiveIndex(event.nativeEvent.position);
  };

  const dots = (
    <DotsRow>
      <Dot active={activeIndex === 0} />
      <Dot active={activeIndex === 1} />
    </DotsRow>
  );

  return (
    <Pager initialPage={0} onPageSelected={handlePageSelected}>
      <Page key="summary">
        <Card>
          <SummaryList>
            <SummaryItemRow>
              <TrendIcon direction="up" size={RFValue(18)} color={theme.colors.on} />
              <SummaryLabel>{translate('driver_extract.entries')}</SummaryLabel>
              <SummaryValue color={theme.colors.on}>R$ {moneyMask(totalCredit)}</SummaryValue>
            </SummaryItemRow>

            <Divider />

            <SummaryItemRow>
              <TrendIcon direction="down" size={RFValue(18)} color={theme.colors.red} />
              <SummaryLabel>{translate('driver_extract.outings')}</SummaryLabel>
              <SummaryValue color={theme.colors.red}>R$ {moneyMask(totalDebit)}</SummaryValue>
            </SummaryItemRow>
          </SummaryList>

          {dots}
        </Card>
      </Page>

      <Page key="ring">
        <Card>
          <RingCardRow>
            <Svg width={ringSize} height={ringSize}>
              <Circle
                cx={ringSize / 2}
                cy={ringSize / 2}
                r={radius}
                stroke={theme.colors.red}
                strokeWidth={strokeWidth}
                fill="none"
              />
              <Circle
                cx={ringSize / 2}
                cy={ringSize / 2}
                r={radius}
                stroke={theme.colors.on}
                strokeWidth={strokeWidth}
                strokeDasharray={`${creditLength} ${circumference}`}
                strokeLinecap="round"
                fill="none"
                rotation="-90"
                origin={`${ringSize / 2}, ${ringSize / 2}`}
              />
            </Svg>

            <LegendColumn>
              <LegendRow>
                <LegendDot color={theme.colors.on} />
                <LegendTextGroup>
                  <LegendLabel>{translate('driver_extract.entries')}</LegendLabel>
                  <LegendValue color={theme.colors.on}>R$ {moneyMask(totalCredit)}</LegendValue>
                </LegendTextGroup>
              </LegendRow>

              <LegendRow>
                <LegendDot color={theme.colors.red} />
                <LegendTextGroup>
                  <LegendLabel>{translate('driver_extract.outings')}</LegendLabel>
                  <LegendValue color={theme.colors.red}>R$ {moneyMask(totalDebit)}</LegendValue>
                </LegendTextGroup>
              </LegendRow>
            </LegendColumn>
          </RingCardRow>

          {dots}
        </Card>
      </Page>
    </Pager>
  );
}
