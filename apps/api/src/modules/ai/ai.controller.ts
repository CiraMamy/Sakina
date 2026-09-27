import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

class AIRequestDto {
  prompt: string;
  context?: Record<string, any>;
}

@ApiTags('AI')
@UseGuards(JwtAuthGuard)
@Controller('ai')
export class AiController {
  @Post('route')
  @ApiOperation({ summary: 'Route a prompt through the AI model gateway abstraction' })
  route(@CurrentUser() user: any, @Body() dto: AIRequestDto) {
    const prompt = (dto.prompt || '').trim();

    return {
      userId: user.sub,
      provider: 'local-strategy',
      mode: 'safe-proxy',
      result: {
        summary: `AI request accepted for prompt length ${prompt.length}. Model routing is abstracted and safety-first.`,
        confidence: 0.72,
        requiresReview: prompt.toLowerCase().includes('diagnostic') || prompt.toLowerCase().includes('suicide'),
      },
      context: dto.context || {},
      timestamp: new Date().toISOString(),
    };
  }
}
