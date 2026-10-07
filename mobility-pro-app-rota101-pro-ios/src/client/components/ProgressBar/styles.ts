import styled from 'styled-components/native';

interface ContentProgressProps {
  visible: boolean;
}

interface ProgressBarrerProps {
  width: number;
}

export const ContentProgressTime = styled.View<ContentProgressProps>`
  display: ${({visible}) => (visible ? 'flex' : 'none')};
  background-color: ${({theme}) => theme.colors.secondary};
  width: 90%;
  align-self: center;
  border-radius: 30px;
  height: 40px;
  position: absolute;
  top: 10px;
  z-index: 5;
  justify-content: center;
  overflow: hidden;
  elevation: 5;
`;

export const ProgressBarrer = styled.View<ProgressBarrerProps>`
  transition: 0.5s all;
  height: 50px;
  width: ${({width}) => (width >= 100 ? '100%' : `${width}%`)};
  align-self: flex-start;
  height: 40px;
  border-radius: 30px;
  background-color: ${({theme}) => theme.colors.primary};
  position: absolute;
`;

export const TextTime = styled.Text`
  font-family: MavenPro_500Medium;
  color: ${({theme}) => theme.colors.background_global};
  align-self: center;
  font-size: 15px;
`;
