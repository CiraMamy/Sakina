import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

class SafetyCheckDto {
  text: string;
}

@ApiTags('Safety')
@UseGuards(JwtAuthGuard)
@Controller('safety')
export class SafetyController {
  @Post('evaluate')
  @ApiOperation({ summary: 'Evaluate a user message against the safety policy' })
  evaluate(@CurrentUser() user: any, @Body() dto: SafetyCheckDto) {
    const content = (dto.text || '').toLowerCase();

    const riskMap = {
      suicide: /suicid|me tuer|je veux mourir|en finir|plus envie de vivre/i,
      selfHarm: /me faire du mal|me couper|automutilation|je me blesse/i,
      violence: /je me fais battre|il me frappe|violence conjugale|j'ai peur de rentrer/i,
    };

    const detected = Object.entries(riskMap).find(([, pattern]) => pattern.test(content));

    return {
      userId: user.sub,
      riskLevel: detected ? 'HIGH' : 'LOW',
      signal: detected ? detected[0] : 'NONE',
      confidence: detected ? 0.86 : 0.18,
      recommendation: detected
        ? 'Escalate to a human support workflow and provide emergency resources.'
        : 'Continue supportive chat and evaluate context.',
      timestamp: new Date().toISOString(),
    };
  }
}
