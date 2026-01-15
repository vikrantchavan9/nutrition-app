import {
    Body,
    Controller,
    Get,
    Post,
    Req,
    Res,
    UseGuards,
} from '@nestjs/common';

import type { AuthRequest } from './types/auth-request.type';

import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { GoogleAuthGuard } from './guards/google-auth.guard';


@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('register')
    register(@Body() dto: RegisterDto) {
        return this.authService.register(dto);
    }

    @Post('login')
    login(@Body() dto: LoginDto) {
        return this.authService.login(dto.email, dto.password);
    }

    @Get('google')
    @UseGuards(GoogleAuthGuard)
    async googleAuth() {
        // Initiates Google OAuth flow
        // Guard redirects to Google
    }

    @Get('google/callback')
    @UseGuards(GoogleAuthGuard)
    async googleAuthRedirect(@Req() req, @Res() res) {
        // Handle the OAuth callback
        const result = await this.authService.handleGoogleLogin(req.user);

        // Redirect to frontend with token
        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:4200';
        res.redirect(`${frontendUrl}/auth/callback?token=${result.accessToken}`);
    }

    @UseGuards(JwtAuthGuard)

    @Get('profile')
    getProfile(@Req() { user }: AuthRequest) {
        return user;
    }
}
