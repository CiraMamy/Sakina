import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { ExceptionFactory } from '../../common/exceptions/exception-factory';

@Injectable()
export class ConsentService {
  constructor(private readonly prisma: PrismaService) {}

  async getConsent(userId: string, consentType: string) {
    const consent = await this.prisma.consent.findFirst({
      where: {
        userId,
        type: consentType.toUpperCase(),
        status: 'GRANTED',
      },
    });

    if (!consent) {
      throw ExceptionFactory.consentRequired(consentType);
    }

    return consent;
  }

  async createConsent(userId: string, dto: any) {
    const existingConsent = await this.prisma.consent.findFirst({
      where: {
        userId,
        type: dto.type,
      },
      orderBy: { version: 'desc' },
    });

    if (existingConsent && existingConsent.status === 'GRANTED') {
      throw ExceptionFactory.resourceConflict(
        'Consent',
        `User already has an active ${dto.type} consent`,
      );
    }

    const consent = await this.prisma.consent.create({
      data: {
        userId,
        type: dto.type,
        version: dto.version || '1.0',
        status: 'PENDING',
        purpose: dto.purpose,
        legalBasis: dto.legalBasis,
        source: 'WEB',
      },
    });

    return consent;
  }

  async acceptConsent(consentId: string) {
    const consent = await this.prisma.consent.findUnique({
      where: { id: consentId },
    });

    if (!consent) {
      throw ExceptionFactory.resourceNotFound('Consent', consentId);
    }

    const updated = await this.prisma.consent.update({
      where: { id: consentId },
      data: {
        status: 'GRANTED',
        grantedAt: new Date(),
      },
    });

    return updated;
  }

  async revokeConsent(consentId: string) {
    const consent = await this.prisma.consent.findUnique({
      where: { id: consentId },
    });

    if (!consent) {
      throw ExceptionFactory.resourceNotFound('Consent', consentId);
    }

    const updated = await this.prisma.consent.update({
      where: { id: consentId },
      data: {
        status: 'REVOKED',
        revokedAt: new Date(),
      },
    });

    return updated;
  }
}
