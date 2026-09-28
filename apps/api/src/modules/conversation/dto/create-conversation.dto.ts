import { IsEnum, IsNotEmpty, IsString, IsUUID } from 'class-validator';

export enum MessageRole {
  USER = 'user',
  ASSISTANT = 'assistant',
  SYSTEM = 'system',
}

export class CreateConversationDto {
  @IsUUID()
  userId: string;

  @IsString()
  @IsNotEmpty()
  title?: string;
}

export class CreateMessageDto {
  @IsUUID()
  conversationId?: string;

  @IsEnum(MessageRole)
  role: MessageRole;

  @IsString()
  @IsNotEmpty()
  content: string;
}
