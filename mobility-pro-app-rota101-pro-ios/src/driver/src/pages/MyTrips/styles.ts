import styled from 'styled-components/native';

export const Container = styled.View`
  width: 100%;
  height: 100%;
  background: ${({theme}) => theme.colors.background_global};
`;

export const ContainerCards = styled.ScrollView.attrs(({ theme }) => ({
  contentContainerStyle: {
    paddingVertical: theme.spacing.medium,
  },
}))``;

export const TextNone = styled.Text`
  text-align: center;
  margin-top: ${({theme}) => theme.spacing.xxlarge}px;
  color: ${({theme}) => theme.colors.secondary};
  font-family: ${({theme}) => theme.fonts.regular};
`;
