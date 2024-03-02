import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ValidationPipe, BadRequestException } from '@nestjs/common';
import * as express from 'express';

import { HttpExceptionFilter } from 'src/filter/http-exception.filter';

const kApiVersion = 1;
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.use(express.json({ limit: '1000mb' })); // Allow up to 1000 MB JSON request bodies
  app.use(express.raw({ limit: '1000mb' })); // Allow up to 1000 MB raw request bodies
  app.use(express.urlencoded({ limit: '1000mb' }));

  app.setGlobalPrefix(`api/v${kApiVersion}`);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      exceptionFactory: (errors) => {
        const result = errors
          .map((error) => {
            if (error.constraints) {
              const values = Object.values(error.constraints);
              return values.length > 0 ? values[0] + `(${error.property})` : '';
            } else if (error.children) {
              const subResult =
                error.children.map((subError) => {
                  if (subError.constraints) {
                    const values = Object.values(subError.constraints);
                    return values.length > 0
                      ? values[0] + `(${subError.property})`
                      : '';
                  }
                }) || [];
              return subResult.join(', ');
            }
          })
          .join(', ');
        return new BadRequestException(result);
      },
    }),
  );
  app.useGlobalFilters(new HttpExceptionFilter());
  const config = new DocumentBuilder()
    .setTitle('KuJung')
    .setDescription('KuJung API Application')
    .setVersion('v1')
    .addBearerAuth(
      {
        description: 'Enter token',
        name: 'Authorization',
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'bearer',
      },
      'Authorization',
    )
    .build();
  if (process.env.ENV !== 'production') {
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);
  }
  await app.listen(process.env.PORT || 3000);
}
bootstrap();
