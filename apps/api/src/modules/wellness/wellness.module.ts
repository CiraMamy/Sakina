import { Module } from '@nestjs/common';
import { WellnessController } from './wellness.controller';

@Module({
  controllers: [WellnessController],
})
export class WellnessModule {}
