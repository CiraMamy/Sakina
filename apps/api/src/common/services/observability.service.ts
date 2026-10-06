import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ObservabilityService {
  constructor(private readonly config: ConfigService) {}

  logTrace(context: string, data: any) {
    const correlationId = data.correlationId || 'unknown';
    console.log(JSON.stringify({
      level: 'TRACE',
      timestamp: new Date().toISOString(),
      correlationId,
      context,
      data: this.sanitizeData(data),
    }));
  }

  logMetric(metric: string, value: number, tags?: Record<string, string>) {
    console.log(JSON.stringify({
      level: 'METRIC',
      timestamp: new Date().toISOString(),
      metric,
      value,
      tags: tags || {},
    }));
  }

  private sanitizeData(data: any) {
    const sensitive = ['password', 'token', 'secret', 'health_data', 'journal', 'emotion'];
    const sanitized = { ...data };
    sensitive.forEach((key) => {
      if (key in sanitized) {
        sanitized[key] = '[REDACTED]';
      }
    });
    return sanitized;
  }
}
