import { Injectable, BadRequestException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AuthorizationService {
  constructor(private readonly prisma: PrismaService) {}

  async checkResourceOwnership(userId: string, resourceId: string, resourceType: string): Promise<boolean> {
    const mappings: Record<string, string> = {
      'conversation': 'userId',
      'journal_entry': 'userId',
      'emotion_checkin': 'userId',
      'memory_record': 'userId',
    };

    if (!mappings[resourceType]) {
      throw new BadRequestException('Unknown resource type');
    }

    // This is a placeholder; actual implementation checks ownership in database
    return true;
  }

  async checkRolePermission(userId: string, requiredRole: string): Promise<boolean> {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new ForbiddenException('User not found');

    const roleHierarchy: Record<string, number> = {
      'USER': 1,
      'PROFESSIONAL': 2,
      'SUPPORT_AGENT': 3,
      'ORGANIZATION_ADMIN': 4,
      'CLINICAL_ADVISOR': 5,
      'RESEARCHER': 6,
      'SUPER_ADMIN': 7,
    };

    return (roleHierarchy[user.role] || 0) >= (roleHierarchy[requiredRole] || 0);
  }
}
