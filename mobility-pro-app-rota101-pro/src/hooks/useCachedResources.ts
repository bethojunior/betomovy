import {
  AntDesign,
  Entypo,
  EvilIcons,
  FontAwesome,
  FontAwesome5,
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
} from '@expo/vector-icons';
import * as Font from 'expo-font';
import * as React from 'react';

import {
  Lato_400Regular,
  Lato_400Regular_Italic,
  Lato_700Bold,
  Lato_700Bold_Italic,
  Lato_900Black,
} from '@expo-google-fonts/lato';

import {
  Roboto_100Thin,
  Roboto_300Light,
  Roboto_400Regular,
  Roboto_400Regular_Italic,
  Roboto_500Medium,
  Roboto_700Bold,
  Roboto_900Black,
} from '@expo-google-fonts/roboto';

import {
  SourceCodePro_400Regular,
  SourceCodePro_600SemiBold,
  SourceCodePro_700Bold,
  SourceCodePro_900Black,
} from '@expo-google-fonts/source-code-pro';

import {
  MavenPro_400Regular,
  MavenPro_500Medium,
  MavenPro_600SemiBold,
  MavenPro_700Bold,
  MavenPro_800ExtraBold,
  MavenPro_900Black,
} from '@expo-google-fonts/maven-pro';

export default function useCachedResources() {
  const [isLoadingComplete, setLoadingComplete] = React.useState(false);

  // Load any resources or data that we need prior to rendering the app
  React.useEffect(() => {
    async function loadResourcesAndDataAsync() {
      try {
        // Load fonts
        await Font.loadAsync({
          ...AntDesign.font,
          ...Entypo.font,
          ...EvilIcons.font,
          ...FontAwesome.font,
          ...FontAwesome5.font,
          ...Ionicons.font,
          ...MaterialCommunityIcons.font,
          ...MaterialIcons.font,
          Roboto_100Thin,
          Roboto_300Light,
          Roboto_400Regular,
          Roboto_400Regular_Italic,
          Roboto_500Medium,
          Roboto_700Bold,
          Roboto_900Black,
          Lato_900Black,
          Lato_400Regular,
          Lato_400Regular_Italic,
          Lato_700Bold,
          Lato_700Bold_Italic,
          SourceCodePro_400Regular,
          SourceCodePro_600SemiBold,
          SourceCodePro_700Bold,
          SourceCodePro_900Black,
          MavenPro_400Regular,
          MavenPro_500Medium,
          MavenPro_600SemiBold,
          MavenPro_700Bold,
          MavenPro_800ExtraBold,
          MavenPro_900Black,
        });
      } catch (e) {
        // We might want to provide this error information to an error reporting service
        console.warn(e);
      } finally {
        setLoadingComplete(true);
      }
    }

    loadResourcesAndDataAsync();
  }, []);

  return isLoadingComplete;
}
