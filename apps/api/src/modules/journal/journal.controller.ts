import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { JournalService } from './journal.service';
import { CreateJournalEntryDto } from './dto/create-journal-entry.dto';

@ApiTags('journal')
@Controller('journal')
export class JournalController {
  constructor(private readonly journalService: JournalService) {}

  @Get(':userId')
  @ApiOperation({ summary: 'List journal entries for a user' })
  findByUser(@Param('userId') userId: string) {
    return this.journalService.findByUser(userId);
  }

  @Post(':userId')
  @ApiOperation({ summary: 'Create a journal entry' })
  create(@Param('userId') userId: string, @Body() dto: CreateJournalEntryDto) {
    return this.journalService.create(userId, dto);
  }
}
