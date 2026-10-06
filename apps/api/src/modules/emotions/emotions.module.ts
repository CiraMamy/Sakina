import { Module } from '@nestjs/common';
import { EmotionsController } from './emotions.controller';

@Module({
  controllers: [EmotionsController],
})
export class EmotionsModule {}
