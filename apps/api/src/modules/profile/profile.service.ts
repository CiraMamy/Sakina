import { Injectable } from '@nestjs/common';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class ProfileService {
  async findOne(userId: string) {
    return {
      id: 'profile-001',
      userId,
      country: 'SN',
      language: 'fr',
      timezone: 'Africa/Dakar',
      accessibility: 'default',
      preferences: {
        theme: 'dark',
        reminders: true,
      },
      message: 'Profile module scaffolded for consent and personalization flows.',
    };
  }

  async update(userId: string, dto: UpdateProfileDto) {
    return {
      id: 'profile-001',
      userId,
      ...dto,
      updatedAt: new Date().toISOString(),
      message: 'Profile changes accepted for phase 1 domain scaffolding.',
    };
  }
}
