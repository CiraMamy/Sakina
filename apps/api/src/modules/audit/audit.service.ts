import { Injectable } from '@nestjs/common';

@Injectable()
export class AuditService {
  async findByUser(userId: string) {
    return {
      userId,
      items: [
        {
          action: 'login',
          resourceType: 'user',
          success: true,
          createdAt: new Date().toISOString(),
        },
      ],
      message: 'Audit module ready for append-only security event storage.',
    };
  }
}
