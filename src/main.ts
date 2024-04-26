import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { ValidationPipe } from '@nestjs/common'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import * as cookieParser from 'cookie-parser'

async function bootstrap() {
    const app = await NestFactory.create(AppModule)
    app.enableCors()
    app.useGlobalPipes(new ValidationPipe())
    app.use(cookieParser())

    const PORT = process.env.APP_PORT

    const config = new DocumentBuilder()
        .setTitle('API')
        .setVersion('1.0')
        .addBearerAuth(
            {
                type: 'http',
                scheme: 'bearer',
                bearerFormat: 'JWT',
                name: 'JWT',
                description: 'Enter JWT token',
                in: 'header',
            },
            'jwt'
        )
        .build()
    const document = SwaggerModule.createDocument(app, config)
    SwaggerModule.setup('api', app, document)

    await app.listen(PORT, () => console.log('Server started on PORT ' + PORT))
}
bootstrap()
