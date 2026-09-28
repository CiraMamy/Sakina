import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { SafetyService } from './safety.service';
import { AuthGuard } from '../../common/guards/auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('safety')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('safety')
export class SafetyController {
  constructor(private readonly safetyService: SafetyService) {}

  @Post(':userId/assess')
  @ApiOperation({ summary: 'Run a safety assessment' })
  assess(@Param('userId') userId: string, @Body() payload: Record<string, any>) {
    return this.safetyService.assess(userId, payload);
  }

  @Get(':userId/alerts')
  @ApiOperation({ summary: 'Get safety alerts for a user' })
  getAlerts(
    @Param('userId') userId: string,
    @Query('skip') skip?: string,
    @Query('take') take?: string,
  ) {
    return this.safetyService.getAlertsByUser(
      userId,
      Number(skip) || 0,
      Number(take) || 20,
    );
  }
}
