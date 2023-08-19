import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ConfigService } from './config';
import { ValidationPipe } from '@nestjs/common';
import { json, urlencoded } from 'express';
import { join } from 'path';
import { DeploymentEnvironmentTypes } from './shared/enums/environment-types.enum';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  // const app = await NestFactory.create(AppModule);
  // await app.listen(3000);

  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const configService = app.get<ConfigService>(ConfigService);

  app.set('trust proxy');

  // Configuration for the size of the payload coming from FE
  app.use(json({ limit: '100mb' }));
  app.use(urlencoded({ extended: true, limit: '100mb' }));

  // Enable cors
  app.enableCors();

  // Apply global pipe for incoming data validation
  app.useGlobalPipes(
    new ValidationPipe({
      disableErrorMessages:
        configService.getEnvironment() ===
        DeploymentEnvironmentTypes.Production,
      transform: true,
      forbidNonWhitelisted: true,
      whitelist: true, // Strip away any properties that don't belong to the DTO
    }),
  );

  // Set the assets directory
  app.useStaticAssets(join(__dirname, '..', 'public'));

  // Swagger configuration for API documentation
  const options = new DocumentBuilder()
    .setTitle('BE Assessment kwanso')
    .setBasePath('api')
    .setDescription('Official documentation for kwanso API Assessment')
    .setVersion('1.0.0')
    .addBearerAuth({ type: 'http', bearerFormat: 'JWT', scheme: 'bearer' })
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('docs', app, document);

  // Finally expose the port given in .env file for listening to the connections
  await app.listen(configService.getPort());
}
bootstrap();
