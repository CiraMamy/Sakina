import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ConsentService } from './consent.service';
import { CreateConsentDto } from './dto/create-consent.dto';

@ApiTags('consents')
@Controller('consents')
export class ConsentController {
  constructor(private readonly consentService: ConsentService) {}

  @Get(':userId')
  @ApiOperation({ summary: 'List user consent records' })
  findAll(@Param('userId') userId: string) {
    return this.consentService.findAll(userId);
  }

  @Post()
  @ApiOperation({ summary: 'Create or update a consent record' })
  @ApiResponse({ status: 201, description: 'Consent record accepted' })
  create(@Body() dto: CreateConsentDto) {
    return this.consentService.create(dto);
  }
}
