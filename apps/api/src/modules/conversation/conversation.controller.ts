import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ConversationService } from './conversation.service';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { CreateMessageDto } from './dto/create-message.dto';

@ApiTags('conversations')
@Controller('conversations')
export class ConversationController {
  constructor(private readonly conversationService: ConversationService) {}

  @Get(':userId')
  @ApiOperation({ summary: 'List conversations for a user' })
  findAll(@Param('userId') userId: string) {
    return this.conversationService.findAll(userId);
  }

  @Post()
  @ApiOperation({ summary: 'Create a conversation' })
  create(@Body() dto: CreateConversationDto) {
    return this.conversationService.create(dto);
  }

  @Post(':conversationId/messages')
  @ApiOperation({ summary: 'Create a message in a conversation' })
  addMessage(
    @Param('conversationId') conversationId: string,
    @Body() dto: CreateMessageDto,
  ) {
    return this.conversationService.addMessage(conversationId, dto);
  }
}
