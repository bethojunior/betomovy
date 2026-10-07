import { RFValue } from "react-native-responsive-fontsize";
import styled from "styled-components/native";

interface ImageProps {
  width: number,
  height: number
}

export const ImageItem = styled.Image<ImageProps>`
  width: ${({width}) => RFValue(width)}px;
  height: ${({height}) => RFValue(height)}px;
`