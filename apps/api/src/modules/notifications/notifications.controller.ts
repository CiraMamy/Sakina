import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

class SendNotificationDto {
  type: string;
  title: string;
  message: string;
  channel?: string;
  scheduledFor?: Date;
}

@ApiTags('Notifications')
@UseGuards(JwtAuthGuard)
@Controller('notifications')
export class NotificationsController {
  @Post('send')
  @ApiOperation({ summary: 'Send a notification (abstracted provider)' })
  send(@CurrentUser() user: any, @Body() dto: SendNotificationDto) {
    const channel = dto.channel || 'PUSH';

    return {
      userId: user.sub,
      type: dto.type,
      title: dto.title,
      message: dto.message,
      channel,
      status: 'QUEUED',
      provider: 'abstracted-notification-gateway',
      scheduledFor: dto.scheduledFor || new Date(),
      timestamp: new Date().toISOString(),
      note: 'Actual delivery depends on configured provider (push, email, SMS, WhatsApp, Telegram)',
    };
  }
}
