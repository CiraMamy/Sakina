import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { PrismaService } from '../../prisma/prisma.service';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

class CreateReferralDto {
  reason!: string;
  notes?: string;
}

@ApiTags('Referral')
@UseGuards(JwtAuthGuard)
@Controller('referrals')
export class ReferralController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  @ApiOperation({ summary: 'List referrals for current user' })
  async list(@CurrentUser() user: any) {
    return this.prisma.referral.findMany({
      where: { userId: user.sub },
      include: { professional: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  @Post()
  @ApiOperation({ summary: 'Create a referral request' })
  async create(@CurrentUser() user: any, @Body() dto: CreateReferralDto) {
    return this.prisma.referral.create({
      data: {
        userId: user.sub,
        reason: dto.reason,
        notes: dto.notes || null,
        userConsent: true,
        status: 'PENDING',
      },
    });
  }

  @Get('professionals')
  @ApiOperation({ summary: 'Search for professionals by criteria' })
  async searchProfessionals(
    @CurrentUser() user: any,
    @Body('country') country?: string,
    @Body('specialty') specialty?: string,
  ) {
    const where: any = { isVerified: true, isActive: true };
    if (country) where.country = country;
    if (specialty) where.specialties = { hasSome: [specialty] };

    return this.prisma.professional.findMany({
      where,
      select: {
        id: true,
        firstName: true,
        lastName: true,
        role: true,
        specialties: true,
        languagesSpoken: true,
        remoteAvailable: true,
        costPerSession: true,
      },
    });
  }
}
