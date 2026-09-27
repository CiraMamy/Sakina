import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { PrismaService } from '../../prisma/prisma.service';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

class CreateMemoryRecordDto {
  memoryType?: string;
  summary: string;
  confidence?: number;
}

@ApiTags('Memory')
@UseGuards(JwtAuthGuard)
@Controller('memory')
export class MemoryController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  @ApiOperation({ summary: 'List memory records' })
  async list(@CurrentUser() user: any) {
    return this.prisma.memoryRecord.findMany({
      where: { userId: user.sub },
      orderBy: { createdAt: 'desc' },
      take: 20,
    });
  }

  @Post()
  @ApiOperation({ summary: 'Create a memory record' })
  async create(@CurrentUser() user: any, @Body() dto: CreateMemoryRecordDto) {
    return this.prisma.memoryRecord.create({
      data: {
        userId: user.sub,
        memoryType: dto.memoryType || 'insight',
        summary: dto.summary,
        confidence: dto.confidence ?? 0.5,
      },
    });
  }
}
