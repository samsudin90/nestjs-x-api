import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthUserDto } from './dto';

@Controller('auth')
export class AuthController {
    constructor (private authService : AuthService) {}
    
    @Post('signup')
    signUp(@Body() dto : AuthUserDto) {
        return this.authService.signUp(dto)
    }

    @Post('signin')
    signIn(@Body() dto : AuthUserDto) {
        return this.authService.signIn(dto)
    }
}
