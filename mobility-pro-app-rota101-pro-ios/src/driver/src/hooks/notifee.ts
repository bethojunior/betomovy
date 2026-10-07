import notifee, {AndroidImportance} from '@notifee/react-native';

interface MessageProps {
  title: string;
  body?: string;
}

export const useNotifee = () => {
  const requestPermission = async () => {
    // Request permissions (required for iOS)
    await notifee.requestPermission();
  };

  const createChannel = async ({id, name}: {id: string; name: string}) => {
    // Create a channel (required for Android)
    const channelId = await notifee.createChannel({
      id: id,
      name: name,
      importance: AndroidImportance.HIGH,
    });

    return channelId;
  };

  const sendNotification = async (message: MessageProps, channelId) => {
    await notifee.displayNotification({
      title: message?.title,
      body: message?.body,
      android: {
        channelId: channelId || 'initTrip',
        pressAction: {
          id: 'default',
        },
        importance: AndroidImportance.HIGH,
      },
    });
  };

  const pushNative = async (message: MessageProps) => {
    await requestPermission();

    const channelId = await createChannel({
      id: 'initTrip',
      name: 'Init Trip',
    });

    sendNotification(message, channelId);
  };

  return {
    pushNative,
  };
};
