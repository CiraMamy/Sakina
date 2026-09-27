import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { PrismaService } from '../../prisma/prisma.service';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@ApiTags('Users')
@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly prisma: PrismaService) {}

  @Get('me')
  @ApiOperation({ summary: 'Get current user details' })
  async getCurrentUser(@CurrentUser() user: any) {
    return this.prisma.user.findUnique({
      where: { id: user.sub },
      include: { profile: true, consents: true },
    });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a user by id' })
  async getUser(@Param('id') id: string) {
    return this.prisma.user.findUnique({
      where: { id },
      include: { profile: true },
    });
  }
}
