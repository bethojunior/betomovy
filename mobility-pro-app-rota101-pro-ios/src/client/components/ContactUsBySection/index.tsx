// @ts-nocheck

import React, {useEffect, useState} from 'react';
import {Image, Linking, Pressable, Text, View} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import whatsappIcon from '../../assets/images/whatsapp.png';
import facebookIcon from '../../assets/images/facebook.png';
import instagramIcon from '../../assets/images/instagram.png';
import apiMain from '../../api/apiMain';
import {useLocal} from '../../contexts/local';
import {Container, styles} from './styles';
import {translate} from '../../locales';
import {useAuth} from '../../../context/auth';

export default function ContactUsBySection() {
  const {placeSelected, placeUser} = useLocal();
  const {user} = useAuth;

  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(false);

  if (!user) return <></>;

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    async function getConfig() {
      let position = null;

      if (placeSelected) {
        position = {
          lat: placeSelected.latitude,
          lng: placeSelected.longitude,
        };
      }

      if (!position && placeUser) {
        position = {
          lat: placeUser.latitude,
          lng: placeUser.longitude,
        };
      }

      if (!position) {
        setLoading(true);
        return;
      }

      const {
        data: {data},
      } = await apiMain.post(`city/getconfig`, position);

      await AsyncStorage.setItem('cityConfig', JSON.stringify(data));

      setConfig(data);
      setLoading(true);
    }

    async function getCache() {
      const data = await AsyncStorage.getItem('cityConfig');

      if (data) {
        setConfig(JSON.parse(data));
        setLoading(true);
      }
    }

    getCache();
    getConfig();
  }, [placeSelected, placeUser]);

  if (!loading) return <></>;

  if (!config) return <></>;

  return (
    <Container style={styles.container}>
      {config.supportContactNumber ? (
        <Pressable
          style={styles.content}
          onPress={() =>
            Linking.openURL(
              `https://api.whatsapp.com/send?phone=+55${config.supportContactNumber}`,
            )
          }
        >
          <>
            <Image style={styles.image} source={whatsappIcon} />
            <View>
              <Text style={styles.small}>
                {translate('contactUs.contact_us')}
              </Text>
              <Text style={styles.label}>{config.supportContactNumber}</Text>
            </View>
          </>
        </Pressable>
      ) : (
        <View />
      )}
      <View style={styles.content}>
        <Pressable onPress={() => Linking.openURL(config.urlFacebook)}>
          <Image
            style={[styles.image, styles.rigthSpace]}
            source={facebookIcon}
          />
        </Pressable>
        <Pressable onPress={() => Linking.openURL(config.urlInstagram)}>
          <Image
            style={[styles.image, styles.rigthSpace]}
            source={instagramIcon}
          />
        </Pressable>
      </View>
    </Container>
  );
}
