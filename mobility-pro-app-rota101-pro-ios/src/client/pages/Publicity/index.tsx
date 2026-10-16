import {useEffect, useState} from 'react';
import * as Application from 'expo-application';
import {
  Image,
  Linking,
  Share,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {Feather, MaterialCommunityIcons, AntDesign} from '@expo/vector-icons';
import {styles} from './styles';

import theme from '../../styles/theme';
import AsyncStorage from '@react-native-async-storage/async-storage';
import WebView from 'react-native-webview';
import {LinkExternalActionType} from '../../../constants/LinkExternal';
import {customToast} from '../../../utils/FlashMessage';
import {translate} from '../../locales';

export default function Publicity({route}) {
  const {publicity} = route.params;
  const [like, setLike] = useState(false);
  const [webView, setWebview] = useState(
    Number(publicity?.typeAction) === LinkExternalActionType.OPEN_WEBVIEW
      ? true
      : false,
  );
  const getLike = async () => {
    const value = await AsyncStorage.getItem(`publicity-${publicity?.id}`);
    if (value) {
      setLike(true);
    }
  };

  const changeLike = async () => {
    if (like) {
      await AsyncStorage.removeItem(`publicity-${publicity?.id}`);
      setLike(false);
      return;
    }
    setLike(true);
    await AsyncStorage.setItem(`publicity-${publicity?.id}`, 'true');
  };

  const onNavLink = async url => {
    try {
      Linking.openURL(url);
    } catch (error) {
      customToast(translate('toast.text_navigation_error'), 'danger');
    }
  };

  useEffect(() => {
    getLike();
  }, []);

  return (
    <View style={styles.container}>
      {!webView && (
        <>
          <Image
            source={{ uri: publicity?.thumbnail }}
            resizeMode="stretch"
            style={styles.image}
          />
          <Text style={styles.description}>{publicity?.description}</Text>
          <View style={styles.content}>
            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                Linking.openURL(publicity?.link);
              }}
            >
              <MaterialCommunityIcons
                name="web"
                size={28}
                color={theme.colors.white}
              />
            </TouchableOpacity>
            {!publicity.buttonsActions && (
              <TouchableOpacity
                style={styles.button}
                onPress={() => {
                  Share.share({
                    title: Application.applicationName,
                    message: publicity?.description,
                    url: publicity?.link,
                  });
                }}
              >
                <Feather name="share" size={28} color={theme.colors.white} />
              </TouchableOpacity>
            )}
            {publicity?.buttonsActions && publicity?.buttonsActions?.share && (
              <TouchableOpacity
                style={styles.button}
                onPress={() => {
                  Share.share({
                    title: Application.applicationName,
                    message: publicity?.description,
                    url: publicity?.link,
                  });
                }}
              >
                <Feather name="share" size={28} color={theme.colors.white} />
              </TouchableOpacity>
            )}
            {publicity?.buttonsActions && publicity?.buttonsActions?.like && (
              <TouchableOpacity
                style={styles.button}
                onPress={() => {
                  changeLike();
                }}
              >
                <AntDesign
                  name="like"
                  size={28}
                  color={like ? theme.colors.primary : theme.colors.white}
                />
              </TouchableOpacity>
            )}
            {publicity?.buttonCta?.checked &&
              publicity?.buttonCta?.link &&
              publicity?.buttonCta?.name && (
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => {
                    onNavLink(publicity?.buttonCta?.link);
                  }}
                >
                  <Text style={{color: theme.colors.white}}>
                    {publicity?.buttonCta?.name}
                  </Text>
                </TouchableOpacity>
              )}
          </View>
        </>
      )}

      {webView && (
        <WebView
          source={{uri: publicity?.link}}
          style={{
            height: '100%',
          }}
          javaScriptEnabled={true}
        />
      )}
    </View>
  );
}
