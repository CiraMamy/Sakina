import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  BadRequestException,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ExceptionFactory } from '../exceptions/exception-factory';

@Injectable()
export class ErrorHandlingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError((error) => {
        console.error('[ERROR]', {
          code: error.code || 'UNKNOWN_ERROR',
          message: error.message,
          statusCode: error.status || 500,
          timestamp: new Date().toISOString(),
        });

        // Ensure all errors are properly formatted
        if (error.status) {
          return throwError(() => error);
        }

        return throwError(
          () =>
            new BadRequestException({
              code: 'INTERNAL_ERROR',
              message: 'An unexpected error occurred',
            }),
        );
      }),
    );
  }
}
