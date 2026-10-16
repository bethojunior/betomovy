import { Image, Linking, Pressable, Text, View } from 'react-native';
import whatsappIcon from '../../assets/images/whatsapp.png';
import facebookIcon from '../../assets/images/facebook.png';
import instagramIcon from '../../assets/images/instagram.png';
import { Container, styles } from './styles';
import { translate } from '../../locales';
import { useAuth } from '../../../context/auth';

export default function ContactUsBySection() {
  const { user, cityConfig } = useAuth();

  if (!user || !cityConfig) return <></>;

  return (
    <Container style={styles.container}>
      {cityConfig.supportContactNumber ? (
        <Pressable
          style={styles.content}
          onPress={() =>
            Linking.openURL(
              `https://api.whatsapp.com/send?phone=+55${cityConfig.supportContactNumber}`,
            )
          }
        >
          <>
            <Image style={styles.image} source={whatsappIcon} />
            <View>
              <Text style={styles.small}>{translate('contactUs.contact_us')}</Text>
              <Text style={styles.label}>{cityConfig.supportContactNumber}</Text>
            </View>
          </>
        </Pressable>
      ) : (
        <View />
      )}
      <View style={styles.content}>
        <Pressable onPress={() => Linking.openURL(cityConfig.urlFacebook)}>
          <Image style={[styles.image, styles.rigthSpace]} source={facebookIcon} />
        </Pressable>
        <Pressable onPress={() => Linking.openURL(cityConfig.urlInstagram)}>
          <Image style={[styles.image, styles.rigthSpace]} source={instagramIcon} />
        </Pressable>
      </View>
    </Container>
  );
}
