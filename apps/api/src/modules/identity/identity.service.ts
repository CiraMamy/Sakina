import { Injectable } from '@nestjs/common';

@Injectable()
export class IdentityService {
  async findOne(userId: string) {
    return {
      userId,
      accountStatus: 'active',
      authProvider: 'oidc-keycloak',
      mfaEnabled: false,
      deviceSessions: 1,
      message: 'Identity module scaffold ready for Keycloak/OIDC integration.',
    };
  }
}
