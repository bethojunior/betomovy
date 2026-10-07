import { createContext, useContext, useEffect, useMemo, useState, ReactNode } from 'react';
import AppSocket from '../services/socket';
import Session from '../utils/Session';

interface SocketContextProps {
  socket: AppSocket | null;
  activeDrivers: any[];
}

const SocketContextInstance = createContext<SocketContextProps | undefined>(undefined);

interface SocketProviderProps {
  children: ReactNode;
}

export const SocketProvider = ({ children }: SocketProviderProps) => {
  const [activeDrivers, setDrivers] = useState<any[]>([]);
  const socket = useMemo(() => new AppSocket({
    query: {
      cityId: Session.getLocal("citySelected").cityId,
    },
  }), []);

  
  useEffect(() => {
    socket.on('driver.positions', (data) => {
      setDrivers(data);
    });

    return () => {
      socket.off('driver.positions');
      socket.disconnect();
    };
  }, [socket]);

  return (
    <SocketContextInstance.Provider value={{ socket, activeDrivers }}>
      {children}
    </SocketContextInstance.Provider>
  );
};

export const useSocket = (): SocketContextProps => {
  const context = useContext(SocketContextInstance);
  if (!context) {
    throw new Error("useSocket must be used within a SocketProvider");
  }
  return context;
};
