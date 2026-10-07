// @ts-nocheck
import React, {useEffect} from 'react';
import {View, StyleSheet, BackHandler, Image} from 'react-native';
import {useAuth} from '../../../context/auth';
import icon from '../../assets/images/congratulations.gif';
import {styles} from './styles';

export default function CongratulationSignUp({route}) {
  const {signIn} = useAuth();
  const {user} = route.params;

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        return true;
      },
    );

    setTimeout(() => {
      signIn(user);
    }, 2000);

    return () => backHandler.remove();
  }, []);

  return (
    <View style={styles.container}>
      <Image source={icon} style={styles.icon} />
    </View>
  );
}
