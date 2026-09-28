import { Injectable } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  async register(dto: RegisterDto) {
    return {
      message: 'User registration accepted for phase 1 scaffold.',
      user: {
        id: 'pending-user-id',
        email: dto.email,
        displayName: dto.displayName,
      },
      requiresVerification: true,
    };
  }

  async login(dto: LoginDto) {
    return {
      accessToken: 'placeholder-access-token',
      refreshToken: 'placeholder-refresh-token',
      tokenType: 'Bearer',
      user: {
        id: 'pending-user-id',
        email: dto.email,
      },
      message: 'Authentication scaffold ready for OIDC / Keycloak integration.',
    };
  }
}
