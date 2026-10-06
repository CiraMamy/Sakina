import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { SecurityHeadersMiddleware } from './common/middleware/security-headers.middleware';
import { RateLimitService } from './common/services/rate-limit.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api/v1');

  app.use(new SecurityHeadersMiddleware().use);

  const rateLimitService = new RateLimitService();
  app.use((req, res, next) => {
    const forwardedFor = req.headers['x-forwarded-for'];
    const clientKey = Array.isArray(forwardedFor)
      ? forwardedFor[0]
      : forwardedFor || req.socket?.remoteAddress || 'unknown-client';

    if (!rateLimitService.isAllowed(String(clientKey), 60, 60_000)) {
      res.status(429).json({ message: 'Too many requests. Please retry later.' });
      return;
    }

    next();
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      errorHttpStatusCode: 400,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('Sakina API')
    .setDescription('Digital Health backend for mental wellbeing and support workflows')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  app.enableCors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    credentials: true,
  });

  await app.listen(process.env.PORT || 3000);
}

bootstrap();
