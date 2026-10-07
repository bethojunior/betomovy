// middleware/socketMonitor.ts
import { pulse } from '../../pulse';
import { Socket } from 'socket.io-client';

interface MonitorSocketOptions {
  context?: string; // nome para diferenciar no Pulse (ex: 'driver-socket')
  userId?: string | number;
}

export const monitorSocket = (
  socket: Socket,
  options: MonitorSocketOptions = {}
) => {
  const context = options.context || 'socket';

  socket.on('connect', () => {
    pulse.send('info', `Socket conectado: ${socket.id} (user ${options.userId ?? '-'})`, context);
  });

  socket.on('disconnect', (reason) => {
    pulse.send('warn', `Socket desconectado: ${reason}`, context);
  });

  socket.on('connect_error', (err) => {
    pulse.send('error', `Erro de conexão: ${err?.message || JSON.stringify(err)}`, context);
  });

  socket.on('error', (err) => {
    pulse.send('error', `Erro no socket: ${JSON.stringify(err)}`, context);
  });
};
