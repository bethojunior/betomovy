// @ts-nocheck

import React from 'react';
import {TouchableOpacity, View, Text, StyleSheet} from 'react-native';
import Icon from '@expo/vector-icons/FontAwesome5';
import {Avatar} from 'react-native-elements';
import Colors from '../Colors';
import {useLocal} from '../../contexts/local';

import imageUser from '../../assets/images/user.png';

import {translate} from '../../locales';
import {useAuth} from '../../../context/auth';
import {Container, IconLocal, SimpleText, TextLocal} from './styles';
import theme from '../../styles/theme';

export default function LocalInput(props) {
  const {placeSelected, placeUser} = useLocal();
  const {user} = useAuth();

  return (
    <Container style={{paddingvertical: 10, elevation: 1}}>
      <Avatar
        rounded
        source={user != null ? {uri: user.profileImageLink} : imageUser}
        style={styles.avatar}
      />
      <TouchableOpacity {...props}>
        <View style={styles.containerBtn}>
          <View style={{width: '90%'}}>
            <SimpleText>
              {translate('form.localInput.text_receive_now_on')}
            </SimpleText>
            <TextLocal numberOfLines={1}>
              {placeSelected
                ? placeSelected.address
                : placeUser
                ? placeUser.address
                : translate('form.localInput.text_enter_your_location')}
            </TextLocal>
          </View>
          <IconLocal name="angle-down" size={20} />
        </View>
      </TouchableOpacity>
    </Container>
  );
}

const styles = StyleSheet.create({
  avatar: {
    width: 35,
    height: 35,
  },
  containerBtn: {
    flex: 1,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    marginHorizontal: 15,
  },
});
