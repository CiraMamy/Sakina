import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { PrismaService } from '../../prisma/prisma.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Audit')
@UseGuards(JwtAuthGuard)
@Controller('audit')
export class AuditController {
  constructor(private readonly prisma: PrismaService) {}

  @Get('events')
  @ApiOperation({ summary: 'List recent audit events for current user' })
  async listEvents(@CurrentUser() user: any) {
    return this.prisma.auditEvent.findMany({
      where: { actorUserId: user.sub },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
  }
}
