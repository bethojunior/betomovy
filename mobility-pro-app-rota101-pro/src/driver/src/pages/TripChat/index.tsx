import { useEffect, useMemo, useState } from 'react';
import { InteractionManager } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { RFValue } from 'react-native-responsive-fontsize';
import {
  Container,
  InnerContainer,
  Content,
  MessagesContent,
  AutoReadCard,
  ScrollToBottomButton,
} from './styles';

import theme from '../../styles/theme';
import { AutoReadToggle } from '../../../../common/components/AutoReadToggle';
import LoadView from '../../components/LoadView';
import { Switch } from '../../components/Switch';
import { useDriverTripChatController } from './useDriverTripChatController';
import { useChatScrollPosition } from '../../../../common/hooks/useChatScrollPosition';
import { getChatOverlayVisibility } from '../../../../common/hooks/chatOverlayVisibility';
import { useFavoriteQuickMessages } from '../../../../common/hooks/useFavoriteQuickMessages';
import { getDriverQuickMessages } from './driverQuickMessages';
import { MessageList } from './MessageList';
import { NavBar } from './NavBar';
import { Footer } from './Footer';
import type { DriverTripChatRoute } from './types';

export default function TripChat({ route }: { route: DriverTripChatRoute }) {
  const {
    user,
    trip,
    scroll,
    loading,
    messages,
    switchValue,
    setSwitchValue,
    keyboardHeight,
    scrollToEnd,
    sendTextMessage,
    speakUnicMessage,
  } = useDriverTripChatController(route);

  const driverFallbackMessages = useMemo(() => getDriverQuickMessages(), []);
  const { quickMessages, favoriteMessage } = useFavoriteQuickMessages(driverFallbackMessages);

  const [footerReady, setFooterReady] = useState(false);
  // Chute inicial até o primeiro onLayout do rodapé medir o valor real.
  const [footerHeight, setFooterHeight] = useState(RFValue(74));
  useEffect(() => {
    const interaction = InteractionManager.runAfterInteractions(() => {
      setFooterReady(true);
    });
    return () => interaction.cancel();
  }, []);

  const { isNearBottom, canScroll, onScroll, onLayout, onContentSizeChange } = useChatScrollPosition(scroll);
  const { showAutoReadCard, showScrollToBottom } = getChatOverlayVisibility({
    keyboardHeight,
    isNearBottom,
    canScroll,
    messagesCount: messages.length,
  });

  return (
    <Container>
      <NavBar trip={trip} />
      {!loading ? (
        <InnerContainer keyboardOffset={keyboardHeight}>
          {showAutoReadCard && (
            <AutoReadCard>
              <AutoReadToggle>
                <Switch value={switchValue} onValueChange={setSwitchValue} />
              </AutoReadToggle>
            </AutoReadCard>
          )}
          <Content
            ref={scroll}
            onLayout={onLayout}
            onContentSizeChange={onContentSizeChange}
            onScroll={onScroll}
            scrollEventThrottle={16}
          >
            <MessagesContent>
              <MessageList
                messages={messages}
                currentUserId={user.userId}
                tripReference={trip.tripReference}
                speakUnicMessage={speakUnicMessage}
                onRetryMessage={sendTextMessage}
                onFavoriteMessage={favoriteMessage}
              />
            </MessagesContent>
          </Content>

          {showScrollToBottom && (
            <ScrollToBottomButton
              offsetBottom={footerHeight + RFValue(16)}
              onPress={() => scrollToEnd()}
              activeOpacity={0.8}
            >
              <Ionicons name="arrow-down" size={20} color={theme.colors.primaryText} />
            </ScrollToBottomButton>
          )}

          {footerReady && (
            <Footer
              tripReference={trip.tripReference}
              userId={user.userId}
              quickMessages={quickMessages}
              scrollToEnd={scrollToEnd}
              onSendMessage={sendTextMessage}
              onLayoutChange={setFooterHeight}
            />
          )}
        </InnerContainer>
      ) : (
        <LoadView />
      )}
    </Container>
  );
}
