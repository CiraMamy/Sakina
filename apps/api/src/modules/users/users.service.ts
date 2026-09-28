import { Injectable } from '@nestjs/common';

@Injectable()
export class UsersService {
  async findAll(limit: number) {
    return {
      items: [
        {
          id: 'user-001',
          email: 'demo@sakina.example',
          status: 'active',
        },
      ],
      limit,
      count: 1,
    };
  }

  async findOne(id: string) {
    return {
      id,
      email: 'demo@sakina.example',
      status: 'active',
      message: 'User profile scaffold ready for domain logic and authorization.',
    };
  }
}
