import type { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

/**
 * Schéma OpenAPI de l'API : servi par Swagger (/api/docs) et écrit dans
 * server/openapi.json et server/ROUTES.md par `task api:docs`.
 */
export function createOpenApiDocument(app: INestApplication) {
  return SwaggerModule.createDocument(
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
}
