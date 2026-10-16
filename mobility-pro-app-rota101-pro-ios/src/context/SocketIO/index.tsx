import { createContext, useContext, useEffect, useState, ReactNode, useMemo, useCallback } from 'react';
import { Platform } from 'react-native';
import { SocketConnection } from '../../common/services/socket';
import { useAuth } from '../auth';
import { BubbleButton } from '@704apps/react-native-bubble-button';

interface SocketContextProps {
  socket: SocketIOClient.Socket | null;
}

export const SocketContextInstance = createContext<SocketContextProps>({ socket: null });

interface SocketProviderProps {
  children: ReactNode;
}

export const SocketProvider = ({ children }: SocketProviderProps) => {
  const [socket, setSocket] = useState<SocketIOClient.Socket | null>(null);
  const { user, userDriver, isDriver } = useAuth();

  const socketConnection = useMemo(() => SocketConnection.getInstance(), []);

  const auth = useMemo(() => {
    if (isDriver && userDriver?.idDriver) {
      return { driverId: userDriver.idDriver, name: userDriver.nameUser };
    }
    if (!isDriver && user?.idUser) {
      return { userId: user.idUser, name: user.nameUser };
    }
    return null;
  }, [userDriver?.idDriver, user?.idUser, isDriver]);

  const connectNativeSocket = useCallback(() => {
    if (!isDriver || Platform.OS !== 'android') return;

    const name = `${auth.name} - Bubble`;

    const queryParams = new URLSearchParams({ ...auth, name }).toString();

    const url = `${socketConnection.getUrl()}?${queryParams}`;

    BubbleButton.connectSocket(url);
  }, [isDriver, socketConnection, auth]);

  const disconnectNativeSocket = useCallback(() => {
    if (Platform.OS !== 'android') return;

    BubbleButton.disconnectSocket();
  }, []);

  useEffect(() => {
    if (!auth) {
      socketConnection.disconnect();
      disconnectNativeSocket();
      setSocket(null);
      return;
    }

    if (socket?.connected) return;

    const newSocket = socketConnection.connect(auth);

    newSocket.on('connect', () => {
      newSocket.emit('join-room', auth);
    });

    setSocket(newSocket);

    connectNativeSocket();

    return () => {
      socketConnection.disconnect();
      setSocket(null);
    };
  }, [auth, socketConnection, connectNativeSocket, disconnectNativeSocket]);

  return (
    <SocketContextInstance.Provider value={{ socket }}>
      {children}
    </SocketContextInstance.Provider>
  );
};

export const useSocket = () => {
  const context = useContext(SocketContextInstance);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};
