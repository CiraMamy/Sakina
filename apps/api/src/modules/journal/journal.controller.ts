import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { PrismaService } from '../../prisma/prisma.service';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

class CreateJournalEntryDto {
  title?: string;
  content: string;
  moodScore?: number;
  tags?: string[];
  context?: Record<string, any>;
}

@ApiTags('Journal')
@UseGuards(JwtAuthGuard)
@Controller('journal')
export class JournalController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  @ApiOperation({ summary: 'List journal entries for current user' })
  async list(@CurrentUser() user: any) {
    return this.prisma.journalEntry.findMany({
      where: { userId: user.sub },
      orderBy: { createdAt: 'desc' },
    });
  }

  @Post()
  @ApiOperation({ summary: 'Create a journal entry' })
  async create(@CurrentUser() user: any, @Body() dto: CreateJournalEntryDto) {
    return this.prisma.journalEntry.create({
      data: {
        userId: user.sub,
        title: dto.title || 'Journal entry',
        content: dto.content,
        moodScore: dto.moodScore ?? null,
        tags: dto.tags || [],
        context: dto.context || {},
      },
    });
  }
}
