import { Module } from '@nestjs/common';
import { LrpgnService } from './lrpgn.service';
import { LrpgnController } from './lrpgn.controller';

@Module({
  controllers: [LrpgnController],
  providers: [LrpgnService],
  exports: [LrpgnService],
})
export class LrpgnModule {}
