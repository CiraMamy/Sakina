import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ProfileService } from './profile.service';

@ApiTags('profile')
@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get(':userId')
  @ApiOperation({ summary: 'Get a user profile' })
  findOne(@Param('userId') userId: string) {
    return this.profileService.findOne(userId);
  }

  @Patch(':userId')
  @ApiOperation({ summary: 'Update a user profile' })
  update(@Param('userId') userId: string, @Body() dto: UpdateProfileDto) {
    return this.profileService.update(userId, dto);
  }
}
