import { Controller, Get, Param } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuditService } from './audit.service';

@ApiTags('audit')
@Controller('audit')
export class AuditController {
  constructor(private readonly auditService: AuditService) {}

  @Get(':userId')
  @ApiOperation({ summary: 'Fetch a user audit record' })
  findByUser(@Param('userId') userId: string) {
    return this.auditService.findByUser(userId);
  }
}
