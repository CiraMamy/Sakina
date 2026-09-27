import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { PrismaService } from '../../prisma/prisma.service';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

class CreateEmotionCheckinDto {
  moodLabel?: string;
  valence?: number;
  arousal?: number;
  dominance?: number;
  confidence?: number;
  uncertainty?: number;
  context?: Record<string, any>;
}

@ApiTags('Emotions')
@UseGuards(JwtAuthGuard)
@Controller('emotions')
export class EmotionsController {
  constructor(private readonly prisma: PrismaService) {}

  @Get('history')
  @ApiOperation({ summary: 'List emotional check-ins' })
  async list(@CurrentUser() user: any) {
    return this.prisma.emotionCheckin.findMany({
      where: { userId: user.sub },
      orderBy: { createdAt: 'desc' },
      take: 30,
    });
  }

  @Post('checkin')
  @ApiOperation({ summary: 'Create an emotion check-in' })
  async checkin(@CurrentUser() user: any, @Body() dto: CreateEmotionCheckinDto) {
    return this.prisma.emotionCheckin.create({
      data: {
        userId: user.sub,
        moodLabel: dto.moodLabel || 'unknown',
        valence: dto.valence ?? null,
        arousal: dto.arousal ?? null,
        dominance: dto.dominance ?? null,
        confidence: dto.confidence ?? 0.5,
        uncertainty: dto.uncertainty ?? 0.5,
        context: dto.context || {},
      },
    });
  }

  @Get('summary')
  @ApiOperation({ summary: 'Generate a simple affect summary' })
  async summary(@CurrentUser() user: any) {
    const items = await this.prisma.emotionCheckin.findMany({
      where: { userId: user.sub },
      orderBy: { createdAt: 'desc' },
      take: 15,
    });

    const avgArousal = items.length ? items.reduce((sum, item) => sum + (item.arousal ?? 0), 0) / items.length : 0;
    const avgValence = items.length ? items.reduce((sum, item) => sum + (item.valence ?? 0), 0) / items.length : 0;

    return {
      userId: user.sub,
      count: items.length,
      averageValence: Number(avgValence.toFixed(2)),
      averageArousal: Number(avgArousal.toFixed(2)),
      dominantLabel: items[0]?.moodLabel || 'unknown',
      confidence: items[0]?.confidence ?? 0.5,
      uncertainty: items[0]?.uncertainty ?? 0.5,
      generatedAt: new Date().toISOString(),
    };
  }
}
