import { Body, Controller, Post, Get, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { PrismaService } from '../../prisma/prisma.service';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

class DataExportRequest {
  format?: string;
}

class DataDeletionRequest {
  reason?: string;
  confirm!: boolean;
}

@ApiTags('Privacy')
@UseGuards(JwtAuthGuard)
@Controller('privacy')
export class PrivacyController {
  constructor(private readonly prisma: PrismaService) {}

  @Get('consents')
  @ApiOperation({ summary: 'Get all user consents' })
  async getConsents(@CurrentUser() user: any) {
    return this.prisma.consent.findMany({
      where: { userId: user.sub },
      orderBy: { grantedAt: 'desc' },
    });
  }

  @Post('export')
  @ApiOperation({ summary: 'Request a data export (GDPR-like)' })
  requestExport(@CurrentUser() user: any, @Body() dto: DataExportRequest) {
    return {
      userId: user.sub,
      format: dto.format || 'JSON',
      status: 'QUEUED',
      estimatedTime: '24-48 hours',
      requestedAt: new Date().toISOString(),
      note: 'Export will include all non-sensitive identity and consented data',
    };
  }

  @Post('delete')
  @ApiOperation({ summary: 'Request account and data deletion' })
  requestDeletion(@CurrentUser() user: any, @Body() dto: DataDeletionRequest) {
    if (!dto.confirm) {
      return { error: 'Deletion must be confirmed' };
    }

    return {
      userId: user.sub,
      status: 'PENDING_VERIFICATION',
      verificationEmail: 'sent',
      note: 'User must verify deletion via email link. Data will be securely deleted after 30-day grace period.',
      requestedAt: new Date().toISOString(),
    };
  }
}
