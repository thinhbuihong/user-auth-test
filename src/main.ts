import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService: ConfigService = app.get(ConfigService);
  app.enableCors({});

  // Swagger configuration
  const config = new DocumentBuilder()
    .setTitle('User Authentication API')
    .setDescription('The User Authentication API description')
    .setVersion('1.0')
    .addTag('auth')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  const port = configService.get('NODE_PORT') || 4000;
  await app.listen(port);

  console.log('Server is running');
  console.log(`Swagger UI available at: ${process.env.SERVER_URL}/docs`);
}
bootstrap();
