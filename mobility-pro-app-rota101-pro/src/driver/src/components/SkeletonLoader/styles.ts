import { RFValue } from 'react-native-responsive-fontsize';
import styled from 'styled-components/native';

/* ─── Form skeleton ──────────────────────────────────────────── */

export const FormWrapper = styled.View`
  padding: ${RFValue(16)}px ${RFValue(20)}px 0;
`;

export const PriceBlockWrapper = styled.View`
  align-items: center;
`;

export const FieldWrapper = styled.View`
  margin-top: ${RFValue(16)}px;
`;

export const FieldInputGap = styled.View`
  margin-top: ${RFValue(6)}px;
`;

export const ConfirmGap = styled.View`
  margin-top: ${RFValue(24)}px;
`;

/* ─── Suggestions skeleton ───────────────────────────────────── */

export const SuggestionRowWrapper = styled.View`
  flex-direction: row;
  align-items: center;
  padding: ${RFValue(12)}px ${RFValue(16)}px;
`;

export const SuggestionIconGap = styled.View`
  margin-right: ${RFValue(12)}px;
`;

export const SuggestionTextCol = styled.View`
  flex: 1;
  gap: ${RFValue(5)}px;
`;

export const SuggestionItemDivider = styled.View`
  height: 0.5px;
  background-color: #e8e8e8;
  margin-left: ${RFValue(60)}px;
`;
