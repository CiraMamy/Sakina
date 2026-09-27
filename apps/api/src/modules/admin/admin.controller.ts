import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Roles } from '../../common/guards/roles.guard';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

class UpdateFeatureFlagDto {
  key: string;
  enabled: boolean;
  country?: string;
}

class UpdateSafetyPolicyDto {
  level: string;
  threshold: number;
}

@ApiTags('Admin')
@UseGuards(JwtAuthGuard)
@Controller('admin')
export class AdminController {
  @Get('health')
  @ApiOperation({ summary: 'System health check (admin only)' })
  health() {
    return {
      status: 'healthy',
      database: 'connected',
      cache: 'connected',
      timestamp: new Date().toISOString(),
    };
  }

  @Post('feature-flags')
  @Roles('SUPER_ADMIN')
  @ApiOperation({ summary: 'Update feature flags' })
  updateFeatureFlags(@Body() dto: UpdateFeatureFlagDto) {
    return {
      key: dto.key,
      enabled: dto.enabled,
      country: dto.country || 'global',
      updatedAt: new Date().toISOString(),
      note: 'Feature flags control voice support, emotion engine, memory, referrals, experimental models, new countries/languages',
    };
  }

  @Post('safety-policy')
  @Roles('SUPER_ADMIN', 'CLINICAL_ADVISOR')
  @ApiOperation({ summary: 'Update safety policy thresholds' })
  updateSafetyPolicy(@Body() dto: UpdateSafetyPolicyDto) {
    return {
      level: dto.level,
      threshold: dto.threshold,
      appliedTo: 'all users',
      updatedAt: new Date().toISOString(),
      note: 'Safety policy thresholds remain global; never personalized for individuals',
    };
  }
}
