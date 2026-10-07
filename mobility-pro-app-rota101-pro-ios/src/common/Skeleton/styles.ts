import Animated from 'react-native-reanimated';
import styled from 'styled-components/native';

export const SkeletonComponent = styled(Animated.View)<any>`
  width: ${({width}) => `${width}${Number.isInteger(width) ? '%' : ''}`};
  height: ${({height}) => `${height}${Number.isInteger(height) ? 'px' : ''}`};
  margin: ${({mh, mv}) => `${mv}px ${mh}px ${mv}px ${mh}px`};
  background-color: #d8d8d8;
  border-radius: ${({circle}) => (circle ? circle : 3)}px;
`;
