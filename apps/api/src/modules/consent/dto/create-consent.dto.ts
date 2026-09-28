import { IsEnum, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export enum ConsentType {
  AI_SUPPORT = 'ai_support',
  PRIVACY = 'privacy',
  VOICE = 'voice',
  RESEARCH = 'research',
  REFERRAL = 'referral',
  MARKETING = 'marketing',
}

export class CreateConsentDto {
  @IsUUID()
  userId: string;

  @IsEnum(ConsentType)
  type: ConsentType;

  @IsString()
  @IsNotEmpty()
  version: string;

  @IsString()
  @IsNotEmpty()
  purpose: string;

  @IsOptional()
  @IsString()
  legalBasis?: string;
}
