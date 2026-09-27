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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
