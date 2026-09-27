import { Injectable } from '@nestjs/common';

@Injectable()
export class RateLimitService {
  private readonly buckets = new Map<string, { count: number; resetAt: number }>();

  isAllowed(key: string, limit: number = 100, windowMs: number = 60000): boolean {
    const now = Date.now();
    const bucket = this.buckets.get(key);

    if (!bucket || bucket.resetAt < now) {
      this.buckets.set(key, { count: 1, resetAt: now + windowMs });
      return true;
    }

    bucket.count++;
    return bucket.count <= limit;
  }
}
