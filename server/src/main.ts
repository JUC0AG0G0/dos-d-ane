import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import type { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module.js';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const config = app.get(ConfigService);

  app.setGlobalPrefix('api');
  // Derrière un proxy (réseau local ou Docker), l'IP du client est lue dans
  // X-Forwarded-For. Les adresses publiques ne sont pas crues.
  app.set('trust proxy', 'loopback, linklocal, uniquelocal');
  // Valide les corps de requête d'après les DTO ; refuse les champs inconnus.
  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }),
  );
  app.enableCors({
    origin: config
      .get<string>('CORS_ORIGINS', '')
      .split(',')
      .map((o) => o.trim())
      .filter(Boolean),
    // Permet au front de lire la nouvelle expiration de la session.
    exposedHeaders: ['X-Session-Expires-At'],
  });
  app.enableShutdownHooks();

  // Swagger : interface sur /api/docs, schéma OpenAPI sur /api/docs-json.
  // Désactivé en production sauf si SWAGGER_ENABLED=true.
  const swaggerEnabled =
    config.get<string>('APP_ENV') !== 'production' ||
    config.get<string>('SWAGGER_ENABLED') === 'true';
  if (swaggerEnabled) {
    const document = SwaggerModule.createDocument(
      app,
      new DocumentBuilder()
        .setTitle("Dos d'âne API")
        .setVersion(process.env.APP_VERSION ?? 'dev')
        .addBearerAuth({
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'accessToken renvoyé par /api/auth/login',
        })
        .build(),
    );
    SwaggerModule.setup('api/docs', app, document, {
      swaggerOptions: { persistAuthorization: true },
    });
  }

  await app.listen(config.get<number>('PORT', 3000));
}
await bootstrap();
