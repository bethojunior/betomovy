import {useNavigation} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {TouchableOpacity, Image} from 'react-native';
import {useAuth} from '../../../../context/auth';
import {useLocalProvider} from '../../context/local';
import {usePublicity} from '../../context/publicity';

import {styles} from './styles';

interface Props {
  setLoading?: any;
  appConstPublicity?: number | null;
}

export default function CardPublicity({setLoading, appConstPublicity}: Props) {
  const [publicity, setPublicity] = useState(null);
  const {location} = useLocalProvider();
  const {userDriver: user} = useAuth();

  const {getPublicity} = usePublicity();

  const navigation = useNavigation();

  async function get() {
    const data = await getPublicity(appConstPublicity ?? null);
    setPublicity(data);
    setLoading(false);
  }

  if (!user) {
    return <></>;
  }

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    if (location && publicity === null) {
      get();
    } else {
      setLoading(false);
    }
  }, [location]);

  if (!user) {
    return <></>;
  }

  if (!publicity) return null;

  return (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate('Publicity', {publicity});
      }}
      style={styles.container}
    >
      {/* <Spinner visible={loading} /> */}
      <Image
        source={{uri: publicity.banner}}
        resizeMode="contain"
        style={styles.imageCard}
      />
    </TouchableOpacity>
  );
}
