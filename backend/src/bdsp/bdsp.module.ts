import { Module } from '@nestjs/common';
import { BdspService } from './bdsp.service';
import { BdspController } from './bdsp.controller';

@Module({
  controllers: [BdspController],
  providers: [BdspService],
  exports: [BdspService],
})
export class BdspModule {}
