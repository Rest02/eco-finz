import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  console.log("DATABASE_URL:", process.env.DATABASE_URL);
  const app = await NestFactory.create(AppModule);

  // Enable global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  app.enableCors({
    origin: true, // Permite cualquier origen o refleja el origen de la petición (ideal para Vercel + Local)
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  // --- CONFIGURACIÓN DE SWAGGER ---
  const config = new DocumentBuilder()
    .setTitle('EcoFinz API')
    .setDescription('Documentación interactiva de la API de gestión financiera EcoFinz')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Ingresa tu token JWT',
        in: 'header',
      },
      'JWT-auth', // Nombre del esquema de seguridad para usar en controladores
    )
    .addTag('Auth', 'Endpoints de autenticación y registro')
    .addTag('Finance', 'Endpoints de transacciones, presupuestos y cuentas')
    .addTag('Users', 'Endpoints de administración de usuarios')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true, // Mantiene el token JWT guardado incluso al recargar la página
    },
  });
  // ---------------------------------

  await app.listen(process.env.PORT ?? 3001);
  console.log(`Application is running on port ${process.env.PORT ?? 3001}`);
  console.log(`Swagger documentation available at http://localhost:${process.env.PORT ?? 3001}/docs`);
}
bootstrap();
