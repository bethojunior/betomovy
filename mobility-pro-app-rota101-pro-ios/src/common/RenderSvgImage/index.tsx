import { RFValue } from "react-native-responsive-fontsize"
import { SvgUri } from "react-native-svg"
import { ImageItem } from "./styles"

interface RenderSvgImageProps {
  image: string
  width: number,
  heigth: number
}

export const RenderSvgImage = ({ image, width, heigth }: RenderSvgImageProps) => {
  return (
    image?.split('.').pop() === 'svg' ?
      <SvgUri
        width={RFValue(width)}
        height={RFValue(heigth)}
        uri={image}
      />
      : <ImageItem width={width} height={heigth} source={{ uri: image }} />
  )
}