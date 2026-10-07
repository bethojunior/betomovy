import { MotiView } from 'moti';
import { View } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';

import { BlockProps, SkeletonAddressSuggestionsProps } from './types';
import {
  ConfirmGap,
  FieldInputGap,
  FieldWrapper,
  FormWrapper,
  PriceBlockWrapper,
  SuggestionIconGap,
  SuggestionItemDivider,
  SuggestionRowWrapper,
  SuggestionTextCol,
} from './styles';

const PULSE = {
  from: { opacity: 0.3 },
  animate: { opacity: 0.75 },
  transition: { type: 'timing' as const, duration: 750, loop: true, repeatReverse: true },
};

const Block = ({ width = '100%', height, borderRadius = RFValue(8), style }: BlockProps) => (
  <MotiView
    {...PULSE}
    style={[{ width, height, borderRadius, backgroundColor: '#d0d0d0' }, style]}
  />
);

const Field = ({ labelWidth }: { labelWidth: `${number}%` }) => (
  <FieldWrapper>
    <Block width={labelWidth} height={RFValue(11)} borderRadius={4} />
    <FieldInputGap>
      <Block height={RFValue(44)} />
    </FieldInputGap>
  </FieldWrapper>
);

const SuggestionRow = () => (
  <SuggestionRowWrapper>
    <SuggestionIconGap>
      <Block width={RFValue(32)} height={RFValue(32)} borderRadius={RFValue(16)} />
    </SuggestionIconGap>
    <SuggestionTextCol>
      <Block width="65%" height={RFValue(12)} borderRadius={4} />
      <Block width="40%" height={RFValue(10)} borderRadius={4} />
    </SuggestionTextCol>
  </SuggestionRowWrapper>
);

export const SkeletonDoorHandleForm = () => (
  <FormWrapper>
    <PriceBlockWrapper>
      <Block width="45%" height={RFValue(32)} borderRadius={RFValue(8)} />
    </PriceBlockWrapper>
    <Field labelWidth="50%" />
    <Field labelWidth="25%" />
    <Field labelWidth="32%" />
    <Field labelWidth="18%" />
    <Field labelWidth="28%" />
    <ConfirmGap>
      <Block height={RFValue(48)} borderRadius={RFValue(12)} />
    </ConfirmGap>
  </FormWrapper>
);

export const SkeletonAddressSuggestions = ({ rows = 3 }: SkeletonAddressSuggestionsProps) => (
  <View>
    {Array.from({ length: rows }).map((_, i) => (
      <View key={i}>
        <SuggestionRow />
        {i < rows - 1 && <SuggestionItemDivider />}
      </View>
    ))}
  </View>
);
