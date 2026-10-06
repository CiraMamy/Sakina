import { Injectable } from '@nestjs/common';

@Injectable()
export class SecurityService {
  validateInputSize(input: string | undefined | null, maxSize: number = 10000): boolean {
    return typeof input === 'string' && input.length > 0 && input.length <= maxSize;
  }

  detectPromptInjection(text: string): boolean {
    const injectionPatterns = [
      /ignore.*instructions/i,
      /bypass.*policy/i,
      /system.*prompt/i,
      /developer.*mode/i,
      /role-?play/i,
      /pretend.*you.*are/i,
    ];

    return injectionPatterns.some((pattern) => pattern.test(text));
  }

  validateMimeType(mimeType: string, allowed: string[] = ['image/jpeg', 'image/png', 'audio/mpeg']): boolean {
    return allowed.includes(mimeType);
  }

  sanitizeOutput(content: string): string {
    // Remove markdown that could be interpreted as code injection
    return content
      .replace(/<script[^>]*>.*?<\/script>/gi, '')
      .replace(/javascript:/gi, '')
      .replace(/on\w+\s*=/gi, '');
  }
}
