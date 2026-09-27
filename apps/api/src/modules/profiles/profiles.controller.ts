import { Body, Controller, Get, Put, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { PrismaService } from '../../prisma/prisma.service';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

class UpdateProfileDto {
  country?: string;
  language?: string;
  timezone?: string;
  gender?: string;
  accessibility?: Record<string, any>;
}

@ApiTags('Profiles')
@UseGuards(JwtAuthGuard)
@Controller('profiles')
export class ProfilesController {
  constructor(private readonly prisma: PrismaService) {}

  @Get('me')
  @ApiOperation({ summary: 'Get current user profile' })
  async getMyProfile(@CurrentUser() user: any) {
    return this.prisma.profile.findUnique({ where: { userId: user.sub } });
  }

  @Put('me')
  @ApiOperation({ summary: 'Update current user profile' })
  async updateMyProfile(@CurrentUser() user: any, @Body() dto: UpdateProfileDto) {
    return this.prisma.profile.upsert({
      where: { userId: user.sub },
      create: {
        userId: user.sub,
        country: dto.country,
        language: dto.language || 'fr',
        timezone: dto.timezone || 'UTC',
        gender: dto.gender,
        accessibility: dto.accessibility || {},
      },
      update: {
        country: dto.country,
        language: dto.language,
        timezone: dto.timezone,
        gender: dto.gender,
        accessibility: dto.accessibility,
      },
    });
  }
}
