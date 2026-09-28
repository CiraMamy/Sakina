import { Controller, Get, Param } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { IdentityService } from './identity.service';

@ApiTags('identity')
@Controller('identity')
export class IdentityController {
  constructor(private readonly identityService: IdentityService) {}

  @Get(':userId')
  @ApiOperation({ summary: 'Get identity context for a user' })
  findOne(@Param('userId') userId: string) {
    return this.identityService.findOne(userId);
  }
}
