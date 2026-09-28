import {
  Injectable,
  BadRequestException,
  NotFoundException,
  UnauthorizedException,
  ForbiddenException,
  ConflictException,
} from '@nestjs/common';

export class SakinaException extends Error {
  constructor(
    public code: string,
    message: string,
    public statusCode: number = 500,
    public details?: Record<string, any>,
  ) {
    super(message);
  }
}

@Injectable()
export class ExceptionFactory {
  static invalidInput(field: string, reason: string) {
    return new BadRequestException({
      code: 'INVALID_INPUT',
      message: `Invalid input for field '${field}': ${reason}`,
      field,
    });
  }

  static resourceNotFound(resourceType: string, id: string) {
    return new NotFoundException({
      code: 'RESOURCE_NOT_FOUND',
      message: `${resourceType} with id '${id}' not found`,
      resourceType,
      id,
    });
  }

  static unauthorized() {
    return new UnauthorizedException({
      code: 'UNAUTHORIZED',
      message: 'Authentication required',
    });
  }

  static forbidden(reason: string) {
    return new ForbiddenException({
      code: 'FORBIDDEN',
      message: `Access denied: ${reason}`,
    });
  }

  static resourceConflict(resourceType: string, reason: string) {
    return new ConflictException({
      code: 'RESOURCE_CONFLICT',
      message: `${resourceType} conflict: ${reason}`,
    });
  }

  static safetyEscalation(reason: string) {
    return new BadRequestException({
      code: 'SAFETY_ESCALATION_REQUIRED',
      message: `Safety policy requires escalation: ${reason}`,
    });
  }

  static consentRequired(consentType: string) {
    return new ForbiddenException({
      code: 'CONSENT_REQUIRED',
      message: `Consent required for operation: ${consentType}`,
      consentType,
    });
  }

  static dataValidationError(errors: Record<string, string[]>) {
    return new BadRequestException({
      code: 'DATA_VALIDATION_ERROR',
      message: 'Data validation failed',
      errors,
    });
  }
}
