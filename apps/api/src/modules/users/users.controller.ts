import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { UsersService } from './users.service';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiOperation({ summary: 'List users' })
  findAll(@Query('limit') limit?: string) {
    return this.usersService.findAll(Number(limit) || 20);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a user profile' })
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }
}
