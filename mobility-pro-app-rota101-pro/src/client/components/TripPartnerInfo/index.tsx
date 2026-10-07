import { ActiveTripText, Container } from "./styles";
import { MaterialIcons } from '@expo/vector-icons';
import { TripPartnerInfoProps } from "./types";
import theme from "../../styles/theme";

const TripPartnerInfo = ({setVisible}: TripPartnerInfoProps) => {
  return (
    <Container
      onPress={() => setVisible(true)}
    >
      <ActiveTripText>Viagens ativas</ActiveTripText>
      <MaterialIcons
        name="keyboard-arrow-right"
        color={theme.colors.primaryText}
        size={30}
      />
    </Container>
  )
}

export default TripPartnerInfo;