import { Body, Controller, Get, Post, Put, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { PrismaService } from '../../prisma/prisma.service';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

class CreateConsentDto {
  type!: string;
  version!: string;
  purpose!: string;
  legalBasis?: string;
  source?: string;
  metadata?: Record<string, any>;
}

@ApiTags('Consents')
@UseGuards(JwtAuthGuard)
@Controller('consents')
export class ConsentsController {
  constructor(private readonly prisma: PrismaService) {}

  @Get('me')
  @ApiOperation({ summary: 'List user consents' })
  async getMyConsents(@CurrentUser() user: any) {
    return this.prisma.consent.findMany({
      where: { userId: user.sub },
      orderBy: { grantedAt: 'desc' },
    });
  }

  @Post('me')
  @ApiOperation({ summary: 'Create or update a consent record' })
  async createConsent(@CurrentUser() user: any, @Body() dto: CreateConsentDto) {
    return this.prisma.consent.create({
      data: {
        userId: user.sub,
        type: dto.type,
        version: dto.version,
        purpose: dto.purpose,
        legalBasis: dto.legalBasis,
        source: (dto.source as any) || 'WEB',
        metadata: dto.metadata || {},
      },
    });
  }

  @Put('me/:id/revoke')
  @ApiOperation({ summary: 'Revoke a consent' })
  async revokeConsent(@CurrentUser() user: any, @Body('reason') reason?: string) {
    const consent = await this.prisma.consent.findFirst({
      where: { userId: user.sub },
      orderBy: { grantedAt: 'desc' },
    });

    if (!consent) {
      return { revoked: false };
    }

    return this.prisma.consent.update({
      where: { id: consent.id },
      data: {
        status: 'REVOKED',
        revokedAt: new Date(),
        metadata: { ...(consent.metadata as any), revokeReason: reason || 'user_action' },
      },
    });
  }
}
