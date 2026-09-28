import { Body, Controller, Get, Param, Post, Patch, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { ConsentService } from './consent.service';
import { CreateConsentDto } from './dto/create-consent.dto';
import { AuthGuard } from '../../common/guards/auth.guard';

@ApiTags('consent')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('consent')
export class ConsentController {
  constructor(private readonly consentService: ConsentService) {}

  @Get('/:userId/:consentType')
  @ApiOperation({ summary: 'Get a specific consent for a user' })
  getConsent(@Param('userId') userId: string, @Param('consentType') consentType: string) {
    return this.consentService.getConsent(userId, consentType);
  }

  @Post()
  @ApiOperation({ summary: 'Create a consent record' })
  createConsent(@Body() dto: CreateConsentDto) {
    return this.consentService.createConsent(dto.userId, dto);
  }

  @Post('/:consentId/accept')
  @ApiOperation({ summary: 'Accept a consent record' })
  acceptConsent(@Param('consentId') consentId: string) {
    return this.consentService.acceptConsent(consentId);
  }

  @Post('/:consentId/revoke')
  @ApiOperation({ summary: 'Revoke a consent record' })
  revokeConsent(@Param('consentId') consentId: string) {
    return this.consentService.revokeConsent(consentId);
  }
}
