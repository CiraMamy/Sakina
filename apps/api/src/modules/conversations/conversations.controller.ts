import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { PrismaService } from '../../prisma/prisma.service';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

class CreateConversationDto {
  title?: string;
}

@ApiTags('Conversations')
@UseGuards(JwtAuthGuard)
@Controller('conversations')
export class ConversationsController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  @ApiOperation({ summary: 'List conversations for current user' })
  async list(@CurrentUser() user: any) {
    return this.prisma.conversation.findMany({
      where: {
        participants: {
          some: { userId: user.sub },
        },
      },
      include: {
        participants: true,
        messages: { take: 10, orderBy: { createdAt: 'desc' } },
      },
    });
  }

  @Post()
  @ApiOperation({ summary: 'Create a conversation' })
  async create(@CurrentUser() user: any, @Body() dto: CreateConversationDto) {
    return this.prisma.conversation.create({
      data: {
        title: dto.title || 'Nouvelle conversation',
        participants: {
          create: [{ userId: user.sub, role: 'USER' }],
        },
      },
      include: { participants: true },
    });
  }
}
