import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { PrismaService } from '../../prisma/prisma.service';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

class CreateWellnessLogDto {
  type?: string;
  title?: string;
  value?: number;
  note?: string;
}

@ApiTags('Wellness')
@UseGuards(JwtAuthGuard)
@Controller('wellness')
export class WellnessController {
  constructor(private readonly prisma: PrismaService) {}

  @Get('logs')
  @ApiOperation({ summary: 'List wellness logs' })
  async list(@CurrentUser() user: any) {
    return this.prisma.wellnessLog.findMany({
      where: { userId: user.sub },
      orderBy: { createdAt: 'desc' },
      take: 30,
    });
  }

  @Post('logs')
  @ApiOperation({ summary: 'Create a wellness log' })
  async create(@CurrentUser() user: any, @Body() dto: CreateWellnessLogDto) {
    return this.prisma.wellnessLog.create({
      data: {
        userId: user.sub,
        type: dto.type || 'exercise',
        title: dto.title || 'Wellness activity',
        value: dto.value ?? null,
        note: dto.note || null,
      },
    });
  }
}
