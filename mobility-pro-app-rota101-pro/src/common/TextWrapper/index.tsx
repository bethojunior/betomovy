import { useState } from "react"
import { Text } from "react-native-paper"

export const TextWrapper = ({
  text,
  initialNumber = 1,
  endNumber = 1,
  Children = Text,
  ... rest
}: any) => {
  const [numberOfLines, setNumberOrLines] = useState(initialNumber);


  const changeSizeAddress = () => {
    if (numberOfLines === initialNumber) {
      return setNumberOrLines(endNumber);
    }
    setNumberOrLines(initialNumber);
  }

  return (
    <Children
      numberOfLines={numberOfLines}
      onPress={changeSizeAddress}
      {...rest}
    >
      {text}
    </Children>
  )
}