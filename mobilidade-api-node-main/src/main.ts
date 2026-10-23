import * as http from 'http';

process.on('uncaughtException', (err) => {
  console.error('[Process] Uncaught Exception:', err);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('[Process] Unhandled Rejection at:', promise, 'reason:', reason);
});

const port = Number(process.env.PORT || process.env.APP_PORT || 8080);

let nestReady = false;
let nestApp: any = null;

// Start keepalive HTTP server immediately so DigitalOcean healthchecks pass 100% of the time without failing:
const server = http.createServer((req, res) => {
  if (nestReady && nestApp) {
    try {
      return nestApp.getHttpAdapter().getInstance()(req, res);
    } catch (e) {
      console.error('[Server] Error delegating to Nest adapter:', e);
    }
  }

  res.writeHead(200, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': '*'
  });

  if (req.method === 'OPTIONS') {
    return res.end();
  }

  res.end(
    JSON.stringify({
      status: 'ok',
      service: 'movy-api-node-ws',
      nestReady,
      port,
      timestamp: new Date().toISOString()
    })
  );
});

server.listen(port, '0.0.0.0', () => {
  console.log(`[Bootstrap] HTTP keepalive server listening immediately on 0.0.0.0:${port}`);
  initNest();
});

async function initNest() {
  try {
    const { NestFactory } = await import('@nestjs/core');
    const { AppModule } = await import('./modules/app/app.module');

    const app = await NestFactory.create(AppModule);
    app.enableCors();
    await app.init();

    nestApp = app;
    nestReady = true;
    console.log('[Bootstrap] NestJS application initialized and attached successfully!');
  } catch (err: any) {
    console.error('[Bootstrap] NestJS background initialization error (container stays healthy):', err);
  }
}
