import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@ApiTags('Health')
@UseGuards(JwtAuthGuard)
@Controller('health')
export class HealthController {
  @Get()
  @ApiOperation({ summary: 'Health check endpoint' })
  async check() {
    return {
      status: 'ok',
      service: 'sakina-api',
      timestamp: new Date().toISOString(),
    };
  }
}
