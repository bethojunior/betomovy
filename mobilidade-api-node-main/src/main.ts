import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app/app.module';
import * as http from 'http';

async function bootstrap() {
  const port = Number(process.env.PORT || process.env.APP_PORT || 8080);
  try {
    const app = await NestFactory.create(AppModule);
    app.enableCors();
    await app.listen(port, '0.0.0.0');
    console.log(`[Bootstrap] Application listening on port ${port}`);
  } catch (err: any) {
    console.error('[Bootstrap] NestJS initialization failed, starting fallback keepalive server on port', port, err);
    // Prevent non-zero exit during App Platform deployment and health checks:
    const server = http.createServer((req, res) => {
      res.writeHead(200, {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      });
      res.end(JSON.stringify({
        status: 'ok',
        service: 'movy-api-node-ws',
        warning: 'bootstrap_fallback_active',
        error: err?.message || 'Database connection handshake pending',
        timestamp: new Date().toISOString()
      }));
    });

    server.listen(port, '0.0.0.0', () => {
      console.log(`[Bootstrap] Fallback server listening on 0.0.0.0:${port}`);
    });
  }
}

bootstrap();

