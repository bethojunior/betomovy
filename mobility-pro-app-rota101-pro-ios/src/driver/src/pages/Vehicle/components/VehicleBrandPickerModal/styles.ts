import { FlatList } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import styled from 'styled-components/native';
import { BrandListItem } from './types';

const LIST_CONTENT_STYLE = {
  paddingBottom: RFValue(8),
};

export const Backdrop = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.background_black_light};
  justify-content: flex-end;
`;

export const Sheet = styled.View<{ bottomInset?: number }>`
  background-color: ${({ theme }) => theme.colors.white};
  border-top-left-radius: ${({ theme }) => theme.borderRadius.xxlarge}px;
  border-top-right-radius: ${({ theme }) => theme.borderRadius.xxlarge}px;
  padding-top: ${({ theme }) => theme.spacing.large}px;
  padding-horizontal: ${({ theme }) => theme.spacing.xlarge}px;
  padding-bottom: ${({ bottomInset }) => bottomInset ?? RFValue(12)}px;
  max-height: 82%;
`;

export const Handle = styled.View`
  width: ${RFValue(40)}px;
  height: ${RFValue(4)}px;
  border-radius: ${RFValue(2)}px;
  background-color: ${({ theme }) => theme.colors.border};
  align-self: center;
  margin-bottom: ${({ theme }) => theme.spacing.xlarge}px;
`;

export const HeaderRow = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${({ theme }) => theme.spacing.xlarge}px;
`;

export const TitleText = styled.Text`
  font-size: ${({ theme }) => theme.fontSizes.xlarge}px;
  font-family: ${({ theme }) => theme.fonts.bold};
  color: ${({ theme }) => theme.colors.secondary};
`;

export const EmptyText = styled.Text`
  text-align: center;
  font-size: ${({ theme }) => theme.fontSizes.medium}px;
  font-family: ${({ theme }) => theme.fonts.regular};
  color: ${({ theme }) => theme.colors.text_gray};
  padding-vertical: ${({ theme }) => theme.spacing.xxxlarge}px;
`;

export const BrandList = styled(FlatList<BrandListItem>).attrs({
  showsVerticalScrollIndicator: false,
  contentContainerStyle: LIST_CONTENT_STYLE,
})``;

export const BrandRow = styled.TouchableOpacity<{ selected: boolean }>`
  flex-direction: row;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.medium}px;
  padding: ${({ theme }) => theme.spacing.medium}px;
  border-radius: ${({ theme }) => theme.borderRadius.medium}px;
  background-color: ${({ theme, selected }) =>
    selected ? theme.colors.background_white : 'transparent'};
`;

export const BrandIconWrapper = styled.View`
  width: ${RFValue(32)}px;
  height: ${RFValue(32)}px;
  border-radius: ${RFValue(16)}px;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme }) => theme.colors.white};
  border-width: ${({ theme }) => theme.borderWidth.small}px;
  border-color: ${({ theme }) => theme.colors.border};
  overflow: hidden;
`;

export const BrandIconImage = styled.Image`
  width: ${RFValue(22)}px;
  height: ${RFValue(22)}px;
`;

export const BrandLabel = styled.Text<{ selected: boolean }>`
  flex: 1;
  font-size: ${({ theme }) => theme.fontSizes.medium}px;
  font-family: ${({ theme, selected }) =>
    selected ? theme.fonts.medium : theme.fonts.regular};
  color: ${({ theme }) => theme.colors.secondary};
`;
