import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { ProfilesModule } from './modules/profiles/profiles.module';
import { ConsentsModule } from './modules/consents/consents.module';
import { AuditModule } from './modules/audit/audit.module';
import { ConversationsModule } from './modules/conversations/conversations.module';
import { HealthModule } from './modules/health/health.module';
import { SafetyModule } from './modules/safety/safety.module';
import { JournalModule } from './modules/journal/journal.module';
import { EmotionsModule } from './modules/emotions/emotions.module';
import { WellnessModule } from './modules/wellness/wellness.module';
import { MemoryModule } from './modules/memory/memory.module';
import { AiModule } from './modules/ai/ai.module';
import { ProfessionalsModule } from './modules/professionals/professionals.module';
import { ReferralModule } from './modules/referral/referral.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { StorageModule } from './modules/storage/storage.module';
import { PrivacyModule } from './modules/privacy/privacy.module';
import { AdminModule } from './modules/admin/admin.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    UsersModule,
    ProfilesModule,
    ConsentsModule,
    AuditModule,
    ConversationsModule,
    HealthModule,
    SafetyModule,
    JournalModule,
    EmotionsModule,
    WellnessModule,
    MemoryModule,
    AiModule,
    ProfessionalsModule,
    ReferralModule,
    NotificationsModule,
    StorageModule,
    PrivacyModule,
    AdminModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
