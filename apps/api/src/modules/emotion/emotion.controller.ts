import { Body, Controller, Param, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { EmotionService } from './emotion.service';

@ApiTags('emotion')
@Controller('emotion')
export class EmotionController {
  constructor(private readonly emotionService: EmotionService) {}

  @Post(':userId/estimate')
  @ApiOperation({ summary: 'Estimate the emotional state of a user' })
  estimate(@Param('userId') userId: string, @Body() payload: Record<string, any>) {
    return this.emotionService.estimate(userId, payload);
  }
}
