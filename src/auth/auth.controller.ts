import { Controller, Get, UseGuards, Req, Res, Post } from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { GoogleAuthGuard } from '../guards/google-auth.guard';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { User } from '../entities/user.entity';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { AuthResponseDto, UserProfileDto } from './dto/auth-response.dto';

interface AuthenticatedRequest extends Request {
  user: User;
}

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // Google OAuth2 login
  @Get('google/login')
  @UseGuards(GoogleAuthGuard)
  @ApiOperation({ summary: 'Initiate Google OAuth2 login' })
  @ApiResponse({ status: 302, description: 'Redirects to Google OAuth2' })
  async googleAuth(@Req() req) {}

  // Google OAuth2 callback
  @Get('google/callback')
  @UseGuards(GoogleAuthGuard)
  @ApiOperation({
    summary: 'Google OAuth2 callback',
  })
  @ApiResponse({
    status: 200,
    description: 'Login successful, returns access_token and user info',
  })
  @ApiResponse({ status: 500, description: 'Authentication failed' })
  @ApiQuery({
    name: 'code',
    required: true,
    description: 'Authorization code returned by Google',
    type: String,
  })
  async googleAuthRedirect(@Req() req: AuthenticatedRequest) {
    return this.authService.login(req.user);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiResponse({
    status: 200,
    description: 'Current user profile',
    type: UserProfileDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getCurrentUser(@Req() req: AuthenticatedRequest) {
    return {
      id: req.user.id,
      email: req.user.email,
      firstName: req.user.firstName,
      lastName: req.user.lastName,
    };
  }
}
