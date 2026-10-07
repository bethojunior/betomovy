import { translate } from "../../locales";
import ModalFrame from "../../../driver/src/components/Modal/ModalFrame";
import { TripListModalProps } from "./types";
import TripPartnerCard from "../TripPartnerCard";
import { ScrollView } from "react-native-gesture-handler";
import { Dimensions } from "react-native";

const TripListModal = ({
  trips,
  visible,
  setVisible
}: TripListModalProps) => {

  const windowHeight = Dimensions.get('window').height;

  return (
    <ModalFrame
      visible={visible}
      onClose={() => setVisible(false)}
      setVisible={setVisible}
      title={"Viagens ativas"}
      textCancel={translate('tripPreAccepted.text_close')}
      hideConfirm
    >
      <ScrollView style={{ maxHeight: windowHeight / 1.75}}>
        {trips.map((trip) => (
          <TripPartnerCard
            key={trip.tripReference}
            trip={trip}
            setVisible={setVisible}
          />
        ))}
      </ScrollView>
    </ModalFrame>
  )
}

export default TripListModal;