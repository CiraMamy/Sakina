import { IsEnum, IsNotEmpty, IsString, IsUUID, IsOptional } from 'class-validator';

export enum ConsentType {
  AI_SUPPORT = 'AI_SUPPORT',
  PRIVACY = 'PRIVACY',
  VOICE = 'VOICE',
  RESEARCH = 'RESEARCH',
  REFERRAL = 'REFERRAL',
  MARKETING = 'MARKETING',
  DATA_EXPORT = 'DATA_EXPORT',
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
