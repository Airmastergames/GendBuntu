import { Module } from '@nestjs/common';
import { MessagerieService } from './messagerie.service';
import { MessagerieController } from './messagerie.controller';

@Module({
  controllers: [MessagerieController],
  providers: [MessagerieService],
  exports: [MessagerieService],
})
export class MessagerieModule {}
