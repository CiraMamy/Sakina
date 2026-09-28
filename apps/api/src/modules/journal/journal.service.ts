import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { ExceptionFactory } from '../../common/exceptions/exception-factory';

@Injectable()
export class JournalService {
  constructor(private readonly prisma: PrismaService) {}

  async findByUser(userId: string, skip = 0, take = 20) {
    const entries = await this.prisma.journalEntry.findMany({
      where: { userId },
      skip,
      take,
      orderBy: { createdAt: 'desc' },
    });

    const count = await this.prisma.journalEntry.count({ where: { userId } });

    return { items: entries, count, skip, take };
  }

  async create(userId: string, dto: any) {
    const entry = await this.prisma.journalEntry.create({
      data: {
        userId,
        content: dto.content,
        title: dto.title,
        moodLabel: dto.moodLabel,
        moodScore: dto.moodScore,
        emotions: dto.emotions || [],
        tags: dto.tags || [],
        isPrivate: dto.isPrivate !== false,
      },
    });

    return entry;
  }

  async getById(id: string, userId: string) {
    const entry = await this.prisma.journalEntry.findUnique({
      where: { id },
    });

    if (!entry || entry.userId !== userId) {
      throw ExceptionFactory.resourceNotFound('JournalEntry', id);
    }

    return entry;
  }

  async delete(id: string, userId: string) {
    const entry = await this.getById(id, userId);

    await this.prisma.journalEntry.delete({
      where: { id },
    });

    return { message: 'Journal entry deleted', id };
  }
}
