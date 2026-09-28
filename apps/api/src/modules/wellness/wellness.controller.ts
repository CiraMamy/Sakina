import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { WellnessService } from './wellness.service';

@ApiTags('wellness')
@Controller('wellness')
export class WellnessController {
  constructor(private readonly wellnessService: WellnessService) {}

  @Get(':userId')
  @ApiOperation({ summary: 'Get wellness content for a user' })
  findByUser(@Param('userId') userId: string) {
    return this.wellnessService.findByUser(userId);
  }

  @Post(':userId')
  @ApiOperation({ summary: 'Create a wellness activity or log' })
  create(@Param('userId') userId: string, @Body() dto: any) {
    return this.wellnessService.create(userId, dto);
  }
}
