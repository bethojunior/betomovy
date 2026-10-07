import {View} from 'react-native';
import WebView from 'react-native-webview';
import theme from '../../styles/theme';

interface Props {
  text?: string;
  setText: (text: string) => void;
  setStartLoading?: (value: boolean) => void;

  width?: number;
  height?: number;
  sizeIcon?: number;
  automatic?: boolean;
}

export const WebViewVoiceRecognition = ({
  text,
  setText,
  setStartLoading,
  width,
  height,
  sizeIcon,
  automatic,
}: Props) => {
  return (
    <View
      style={{
        width: width || 50,
        height: height || 50,
        justifyContent: 'center',
      }}
    >
      <WebView
        originWhitelist={['*']}
        allowsInlineMediaPlayback
        javaScriptEnabled
        scalesPageToFit
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        bounces={false}
        mediaPlaybackRequiresUserAction={false}
        javaScriptEnabledAndroid
        useWebkit
        onMessage={event => {
          if (event.nativeEvent.data === 'start') {
            setStartLoading && setStartLoading(true);
            return;
          }
          setText(event.nativeEvent.data);
          setStartLoading && setStartLoading(false);
        }}
        scrollEnabled={false}
        source={{
          html: `

    <!DOCTYPE html>
    <html>
      <head>
        <title>Simple Command Voice</title>
      </head>
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.3.0/font/bootstrap-icons.css">

      <style>
      body {
        width: 130px;
        height: 180px;
        overflow: hidden;
        position: relative;
        background-color: ${theme.colors.background_global};
      }
        button {
          margin-top: 10px;
          overflow: hidden;
          border: none;
          background-color: transparent;
        }
        i {
          font-size: ${sizeIcon || 110}px;
          color: ${theme.colors.primary};
        }
      </style>
      <body>
        <p id="output"></p>
        <button id="start"> <i id="icon" class="bi bi-mic"></i></button>
        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-kenU1KFdBIe4zVF0s0G1M5b4hcpxyD9F7jL+jjXkk+Q2h455rYXK/7HAuoJl+0I4" crossorigin="anonymous"></script>
        <script>
          (() => {
            const startBtn = document.querySelector('#start');
            const icon = document.querySelector('#icon');
            const output = document.querySelector('#output');
            let contentText = '';
            let startSpeak = false;
            let colorPrimary = '${theme.colors.primary}';
            function start() {
              // if (!startSpeak) {
              //   // loading iconHtml
              //   icon.classList.remove('bi-mic');
              //   icon.innerText = '...';
              // window.ReactNativeWebView.postMessage('start');
              //   setTimeout(() => {
              //     icon.classList.add('bi-mic');
              //     startSpeak = true;
              //     startBtn.click();
              //   }, 2000);
              //   return 
              // }
              icon.style.color = 'red';
              window.ReactNativeWebView.postMessage('start');
              
              const recognition = new webkitSpeechRecognition();
              recognition.interimResults = true;
              recognition.lang = "pt-BR";
              recognition.continuous = true;
              recognition.start();
              // This event happens when you talk in the microphone
              recognition.onresult = function(event) {
                for (let i = event.resultIndex; i < event.results.length; i++) {
                  if (event.results[i].isFinal) {
                    // Here you can get the string of what you told
                    const content = event.results[i][0].transcript.trim();
                    // output.textContent = content;
                    contentText = content;
                    // window.ReactNativeWebView.postMessage(content);
                  }
                }
              };
              // This event happens when you stop talking in the microphone
              recognition.onend = function() {
                icon.style.color = colorPrimary;
                startSpeak = false;
                window.ReactNativeWebView.postMessage(contentText);
              };

                
            };

            if (${!automatic}) {
              return startBtn.addEventListener('click', () => start());
            } else {
              setTimeout(() => {
                start()
              }, 2500);
            }
          })();
        </script>
      </body>
    </html>
    `,
        }}
      />
    </View>
  );
};
