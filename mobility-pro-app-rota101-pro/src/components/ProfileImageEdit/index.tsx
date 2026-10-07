import { RFValue } from "react-native-responsive-fontsize"
import { Container, IconContainer, Image } from "./styles"
import { Feather } from '@expo/vector-icons';
import { ActivityIndicator, ImageSource } from "react-native";

type ProfileImageEditProps = {
  loading?: boolean;
  source?: ImageSource;
}

const ProfileImageEdit: React.FC<ProfileImageEditProps> = ({ loading, source }) => {
  return (
    <Container>
      <Image source={source} resizeMode="cover" />
      <IconContainer>
        {loading ? (
          <ActivityIndicator size="small" color="#007bff" />
        ) : (
          <Feather name="edit-2" size={RFValue(12)} />
        )}
      </IconContainer>
    </Container>
  )
}

export default ProfileImageEdit
