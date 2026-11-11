import {RFValue} from 'react-native-responsive-fontsize';
import styled from 'styled-components/native';

// margin-top separa do input de busca (mesmo valor do ContentAddress, HomeBottomSheet/styles.ts)
// — sem isso os dois cards (mesmo bg) se colam.
export const ListCard = styled.View`
  background-color: ${({theme}) => theme.colors.white ?? '#FFFFFF'};
  border-radius: ${({theme}) => theme.borderRadius.xlarge}px;
  border-width: 1px;
  border-color: ${({theme}) => theme.colors.gray_border ?? '#E2E8F0'};
  padding: ${({theme}) => theme.spacing.medium}px;
  margin-top: ${({theme}) => theme.spacing.large}px;
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.06;
  shadow-radius: 8px;
  elevation: 3;
`;

// ~1 card e meio de altura — o resto só aparece rolando, sinalizando que tem mais.
export const PreviewList = styled.ScrollView`
  max-height: ${RFValue(110)}px;
`;

export const SectionHeader = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${({theme}) => theme.spacing.small}px;
`;

export const SectionTitle = styled.Text`
  font-size: ${({theme}) => theme.fontSizes.medium}px;
  font-weight: 700;
  color: ${({theme}) => theme.colors.secondary};
`;

export const SeeAllLink = styled.TouchableOpacity``;

export const SeeAllLinkText = styled.Text`
  font-size: ${({theme}) => theme.fontSizes.small}px;
  color: ${({theme}) => theme.colors.secondary};
  font-weight: 700;
`;
