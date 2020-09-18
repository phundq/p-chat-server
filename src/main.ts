import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // swagger 
  const options = new DocumentBuilder()
  .setTitle('PChat Server')
  .setDescription('Server for PChat Application')
  .setVersion('1.0')
  .addTag('chats')
  .build();
const document = SwaggerModule.createDocument(app, options);
SwaggerModule.setup('swagger-ui', app, document);

  await app.listen(3000);
}
bootstrap();
