import {Modal} from 'react-native';
import WebView from 'react-native-webview';
import AntDesign from '@expo/vector-icons/AntDesign';
import {useTheme} from 'styled-components';

import {useEffect, useRef} from 'react';
import {Container, Content, ContentExit} from './styles';

interface Props {
  visible: boolean;
  closeModal: () => void;
}

export function LoginFacebookModal({visible, closeModal}: Props) {
  const {colors} = useTheme();
  const webRef = useRef<WebView>(null);

  useEffect(() => {
    if (webRef?.current) {
      setInterval(() => {
        webRef?.current?.injectJavaScript(INJECTED_JAVASCRIPT);
      }, 2000);
    }
  }, [visible]);

  const INJECTED_JAVASCRIPT = `(function () {
    const tokenLocalStorage = window.localStorage.getItem('token');
    window.ReactNativeWebView.postMessage(tokenLocalStorage);
  })()`;

  return (
    <Modal visible={visible} transparent>
      <Container>
        <Content>
          <ContentExit onPress={closeModal}>
            <AntDesign name="close" size={22} color={colors.white} />
          </ContentExit>
          <WebView
            ref={webRef}
            source={{
              uri: 'https://192.168.1.26:3000',
            }}
            onMessage={event => {
              console.log(event.nativeEvent.data);
            }}
            javaScriptCanOpenWindowsAutomatically={true}
            javaScriptEnabled
            // injectedJavaScript={INJECTED_JAVASCRIPT}
          />
        </Content>
      </Container>
    </Modal>
  );
}
