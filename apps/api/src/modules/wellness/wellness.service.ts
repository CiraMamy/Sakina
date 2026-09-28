import { Injectable } from '@nestjs/common';

@Injectable()
export class WellnessService {
  async findByUser(userId: string) {
    return {
      userId,
      modules: [
        {
          type: 'sleep',
          title: 'Sleep support',
          status: 'available',
        },
        {
          type: 'mindfulness',
          title: 'Breathing exercises',
          status: 'available',
        },
      ],
      message: 'Wellness module scaffold ready for routines and self-care flows.',
    };
  }

  async create(userId: string, dto: any) {
    return {
      id: 'wellness-activity-id',
      userId,
      ...dto,
      createdAt: new Date().toISOString(),
      message: 'Wellness activity accepted for tracking and personalized recommendations.',
    };
  }
}
