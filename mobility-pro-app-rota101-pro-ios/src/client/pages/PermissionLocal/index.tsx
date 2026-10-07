// @ts-nocheck

import {Linking} from 'expo';
import React, {useEffect, useState} from 'react';
import {
  View,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Text,
  Modal,
  Alert,
  Platform,
} from 'react-native';
import * as Application from 'expo-application';
import * as IntentLauncher from 'expo-intent-launcher';
import apiMain from '../../api/apiMain';
import localization from '../../assets/images/localization.png';
import {useLocal} from '../../contexts/local';

import {translate} from '../../locales';
import {styles} from './styles';
import {useAuth} from '../../../context/auth';

export default function PermissionLocal(props) {
  const [visibleModal, setVisibleModal] = useState(false);
  const {getPermissionLocal} = useAuth();
  const {placeSelected, loading} = useLocal();
  const {visible, onWithoutLocal} = props;
  const [terms, setTerms] = useState('');

  useEffect(() => {
    if (loading) {
      if (!placeSelected) {
        apiMain
          .get('termsUsePolicy/findByType?type=customer')
          .then(response => {
            setTerms(response.data.data.description);
            setVisibleModal(visible);
          });
      } else {
        setVisibleModal(false);
      }
    }
  }, [loading, visible, placeSelected]);

  return (
    <Modal visible={visibleModal}>
      <View style={styles.container}>
        <Text style={styles.title}>{translate('permissionLocal.title')}</Text>
        <Image style={styles.icon} source={localization} />
        <Text style={styles.subTitle}>
          {translate('permissionLocal.subtitle')}
        </Text>
        <View style={styles.contentText}>
          <ScrollView>
            <Text style={styles.text}>{terms}</Text>
          </ScrollView>
        </View>
        <View style={styles.buttonContent}>
          <TouchableOpacity
            style={styles.touchableButton}
            onPress={() => {
              getPermissionLocal().catch(() => {
                Alert.alert(
                  translate(
                    'permissionLocal.title_alert_we_dont_have_acess_your_location',
                  ),
                  `${translate(
                    'permissionLocal.message_alert_you_can_change_acess_to_your_location_in',
                  )}\n ${translate(
                    'permissionLocal.message_alert_your_device_settings',
                  )}`,
                  [
                    {
                      text: translate('permissionLocal.text_go_to_settings'),
                      onPress: () => {
                        if (Platform.OS === 'ios') {
                          Linking.openURL(`app-settings:`);
                        } else {
                          const bundleIdentifier = Application.applicationId;

                          IntentLauncher.startActivityAsync(
                            IntentLauncher.ACTION_APPLICATION_DETAILS_SETTINGS,
                            {
                              data: `package:${bundleIdentifier}`,
                            },
                          );
                        }
                      },
                    },
                    {
                      text: translate('permissionLocal.text_cancel'),
                    },
                  ],
                );
              });
            }}
          >
            <View style={styles.containerButton}>
              <Text style={styles.button}>
                {translate('permissionLocal.button_allow')}
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.buttonWithoutLocal}
            onPress={() => {
              setVisibleModal(false);
              if (onWithoutLocal) onWithoutLocal(true);
            }}
          >
            <Text style={styles.button}>
              {translate('permissionLocal.button_refuse')}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
