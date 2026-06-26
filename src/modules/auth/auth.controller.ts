import { Body, Controller, Post } from '@nestjs/common';
import { AuthService, loginProps } from './auth.service';
import { CreateAccountDto } from './dto/register.dto';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
    ){}

    @Post('register')
    registerUser(@Body() userPayload: CreateAccountDto){
        return this.authService.register(userPayload);
    }

    @Post('login')
    login(@Body() body: loginProps){
        return this.authService.login(body);
    }
}
