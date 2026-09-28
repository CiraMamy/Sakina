import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class AuditInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const route = request.route?.path ?? request.originalUrl;

    return next.handle().pipe(
      tap(() => {
        const auditEntry = {
          action: 'api_request',
          route,
          method: request.method,
          timestamp: new Date().toISOString(),
          user: request.user ?? null,
        };

        // Placeholder for production audit service.
        // This should write to a tamper-evident audit event stream.
        // eslint-disable-next-line no-console
        console.info('[AUDIT]', JSON.stringify(auditEntry));
      }),
    );
  }
}
