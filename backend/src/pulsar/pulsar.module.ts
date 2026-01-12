import { Module } from '@nestjs/common';
import { PulsarService } from './pulsar.service';
import { PulsarController } from './pulsar.controller';

@Module({
  controllers: [PulsarController],
  providers: [PulsarService],
  exports: [PulsarService],
})
export class PulsarModule {}
