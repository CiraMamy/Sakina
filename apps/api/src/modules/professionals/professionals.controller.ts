import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { PrismaService } from '../../prisma/prisma.service';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

class CreateProfessionalDto {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  role: string;
  specialties: string[];
  country: string;
  city?: string;
  languagesSpoken: string[];
  remoteAvailable?: boolean;
  costPerSession?: number;
}

@ApiTags('Professionals')
@UseGuards(JwtAuthGuard)
@Controller('professionals')
export class ProfessionalsController {
  constructor(private readonly prisma: PrismaService) {}

  @Get('directory')
  @ApiOperation({ summary: 'List verified professionals' })
  async listDirectory() {
    return this.prisma.professional.findMany({
      where: { isVerified: true, isActive: true },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        role: true,
        specialties: true,
        country: true,
        languagesSpoken: true,
        remoteAvailable: true,
        costPerSession: true,
      },
    });
  }

  @Post('register')
  @ApiOperation({ summary: 'Register as a professional' })
  async register(@Body() dto: CreateProfessionalDto) {
    return this.prisma.professional.create({
      data: {
        firstName: dto.firstName,
        lastName: dto.lastName,
        email: dto.email,
        phone: dto.phone || null,
        role: dto.role,
        specialties: dto.specialties,
        country: dto.country,
        city: dto.city || null,
        languagesSpoken: dto.languagesSpoken,
        remoteAvailable: dto.remoteAvailable ?? false,
        costPerSession: dto.costPerSession ?? null,
        isVerified: false,
      },
    });
  }
}
