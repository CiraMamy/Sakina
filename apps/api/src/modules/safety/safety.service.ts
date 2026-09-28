import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { ExceptionFactory } from '../../common/exceptions/exception-factory';

@Injectable()
export class SafetyService {
  constructor(private readonly prisma: PrismaService) {}

  async assess(userId: string, context: any) {
    // This is a scaffold for the safety engine
    // In production, this would integrate with SAKINA SAFETY CORE
    // which uses rules, classifiers, and policy evaluation

    const signals: string[] = [];
    let riskLevel = 'LOW';
    let confidence = 0.5;

    // Placeholder: detect high-risk keywords in context
    if (context.text) {
      const riskyKeywords = [
        'suicid',
        'harm',
        'die',
        'kill',
        'abuse',
      ];
      const textLower = context.text.toLowerCase();
      const detectedRisks = riskyKeywords.filter((kw) => textLower.includes(kw));

      if (detectedRisks.length > 0) {
        signals.push('POTENTIAL_SELF_HARM_CONCERN');
        riskLevel = 'MODERATE';
        confidence = 0.65;
      }
    }

    const alert = await this.prisma.safetyAlert.create({
      data: {
        userId,
        level: riskLevel as any,
        signals: signals as any,
        confidence,
        summary: `Safety assessment completed with risk level ${riskLevel}`,
        requiredAction: 'LISTEN',
        humanEscalation: riskLevel !== 'LOW',
      },
    });

    return {
      id: alert.id,
      riskLevel,
      confidence,
      signals,
      requiredAction: alert.requiredAction,
      humanEscalation: alert.humanEscalation,
      message: 'Safety assessment completed. Human oversight required before crisis actions.',
    };
  }

  async getAlertsByUser(userId: string, skip = 0, take = 20) {
    const alerts = await this.prisma.safetyAlert.findMany({
      where: { userId },
      skip,
      take,
      orderBy: { createdAt: 'desc' },
    });

    const count = await this.prisma.safetyAlert.count({ where: { userId } });

    return { items: alerts, count };
  }
}
