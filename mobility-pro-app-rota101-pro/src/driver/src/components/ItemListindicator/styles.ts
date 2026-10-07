import styled from 'styled-components/native';

export const Container = styled.View`
  padding: 20px 22px;
  width: 100%;
  justify-content: center;
  border-bottom-width: 0.3px;
  border-bottom-color: ${({theme}) => theme.colors.primary};
`;

export const Content = styled.View`
  flex-direction: row;
  justify-content: space-between;
`;

export const Title = styled.Text`
  font-size: ${({theme}) => theme.fontSizes.smalls}px;
  font-family: ${({theme}) => theme.fonts.regular};
  color: ${({theme}) => theme.colors.primary};
  margin-top: -5px;
  margin-bottom: 5px;
`;

export const Month = styled.Text`
  font-size: ${({theme}) => theme.fontSizes.small}px;
  font-family: ${({theme}) => theme.fonts.regular};
  color: ${({theme}) => theme.colors.secondary};
`;

export const Name = styled.Text`
  font-size: ${({theme}) => theme.fontSizes.small}px;
  font-family: ${({theme}) => theme.fonts.regular};
  color: ${({theme}) => theme.colors.secondary};
  width: 55%;
`;

export const Type = styled.Text`
  font-size: ${({theme}) => theme.fontSizes.small}px;
  font-family: ${({theme}) => theme.fonts.regular};
  color: ${({theme}) => theme.colors.secondary};
`;

export const ContentInfo = styled.View`
  flex-direction: column;
  width: 60%;
`;

export const Info = styled.View`
  flex-direction: row;
`;

export const ContentType = styled.View`
  width: 40%;
`;
