import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { LoginValidationMiddleware } from 'src/middlewares/login-validation.middleware';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './strategies/jwt.strategy';
import { ApiKeyStrategy } from './strategies/apikey.strategy';
import { ClientModule } from 'src/client/client.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    PassportModule,
    ClientModule,
    ConfigModule.forRoot({ isGlobal: true }),
    JwtModule.register({
    secret: process.env.JWT_SECRET,
    signOptions: { expiresIn: '16h' }
    })
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, ApiKeyStrategy],
  exports: [AuthService]
})
export class AuthModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoginValidationMiddleware).forRoutes('login');
  }
}
