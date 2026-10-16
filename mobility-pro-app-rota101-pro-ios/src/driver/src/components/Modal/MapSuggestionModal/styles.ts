import styled from 'styled-components/native';
import {rgba} from 'polished';
import {RFValue} from 'react-native-responsive-fontsize';

export const Header = styled.View`
  flex-direction: row;
  align-items: flex-start;
  padding-right: ${RFValue(28)}px;
  margin-top: ${({theme}) => theme.spacing.xxlarge}px;
  margin-bottom: ${({theme}) => theme.spacing.xlarge}px;
`;

export const HeaderIconBadge = styled.View`
  width: ${RFValue(48)}px;
  height: ${RFValue(48)}px;
  border-radius: ${RFValue(24)}px;
  align-items: center;
  justify-content: center;
  margin-right: ${({theme}) => theme.spacing.large}px;
  background-color: ${({theme}) => rgba(theme.colors.yellowStrong, 0.16)};
`;

export const HeaderTextContent = styled.View`
  flex: 1;
`;

export const HeaderTitle = styled.Text`
  font-size: ${({theme}) => theme.fontSizes.xlarge}px;
  font-weight: 700;
  color: ${({theme}) => theme.colors.secondary};
`;

export const HeaderSubtitle = styled.Text`
  margin-top: ${({theme}) => theme.spacing.small}px;
  font-size: ${({theme}) => theme.fontSizes.medium}px;
  color: ${({theme}) => theme.colors.text_gray};
`;
