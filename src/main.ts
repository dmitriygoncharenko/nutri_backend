import "dotenv/config";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app/app.module";
import { initializeTransactionalContext } from "typeorm-transactional";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

const PORT = process.env.PORT;

async function bootstrap() {
  initializeTransactionalContext();
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.setGlobalPrefix("api/v1.0");
  const options = new DocumentBuilder()
    .setTitle("NUTRI API")
    .setDescription("NUTRI backend API.")
    .setVersion("1.0")
    .addBearerAuth(
      { type: "http", scheme: "bearer", bearerFormat: "JWT" },
      "AUTH"
    )
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup("api", app, document);

  await app.listen(PORT);
  console.log(`The application is running: http://localhost:${PORT}/api`);
}
bootstrap();
