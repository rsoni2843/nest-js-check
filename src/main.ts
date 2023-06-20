import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { logger } from './utils/service-logger';
import config from './config/env';
import cookieParser from 'cookie-parser';
import constant from './config/constant';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
  const appPort = config.app.port;

  app.enableCors({
    origin: (origin, cb) => {
      cb(null, true);
    },
    credentials: true,
  });
  await app.listen(appPort || 3000);
  logger.info('Pricing Calculator started on: ' + appPort);
}
bootstrap();
