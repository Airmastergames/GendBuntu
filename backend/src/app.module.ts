import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { UnitesModule } from './unites/unites.module';
import { PulsarModule } from './pulsar/pulsar.module';
import { LrpgnModule } from './lrpgn/lrpgn.module';
import { MessagerieModule } from './messagerie/messagerie.module';
import { AnnuaireModule } from './annuaire/annuaire.module';
import { BdspModule } from './bdsp/bdsp.module';
import { CompteRenduModule } from './compte-rendu/compte-rendu.module';
import { EventgraveModule } from './eventgrave/eventgrave.module';
import { AdminModule } from './admin/admin.module';
import { AuditModule } from './audit/audit.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 100,
      },
    ]),
    PrismaModule,
    AuthModule,
    UsersModule,
    UnitesModule,
    PulsarModule,
    LrpgnModule,
    MessagerieModule,
    AnnuaireModule,
    BdspModule,
    CompteRenduModule,
    EventgraveModule,
    AdminModule,
    AuditModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
