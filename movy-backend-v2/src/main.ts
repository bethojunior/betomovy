import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({ origin: '*' });

  const port = process.env.PORT || 8080;
  await app.listen(port);
  console.log(`[MOVY V2 API & Realtime Gateway] Listening on port ${port} (US/BR Multi-Currency Engine Ready)`);
}
bootstrap();
