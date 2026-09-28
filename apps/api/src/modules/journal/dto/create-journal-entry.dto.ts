import { IsArray, IsBoolean, IsOptional, IsString } from 'class-validator';

export class CreateJournalEntryDto {
  @IsString()
  content: string;

  @IsOptional()
  @IsString()
  mood?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  emotions?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @IsOptional()
  @IsBoolean()
  private?: boolean;
}
