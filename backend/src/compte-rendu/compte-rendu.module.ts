import { Module } from '@nestjs/common';
import { CompteRenduService } from './compte-rendu.service';
import { CompteRenduController } from './compte-rendu.controller';

@Module({
  controllers: [CompteRenduController],
  providers: [CompteRenduService],
  exports: [CompteRenduService],
})
export class CompteRenduModule {}
