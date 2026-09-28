import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { JournalService } from './journal.service';
import { CreateJournalEntryDto } from './dto/create-journal-entry.dto';
import { AuthGuard } from '../../common/guards/auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('journal')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('journal')
export class JournalController {
  constructor(private readonly journalService: JournalService) {}

  @Get()
  @ApiOperation({ summary: 'List journal entries for the authenticated user' })
  findByUser(
    @CurrentUser() user: any,
    @Query('skip') skip?: string,
    @Query('take') take?: string,
  ) {
    return this.journalService.findByUser(user.id, Number(skip) || 0, Number(take) || 20);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a journal entry by ID' })
  getById(@Param('id') id: string, @CurrentUser() user: any) {
    return this.journalService.getById(id, user.id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a journal entry' })
  create(@Body() dto: CreateJournalEntryDto, @CurrentUser() user: any) {
    return this.journalService.create(user.id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a journal entry' })
  delete(@Param('id') id: string, @CurrentUser() user: any) {
    return this.journalService.delete(id, user.id);
  }
}
