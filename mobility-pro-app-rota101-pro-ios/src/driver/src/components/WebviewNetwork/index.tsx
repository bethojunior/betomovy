import React, {useEffect} from 'react';
import {Alert, View} from 'react-native';
import {WebView} from 'react-native-webview';
import {useTripProvider} from '../../context/Trip';
import {useAuth} from '../../../../context/auth';
interface Props {
  network?: boolean;
  setNetwork?: (network: boolean) => void;
}

export const WebViewConnectionOnInternet = ({network, setNetwork}: Props) => {
  const {setItsNetwork} = useAuth();

  const onMessage = event => {
    if (event.nativeEvent.data === 'online') {
      setItsNetwork(true);
    } else if (event.nativeEvent.data === 'offline') {
      setItsNetwork(false);
    }
  };

  return (
    <View
      style={{
        width: 1,
        height: 1,
        position: 'absolute',
      }}
    >
      <WebView
        source={{
          html: `
        <html>
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          
        </head>
        <body>
          
          <script>
            window.addEventListener('online', function () {
              window.ReactNativeWebView.postMessage('online');
            });
            window.addEventListener('offline', function () {
              window.ReactNativeWebView.postMessage('offline');
            });
            // Check the initial network status
            if (navigator.onLine) {
              window.ReactNativeWebView.postMessage('online');
            } else {
              window.ReactNativeWebView.postMessage('offline');
            }
          </script>
        </body>
      </html>
      
        `,
        }}
        onMessage={onMessage}
        style={{flex: 1}}
        containerStyle={{flex: 1}}
        originWhitelist={['*']}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        startInLoadingState={true}
        scalesPageToFit={true}
        allowsInlineMediaPlayback={true}
        allowsFullscreenVideo={true}
        allowsBackForwardNavigationGestures={true}
        allowsLinkPreview={true}
        allowsPictureInPictureMediaPlayback={true}
        allowsWebContentPlayback={true}
      />
    </View>
  );
};
