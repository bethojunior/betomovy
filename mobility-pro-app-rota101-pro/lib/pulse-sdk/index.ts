type LogType = 'error' | 'warn' | 'info' | 'debug';

interface PulseConfig {
  app: string;
  groupId: string;
}

export class Pulse {
  private endpoint = 'https://api-pulse.704app.com.br/logs';
  private app: string;
  private groupId: string;
  private validTypes: LogType[] = ['error', 'warn', 'info', 'debug'];

  constructor(config: PulseConfig) {
    this.app = config.app;
    this.groupId = config.groupId;
  }

  public send(type: LogType, message: string, context: string): void {
    if (!this.validTypes.includes(type)) return;

    const payload = {
      type,
      message,
      app: this.app,
      context,
      groupId: this.groupId,
    };

    fetch(this.endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    }).catch((error) => {
      if (error instanceof TypeError) return;
      console.error('Error sending log to Pulse:', error);
    });
  }
}
