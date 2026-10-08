import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  const port = process.env.PORT || process.env.APP_PORT || 8080;
  await app.listen(port, '0.0.0.0');
  console.log(`[Bootstrap] Application listening on port ${port}`);
}
bootstrap().catch((err) => {
  console.error('[Bootstrap] Fatal error:', err);
  process.exit(1);
});
