import { Body, Controller, Param, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { SafetyService } from './safety.service';

@ApiTags('safety')
@Controller('safety')
export class SafetyController {
  constructor(private readonly safetyService: SafetyService) {}

  @Post(':userId/assess')
  @ApiOperation({ summary: 'Run a safety assessment for the user context' })
  assess(@Param('userId') userId: string, @Body() payload: Record<string, any>) {
    return this.safetyService.assess(userId, payload);
  }
}
