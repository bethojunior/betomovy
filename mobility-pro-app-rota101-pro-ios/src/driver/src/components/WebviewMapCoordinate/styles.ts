import styled from 'styled-components/native';

export const HeaderModal = styled.View`
  padding-top: 20px;
  z-index: 2;
  width: 100%;
  height: 300px;
  position: absolute;
  padding: 10px;
  border-radius: 10px;
`;
export const Content = styled.View`
  flex: 1;
  border-radius: 5px;
  position: relative;
  border: 5px solid ${({theme}) => theme.colors.background_global};
`;

export const ContainerAddress = styled.ScrollView`
  background-color: ${({theme}) => theme.colors.background_global};
  max-height: 55px;
  overflow: hidden;
`;

export const ContentCloseIcon = styled.TouchableOpacity`
  position: absolute;
  top: 0;
  right: 0;
  z-index: 1;
  padding: 5px;
  background-color: ${({theme}) => theme.colors.primary};

  border-bottom-left-radius: 5px;
`;

export const TextTitle = styled.Text`
  font-size: ${({theme}) => theme.fontSizes.medium}px;
  font-family: ${({theme}) => theme.fonts.regular};
`;
