import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { HealthModule } from './modules/health/health.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { ConsentModule } from './modules/consent/consent.module';
import { ConversationModule } from './modules/conversation/conversation.module';
import { ProfileModule } from './modules/profile/profile.module';
import { AuditModule } from './modules/audit/audit.module';
import { IdentityModule } from './modules/identity/identity.module';
import { JournalModule } from './modules/journal/journal.module';
import { WellnessModule } from './modules/wellness/wellness.module';
import { SafetyModule } from './modules/safety/safety.module';
import { EmotionModule } from './modules/emotion/emotion.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', 'apps/api/.env'],
    }),
    PrismaModule,
    HealthModule,
    AuthModule,
    UsersModule,
    ConsentModule,
    ConversationModule,
    ProfileModule,
    AuditModule,
    IdentityModule,
    JournalModule,
    WellnessModule,
    SafetyModule,
    EmotionModule,
  ],
  controllers: [AppController],
  providers: [AppService, HttpExceptionFilter],
})
export class AppModule {}
